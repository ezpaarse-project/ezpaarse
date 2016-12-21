# Middlewares #

## What's a middleware ? ##

Middlewares are functions that constitute the processing chain. The middlewares are successively applied to the consultation events processed by ezPAARSE and turnthem into the definitive form they will have when the events are eventually written in the result file.

## How to create a middleware ? ##

The middlewares have their [own dedicated repository](https://github.com/ezpaarse-project/ezpaarse-middlewares).

Please refer to the [Readme](https://github.com/ezpaarse-project/ezpaarse-middlewares/blob/master/README.md) for more details.

## How to load a middleware ? ##

To become part of the processing chain, a middleware must have its name (*ie* the name of its file, without the `.js` suffix) added to the `EZPAARSE_MIDDLEWARES` array in the config file. The order of declaration in the array determines the order in which middlewares are called.

## Available Middlewares ##
### anonymizer
Anonymizes a list of fields

### crossref
Enriches consultation events with [crossref](http://search.crossref.org/) data from their [API](http://search.crossref.org/help/api)

### cut
Separates any unique field into two or more distinct fields, based on a given separator or regular expression

### deduplicator
Removes duplicate consultation events, based on the COUNTER algorithm for double-clicks

### enhancer
Enhances consultation events with information found in a pkb (issn, eissn, doi, title_id)

### field-splitter
TO BE DEPRECATED

### filter
Filters irrelevant consultation events

### geolocalizer
Geolocalize consultation events based on an IP address

### hal
Enriches consultation events with [HAL](https://hal.archives-ouvertes.fr/) data from their [API](https://api.archives-ouvertes.fr/docs/search)

### istex
Enriches consultation events with [istex](http://www.istex.fr/) data from their [API](https://api.istex.fr/documentation/)

### parser
Parses the URL associated with a consultation event (by calling the appropriate parser)

### qualifier
Checks consultation events' qualification. See the [dedicated page](../features/qualification.html) for more detail.

### sudoc
Enriches consultation events with [Sudoc](http://www.sudoc.abes.fr) data, especially the PPN (that identify Sudoc records)

### throttler
Regulates the consultation events' stream
