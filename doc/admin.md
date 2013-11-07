# Documentation administrateur #

L'ensemble des fonctions décrites dans cette page peuvent être utilisées directement depuis la zone d'administration de l'application.

## Création de l'administrateur ##

Lorsqu'aucun utilisateur n'est encore enregistré, une tentative de connexion débouche sur un formulaire permettant de créer l'administrateur de l'application.  

Pour créer l'administrateur sans le formulaire, utiliser la route suivante :  
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Méthode</th>
      <th>Paramètres</th>
  </tr>
  <tr>
    <td>/register</td>
    <td>POST</td>
    <td>username, password</td>
  </tr>
</table>

#### Réponses possibles ####

- **201 Created** : l'administrateur a été créé.
- **400 Bad Request** : un paramètre est manquant.
- **409 Conflict** : un administrateur existe déjà.
- **500 Internal Server Error** : la création a échoué.

#### Exemple curl ####
```bash
curl -X POST --data "username=foo&password=bar" http://localhost:59599/register
```

## Gestion des utilisateurs ##

### Lister les utilisateurs ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Méthode</th>
      <th>Paramètres</th>
  </tr>
  <tr>
    <td>/users</td>
    <td>GET</td>
    <td></td>
  </tr>
</table>

Retourne un tableau JSON contenant l'ensemble des utilisateurs.

### Ajouter un utilisateur ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Méthode</th>
      <th>Paramètres</th>
  </tr>
  <tr>
    <td>/users/</td>
    <td>POST</td>
    <td>username, password</td>
  </tr>
</table>

#### Réponses possibles ####

- **201 Created** : l'utilisateur a été créé.
- **400 Bad Request** : un paramètre est manquant.
- **409 Conflict** : le nom d'utilisateur existe déjà.
- **500 Internal Server Error** : la création a échoué.

En cas de succès, le corps de la réponse contient une représention JSON de l'utilisateur créé.

#### Exemple curl ####
```bash
curl -X POST -u "admin:password" --data "username=foo&password=bar" http://localhost:59599/users/
```

### Supprimer un utilisateur ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Méthode</th>
      <th>Paramètres</th>
  </tr>
  <tr>
    <td>/users/{username}</td>
    <td>DELETE</td>
    <td></td>
  </tr>
</table>

#### Réponses possibles #### 

- **204 No Content** : l'utilisateur a été supprimé.
- **404 Not Found** : l'utilisateur est introuvable.
- **403 Forbidden** : l'administrateur a essayé de se supprimer lui-même.

#### Exemple curl ####
```bash
curl -X DELETE -u "admin:password" http://localhost:59599/users/foo
```

## Gestion des bases de connaissances ##

### Vérifier l'état ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Méthode</th>
      <th>Paramètres</th>
  </tr>
  <tr>
    <td>/pkb/status</td>
    <td>GET</td>
    <td></td>
  </tr>
</table>

#### Réponses possibles #### 

- **200 OK** : la vérification s'est terminé correctement.
- **500 Internal Server Error** : la vérification a échoué.

En cas de succès, le corps de la réponse contient **uptodate** ou **outdated**.

#### Exemple curl ####
```bash
curl -X GET -u "admin:password" http://localhost:59599/pkb/status
```

### Mettre à jour ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Méthode</th>
      <th>Paramètres</th>
  </tr>
  <tr>
    <td>/pkb/status</td>
    <td>PUT</td>
    <td>**uptodate** dans le corps de la requête</td>
  </tr>
</table>

#### Exemple curl ####
```bash
curl -X PUT -u "admin:password" --data "uptodate" http://localhost:59599/pkb/status
```

#### Réponses possibles #### 

- **200 OK** : les PKBs ont été mises à jour.
- **400 Bad Request** : le corps de la requête n'est pas **uptodate**.
- **500 Internal Server Error** : la mise à jour a échoué.


## Gestion des parseurs ##

### Vérifier l'état ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Méthode</th>
      <th>Paramètres</th>
  </tr>
  <tr>
    <td>/parsers/status</td>
    <td>GET</td>
    <td></td>
  </tr>
</table>

#### Réponses possibles #### 

- **200 OK** : la vérification s'est terminé correctement.
- **500 Internal Server Error** : la vérification a échoué.

En cas de succès, le corps de la réponse contient **uptodate** ou **outdated**.

#### Exemple curl ####
```bash
curl -X GET -u "admin:password" http://localhost:59599/parsers/status
```

### Mettre à jour ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Méthode</th>
      <th>Paramètres</th>
  </tr>
  <tr>
    <td>/parsers/status</td>
    <td>PUT</td>
    <td>**uptodate** dans le corps de la requête</td>
  </tr>
</table>

#### Réponses possibles #### 

- **200 OK** : les parseurs ont été mis à jour.
- **400 Bad Request** : le corps de la requête n'est pas **uptodate**.
- **500 Internal Server Error** : la mise à jour a échoué.

#### Exemple curl ####
```bash
curl -X PUT -u "admin:password" --data "uptodate" http://localhost:59599/parsers/status
```