# Administration API #

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
    <td>userid (valid mail address), password, confirm (password confirmation)</td>
  </tr>
</table>

#### Possible outputs ####

- **201 Created** : The admin has been created.
- **400 Bad Request** : Missing parameter.
- **409 Conflict** : There's already an admin.
- **500 Internal Server Error** : Creation failed.

#### Exemple curl ####
```bash
curl -X POST --data "userid=foo@foo.fr&password=bar&confirm=bar" http://localhost:59599/register
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

#### Exemple curl ####
```bash
curl -X GET --proxy "" -u "admin:password" http://localhost:59599/users
```

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
    <td>userid (valid mail address), password, group (defaults to 'user', set to 'admin' to create an administrator)</td>
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
curl -X POST --proxy "" -u "admin:password" --data "userid=foo@foo.net&password=bar&group=user" http://localhost:59599/users/
```

### Update a user ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Méthode</th>
      <th>Paramètres</th>
  </tr>
  <tr>
    <td>/users/{username}</td>
    <td>POST</td>
    <td>username (valid mail address), group</td>
  </tr>
</table>

#### Possible outputs ####

- **200 OK** : User updated.
- **400 Bad Request** : Missing parameter.
- **404 Not Found** : User not found.
- **500 Internal Server Error** : Update failed.

When the update succeeds, the output contains the updated user in JSON format.

#### Exemple curl ####
```bash
curl -X POST --proxy "" -u "admin:password" --data "group=admin" http://localhost:59599/users/foo@foo.net
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
curl -X DELETE -u "admin:password" http://localhost:59599/users/foo@foo.net
```

### Reset a password ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Method</th>
      <th>Parameters</th>
  </tr>
  <tr>
    <td>/passwords/{username}</td>
    <td>POST</td>
    <td></td>
  </tr>
</table>

#### Possible output ####

- **200 OK** : The password has been reset.
- **404 Not Found** : User not found.

#### Example curl ####
```bash
curl -X DELETE -u "admin:password" http://localhost:59599/users/foo@foo.net
```

## Repositories update ##
The URLs below allow for updating the different parts of ezPAARSE.

### Check the state of a repository ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Method</th>
      <th>What's updated</th>
  </tr>
  <tr>
    <td>/app/status</td>
    <td>GET</td>
    <td>Core software</td>
  </tr>
  <tr>
    <td>/platforms/status</td>
    <td>GET</td>
    <td>Platforms (Parsers, PKBs, scrapers)</td>
  </tr>
  <tr>
    <td>/middlewares/status</td>
    <td>GET</td>
    <td>Middlewares</td>
  </tr>
  <tr>
    <td>/resources/status</td>
    <td>GET</td>
    <td>Resources (predefined settings, default formats...)</td>
  </tr>
</table>

#### Possible feedbacks ####

- **200 OK** : Checking normally completed.
- **500 Internal Server Error** : Checking failed.

#### Response body ####
The server reply with a JSON response containing various things about the git status of the given repository.

Example:
```javascript
{
  "current": "2.9.4-4-g9089308", # Current commit description
  "head": "2.9.4-4-g9089308",    # HEAD commit description
  "tag": "2.9.4",                # Current git tag (latest tag before the current commit)
  "from-head": "uptodate",       # State of HEAD compared to origin (can be 'uptodate' or 'outdated')
  "from-tag": "upward",          # State of current tag compared to origin (can be 'uptodate', 'outdated' or 'upward')
  "local-commits": false,        # Is there any unpushed local commit ?
  "local-changes": false         # Is there any uncommited local changes ?
}
```

#### Example curl ####
```bash
curl -X GET -u "admin:password" http://localhost:59599/platforms/status
```

### Update a repository ###
<table>
  <tr>
      <th style="text-align:left;width:140px;">Path</th>
      <th>Method</th>
      <th>Parameters</th>
  </tr>
  <tr>
    <td>/app/status</td>
    <td>PUT</td>
    <td>Core software</td>
  </tr>
  <tr>
    <td>/platforms/status</td>
    <td>PUT</td>
    <td>Platforms (Parsers, PKBs, scrapers)</td>
  </tr>
  <tr>
    <td>/middlewares/status</td>
    <td>PUT</td>
    <td>Middlewares</td>
  </tr>
  <tr>
    <td>/resources/status</td>
    <td>PUT</td>
    <td>Resources (predefined settings, default formats...)</td>
  </tr>
</table>

#### Example curl ####
```bash
curl -X PUT -u "admin:password" http://localhost:59599/platforms/status
```

#### Possible outputs ####

- **200 OK** : Platforms have been updated
- **500 Internal Server Error** : Update failed.
