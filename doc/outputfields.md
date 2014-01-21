### Output-Fields headers ###
Le header Output-Fields permet d'ajouter ou retirer (quand le format de sortie le permet) des champs à ceux retournés par ezPAARSE lors de la génération des événements de consultation (ECs).  

Par défaut, les champs retournés sont ceux présents dans le paramètre EZPAARSE_OUTPUT_FIELDS du fichier de configuration ([config.json](https://github.com/ezpaarse-project/ezpaarse/blob/master/config.json#L9)), auxquels sont ajoutés ceux extraits du format de log.

Ce paramètre permet par exemple de rajouter des champs personnalisés que certains parseurs seraient suceptibles de retourner. Par exemple, les champs "pisbn" et "eisbn" ne sont pas ajoutés par défaut mais peuvent vous intéresser si vous avez de nombreux ebooks dans vos plateformes.

A noter que les champs personnalisés dans le [format de log](./formats.html) seront automatiquement ajoutés dans la listes des "Output-Fields".

Le header Output-Fields est composé d'une liste de champs séparés par des virgules, chacun précédé d'un signe **+** ou **-** selon qu'il doive être ajouté ou enlevé.

#### Exemple ####
```shell
curl -X POST --proxy "" --no-buffer -H 'Output-Fields: -host,-login,+datetime' --data-binary @test/dataset/sd.2012-11-30.300.log  http://127.0.0.1:59599 -v
```