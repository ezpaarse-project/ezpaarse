# Startup #

[Anonymised example log files](https://raw.github.com/ezpaarse-project/ezpaarse/master/test/dataset/sd.2012-11-30.300.log)
are available in the ezPAARSE repository.

You have to start ezPAARSE first by launching the following command:
```console
make start
```

You can always check the program status by issueing the following command:
```console
make status
```

To stop ezPAARSE, type the following command:
```console
make stop
```

If you are not computer savvy, the easiest method to use ezPAARSE is to go through its HTML form
that is accessible with your favourite web browser.
You just have to open this URL: [http://localhost:59599/](http://localhost:59599/)

If you are an IT person, you can use an HTTP client (we'll use curl) to send a logfile
(in this case: ./test/dataset/sd.2012-11-30.300.log) to the ezPAARSE web service
and get a CSV stream of access events back.

```console
curl -X POST http://127.0.0.1:59599 \
             -v --proxy "" --no-buffer \
             --data-binary @./test/dataset/sd.2012-11-30.300.log
```

As an alternative, you could also use the ``./bin/loginjector`` command that ezPAARSE provides you with
to more simply inject the logfile in the web service:

```console
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector
```

You can also run quick calculations by adding the ``./bin/csvtotalizer`` command at the end of
your command line.
You will get an overview of access events that have been spotted in your logs by ezPAARSE:

```console
. ./bin/env
cat ./test/dataset/sd.2012-11-30.300.log | ./bin/loginjector | ./bin/csvtotalizer
```
