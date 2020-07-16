# Metadata enrichment

**Middlewares** can be used to enrich access events by querying external APIs.
By default, ezPAARSE is configured for using 4 enrichment middlewares:
  * [istex](#configuring-istex-middleware-call)
  * [crossref](#configuring-crossref-middleware-call)
  * [sudoc](#configuring-sudoc-middleware-call)
  * [hal](#configuring-hal-middleware-call)

For more details on middlewares, you can read the [dedicated section](../development/middlewares.html).

## Important Caveats

### Accessing external APIs: availability, authorization
When sending requests to an external API, things can go wrong and ezPAARSE will stop working after 5 failures in a row.

Firstly, the API has to be available: if it is not the case, our advice is to wait a bit and launch an ezPAARSE job again.

Secondly, your ezPAARSE instance has to be authorized reaching out to the external API.
If you work behind a proxy (the proxy being at your institution level) it should be declared in your environment variables: you have to check that HTTP_PROXY and HTTPS_PROXY (and their lowercase counterparts) are known from the machine where your ezpaarse instance is installed. Once checked, you will have to restart your instance (`make stop`, then `make start`) so they are taken in account by the crossref middleware used by ezpaarse

Less probably, if your proxy is correctly declared in the environments variables but won't let the queries go out: there is a tweak to be made at the institution proxy level. You can correctly process logs as soon as the proxy is configured to let those queries go out.

### Impact on the Speed of Processing
Using those enrichment middlewares may slow the process down, as the number of queries is limited over time.

However, the results are temporarily cached in the mongoDB database, to prevent multiple occurrences of a document from generating further requests. The actual number of requests (i.e. excluding cached ones) is available in the report under `general -> <middleware>-queries`. Where `<middleware>` is the name of the middleware involved.

## Configuring Crossref Middleware Call

[View documentation](../middlewares/crossref/doc.md)

## Configuring Sudoc Middleware Call

[View documentation](../middlewares/sudoc/doc.md)

## Configuring HAL Middleware Call

[View documentation](../middlewares/hal/doc.md)

## Configuring ISTEX Middleware Call

[View documentation](../middlewares/istex/doc.md)

## Configuring Unpaywall Middleware Call

[View documentation](../middlewares/unpaywall/doc.md)