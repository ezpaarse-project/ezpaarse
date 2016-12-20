# Alerts #

## Principles ##
When you process log files with ezPAARSE, a number of processing indicators are generated: 
  * number of log lines read, 
  * number of rejected log line, 
  * number of recognized platforms
  * ...

Those indicators can be used to detect anomalies during the processing, based on figures considered as "normal".

## How to know if alerts have been generated? ##
The list of alerts is available in the [processing report](../essential/report.html#alerts). If the mail notification is activated, you'll also be able to access this list within the email sent when the processing is finished.

**NB**: the activation of the alert system needs a sufficient quantity of relevant log lines. The activation threshold is set in the `config.json` file, with the `activationThreshold` key. It can also be modified with the **Alerts-Activation-Threshold** header.

## Available Alerts ##

### Unknown Domains ###
Generated when a domain frequently appears in the log lines but no associated parser has been found. The presence rate is calculated with the sum of relevant log lines.

```
  appearance_rate = appearance_sum / (total_of_loglines - ignored_lines) * 100
```

The activation threshold is set in the `config.json` file, with the `unknownDomainsRate` key. It can also be modified with the **Alerts-Unknown-Domains-Rate** header.

### Holes in the Knowledges Bases ###

#### Lack of a Knowledge Base ####
An alert is generated when the lack of a PKB prevents the enrichment of access events carrying a provider' identifier (title_id).

#### Lack of an Identifier  ####
An alert is generated when an identifier is lacking and has been repeatedly requested.

The activation threshold is set in the `config.json` file, with the `titleIdOccurrenceRate` key. It can also be modified with the **Alerts-TitleID-Occurrence-Rate** header.

#### General Lack ####
An alert is generated when a large number of searches in a PKB have proved unsuccessful.

The tolerated rate of unsuccessful searches is set in the `config.json` file, with the `pkbFailRate` key. It can also be modified with the **Alerts-PKB-Fail-Rate** header.
