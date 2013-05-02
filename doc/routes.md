# Routes #

ezPAARSE est une application RESTful.  
**REST**: Representational State Transfer

####Methodes####
  
<table>
    <tr>
        <th style="text-align:left;width:140px;">URL</th>
        <th> GET </th>
        <th> POST </th>
        <th> PUT </th>
        <th> DELETE </th>
    </tr>
    <tr>
      <td>
        /</td>
      <td>Page d'accueil</td>
      <td>[Parse un fichier de log](./postlog.html)</td>
      <td>_NA_</td>
      <td>_NA_</td>
    </tr>
    <tr>
      <td>
        /{jobID}/{log}</td>
      <td>Récupère un fichier de log lié au job d'ID donné</td>
      <td>_NA_</td>
      <td>_NA_</td>
      <td>_NA_</td>
    </tr>
    <tr>
      <td>
        /info/platforms</td>
      <td>Liste les plateformes disponibles</td>
      <td>_NA_</td>
      <td>_NA_</td>
      <td>_NA_</td>
    </tr>
    <tr>
      <td>
        /info/ectypes</td>
      <td>Liste les types d'EC</td>
      <td>_NA_</td>
      <td>_NA_</td>
      <td>_NA_</td>
    </tr>
    <tr>
      <td>
        /info/codes</td>
      <td>Liste les codes de retour de l'application et leur signification</td>
      <td>_NA_</td>
      <td>_NA_</td>
      <td>_NA_</td>
    </tr>
    <tr>
      <td>
        /info/codes/{code}</td>
      <td>Retourne la signification d'un code</td>
      <td>_NA_</td>
      <td>_NA_</td>
      <td>_NA_</td>
    </tr>
</table>

####Légende####

- NA: Non autorisé