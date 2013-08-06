### User-fields headers ###

Les headers user-fields permettent d'extraire d'un champ présent dans les logs les informations utilisateur et de les répartir dans d'autres champs à l'aide d'expressions régulières.
Ils peuvent s'écrire par <span style="color: blue">bloc de header numérotés</span> *(en couleur les zones variables)* de la façon suivante :

User-field<span style="color: blue">0</span>-src: <span style="color: red">nomDuChampSource</span></br>
User-field<span style="color: blue">0</span>-sep: <span style="color: green">Séparateur</span></br>
User-field<span style="color: blue">0</span>-dest-<span style="color: red">nomDuChampDestination1</span>: <span style="color: magenta">expressionRégulière1</span></br>
User-field<span style="color: blue">0</span>-dest-<span style="color: red">nomDuChampDestination2</span>: <span style="color: magenta">expressionRégulière2</span></br>
User-field<span style="color: blue">0</span>-residual: <span style="color: red">nomDuChampRestes</span></br>

#### Paramètres (headers) ####

-   **User-field<span style="color: blue">0</span>-src:** nom du champ source utilisé pour extraire les informations utilisateur *(le champ doit être présent dans les logs)* .
-   **User-field<span style="color: blue">0</span>-sep:** caractère séparateur présent dans le champ source des informations utilisateur et qui sépare ces informations *(on utilisera le mot **space** pour invoquer l'espace)*
-   **User-field<span style="color: blue">0</span>-dest-<span style="color: red">nomDuChampDestination1</span>:** <span>définition du champ destination à mettre dans les données en sortie, comprenant le nom du champ après la chaîne **User-field<span style="color: blue">0</span>-dest-** et l'expression régulière correspondante aux données.</br> Il peut y avoir plusieurs noms de champ *(avec chacun son header correspondant)*. Les expressions régulières sont évaluées dans l'ordre. Le séparateur est utilisé en sortie si le champ est multivalué.</br> Les chaînes de caractères ne matchant pas les expressions régulières sont laissées dans le champ **User-field<span style="color: blue">0</span>-residual** s'il est présent.</span>
-   **User-field<span style="color: blue">0</span>-residual: ** Facultatif. Nom du champ destination utilisé pour recevoir les informations utilisateur non reconnues par les expressions régulières des champs destination.

Exemple d'usage :
```shell
curl -v -X POST --proxy "" --no-buffer \
  -F "file=@test/dataset/user-mono-plus.log" \
  -H 'Log-Format-ezproxy: %h - %u %t "%r" %s %b %{user}<[a-zA-Z0-9+]*>' \
  -H 'User-field0-src: user'\
  -H 'User-field0-sep: +'\
  -H 'User-field0-dest-groupe: etu|persecr|uncas|unautre'\
  -H 'User-field0-dest-categorie: [0-9]{3}'\
 	http://127.0.0.1:59599
```
