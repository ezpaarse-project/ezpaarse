'use strict';

const fs = require('fs');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const { parse } = require('csv');
const { glob } = require('glob');

/* eslint-disable max-len */
/**
 * @typedef {import('csv').parser.Options} CSVParseOptions
 * @typedef {import('mongodb').Collection} Collection
 * @typedef {import('mongodb').IndexSpecification} IndexSpecification
 *
 * @typedef {object} FileDocument
 * @property {'file'} type - The type of the document.
 * @property {string} location - The location of the source file.
 * @property {string} checksum - The checksum of the file.
 * @property {Date} updatedAt - The last time the document was modified.
 * @property {'loading'|'synced'} state - The state of the file.
 * @property {number} [totalRecords] - The total number of records in the file.
 *
 * @typedef {object} RecordDocument
 * @property {'record'} type - The type of the document.
 * @property {string} location - The location of the source file.
 * @property {Date} updatedAt - The last time the document was modified.
 * @property {object} content - The content of the record.
 * @property {object} content.json - The content of the record in JSON format.
 *
 * @typedef {object} TargetCollection
 * @property {string} name - The name of the collection.
 * @property {IndexSpecification[]} indices - A list of indices to add in the collection.
 *
 * @typedef {object} Repository
 * @property {string} [cwd] - The root directory of the repository.
 * @property {string[]} [globs] - An array of glob patterns to match files in the repository.
 * @property {string[]} [ignore] - An array of glob patterns to ignore files in the repository.
 * @property {boolean} [removeEmptyFields] - Whether to remove empty fields from the CSV document.
 * @property {CSVParseOptions} [csvParseOptions] - Options to pass to the csv-parse library.
 * @property {function} [docModifier] - A function to modify the document before writing it to the collection. Should return the modified document.
 */
/* eslint-enable max-len */

