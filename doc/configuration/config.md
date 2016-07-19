# Configuration options #

ezPAARSE comes with a config.json file (located at the root of the /ezpaarse directory).

### EZPAARSE_ADMIN_MAIL
The default value is set to `ezpaarse@couperin.org`

### EZPAARSE_PARENT_URL
The default value is set to `http://ezpaarse-preprod.couperin.org`

### EZPAARSE_MONGO_URL
The default value is set to `mongodb://localhost:27017/ezpaarse`

### EZPAARSE_FEEDBACK_RECIPIENTS
The default value is set to `ezpaarse@couperin.org`

### EZPAARSE_SUBSCRIPTION_MAIL
The default value is set to `false

### EZPAARSE_ENV
The default value is set to `production`

### EZPAARSE_NODEJS_PORT
The default value is set to `59599`

### EZPAARSE_NODEJS_VERSION
The default value is set to `4.2.1`

### EZPAARSE_LOG_FOLDER
The default value is set to `test/dataset`

### EZPAARSE_REQUIRE_AUTH
The default value is set to `false`

### EZPAARSE_OUTPUT_FIELDS"
Contains an array of field names that are going to be present in the result file produced by ezPAARSE. 
The default array contains the following fields: 

```json
[
"datetime",
"date",
"login",
"platform",
"platform_name",
"publisher_name",
"rtype",
"mime",
"print_identifier",
"online_identifier",
"title_id",
"doi",
"publication_title",
"unitid",
"domain"
]
```

### EZPAARSE_MIDDLEWARES": 
Contains an array of middleware names, in the order they are going to be launched by ezPAARSE during a process.
The default array contains the following middlewares: 

```json
[
  "filter",
  "parser",
  "deduplicator",
  "enhancer",
  "istex",
  "elsevier",
  "crossref",
  "sudoc",
  "hal",
  "geolocalizer",
  "field-splitter",
  "qualifier",
  "cut",
  "anonymizer"
]
```
### EZPAARSE_QUALIFYING_LEVEL
This sets the minimal value, under which ezPAARSE considers an EC is not qualified enough to be written to the results.
The default value is set to `1`

### EZPAARSE_QUALIFYING_FACTORS
```json
{
    "internal": {
      "rtype": 0.5,
      "mime": 0.5
    },
    "external": [
      {
        "file": "platforms/fields.json",
        "sublist": "rid",
        "attribute": "code",
        "weight": 1
      }
    ]
  }
```

### EZPAARSE_TMP_CYCLE
The default value is set to `60min`

### EZPAARSE_TMP_LIFETIME
The default value is set to `1day`

### EZPAARSE_IGNORED_DOMAINS
Contains an array of domains to be ignored (ie filtered out) by ezPAARSE.
```json
[
  "www.google.fr",
  "www.google.com"
]
```

To avoid declaring too long a list, you can also declare unrelevant domains in dedicated exclusion files as documented in this [section](http://ezpaarse.readthedocs.io/en/master/features/exclusions.html#the-unrelevant-domains)

### EZPAARSE_GEOLOCALIZE_DEFAULT
The default value is set to `geoip-lookup`

### EZPAARSE_GEOLOCALIZE_SEPARATOR
The default value is set to `.`

### EZPAARSE_ALERTS
Contains an object with 4 member properties, listed here:
```json
{
  "activationThreshold": 1000,
  "unknownDomainsRate": 10,
  "titleIdOccurrenceRate": 20,
  "pkbFailRate": 20
}
```
