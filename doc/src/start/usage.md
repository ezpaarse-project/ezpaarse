# How to use

## Run the server

ezPAARSE launches from the command line. Use the following commands from the installation directory to start and stop the server.

If you want to launch ezPAARSE without the web client, set the `EZPAARSE_NO_WEB_CLIENT` environment variable with any value. This is not necessary if ezPAARSE has been installed without client dependencies.

### Without Docker

```bash
make start   # start the server
make stop    # stop the server
make restart # restart the server
make status  # check the server status
```

### With Docker and Compose

```bash
docker compose up -d   # start the server
docker compose stop    # stop the server
docker compose restart # restart the server
docker compose ps      # check the server status
```

**NB**: for docker-compose version 1, replace `docker compose` by `docker-compose`.

## Use with web client

Visit [http://localhost:59599/](http://localhost:59599/) and create the first administrator of your local ezPAARSE instance. Administrators can manage the registered users and trigger updates from the web interface.

Once logged in, try drag-and-dropping a log file on the online form and processing it. If your logs are standard, you should be able to get a result immediately and see what ezPAARSE can produce for you.

Now you're up and ready to use ezPAARSE. Head onto the next section to learn about the basics.

## Use with command line

ezPAARSE ships with an utility called `ezp`, which allows for processing files through the command line. To make it available in your terminal, you'll need to load the ezPAARSE environment. This is done by sourcing the `bin/env` file located in the installation directory:

```bash
cd ezpaarse
. bin/env
```

Once the environment is loaded, you get access to the `ezp` command:

```bash
ezp --help
```

You can then use [ezp process](#ezp-process) to process a list of files, or [ezp bulk](#ezp-bulk) to process an entire directory in a more automated way.

### ezp process

Let you process one or more files with an instance of ezPAARSE. If no files are provided, the command will listen to `stdin`. The results are printed to `stdout`, unless you set an output file with `--out`.

```bash
Options:
  --output, --out, -o       Output file
  --header, --headers, -H   Add a header to the request (ex: "`Reject-Files: all`")
  --download, -d            Download a file from the job directory
  --verbose, -v             Shows detailed operations.
  --settings, -s            Set a predefined setting.
```

Examples of use :
```bash
# Simple case, process ezproxy.log and write results to result.csv
ezp process ezproxy.log --out result.csv

# Same as above, and download the report file
ezp process ezproxy.log --out result.csv --download report.json

# Download the report file with a custom path
ezp process ezproxy.log --out result.csv --download report.json:./reports/job-report.json

# Reading from stdin and redirecting stdout to a file
cat ezproxy.log | ezp process > result.csv
```

### ezp bulk

Process files in `sourceDir` and save results in `destDir`. If `destDir` is not provided, results will be stored in `sourceDir`, aside the source files. When processing files recursively with the `-r` option, `destDir` will mimic the structure of `sourceDir`. Files will use the same or Files with existing results are skipped, unless the `--force` flag is set. By default, the result file and the job report are downloaded, but you can get additionnal files from the job directory by using the `--download` option.

```bash
Options:
  --header, --headers, -H   Add a header to the request (ex: "`Reject-Files: all`")
  --settings, -s            Set a predefined setting.
  --recursive, -r           Look for log files into subdirectories
  --download, -d            Download a file from the job directory
  --overwrite, --force, -f  Overwrite existing files
  --verbose, -v             Shows detailed operations.
  --list, -l                Only list log files in the directory
```

Examples of use :
```bash
# Simple case, processing files recursively from ezproxy-logs and storing results in ezproxy-results
ezp bulk -r ezproxy-logs/ ezproxy-results/

# Activating reject files and downloading unqualified log lines along results
ezp bulk -r ezproxy-logs/ ezproxy-results/ -H "Reject-Files: all" --download lines-unqualified-ecs.log
```

A result file (`.ec.csv` extension) and a report in JSON format (extension` .report.json`) are generated in the output directory for each log file. If the destination directory is not specified, they are generated in the same directory as the file being processed.
If an error occurs when processing a file, the incomplete result file is named with the `.ko` extension.
Rejects files are not retained by ezPAARSE.

```
Inject files to ezPAARSE (for batch purpose)
  Usage: /home/yan/ezpaarse/bin/ecbulkmaker [-rflvH] SOURCE_DIR [RESULT_DIR]

Options:
  --recursive, -r  If provided, files in subdirectories will be processed. (preserves the file tree)
  --list, -l       If provided, only list files.
  --force, -f      override existing result (default false).
  --header, -H     header parameter to use.
  --verbose, -v    Shows detailed operations.

```
### Video Demonstration
This [screencast](https://www.youtube.com/watch?v=5Tlk6GECSTI) demonstrates the usage of ecbulkmaker (ie process a directory containing log files and outputting a mirror directory with the results)


