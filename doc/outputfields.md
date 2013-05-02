### Output-Fields ###
Le header Output-Fields permet de spécifier (quand le format de sortie le permet) les champs à retourner par ezPAARSE lors de la génération des évènements de consultation (ECs).

Par défaut, les champs retournés sont ceux présents dans le paramètre EZPAARSE_OUTPUT_FIELDS du fichier de configuration (config.json), auxquels sont ajoutés ceux extraits du format de log. Ces champs par défaut peuvent être surchargés avec de nouveaux champs, ou simplement remplacés.

Pour remplacer les champs par défaut, il suffit d'énumérer ceux voulus.  
Ex: **Output-Fields: C1,C2** (les ECs contiendront **uniquement** les champs C1 et C2.)  

Pour surcharger les champs par défaut au lieu de les remplacer, le signe **+** doit être ajouté avant l'énumération.  
Ex: **Output-Fields: +C1,C2** (les ECs contiendront les champs par défauts, auxquels seront ajoutés les champs C1 et C2.)  

#### Exemples ####
```shell
curl -X POST --proxy "" --no-buffer -H 'Output-Fields: host,login,url' --data-binary @test/dataset/sd.2012-11-30.300.log  http://127.0.0.1:59599 -v
curl -X POST --proxy "" --no-buffer -H 'Output-Fields: +datetime,timestamp' --data-binary @test/dataset/sd.2012-11-30.300.log  http://127.0.0.1:59599 -v
```