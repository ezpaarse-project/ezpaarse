# Parameters #

The ezPAARSE treatments can be congured using HTTP headers. Please find below the list of available headers.


### Content-Encoding ###
Encoding of the data sent  *(supported : gzip, deflate)*  

### Response-Encoding ###
Encoding of the data sent back by server. *(supported : gzip, deflate)*  

### Accept ###
Output format. Supported :
  - text/csv (by default)
  - text/tab-separated-values (for a TSV output : as CSV but tab-delimited)
  - application/json
  - application/jsonstream (one JSON object per line)

### Log-Format-xxx ###
Format of the log lines in input, depend on the proxy *xxx* used. [See the available formats](./formats.html)

### Date-Format ###
Date format used in the logs sent. Default is : 'DD/MMM/YYYY:HH:mm:ss Z'.  

### Crypted-Fields ###
Comma-separated list of fields that will be crypted in the results, or `none` to disable crypting. Defaults to `host,login`.

**Caution**: each job uses a random salt for crypting, so crypted values from different jobs are not comparable.

### Output-Fields ###
To specify the fields to include in the output (if the format allows it). [(More information)](./outputfields.html)  

### Traces-Level ###
Allows to specify the verbosity level desired for ezPAARSE's feedback. The higher levels include the lower ones.
Niveaux disponibles :
  - **error** : blocking errors, abnormal treatment termination.  
  - **warn** : errors not fatal to the treatment.  
  - **info** : general informations (requested format, ending notification, number of ECs generated...).  
  - **verbose** : more precise than info, gives more information about each stage of the treatment.  
  - **silly** : every detail of the treatment (parser not found, line ignored, unsuccessful search in a pkb...).  


### Reject-Files ###
List of the reject files to create, separated by commas. (`none` by default, `all`)
Possible values : Unknown-Formats, Ignored-Domains, Unknown-Domains, Unqualified-ECs, PKB-Miss-ECs, Duplicate-ECs, Unordered-ECs, Filtered-ECs, Ignored-Hosts, Robots-ECs.

### User-field[n]-xxx ###
Extacts user information from a field of the imput logfile [(More information)](./userfields.html).

### Double-Click-xxx ###
Parameters used for deduplication. [(More information)](./doubleclick.html).

### Request-Charset ###
Character map used for input. [(see supported encodings)](https://github.com/ashtuchkin/iconv-lite#supported-encodings).

### Response-Charset ###
Character map used for output. [(see supported encodings)](https://github.com/ashtuchkin/iconv-lite#supported-encodings).

### Max-Parse-Attempts ###
Maximum number of lines that ezPAARSE will attempt to parse in order to check the log format.

### Clean-Only ###
If set to `true`, ezPAARSE will just filter out the lines we are sure are irrelevant and output only the relevant ones.
The goal when using this parameter is to reduce the size of the log file, if you need to store it for further treatment.

### Force-Parser ###
If URLs don't have 'domain' part, use this parameter to force right parser to be used. Usefull for Open Access log analysis which don't have domain part in URL (all URLs comes form the same domain).
For example : Force-Parser: 'dspace'.
Can be use in conjonction with Force-ECField-Publisher.

### COUNTER-Reports ###
List of COUNTER reports to create (ex: JR1, BR2). Download links are accessible in the `stats` section of the treatment report. [(More information)](./counter.html)

### COUNTER-Format ###
COUNTER report formats : `XML` (by default) ou `CSV`.  

### COUNTER-Customer ###
Name and/or email of the customer to include in the COUNTER reports, following the form `name`, `<email>` or `name<email>`. (By default :`ezPAARSE<admin email>`)  

### COUNTER-Vendor ###
Name and/or email of the publisher  to include in the COUNTER reports, following the form `name`, `<email>` or `name<email>`. (By default :`platform42`, without email)  

### Geoip ###
Listing of the geolocation informations to be added to the results. Bu default `geoip-longitude, geoip-latitude, geoip-country`. `all` can be used to include every fiel available, or `none` to deactivate geolocation altogether. [(More information)](./geolocalisation.html)

### ezPAARSE-Job-Notifications ###
Listing of notifications to send when treatment is done, written as `action<cible>` et separated by commas. Currently available : `mail<adresse>`

### ezPAARSE-Enrich ###
Set to `false` to deactivate data enrichment (geoip and knowledge bases). Any other value will leave the data enrichment active.

### ezPAARSE-Predefined-Settings ###
Tells ezPAARSE to use a predefined set of parameters. Ex : `inist` for INIST-CNRS parameters. ([see the full list](/info/predefined-settings))

### ezPAARSE-Filter-Redirects ###
Set false to prevent lines with HTTP status codes 301, 302 from being filtered and discarded.

### Disable-Filters ###
Disable filters applying to robots or arbitrary hosts/domains. (defaults to `none`).  
Possible values (separated by commas) : `robots`, `ignored-hosts`, `ignored-domains`.  
Set to `all` to disable all above filters.  

**NB**: when robots are not filtered, add the `robot` field to the output in order to know which consultations were made by robots.

### Force-ECField-Publisher ###
Set the publisher_name field to a predefined value.
For example : Force-ECField-Publisher: 'IRevues'.


### cut ###
Set to `true` to activate middleware. Any other value will leave the middleware deactive.
Add ohter headers. 
     - ### cut-fields ### : it's fields to cut, initializes with name of fields to want a cut.
     - ### cut-regex ### : régulairie expression to match with fields to cut.
     - ### cut-fields-create ### : new fields to create with result to cutting fields.

Usage example:

```shell
curl -v -X POST --proxy "" --no-buffer \
  -F "file=@test/dataset/cut.log" \
  -H 'cut: true' \
  -H 'cut-fields: doi' \
  -H 'cut-regex: ([0-9\.]+)\/([0-9\-]+)' \
  -H 'cut-fields-create: prefix,suffix' \
 	http://127.0.0.1:59599
```