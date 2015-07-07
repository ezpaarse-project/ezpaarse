# HAL enrichment #

A middleware is available to allow enrichment of HAL consultations by querying the HAL database. Note that it may slow the process down, as the number of queries is limited over time. However, the results are temporarily cached in the mongoDB database, to prevent multiple occurrences of a document from generating further requests.

### Headers ###
**HAL-Enrich** : set to `true` to enable HAL enrichment. Disable by default.  
**HAL-TTL** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.  
**HAL-Throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`.  
