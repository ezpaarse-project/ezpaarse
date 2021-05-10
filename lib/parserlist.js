'use strict';

const fs   = require('fs-extra');
const path = require('path');
const { URL }  = require('url');

const csvextractor = require('./csvextractor.js');
const platformsDir = path.join(__dirname, '../platforms');

/**
 * This module handles a parser list and is used to find a parser using a domain.
 */
class ParserList {


  constructor() {
    this.domains   = new Map();
    this.platforms = new Map();
  }

  /**
   * Return the size of a specific list
   * @param  {String} type
   */
  sizeOf(type) {
    switch (type) {
    case 'domains':
    case 'platforms':
      return this[type].size;
    default:
      return null;
    }
  }

  /**
   * Link a parser to a domain
   * @param  {String}  domain
   * @param  {Object}  obj ->
   * {String}  file          path to the parser file
   * {Boolean} isNode        is the parser written with node.js ?
   * {String}  platform      platform short name
   * {String}  platformName  platform complete name
   */
  add(domain, parser) {
    const platform = parser.platform;

    // Unknown domain => init with an empty list of parsers
    if (!this.domains.has(domain)) {
      this.domains.set(domain, []);
    }

    // Unknown platform => init with a parser and an empty Set of domains
    if (!this.platforms.has(platform)) {
      this.platforms.set(platform, { parser, domains: new Set() });
    }

    const platformEntry = this.platforms.get(platform);

    if (!platformEntry.domains.has(domain)) {
      this.domains.get(domain).push(parser);
      platformEntry.domains.add(domain);
    }
  }

  /**
   * Look for the parser of a given domain
   * @param  {String}  domain
   * @return {Object} the corresponding parser or false
   */
  get(domain) {
    return this.domains.get(domain);
  }

  /**
   * Look for the parser of a given platform
   * @param  {String} name  the platform name
   * @return {Object} the corresponding parser or false
   */
  getFromPlatform(name) {
    const platform = this.platforms.get(name);
    return platform && platform.parser;
  }

  /**
   * Return the entire domain list
   * @return {Object} the list of all domains
   */
  getAll() {
    return this.domains;
  }

  /**
   * Return the domains of a platform
   * @return {Array} all domains supported by the platform
   */
  getDomainsOf(platform) {
    return this.platforms.get(platform);
  }

  /**
   * Clear cached references of a platform
   */
  clearPlatform(name) {
    const platform = this.platforms.get(name);

    if (!platform) { return; }

    platform.domains.forEach(domain => this.domains.delete(domain));

    this.platforms.delete(name);
  }

  /**
   * Clear cached parsers
   * @return {Array} cleared  parsers that were cached (path to their file)
   */
  clearCachedParsers() {
    for (const { parser } in this.platforms.values()) {
      try {
        delete require.cache[require.resolve(parser.file)];
      } catch (e) {
        continue;
      }
    }
  }

  /**
   * Read platforms directory and build the domains list
   */
  async init() {
    this.domains   = new Map();
    this.platforms = new Map();

    const platformsDir = path.resolve(__dirname, '../platforms');

    let items = await fs.readdir(platformsDir);

    // Remove .git, .lib, and jsparserskeleton
    items = items.filter(i => !i.startsWith('.') && i != 'js-parser-skeleton');

    for (const item of items) {
      const stat = await fs.stat(path.resolve(platformsDir, item));

      if (stat.isDirectory()) {
        await this.addDomainsOf(item);
      }
    }
  }

  /**
   * Find the domains supported by a platform and add them to the list
   * @param  {String} platform  the platform short name
   */
  async addDomainsOf(platform) {
    const platformDir  = path.resolve(platformsDir, platform);
    const manifestFile = path.resolve(platformDir, 'manifest.json');
    const parserFile   = path.resolve(platformDir, 'parser.js');
    const pkbFolder    = path.resolve(platformDir, 'pkb');

    const manifest = JSON.parse(await fs.readFile(manifestFile));

    if (!manifest.name) { return; }
    if (!manifest.domains && !manifest['pkb-domains']) { return; }

    await fs.stat(parserFile);

    const parser = {
      file: parserFile,
      platform: manifest.name,
      platformName: manifest.longname,
      publisherName: manifest.publisher_name,
      manifest
    };

    (manifest.domains || []).forEach(domain => this.add(domain, parser));

    const domainsPkbField = manifest['pkb-domains'];

    if (!domainsPkbField) { return; }

    const files = await fs.readdir(pkbFolder);

    const pkbFiles = files
      .filter(f => /_[0-9]{4}-[0-9]{2}-[0-9]{2}\.txt$/.test(f))
      .map(f => path.resolve(pkbFolder, f));

    if (pkbFiles.length === 0) { return; }

    const opts = {
      silent: true,
      fields: [domainsPkbField],
      delimiter: '\t'
    };

    const records = await new Promise((resolve, reject) => {
      csvextractor.extract(pkbFiles, opts, function (err, records) {
        if (err) { reject(err); }
        else { resolve(records); }
      });
    });

    records.forEach(record => {
      let domain = record[domainsPkbField];
      if (!domain) { return; }

      if (!/^https?:\/\//i.test(domain)) {
        this.add(domain, parser);
        return;
      }

      try {
        const parsedUrl = new URL(domain);
        if (parsedUrl.hostname) {
          this.add(parsedUrl.hostname, parser);
        }
      } catch (e) {
        return;
      }
    });
  }
}

module.exports = new ParserList();
