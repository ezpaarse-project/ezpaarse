# Formats de logs #
ezPAARSE permet aux utilisateurs de préciser le format des lignes de logs générées par leur proxy en utilisant le header HTTP *Log-Format-xxx*, où *xxx* correspond au nom du proxy.  

Les différentes syntaxes sont calquées sur celles utilisées par les proxy, de sorte qu'il suffise de coller le format présent dans la configuration du proxy afin que les lignes soient reconnues. Attention cependant, **les paramètres ne sont pas repris dans leur globalité**.

## Syntaxe EZproxy ##

- %h : hôte à l'origine de la requête.
- %u : login utilisé pour l'authentification.
- %l : nom d'utilisateur distant obtenu par identd. (toujours "-")
- %b : nombre d'octets transférés.
- %U : URL demandée *(e.g. http://www.somedb.com/)*.
- %m : méthode de la requête *(e.g. GET, POST)*.
- %r : requête complète *(e.g. GET http://www.somedb.com HTTP/1.0)*.
- %t : date/heure de la requête. Le format peut être précisé dans le header *Date-Format*.
- %s : statut numérique HTTP de la requête.

### Expressions régulières générées pour les champs EZproxy ###

Chacun des champs ci-dessus est transformé par ezPAARSE en une expression régulière :
- %h (host)     : '([a-zA-Z0-9\\.\\-]+(?:, ?[a-zA-Z0-9\\.\\-]+)*)'
- %u (login)    : '([a-zA-Z0-9@\\.\\-_%,=]+)'
- %l (identd)   : '([a-zA-Z0-9\\-]+|\\-)'
- %b (size)     : '([0-9]+)'
- %U (url)      : '([^ ]+)'
- %m (method)   : '([A-Z]+)'
- %r (url)      : '[A-Z]+ ([^ ]+) [^ ]+'
- %t (datetime) : '\\[([^\\]]+)\\]'
- %s (status)   : '([0-9]+)'

## Syntaxe Apache ##

- %h  : hôte à l'origine de la requête.
- %u  : login utilisé pour l'authentification.
- %l  : nom d'utilisateur distant obtenu par identd. (toujours "-")
- %b  : nombre d'octets transférés.
- %U  : URL demandée *(e.g. http://www.somedb.com/)*.
- %r  : requête complète *(e.g. GET http://www.somedb.com HTTP/1.0)*.
- %t  : date/heure de la requête. Le format peut être précisé dans le header *Date-Format*.
- %>s : statut numérique HTTP de la requête.

## Syntaxe Squid ##

- %ts  : timestamp de la requête (en secondes).
- %tu  : nombre de millisecondes (du timestamp).
- %tr  : temps de réponse du serveur.
- %tl  : date/heure de la requête. Le format peut être précisé dans le header *Date-Format*.
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

## Paramètres personnalisés ##

Utiliser des paramètres personnalisés permet de récupérer des informations présentes dans les lignes de logs qui ne répondent pas au standard EZproxy. A l'inverse, il est possible d'ignorer certaines informations, qui ne seront pas retrouvées dans les événements de consultation générés par ezPAARSE.  

Un paramètre peut être formulé de trois façons :  
- %{**propriété**}<**regexp**> : récupère le champ correspondant à l'expression régulière entre <...> et l'ajoute à l'événement de consultation sous le nom défini entre {...}.  
- %{**propriété**} : récupère une chaîne alphanumérique et l'ajoute à l'événement de consultation sous le nom défini entre {...}.  
- %<**regexp**> : ignore le morceau de ligne de log correspondant à l'expression régulière entre <...>.

**NB:** pour les expressions régulières complexes, utilisez des parenthèses non capturantes : **(?:x)**.

### Exemples de champs particuliers ###

<table>
  <tr>
    <th>Champ</th>
    <th style="text-align:left;">Formes</th>
    <th>Format à indiquer</th>
  </tr>
  <tr>
    <td>%{X-FORWARDED-FOR}i</td>
    <td><span style="color: red">61.117.43.242</span>
      <br /><span style="color: green">209.85.238.58, 10.0.0.99</span>
    </td>
    <td>%{X-FORWARDED-FOR}&lt;[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}(?:, [0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})\*&gt;</td>
  </tr>
  <tr>
    <td>%{ezproxy-groups}i</td>
    <td><span style="color: red">Default+inpl</span>
      <br /><span style="color: green">Default+915</span></td>
    <td>%{ezproxy-groups}&lt;[a-zA-Z0-9\\+]+&gt;</td>
  </tr>
  <tr>
    <td>%{ezproxy-session}i</td>
    <td><span style="color: red">pvJ0HWGo6eWhhVv</span>
      <br /><span style="color: green">UX0Yi0agVZQwHNs</span></td>
    <td>%{ezproxy-session}
      <br />**ou**
      <br />%{ezproxy-session}&lt;[a-zA-Z0-9]+&gt;</td>
  </tr>
</table>

### Exemple de requête ###
```shell
curl -X POST --proxy "" --no-buffer -H 'Log-Format-ezproxy: %h %<[-]> %u [%t] "%r" %s %b' --data-binary @test/dataset/sd.2012-11-30.300.log  http://127.0.0.1:59599 -v
```

### Cas concrets ###

<table>
  <tr>
    <th>Proxy</th>
    <th style="text-align:left;">Type de ligne</th>
    <th>Format possible</th>
  </tr>
  <tr>
    <td rowspan="2">EZproxy</td>
    <td>80.80.80.80 - oBzrStkEVAeUDeA [20/Nov/2011:17:45:50 +0100] "GET http://www.sciencedirect.com:80/science/journal/aip/00121606 HTTP/1.1" 200 162009</td>
    <td>%h %l %u %t "%r" %s %b</td>
  </tr>
  <tr>
    <td>[18/Nov/2012:00:00:34 +0100] 40.30.25.122 40.30.25.122 5mpcyan6 http://link.springer.com:80/article/10.1007/s00262-008-0620-4/fulltext.html 116636 liV9RqGobWNKrdD</td>
    <td>%t %h %u %U %b %{session}</td>
  </tr>
  <tr>
    <td>Apache</td>
    <td>50.50.50.50 - uid=aaa2561c,ou=people,dc=uep-tlfy,dc=fr [27/Mar/2012:06:52:44 +0200] "GET /http/www.sciencedirect.com/science/article/pii/S1875389212003823 HTTP/1.1" 200 45022 "-" "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.79 Safari/535.11"
    </td>
    <td>%h %l %u %t "%r" %&gt;s %b %&lt;.\*&gt;</td>
  </tr>
  <tr>
    <td rowspan="2">Squid</td>
    <td>1319061710.284   2102 90.90.90.90 TCP_MISS/200 309401 GET http://www.sciencedirect.com/science/article/pii/S0166218X11003477 cousteau DIRECT/198.81.200.2 text/html</td>
    <td>%ts.%03tu %6tr %>a %Ss/%03&gt;Hs %&lt;st %rm %ru %[un %Sh/%&lt;a %mt</td>
  </tr>
  <tr>
    <td>istproxy.inrialpes.fr:443 123.123.123.123 - tartempion [10/Apr/2012:09:38:21 +0200] "GET http://www.sciencedirect.com/science/article/pii/S0166218X11003477 HTTP/1.1" 302 20 "-" "Mozilla/5.0 (Windows NT 6.1; rv:11.0) Gecko/20100101 Firefox/11.0"</td>
    <td>%&lt;A:%lp %&gt;a %ui %[un [%tl] "%rm %ru HTTP/%rv" %&gt;Hs %&lt;st %&lt;.\*&gt;</td>
  </tr>
</table>
