# Ecosystem

## pkb-cleaner

Detects and deletes duplicates in the knowledge bases.

```bash
Usage: pkb-cleaner [-nvp] [DIR_TO_CLEAN]

Options:
  --platform, -p   Name of a platform whose PKB should be cleaned.(if provided, ignore dir path)
  --norewrite, -n  If provided, do not rewrite files once the check is complete.
  --verbose, -v    Print all duplicated entries
```

Example:
```bash
pkb-cleaner ./path/to/some/directory
pkb-cleaner --platform=sd
```

## scrape
Launches the scrapers for one or more platforms. The scrapers are little utility programs to assemble a knowledge base by scraping a publisher's website.

```bash
Usage: /home/yan/ezpaarse/bin/scrape [-alvfc] [Platform] [Platform] ...

Options:
  --all, -a      Execute all scrapers.
  --list, -l     Only list scrapers without executing them.
  --clean, -c    Clean PKB files when all scrapers has been executed.
  --force, -f    Overwrite PKB files if they already exist.
  --verbose, -v  Print scrapers output into the console.
```

Example:
```bash
scrape sd cbo # launches the scrapers for SD (ScienceDirect) and CBO
scrape -al    # lists all the existing scrapers without launching them
```

## loginjector

Streams a log file to a local instance of ezPAARSE.

Example:
```bash
zcat monezproxy.log.gz | ./bin/loginjector
```

Usage:
```
Injects data into ezPAARSE and gets the response
Usage: node ./loginjector

Options:
  --input, -i     a file to inject into ezPAARSE (default: stdin)
  --output, -o    a file to send the result to (default: stdout)
  --server, -s    the server to send the request to (ex: http://ezpaarse.com:80). If none, will send to a local instance.
  --proxy, -p     the proxy which generated the log file
  --format, -f    the format of log lines (ex: %h %u [%t] "%r")
  --encoding, -e  encoding of sent data (gzip, deflate)
  --accept, -a    wanted type for the response (text/csv, application/json)
```

This command eases the sending of log files to an ezPAARSE instance, compared to the cURL utility.

## loganonymizer

Anonymizes a log file. The sensitive elements, like the login, machine name or IP address, are replaced with random values. The log file should be sent to the system input (stdin) of the command.

Example:
```bash
zcat monezproxy.log.gz | ./bin/loganonymizer
```

Usage:
```
Anonymize critical data in a log file
Usage: node ./loganonymizer --input=[string] --output=[string] --proxy=[string] --format[string]

Options:
  --input, -i   the input data to clean
  --output, -o  the destination where to send the result to
  --proxy, -p   the proxy which generated the log file
  --format, -f  the format of log lines (ex: %h %u [%t] "%r")
```

This is useful for generating test files by removing sensitive items (related to the protection of personal data). Each value is replaced by the same random value so keeping associations and be able to deduplicate is guaranteed.

## logextractor

Retrieves one or more fields in a log file. The log file should be sent to the system input (stdin) of the command.

Examples:
```bash
zcat monezproxy.log.gz | ./bin/logextractor --fields=url
zcat monezproxy.log.gz | ./bin/logextractor --fields=login,url --separator="|"
```

Usage:
```
Extract specific fields from a log stream
Usage: node ./logextractor --fields=[string] --separator=";"

Options:
  --fields, -f            fields to extract from log lines (ex: url,login,host)  [required]
  --separator, --sep, -s  character to use between each field                    [required]  [default: "\t"]
  --input, -i             a file to extract the fields from (default: stdin)
  --output, -o            a file to write the result into (default: stdout)
  --proxy, -p             the proxy which generated the log file
  --format, -t            the format of log lines (ex: %h %u [%t] "%r")

```

This is useful for manipulating log files. A common use is extracting URLs from a log file in order to analyze a platform for a publisher. For example, here's how to get the URL for the ScienceDirect platform by sorting alphabetically and deduplicating them:
```bash
zcat monezproxy.log.gz | ./bin/logextractor --field=url | grep "sciencedirect" | sort | uniq
```

