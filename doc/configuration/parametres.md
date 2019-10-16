# Parameters

The ezPAARSE jobs can be configured using HTTP headers. Please find the list of available headers below.


### Content-Encoding
Encoding of the data sent.
*(supported: gzip, deflate)*

### Response-Encoding
Encoding of the data sent back by server.
*(supported: gzip, deflate)*

### Accept
Output format.
Supported:
  - text/csv (by default)
  - text/tab-separated-values (for a TSV output: as CSV but tab-delimited)
  - application/json
  - application/jsonstream (one JSON object per line)

### Log-Format-xxx
Format of the log lines in input, depends on the proxy *xxx* used. [See the available formats](../essential/formats.html)

### Date-Format
Date format used in the logs sent. Default is: 'DD/MMM/YYYY:HH:mm:ss Z'.

### Crypted-Fields
Comma-separated list of fields that will be crypted in the results, or `none` to disable crypting. Defaults to `host,login`.

**Caution**: each job uses a random salt for crypting, so crypted values for the same access event but from distinct jobs are not identical. Use the `Crypted-Salt` header to change this behavior.

### Crypting-Salt
A specific crypting key to use if you want fields to be crypted the same way accross different jobs.

### Crypting-Algorithm
The algorithm that should be used to crypt fields. It must be supported by the version of OpenSSL that is installed on the platform. On recent releases of OpenSSL, `openssl list -digest-algorithms` will display the available algorithms.

### Output-Fields
To specify the fields to include in the output (if the format allows it). [(More information)](../features/outputfields.html)

### Traces-Level
To specify the verbosity level from ezPAARSE's feedback. The higher levels include the lower ones.
  - **error**: blocking errors, abnormal treatment termination.
  - **warn**: errors not fatal to the treatment.
  - **info**: general informations (requested format, ending notification, number of access events generated...).
  - **verbose**: more precise than info, gives more information about each stage of the treatment.
  - **silly**: every detail of the treatment (parser not found, line ignored, unsuccessful search in a pkb...).


### Reject-Files
List of the reject files to create, separated by commas.

Possible values are:
  * `Unknown-Formats`
  * `Ignored-Domains`
  * `Unknown-Domains`
  * `Unqualified-ECs`
  * `Duplicate-ECs`
  * `Unordered-ECs`
  * `Filtered-ECs`
  * `Ignored-Hosts`
  * `Robots-ECs`

Set to `none` by default.

We recommend to set it to `all` when you start using ezPAARSE, to fully understand the filtering and exclusion system.

### Double-Click-xxx
Parameters used for deduplication. [(More information)](../features/doubleclick.html).

