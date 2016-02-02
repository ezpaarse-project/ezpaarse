# Administrator's documentation #

Every function listed in this page may be used directly from the administration section in the application.

## Create an administrator ##

If no user has been registered yet, any attempt to connect triggers an admin creation form.

To create an administrator account without the help of the form, please use the following route : 
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Method</th>
      <th>Parameters</th>
  </tr>
  <tr>
    <td>/register</td>
    <td>POST</td>
    <td>username, password</td>
  </tr>
</table>

#### Possible outputs ####

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

#### Possible outputs ####

- **201 Created** : User has been created.
- **400 Bad Request** : Missing parameter.
- **409 Conflict** : User name already exists.
- **500 Internal Server Error** : Creation failed.

When the creation succeeds, the output contains a complete information about the user in JSON format. 

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

#### Possible output #### 

- **204 No Content** : User has been deleted.
- **404 Not Found** : User not found.
- **403 Forbidden** : The admin has tried to delete the admin account.

#### Example curl ####
```bash
curl -X DELETE -u "admin:password" http://localhost:59599/users/foo
```

## Platforms Management ##
A platform is composed of a parser, one or more knowledge bases and one or more scrapers. 
The commands listed below act on the platform level, you don't have to worry about separately updating its elements.

### Check state ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Method</th>
      <th>Parameters</th>
  </tr>
  <tr>
    <td>/platforms/status</td>
    <td>GET</td>
    <td></td>
  </tr>
</table>

#### Possible feedbacks #### 

- **200 OK** : Checking normally completed.
- **500 Internal Server Error** : Checking failed.

In case of success, the output contains **uptodate** or **outdated**.


#### Example curl ####
```bash
curl -X GET -u "admin:password" http://localhost:59599/platforms/status
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
curl -X PUT -u "admin:password" --data "uptodate" http://localhost:59599/platforms/status
```

#### Possible outputs #### 

- **200 OK** : Platforms have been updated
- **400 Bad Request** : No **uptodate** in query string.
- **500 Internal Server Error** : Update failed.
