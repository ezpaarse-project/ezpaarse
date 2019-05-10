'use strict';

const i18nIsoCountries = require('i18n-iso-countries');
let ObjectID = require('mongodb').ObjectID;
let mongo  = require('./mongo.js');

module.exports = {
  getAll () {
    return mongo.getCollection('settings').find({}).toArray();
  },

  async insert (settings) {
    settings.country = i18nIsoCountries.getAlpha3Code(settings.country, 'en');
    const { fullName } = settings;

    const id = settings.id || ObjectID().toString();
    const existing = await mongo.getCollection('settings').findOne({ $or: [{ fullName }, { id }] });

    if (existing) {
      return Promise.reject(new Error('already_exists'));
    }

    return mongo.getCollection('settings').insertOne(settings);
  },

  async updateOne (id, settings) {
    settings.country = i18nIsoCountries.getAlpha3Code(settings.country, 'en');
    const { fullName, newId } = settings;
    const existing = await mongo.getCollection('settings').findOne({
      id: { $ne: id },
      $or: [{ fullName }, { id: newId }]
    });

    if (existing) {
      return Promise.reject(new Error('already_exists'));
    }

    return mongo.getCollection('settings').findOneAndReplace({ id }, settings);
  },

  delete (id) {
    return mongo.getCollection('settings').deleteOne({ id });
  }
};