### Request-Charset
Character map used for input. [(see supported encodings)](https://github.com/ashtuchkin/iconv-lite#supported-encodings).

### Response-Charset
Character map used for output. [(see supported encodings)](https://github.com/ashtuchkin/iconv-lite#supported-encodings).

### Max-Parse-Attempts
Maximum number of lines that ezPAARSE will attempt to parse in order to check the log format.

### Clean-Only
If set to `true`, ezPAARSE will just filter out the lines we are sure are irrelevant and output only the relevant ones.
The goal when using this parameter is to reduce the size of the log file, if you need to store it for further treatment.
#### Video Demonstration
This [screencast](https://www.youtube.com/watch?v=I3D6lO4wDZo) demonstrates the usage of the Clean-Only parameter (ie the cleaning of a log file for size reduction and ease of storage)

### Force-Parser
If URLs don't have 'domain' part, use this parameter to force right parser to be used. Usefull for Open Access log analysis which don't have domain part in URL (all URLs comes form the same domain).
For example: Force-Parser: 'dspace'.
Can be use in conjonction with Force-ECField-Publisher.

### COUNTER-Reports
List of COUNTER reports to create (ex: JR1, BR2). Download links are accessible in the `stats` section of the treatment report. [(More information)](../features/counter.html)

### COUNTER-Format
COUNTER report formats: `XML` (by default) ou `CSV`.

### COUNTER-Customer
Name and/or email of the customer to include in the COUNTER reports, following the form `name`, `<email>` or `name<email>`. (By default :`ezPAARSE<admin email>`)

### COUNTER-Vendor
Name and/or email of the publisher  to include in the COUNTER reports, following the form `name`, `<email>` or `name<email>`. (By default :`platform42`, without email)

### Geoip
Listing of the geolocation informations to be added to the results. By default `geoip-longitude, geoip-latitude, geoip-country`. `all` can be used to include every fiel available, or `none` to deactivate geolocation altogether. [(More information)](../features/geolocalisation.html)

### ezPAARSE-Job-Notifications
Listing of notifications to send when treatment is done, written as `action<cible>` and separated by commas. Currently available: `mail<adress>`

### ezPAARSE-Middlewares
Insert a list of middlewares that are not present in the base configuration (`EZPAARSE_MIDDLEWARES`). The value must be a list of middleware names separated with commas, in the order of use.

By default, they will be inserted at the end of the chain, before `qualifier`. You can prefix the list with the mention `(before <middleware name>)` or `(after <middleware name>)` to insert them at a more specific place, or `(only)` to only use the middlewares you want.

#### Examples
```
'ezPAARSE-Middlewares': 'user-agent-parser, sudoc'
```
```
'ezPAARSE-Middlewares': '(before istex) user-agent-parser'
```
```
'ezPAARSE-Middlewares': '(after sudoc) hal, istex'
```
```
'ezPAARSE-Middlewares': '(only) crossref'
```

### ezPAARSE-Enrich
Set to `false` to deactivate data enrichment (geoip and knowledge bases). Any other value will leave the data enrichment active.

### ezPAARSE-Predefined-Settings
Tells ezPAARSE to use a predefined set of parameters. For example: `inist` for INIST-CNRS parameters.

### ezPAARSE-Filter-Redirects
Set to `false` to prevent lines with HTTP status codes 301, 302 from being filtered and discarded.

### ezPAARSE-Filter-Status
Set to `false` to disable filtering on status codes.

### Disable-Filters
Disable filters applying to robots or arbitrary hosts/domains. (defaults to `none`).
Possible values (separated by commas): `robots`, `ignored-hosts`, `ignored-domains`.
Set to `all` to disable all above filters.

**NB**: when robots are not filtered, add the `robot` field to the output in order to know which consultations were made by robots.

### Force-ECField-Publisher
Set the publisher_name field to a predefined value.
For example: Force-ECField-Publisher: 'IRevues'.

### Session-ID-Fields
Change the fields used to generate session IDs and user IDs. By default, the generator uses either `login`, `cookie`, or a combination of `host` and `user-agent`, and store the generated IDs in `session_id` and `user_id`. You can customize those fields by providing a mapping separated by commas.

Default mapping :
```
  user: login, cookie: cookie, host: host, useragent: user-agent, session: session_id, userid: user_id
```

If your user login is in the `user_login` field :
```
  user: user_login
```

### Extract
Extract values from a field and dispatch them in new fields. The syntax is the following : `source_field => extract_expression => destination_fields`

#### Examples:

The following examples assume we have a **login** field with the value **THEODORE_MCCLURE**. Here are multiple ways to create a **firstname** field containing **THEODORE** and **lastname** field containing **MCCLURE**.

##### Extracting with a regular expression:
If the extract expression is a regular expression (between slashes, with optional flags after the closing slash), it's applied to the source field and the captured groups are stored in the destination fields.

The following expression applies the regular expression `/^([a-z]+)_([a-z]+)$/i` on the **login** field, and puts the captured groups in the **firstname** and **lastname** fields.

```
  login => /^([a-z]+)_([a-z]+)$/i => firstname,lastname
```

##### Splitting over an expression:
If the extract expression is **split()**, then the source field will be splitted according to the expression between the parentheses.

The following splits the **login** field with the character `\_` and puts the parts in the **firstname** and **lastname** fields.
```
'Extract': 'login => split(_) => firstname,lastname'
```

The following splits the **login** field with the regular expression `/[\_]+/` and puts the parts in the **firstname** and **lastname** fields.
```
'Extract': 'login => split(/[_]+/) => firstname,lastname'
```

## Metadata enrichment
The use of middlewares to enrich access events with metadata coming from external APIs is controlled by headers.

### Crossref

[(More information)](../features/metadata-enrichment.html#configuring-crossref-middleware-call)

### Sudoc

[(More information)](../features/metadata-enrichment.html#configuring-sudoc-middleware-call)

### HAL

[(More information)](../features/metadata-enrichment.html#configuring-hal-middleware-call)

### ISTEX

[(More information)](../features/metadata-enrichment.html#configuring-istex-middleware-call)
