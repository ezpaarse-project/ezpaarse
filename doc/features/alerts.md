# Alerts

## Principles
When you process log files with ezPAARSE, a number of processing indicators are generated:
  * number of log lines read,
  * number of rejected log line,
  * number of recognized platforms, etc.

Those indicators can be used to detect anomalies during the processing, based on figures considered as "normal".

## How to know if alerts have been generated?
The list of alerts is available in the [processing report](../essential/report.html#alerts). If the mail notification is activated, you'll also receive this list with the email that is sent when the processing has completed.

**NB**: the activation of the alert system needs a sufficient quantity of relevant log lines. The activation threshold is set in the `config.json` file, with the `activationThreshold` key. It can also be modified with the **Alerts-Activation-Threshold** header.

## Available Alerts

### Unknown Domains
This alert is generated when a domain frequently appears in the log lines but no associated parser has been found. The appearence rate is calculated with the sum of relevant log lines.

```
  appearance_rate = appearance_sum / (total_of_loglines - ignored_lines) * 100
```

The activation threshold is set in the `config.json` file, with the `unknownDomainsRate` key. It can also be modified with the **Alerts-Unknown-Domains-Rate** header.

This alert simply means that ezPAARSE is not able to work for a certain amount of log lines you are providing it with. Most of the time, it is normal behavior because there is a lot more activity in logfiles that ezPAARSE is interested in.
