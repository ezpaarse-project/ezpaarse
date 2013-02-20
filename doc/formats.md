### Formats de logs ###
ezPAARSE permet aux utilisateurs de préciser le format des lignes de logs générées par leur proxy en utilisant le header HTTP *LogFormat-xxx*, où *xxx* correspond au nom du proxy.  

Les différentes syntaxes sont calquées sur celles utilisées par les proxy, de sorte qu'il suffise de coller le format présent dans la configuration du proxy afin que les lignes soient reconnues. Attention cependant, **les paramètres ne sont pas repris dans leur globalité**.

#### Syntaxe EZproxy ####

- %h : hôte à l'origine de la requête.
- %u : login utilisé pour l'authentification.
- %l : nom d'utilisateur distant obtenu par identd. (toujours "-")
- %b : nombre d'octets transférés.
- %U : URL demandée *(e.g. http://www.somedb.com/)*.
- %m : méthode de la requête *(e.g. GET, POST)*.
- %r : requête complète *(e.g. GET http://www.somedb.com HTTP/1.0)*.
- %t : date/heure de la requête. Le format peut être précisé dans le header *ezPAARSE-DateFormat*.
- %s : statut numérique HTTP de la requête.

#### Syntaxe Bibliopam (Apache) ####

- %h  : hôte à l'origine de la requête.
- %u  : login utilisé pour l'authentification.
- %l  : nom d'utilisateur distant obtenu par identd. (toujours "-")
- %b  : nombre d'octets transférés.
- %U  : URL demandée *(e.g. http://www.somedb.com/)*.
- %r  : requête complète *(e.g. GET http://www.somedb.com HTTP/1.0)*.
- %t  : date/heure de la requête. Le format peut être précisé dans le header *ezPAARSE-DateFormat*.
- %>s : statut numérique HTTP de la requête.

#### Syntaxe Squid ####

- %ts  : timestamp de la requête (en secondes).
- %tu  : nombre de millisecondes (du timestamp).
- %tr  : temps de réponse du serveur.
- %tl  : date/heure de la requête. Le format peut être précisé dans le header *ezPAARSE-DateFormat*.
- %>a  : hôte à l'origine de la requête.
- %<a  : adresse IP de la dernière connexion.
- %<A  : nom de domaine demandé dans la requête.
- %lp  : port demandé dans la requête.
- %Ss  : statut squid de la requête *(TCP_MISS, ..)*.
- %>Hs : statut numérique HTTP de la requête.
- %<st : taille de la réponse (headers inclus).
- %rm  : méthode de la requête *(e.g. GET, POST)*.
- %rv  : version du protocole utilisé.
- %ru  : URL demandée *(e.g. http://www.somedb.com/)*.
- %[un : login utilisé pour l'authentification.
- %Sh  : statut hiérarchique squid *(DEFAULT_PARENT, ..)*.
- %mt  : type MIME du contenu.
- %ui  : nom d'utilisateur distant obtenu par identd.

##### Paramètres personnalisés (commun) #####

Utiliser des paramètres personnalisés permet de récupérer des informations présentes dans les lignes de logs qui ne répondent pas au standard EZproxy. A l'inverse, il est possible d'ignorer certaines informations, qui ne seront pas retrouvées dans les évènements de consultation générés par ezPAARSE.  

Un paramètre peut être formulé de trois façons :  
- %{**proprieté**}<**regexp**> : récupère le champ correspondant à l'expression régulière entre <...> et l'ajoute à l'évènement de consultation sous le nom défini entre {...}.  
- %{**proprieté**} : récupère une chaîne alphanumérique et l'ajoute à l'évènement de consultation sous le nom défini entre {...}.  
- %<**regexp**> : ignore le morceau de ligne de log correspondant à l'expression régulière entre <...>.

#### Exemple ####
```shell
curl -X POST --proxy "" --no-buffer -H 'LogFormat-ezproxy: %h %<[-]> %u [%t] "%r" %s %b' --data-binary @test/dataset/sd.2012-11-30.300.log  http://127.0.0.1:59599/ws/ -v
```