# COUNTER Reports

ezPAARSE can generate COUNTER reports based on the data collected in its results.
To that effect, you use the parameter **COUNTER-Reports** and specify:
  * the type of report (`JR1` is the only one available for now)
  * the output format with the **COUNTER-Format** parameter


## Parameters (headers)

-   **COUNTER-Reports:** lists the COUNTER reports you want to generate (eg: `JR1`, `BR2`). The download links are accessible in the `stats` section from the processing report.
-   **COUNTER-Format:** COUNTER reports output format : `XML` (by default) or `TSV`.
-   **COUNTER-Customer:** client's name and/or email address that will appear in the reports, either `name`, `<email>` or `name<email>`. (`ezPAARSE<mail de l'administrateur>` by default)
-   **COUNTER-Vendor:** vendor's name and/or email address that will appear in the reports, either `name`, `<email>` or `name<email>`. (`platform42` by default)

## CLI Usage

```bash
curl -X POST http://localhost:59599 \
 -H "Accept:text/csv" \
 -H "Traces-Level:info" \
 -H "COUNTER-Reports:JR1" \
 -H "COUNTER-Format:csv" \
 -F "files[]=@fede.bibliovie.ezproxy.2014.06.10.log.gz;type=application/x-gzip"
```

With cURL, the generated report can be downloaded at the URL given in the **Job-Report-jr1** header (see below).

<img :src="$withBase('/images/ezPAARSE-SR18-04.jpg')" alt="Commande cURL pour JR1" style="width: 750px"/>

## Usage through the online form

Using the online form, you can ask for the creation of COUNTER reports by adding specific headers in the **Headers (advanced)** section (see below):

<img :src="$withBase('/images/ezPAARSE-SR18-01.jpg')" alt="COUNTER via formulaire" style="width: 750px"/>

When the processing of logs is finished, the COUNTER reports can be downloaded via the link(s) in the stats section of the processing report, look for the **url-counter-jr1** line (see below):

<img :src="$withBase('/images/ezPAARSE-SR18-02.jpg')" alt="COUNTER via formulaire" style="width: 750px"/>

## COUNTER reports

The COUNTER report(s) can be directly used in a spreadsheet program, depending on the specified output format. You can see below a TSV file imported in Excel:

<img :src="$withBase('/images/ezPAARSE-SR18-03.jpg')" alt="COUNTER via formulaire" style="width: 750px"/>

