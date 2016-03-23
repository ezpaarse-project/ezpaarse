### Output-Fields headers ###
The Output-Fields header adds or removes fields to those returned by ezPAARSE by default when generating Consultation Events (CEs).

By default, the fields returned are those present in the EZPAARSE_OUTPUT_FIELDS parameter configuration file ([config.json](https://github.com/ezpaarse-project/ezpaarse/blob/master/config.json#L9)) to which are added the ones already present in the log format triggered for the processing.

This parameter can be used to add custom fields (that some parsers would be able to extract and return). For example, the "btype" field is not added by default and can be used to trace back advanced information on some database consultations.
It can also allow you to add internal ezPAARSE fields as:
- Datetime: for the full date (hour, minute and second included) of the consultation event
- Timestamp: the date in a computer format for the consultation event

Please not that the personalized fields in the [log format](./formats.html) will automatically be added to the "Output-Fields" list: there is no need to declare them with this Output-Fields header.

The Output-Fields header is composed with a list of comma separated fields, each one preceded with a **+** or **-** signs, depending on whether it has to be added or removed.

#### Exemple ####
```shell
curl -X POST --proxy "" --no-buffer -H 'Output-Fields: -host,-login,+datetime' --data-binary @test/dataset/sd.2012-11-30.300.log  http://127.0.0.1:59599 -v
```
