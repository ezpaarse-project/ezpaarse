# Knowledge bases

## What is a knowledge base?

A **PKB** (read _Publisher Knowledge Base_) is simply an organized list making the link between normalized metadata (eg. ISSN, DOI, journal title, etc.) and proprietary resource identifier(s) used by a vendor.

A **PKB** is composed of one or more [tab separed value](http://en.wikipedia.org/wiki/Tab-separated_values) text files that conforms to the [KBART format](http://www.niso.org/workrooms/kbart)

The KBART field named **title_id** represents the vendor's identifier that will be linked to a normalized identifier like **print_identifier** (very often: print ISSN) or **online_identifier**.

The KBART files used by ezPAARSE can contain additional non-KBART fields (that will be prefixed with `pkb-`, like: `pkb-domain`), depending on the richness of the metadata available.

In order to be taken in account by ezPAARSE, the PKB files need to respect the KBART standard file naming pattern: **[ProviderName]\_*[Region/Consortium]*\_[PackageName]\_[YYYY-MM-DD].txt**, and be located in a folder named after the platform's parser.

For example:
  * cairn/cairn_ebooks_2014-02-13.txt
  * cairn/cairn_journals_part1_2014-02-13.txt

**Warning** : PKB identifiers **must be unique**. If an identifier appears more than once (in one or more PKB files), **only one occurrence** will be taken in account.

## How is a Knowledge Base used?

### ezPAARSE < 2.1.0

When a resource carrying a vendor identifier `title_id` is met, the associated knowledge base is built from the KBART files and loaded to memory. ezPAARSE can then link the proprietary identifier with all the metadata available and add it to the access event that has been generated.

### ezPAARSE since 2.1.0

As knowledge bases are growing and take too much RAM space, ezPAARSE stores them in a mongoDB database to query the metadata associated with the proprietary identifiers. For that purpose, ezPAARSE runs [CastorJS](https://github.com/castorjs/castor-load) in the background to keep the database and PKB files synchronized. This keeps the memory footprint of ezPAARSE at a minimum, but also requires additional startup time to perform the synchronization, especially on first startup.

Please note that processing logs without waiting for the initial synchronization to be over may result in incomplete enrichment of the access events.

**Warning**: some ezPAARSE output formats will force you to explicitely ask for some information you are interested in. If you don't, you will only get a minimal set of information as a result. This is the case with the CSV output.
Other output formats, like JSON, will automatically return all the data available.
