### OutputFields ###
Le header OutputFields permet de spécifier (quand le format de sortie le permet) les champs à retourner par ezPAARSE lors de la génération des évènements de consultation (ECs).

Par défaut, les champs retournés sont ceux présents dans le paramètre EZPAARSE_OUTPUT_FIELDS du fichier de configuration, auxquels sont ajoutés ceux extraits du format de log.

Deux méthodes sont disponibles pour surcharger les champs par défaut :  
- "OutputFields: C1,C2" : les ECs contiendront **uniquement** les champs C1 et C2.  
- "OutputFields: **+**C1,C2" : les ECs contiendront les champs par défauts, auxquels seront ajoutés les champs C1 et C2.  

#### Exemple ####
```shell
curl -X POST --proxy "" --no-buffer -H 'OutputFields: host,login,url' --data-binary @test/dataset/sd.2012-11-30.300.log  http://127.0.0.1:59599 -v
```