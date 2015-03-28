# Documentation administrateur #

Every function listed in this page may be used directly from the administration section in the application.

## Create an administrator ##

If no user has been registered yet, any attempt to connect triggers an admin creation form.

To create an administrator account without the help of the form, please use the following route : 
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

#### Possible feedbacks ####

- **201 Created** : The admin has been created.
- **400 Bad Request** : Missing parameter.
- **409 Conflict** : There's already an admin.
- **500 Internal Server Error** : Creation failed.

#### Exemple curl ####
```bash
curl -X POST --data "username=foo&password=bar" http://localhost:59599/register
```

## Users management ##

### List users ###
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

Outputs a JSON table with the complete list of users.

### Add a user ###
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

#### Possible feedbacks ####

- **201 Created** : User has been created.
- **400 Bad Request** : Missing parameter.
- **409 Conflict** : User name already exists.
- **500 Internal Server Error** : Creation failed.

When the creation succeeds, the feedback contains a complete information about the user in JSON format. 

#### Exemple curl ####
```bash
curl -X POST -u "admin:password" --data "username=foo&password=bar" http://localhost:59599/users/
```

### Delete a user ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Method</th>
      <th>Parameters</th>
  </tr>
  <tr>
    <td>/users/{username}</td>
    <td>DELETE</td>
    <td></td>
  </tr>
</table>

#### Possible feedbacks #### 

- **204 No Content** : User has been deleted.
- **404 Not Found** : User not found.
- **403 Forbidden** : The admin has tried to delete the admin account.

#### Example curl ####
```bash
curl -X DELETE -u "admin:password" http://localhost:59599/users/foo
```

## Knowledge bases management ##

### Check state ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Method</th>
      <th>Parameters</th>
  </tr>
  <tr>
    <td>/pkb/status</td>
    <td>GET</td>
    <td></td>
  </tr>
</table>

#### Possible fedbacks #### 

- **200 OK** : Checking normally completed.
- **500 Internal Server Error** : Chercling failed.

In case of success, the answer contains **uptodate** or **outdated**.


#### Example curl ####
```bash
curl -X GET -u "admin:password" http://localhost:59599/pkb/status
```

### Update ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Method</th>
      <th>Parameters</th>
  </tr>
  <tr>
    <td>/pkb/status</td>
    <td>PUT</td>
    <td>**uptodate** in query string</td>
  </tr>
</table>

#### Example curl ####
```bash
curl -X PUT -u "admin:password" --data "uptodate" http://localhost:59599/pkb/status
```

#### Possible feedbacks #### 

- **200 OK** : PKBs have been updated
- **400 Bad Request** : No **uptodate** in query string.
- **500 Internal Server Error** : Update failed.


## Parsers management ##

### Check state ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Method</th>
      <th>Parameters</th>
  </tr>
  <tr>
    <td>/parsers/status</td>
    <td>GET</td>
    <td></td>
  </tr>
</table>

#### Possible feedbacks #### 

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
