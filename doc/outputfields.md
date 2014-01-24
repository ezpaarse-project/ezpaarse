### Output-Fields headers ###
Le header Output-Fields permet d'ajouter ou retirer (quand le format de sortie le permet) des champs à ceux retournés par ezPAARSE lors de la génération des événements de consultation (ECs).  

Par défaut, les champs retournés sont ceux présents dans le paramètre EZPAARSE_OUTPUT_FIELDS du fichier de configuration ([config.json](https://github.com/ezpaarse-project/ezpaarse/blob/master/config.json#L9)), auxquels sont ajoutés ceux extraits du format de log.

Ce paramètre peut permettre de rajouter des champs personnalisés que certains parseurs seraient suceptibles de retourner. Par exemple, le champ "btype" n'est pas ajouté par défaut par ezpaarse et permet de remonter des informations avancées sur les consultations de base de données.
Il peut également permettre de rajouter des champs interne à ezPAARSE comme :
- datetime : pour avoir la date complète (heure, minute et seconde comprises) de l'évènement de consultation
- timestamp : pour avoir la date au format informatique de l'évènement de consultation

A noter que les champs personnalisés dans le [format de log](./formats.html) seront automatiquement ajoutés dans la listes des "Output-Fields".

Le header Output-Fields est composé d'une liste de champs séparés par des virgules, chacun précédé d'un signe **+** ou **-** selon qu'il doive être ajouté ou enlevé.

#### Exemple ####
```shell
curl -X POST --proxy "" --no-buffer -H 'Output-Fields: -host,-login,+datetime' --data-binary @test/dataset/sd.2012-11-30.300.log  http://127.0.0.1:59599 -v
```