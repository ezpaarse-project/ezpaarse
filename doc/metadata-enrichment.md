# Metadata enrichment #

Some middleware can be used to allow enrichment of consultations by querying API.

Note that it may slow the process down, as the number of queries is limited over time.

However, the results are temporarily cached in the mongoDB database, to prevent multiple occurrences of a document from generating further requests. The actual number of requests (ie. excluding cached ones) is available in the report under `general -> <middleware>-queries`. Where `<middleware>` is the name of the middleware involved.

The middleware have to be declared in the `EZPAARSE_MIDDLEWARES` array in the config file.

The index in the array determine the order in which middlewares are applied.

ezPAARSE is configured for using 5 enrichment middleware : crossref, elsevier, sudoc, hal and istex

## Configuring crossref middleware call ##

The crossref middleware use the doi found in the ECs to request metadatas using the [node-crossref](https://www.npmjs.com/package/meta-doi) module.

### Headers ###
**crossref-Enrich** : set to `true` to enable crossref enrichment. Enable by default.  
**crossref-TTL** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`
.  
**crossref-throttle** : minimum time to wait between queries, in milliseconds. Defaults to `200` ms
**crossref-paquet-size** : maximum number of identifier to query in a single request. Defaults to `50` 
**crossref-buffer-size** : maximum number of memorised ECs before sending a request. Defaults to `1000`
**enrich-overwrite** : set to `true` to enable crossref aggregate. Enable by default.  
**enrich-overwrite-feilds** : feilds to aggregate and priority of aggregation, the field must be the priority process symbol `> | <`

## Configuring elsevier middleware call ##

The elsevier middleware use the pii found in the ECs to request metadatas using the [node-elsevier](https://www.npmjs.com/package/meta-els) module.

The elsevier middleware needs an APIkey (http://dev.elsevier.com/myapikey.html) to be configured in the EZPAARSE_ELS_APIKEY of the config.local.json file 

### Headers ###
**elsevier-Enrich** : set to `true` to enable crossref enrichment. Disabled by default.  
**elsevier-TTL** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.  
**elsevier-Throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`.  

## Configuring sudoc middleware call ##

The sudoc middleware use the print_identifier found in the ECs to request metadatas using the [node-sudoc](https://www.npmjs.com/package/sudoc)

### Headers ###
**sudoc-Enrich** : set to `true` to enable crossref enrichment. Disabled by default.  
**sudoc-TTL** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.  
**sudoc-Throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`.  

## Configuring HAL middleware call ##

The HAL middleware use the hal-identifier found in the ECs to request metadatas using the [node-hal](https://www.npmjs.com/package/methal)

### Headers ###
**HAL-Enrich** : set to `true` to enable HAL enrichment. Disable by default.  
**HAL-TTL** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.  
**HAL-Throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`.  

## Configuring ISTEX middleware call ##

The ISTEX middleware use the istex-identifier found in the ECs to request metadatas using the [node-istex](hhttps://www.npmjs.com/package/node-istex)

ISTEX middleware is automatically activated on ISTEX logs

### Headers ###
**istex-enrich** : set to `true` to enable ISTEX enrichment. Disable by default.  
**istex-ttl** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.  
**istex-throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`. 