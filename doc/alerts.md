# Les alertes #

## Principe ##
Lorsque vous traitez des logs avec ezPAARSE, un certain nombre de chiffres sont générés (nombre de lignes lues, de rejets, de plateformes reconnues...). Les statistiques issues de ces chiffres sont utilisées afin de détecter la présence d'anomalies durant le traitement, en se basant sur des valeurs considérées comme normales.

## Comment savoir si des alertes ont été générées ? ##
La liste des alertes est consultable dans le [rapport de traitement](./report.html#alerts). Si la notification par mail est activée, vous pourrez également la visionner dans le mail envoyé à l'issue du traitement.

**NB**: l'activation du système d'alerte nécessite de traiter suffisamment de lignes de log pertinentes. Le seuil d'activation est défini dans le fichier `config.json` sous la clé `activationThreshold`.

## Liste des alertes disponibles ##

### Domaines inconnus ###
Générée lorsqu'un domaine sans parseur associé apparaît fréquemment dans les logs. Le taux d'apparition est calculé sur la base des lignes de log pertinentes.

```
  taux_apparition = nombre_apparitions / (total_des_lignes - lignes_ignorées) * 100
```

Le seuil d'alerte est défini dans le fichier `config.json` sous la clé `unknownDomainsRate`.
