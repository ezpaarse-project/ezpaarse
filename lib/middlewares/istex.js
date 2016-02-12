'use strict';

var istex = require("./node-istex/index.js")
var metaistex = {};
var data = require('./rtype.json');
var cacheistex = require('../cache')('istex');


/**
 * Enrich ECs with istex data
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */

module.exports = function (req, res, job, saturate, drain) {

  var nbErrors = 0;
  var buffer   = [];
  var busy     = false;
  if (!cacheistex) {
    var err = new Error('failed to connect to mongodb, cache not available for istex');
    err.status = 500;
    return err;
  }


  function  pullBuffer(ec, next) {
    var ecb = buffer.shift();
    if (!ecb) {
      busy = false;
      return drain();
    }
    istex.find(ecb.unitid , function(err, result){
      if (err) { 
        enrichEc(null, ec , next);
        setTimeout(pullBuffer, 500);
      }
      // construct array data with a property ezpaarse 
       metaistex.publisher_name = result.corpusName;
      if (result.host.isbn) metaistex.print_identifier = result.host.isbn[0];
      if (result.host.issn) metaistex.print_identifier = result.host.issn[0];
      if (result.host.eisbn) metaistex.online_identifier = result.host.eisbn[0];
      if (result.doi) metaistex.doi = result.doi[0];
      metaistex.publication_title = result.host.title;
      if (result.publicationDate) {
      metaistex.publication_date = result.publicationDate;
      } else {
      metaistex.publication_date = result.copyrightDate;
      }
      metaistex.rtype = data[result.genre[0]];
      metaistex.language = result.language[0]; 

      cacheistex.set(ecb.unitid , metaistex, function(err){
         enrichEc(metaistex, ec , next);
         if (err) { 
          setTimeout(pullBuffer, 500);
         }

      });   
    })
  };




 function enrich(ec, next) {
   if (!ec || !ec.unitid ) {
      return next();
    }
    cacheistex.get(ec.unitid.toString(), function (err, cachedDoc) {
      if (err) { return next(); }

      buffer.push(ec);
      if (cachedDoc) {
        return enrichEc(cachedDoc, ec , next);
      }


      buffer.push(ec);
      if (busy) { return; }
      
      busy = true;
      saturate();
      pullBuffer(ec, next);
    });
  }


  function enrichEc(data , ec , next) {
    if(data) {
      for (let p in data ) {
        ec[p] = data[p];
      }
    }
    return next();
  }

  
  return new Promise(function (resolve, reject) {
    if (!activated) { return resolve(enrich); }

    cache.checkIndexes(ttl, function (err) {
      if (err) {
        job.logger.error('istex: failed to ensure indexes');
        return reject(new Error('failed to ensure indexes for the cache of istex'));
      }

      resolve(enrich);
    });
  });

};
