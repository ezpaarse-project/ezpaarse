# Metadata enrichment #

**Middlewares** can be used to enrich access events by querying external APIs.
By default, ezPAARSE is configured for using 4 enrichment middlewares:
  * istex
  * crossref
  * sudoc
  * hal

For more details on middlewares, you can read the [dedicated section](../development/middlewares.html).

## Important Caveats ##

### Accessing external APIs: availability, authorization ###
When sending requests to an external API, things can go wrong and ezPAARSE will stop working after 5 failures in a row.

Firstly, the API has to be available: if it is not the case, our advice is to wait a bit and launch an ezPAARSE job again.

Secondly, your ezPAARSE instance has to be authorized reaching out to the external API.
If you work behind a proxy (the proxy being at your institution level) it should be declared in your environment variables: you have to check that HTTP_PROXY and HTTPS_PROXY (and their lowercase counterparts) are known from the machine where your ezpaarse instance is installed. Once checked, you will have to restart your instance (`make stop`, then `make start`) so they are taken in account by the crossref middleware used by ezpaarse

Less probably, if your proxy is correctly declared in the environments variables but won't let the queries go out: there is a tweak to be made at the institution proxy level. You can correctly process logs as soon as the proxy is configured to let those queries go out.

### Impact on the Speed of Processing ###
Using those enrichment middlewares may slow the process down, as the number of queries is limited over time.

However, the results are temporarily cached in the mongoDB database, to prevent multiple occurrences of a document from generating further requests. The actual number of requests (i.e. excluding cached ones) is available in the report under `general -> <middleware>-queries`. Where `<middleware>` is the name of the middleware involved.

## Configuring Crossref Middleware Call ##

The Crossref middleware uses the `DOI` found in access events to request metadata using the [node-crossref](https://www.npmjs.com/package/meta-doi) module.

### Headers ###
  * **crossref-Enrich**: set to `false` to disable crossref enrichment. Enabled by default.
  * **crossref-TTL**: lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`
  * **crossref-throttle**: minimum time to wait between queries, in milliseconds. Defaults to `200`ms
  * **crossref-paquet-size**: maximum number of identifiers to send for query in a single request. Defaults to `50`
  * **crossref-buffer-size**: maximum number of memorised access events before sending a request. Defaults to `1000`
  * **crossref-license**: set to `true` to get the `license` field as JSON. Disabled by default.

## Configuring Sudoc Middleware Call ##

### Headers ###
  * **sudoc-Enrich**: set to `true` to enable Sudoc enrichment. Disabled by default.
  * **sudoc-TTL**: lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.
  * **sudoc-Throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`.

## Configuring HAL Middleware Call ##

The HAL middleware uses the `hal-identifier` found in the access events to request metadata using the [node-hal](https://www.npmjs.com/package/methal)

### Headers ###
  * **HAL-Enrich**: set to `true` to enable HAL enrichment. Disabled by default.
  * **HAL-TTL**: lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.
  * **HAL-Throttle**: minimum time to wait between queries, in milliseconds. Defaults to `500`.

## Configuring ISTEX Middleware Call ##

The ISTEX middleware uses the `istex-identifier` found in the access events to request metadata using the [node-istex](hhttps://www.npmjs.com/package/node-istex)

ISTEX middleware is automatically activated on ISTEX logs

### Headers ###
  * **istex-enrich** : set to `true` to enable ISTEX enrichment. Disabled by default.
  * **istex-ttl** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.
  * **istex-throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`.

## Configuring Unpaywall Middleware Call ##

The Unpaywall middleware uses the `DOI` found in access events to request Open Acess metadata using the Unpaywall API. Limited to `100 000` DOIs per day.

### Headers ###
  * **unpaywall-cache**: set to `false` to disable result caching. Enabled by default.
  * **unpaywall-TTL**: lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`
  * **unpaywall-throttle**: minimum time to wait between each packet of queries, in milliseconds. Defaults to `100`ms
  * **unpaywall-paquet-size**: maximum number of DOIs to request in parallel. Defaults to `10`
  * **unpaywall-buffer-size**: maximum number of memorised access events before sending requests. Defaults to `200`
  * **unpaywall-email**: the email to use for API calls. Defaults to `YOUR_EMAIL`.