## csvextractor

Extracts content from a CSV file. The CSV file must be sent to the system input (stdin) of the command.

Example:
```bash
cat monfichier.csv | ./bin/csvextractor
```

Usage:
```
Parse a csv source into json.
  Usage: csvextractor [-sc] [-f string | -d string | -k string] [--no-header]

Options:
  --file, -f          A csv file to parse. If absent, will read from standard input.
  --fields, -d        A list of fields to extract. Default extract all fields. (Ex: --fields issn,pid)
  --key, -k           If provided, the matching field will be used as a key in the resulting json.
  --silent, -s        If provided, empty values or unexisting fields won't be showed in the results.
  --csv, -c           If provided, the result will be a csv.
  --json, -j          If provided, the result will be a JSON.
  --jsonstream, --js  If provided, the result will be a JSON stream (one JSON per line).
  --noheader          If provided, the result won't have a header line. (if csv output)
```

This command is useful for testing the parser directly from the test file by extracting the URL column of the file.

Example (parser test):
```bash
cat ./test/npg.2013-01-16.csv | ../../bin/csvextractor --fields='url' -c --noheader | ./parser.js
```

## csvtotalizer

Produces a summary on the content of a CSV file resulting from a processing of ezPAARSE. The CSV file must be sent to the system input (stdin) of the command.

Example:
```bash
cat monresultat.csv | ./bin/csvtotalizer
```

Usage:
```
Summarize fields from a CSV stream
Usage: node ./bin/csvtotalizer --fields=[string] --output="text|json"

Options:
  --output, -o  output : text or json                                        [required]  [default: "text"]
  --sort, -s    sort : asc or desc in text mode                              [required]  [default: "desc"]
  --fields, -f  fields to compute from the CSV (ex: domain;host;login;type)  [required]  [default: "domain;host;login;type"]
```

This is useful for getting a quick overview of a processing outcome of a log file ezPAARSE.
By default, domain fields, host, login and type are available in text format.
Here is how to know how many different consultation events have been recognized in a sample file:
```bash
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector | ./bin/csvtotalizer
```

## logfaker

Generates an output stream matching with log lines of a platform on stdout.

Example:
```bash
./logfaker | ./loginjector
```

Usage:
```
Usage: node ./logfaker --platform=[string] --nb=[num] --rate=[num] --duration=[num]

Options:
  --platform      the publisher platform code used as a source for generating url  [required]  [default: "sd"]
  --nb, -n        number of lines of log to generate                               [required]  [default: "nolimit"]
  --rate, -r      number of lines of log to generate per second (max 1000)         [required]  [default: 10]
  --duration, -d  stop log generation after a specific number of seconds           [required]  [default: "nolimit"]
```

Useful to test the performance of ezPAARSE.

## pkbvalidator

Checks the validity of a knowledge base for a publisher's platform.
This file must conform to the KBART format.

This command checks the following:
- The presence of the .txt extension
- Uniqueness of title_id
- Minimal identification information available
- Syntax check of standardized identifiers (ISSN, ISBN, DOI)

Usage:
```
Check a platform knowledge base file.
  Usage: node ./bin/pkbvalidator [-cfsv] pkb_file1.txt [pkb_file2.txt]

Options:
  --silent, -s   If provided, no output generated.
  --csv, -c      If provided, the error-output will be a csv.
  --verbose, -v  show stats of checking.
```

## hostlocalize

Enriches a csv result file containing a host name with the geolocation of the IP address

Example:
```bash
./hostlocalize -f ezpaarsedata.csv > ezpaarsedatalocalised.csv
```
The input file is assumed to contain a field with the ip address for the location
```
Enrich a csv with geolocalisation from host ip.
  Usage: node ./bin/hostlocalize [-s] [-f string | -k string]

Options:
  --hostkey, -k  the field name containing host ip (default "host").
  --file, -f     A csv file to parse. If absent, will read from standard input.
```
