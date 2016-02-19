# Metadata enrichment #

Some middleware can be used to allow enrichment of consultations by querying API.

Note that it may slow the process down, as the number of queries is limited over time.

However, the results are temporarily cached in the mongoDB database, to prevent multiple occurrences of a document from generating further requests. The actual number of requests (ie. excluding cached ones) is available in the report under `general -> <middleware>-queries`. Where `<middleware>` is the name of the middleware involved.

The middleware have to be declared in the `EZPAARSE_MIDDLEWARES` array in the config file.

The index in the array determine the order in which middlewares are applied.

ezPAARSE is configured for using 5 enrichment middleware : crossref, elsevier, sudoc, hal and istex

## Configuring crossref middleware call ##

The crossref middleware use the doi found in the ECs to request metadatas

### Headers ###
**crossref-Enrich** : set to `true` to enable crossref enrichment. Enable by default.  
**crossref-TTL** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.  
**crossref-paquet-size** :
**crossref-buffer-size** :


## Configuring elsevier middleware call ##

The elsevier middleware use the pii found in the ECs to request metadatas.

The elsevier middleware needs an APIkey (http://dev.elsevier.com/myapikey.html) to be configured in the EZPAARSE_ELS_APIKEY of the config.local.json file 

### Headers ###
**elsevier-Enrich** : set to `true` to enable crossref enrichment. Enable by default.  
**elsevier-TTL** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.  
**elsevier-Throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`.  

## Configuring HAL middleware call ##

### Headers ###
**HAL-Enrich** : set to `true` to enable HAL enrichment. Disable by default.  
**HAL-TTL** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.  
**HAL-Throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`.  
