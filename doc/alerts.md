# Les alertes #

## Principe ##
Lorsque vous traitez des logs avec ezPAARSE, un certain nombre de chiffres sont générés (nombre de lignes lues, de rejets, de plateformes reconnues...). Les statistiques issues de ces chiffres sont utilisées afin de détecter la présence d'anomalies durant le traitement, en se basant sur des valeurs considérées comme normales.

## Comment savoir si des alertes ont été générées ? ##
La liste des alertes est consultable dans le [rapport de traitement](./report.html#alerts). Si la notification par mail est activée, vous pourrez également la visionner dans le mail envoyé à l'issue du traitement.

**NB**: l'activation du système d'alerte nécessite de traiter suffisamment de lignes de log pertinentes. Le seuil d'activation est défini dans le fichier `config.json` sous la clé `activationThreshold`. Il peut être modifié via le header **Alerts-Activation-Threshold**.

## Liste des alertes disponibles ##

### Domaines inconnus ###
Générée lorsqu'un domaine sans parseur associé apparaît fréquemment dans les logs. Le taux d'apparition est calculé sur la base des lignes de log pertinentes.

```
  taux_apparition = nombre_apparitions / (total_des_lignes - lignes_ignorées) * 100
```

Le seuil d'alerte est défini dans le fichier `config.json` sous la clé `unknownDomainsRate`, et modifiable via le header **Alerts-Unknown-Domains-Rate**.

### Manques dans les bases de connaissance ###

#### Absence de base de connaissance ####
Générée lorsque qu'une PKB absente empêche l'enrichissement d'événements de consultations pourvus d'un identifiant éditeur (title_id).

#### Absence d'un identifiant ####
Générée lorsqu'un identifiant absent d'une PKB a été recherché un grand nombre de fois.

Le taux d'apparition toléré est défini dans le fichier `config.json` sous la clé `titleIdOccurrenceRate`, et modifiable via le header **Alerts-TitleID-Occurrence-Rate**.


#### Manque généralisé ####
Générée lorsqu'un grand nombre de recherches dans une PKB se sont révélées infructueuses.

Le taux de requêtes infructueuses toléré est défini dans le fichier `config.json` sous la clé `pkbFailRate`, et modifiable via le header **Alerts-PKB-Fail-Rate**.