/** The CSV2Mongo class is used to synchronize CSV files with a MongoDB database. */
exports.CSV2Mongo = class CSV2Mongo {
/**
 * Constructs a new instance of the CSV2Mongo class.
 *
 * @param {Object} opts - The options for the constructor.
 * @param {string} [opts.mongoUrl] - The URL of the MongoDB database.
 * @param {MongoClient} [opts.mongoClient] - The MongoDB client.
 * @param {TargetCollection} [opts.collection] - The collection to synchronize.
 * @param {Repository} [opts.repository] - The repository to synchronize.
 * @param {number} [opts.concurrency] - The maximum number of concurrent syncs.
 * @param {function} [opts.onChange] - A function to call when the synchronization state changes.
 * @param {function} [opts.onSyncStart] - A function to call when a file starts being synchronized.
 * @param {function} [opts.onSyncEnd] - A function to call when a file ends being synchronized.
 * @param {function} [opts.onCleanUp] - A function to call when old documents have been deleted.
 * @param {function} [opts.onComplete] - A function to call when the synchronization is complete.
 * @param {function} [opts.onError] - A function to call when an error occurs.
 */
  constructor (opts) {
    this.mongoUrl = opts?.mongoUrl;
    this.mongoClient = opts?.mongoClient;
    this.collection = opts?.collection;
    this.repository = opts?.repository;
    this.concurrency = opts?.concurrency || 1;

    this.onChange = typeof opts?.onChange === 'function' ? opts?.onChange : () => {};
    this.onSyncStart = typeof opts?.onSyncStart === 'function' ? opts?.onSyncStart : () => {};
    this.onSyncEnd = typeof opts?.onSyncEnd === 'function' ? opts?.onSyncEnd : () => {};
    this.onCleanUp = typeof opts?.onCleanUp === 'function' ? opts?.onCleanUp : () => {};
    this.onComplete = typeof opts?.onComplete === 'function' ? opts?.onComplete : () => {};
    this.onError = typeof opts?.onError === 'function' ? opts?.onError : () => {};

    this.syncList = [];
    this.synchronizing = new Set();
  }

  /**
   * Establish a connection to the MongoDB database.
   *
   * @return {Promise<MongoClient>} Returns a Promise that resolves with the MongoDB client.
   */
  async connect() {
    if (this.mongoClient) { return this.mongoClient; }

    if (!this.mongoUrl) {
      throw new Error('No mongoUrl config');
    }

    this.mongoClient = await MongoClient.connect(this.mongoUrl);

    return this.mongoClient;
  }

  /**
   * Disconnects from the MongoDB client if connected.
   *
   * @return {Promise<void>} A Promise that resolves when the MongoDB client is successfully closed.
   */
  async disconnect() {
    if (this.mongoClient) {
      return this.mongoClient.close();
    }
  }

  /**
   * Retrieves the collection from the MongoDB database.
   *
   * @return {Collection} The collection with the specified name.
   */
  getCollection() {
    return this.mongoClient.db().collection(this.collection.name);
  }

  /**
   * Checks if the collection exists in the MongoDB database.
   *
   * @return {Promise<boolean>} Resolves with true if the collection exists, false otherwise.
   */
  async collectionExists() {
    const collections = await this.mongoClient.db().listCollections().toArray();
    return collections.some(col => col.name === this.collection.name);
  }

  /**
   * Initializes the collection in the MongoDB database by resetting indices
   *
   * @return {Promise<void>} A promise that resolves when the collection has been initialized.
   */
  async initiateCollection() {
    const collection = this.getCollection();

    if (await this.collectionExists()) {
      await collection.dropIndexes();
    }

    await collection.createIndex({ location: 1 });

    for (const index of this.collection.indices) {
      await collection.createIndex(index, { sparse: true });
    }
  }

  /**
   * Scans the repository for files, adds them to the syncList, and starts the synchronization.
   *
   * @return {Promise<void>} A Promise that resolves when the scanning is complete.
   */
  async scan() {
    await this.connect();
    const scanDate = new Date();
    const repo = this.repository;

    await this.initiateCollection();

    const globs = await glob(repo.globs, {
      cwd: repo.cwd,
      ignore: repo.ignore,
      stat: true,
      withFileTypes: true,
    });

    this.syncList = [
      ...this.syncList,
      ...globs.map(file => ({
        location: file.fullpath(),
        name: file.name,
        size: file.size,
        mtime: file.mtime,
      })),
    ];

    await this.syncNext(scanDate);
  }

  /**
   * Triggers the change event by calling the `onChange` function
   *
   * @return {void}
   */
  triggerChange() {
    this.onChange(this.syncList, this.synchronizing);
  }

  /**
   * Deletes documents from the collection that are older than the specified date,
   * or don't have an updatedAt field.
   * @param {Date} scanDate - The date to compare documents to.
   */
  async cleanUp(scanDate) {
    const collection = this.getCollection();
    const { deletedCount } = await collection.deleteMany({
      $or: [
        { updatedAt: { $lt: scanDate } },
        { updatedAt: { $exists: false } },
      ]
    });
    this.onCleanUp({ deletedCount });
  }

  /**
   * Asynchronously synchronizes the next file in the `syncList` array.
   *
   * @param {Date} scanDate - The date when the sync started.
   * @return {Promise<void>}
   */
  async syncNext(scanDate) {
    if (this.syncList.length === 0 && this.synchronizing.size === 0) {
      await this.cleanUp(scanDate);
      this.triggerChange();
      this.onComplete({ took: Math.floor((Date.now() - scanDate.getTime()) / 1000) });
      return;
    }

    if (this.syncList.length === 0) { return; }
    if (this.synchronizing.size >= this.concurrency) { return; }

    const file = this.syncList.shift();
    this.synchronizing.add(file);
    this.triggerChange();

    this.sync(file)
      .catch(e => {
        this.onError(e);
      })
      .finally(() => {
        this.synchronizing.delete(file);
        this.syncNext(scanDate);
      });

    this.syncNext(scanDate);
  }

  /**
   * Asynchronously synchronizes the specified file with the MongoDB collection.
   *
   * @param {string} file - The path to the file to be synchronized.
   * @return {Promise<Object>} An object containing the total number of synced/cleaned records.
   */
  async sync(file) {
    const scanDate = new Date();
    const repo = this.repository;
    const collection = this.getCollection();

    if (!collection) { return; }

    const fileSelector = { type: 'file', location: file.location };

    const existing = await collection.findOne(fileSelector);
    const checksum = await this.generateChecksum(file.location);
    const totalSavedRecords = await collection.countDocuments({
      location: file.location,
      type: 'record',
    });

    const unmodified = (
      existing?.state === 'synced' &&
      existing?.checksum === checksum &&
      existing.totalRecords === totalSavedRecords
    );

    this.onSyncStart({ filePath: file.location, checksum, unmodified });


    if (unmodified) {
      await collection.updateMany(
        { location: file.location, type: { $in: ['file', 'record'] } },
        { $set: { updatedAt: new Date() } },
      );
      return;
    }

    await collection.findOneAndReplace(
      fileSelector,
      {
        ...fileSelector,
        checksum,
        state: 'loading',
        updatedAt: new Date(),
      },
      {
        upsert: true,
      }
    );

    const parser = fs.createReadStream(file.location).pipe(parse(repo.csvParseOptions));

    const maxBulkSize = 2000;
    let docs = [];
    let totalRecords = 0;

    for await (const record of parser) {
      totalRecords += 1;

      const doc = {
        type: 'record',
        location: file.location,
        updatedAt: new Date(),
        content: {
          json: repo.removeEmptyFields
            ? Object.fromEntries(Object.entries(record).filter(([, value]) => value !== ''))
            : record,
        },
      };

      docs.push(typeof repo.docModifier === 'function' ? repo.docModifier(doc) : doc);

      if (docs.length >= maxBulkSize) {
        await collection.insertMany(docs, { ordered: false });
        docs = [];
      }
    }

    if (docs.length > 0) {
      await collection.insertMany(docs, { ordered: false });
    }

    const { deletedCount: cleanedRecords } = await collection.deleteMany({
      location: file.location,
      type: 'record',
      updatedAt: { $lt: scanDate },
    });

    await collection.findOneAndReplace(
      fileSelector,
      {
        ...fileSelector,
        checksum,
        totalRecords,
        state: 'synced',
        updatedAt: new Date(),
      },
      {
        upsert: true,
      },
    );

    this.onSyncEnd({ filePath: file.location, checksum, totalRecords });

    return {
      totalRecords,
      cleanedRecords,
    };
  }

  /**
   * Generates a checksum for the file at the specified filePath.
   *
   * @param {string} filePath - The path to the file for which to generate the checksum.
   * @return {Promise<string>} A promise that resolves with the MD5 hash checksum of the file.
   */
  generateChecksum(filePath) {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => reject(err));
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => { resolve(hash.digest('hex')); });
    });
  }
};

