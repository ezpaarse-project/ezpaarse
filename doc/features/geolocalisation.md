### Geolocation ###

The geolocation is based on the IP address found in the host field from the log files. The `Geoip` header allows to choose which data is to be added to the results, or to deactivate the geolocation altogether.

The library used for this is [geoip-lite](https://github.com/bluesmoon/node-geoip).

**Geolocation Caveats** : IP address geolocation is a method that links the IP address of a terminal connected to the internet with a geographical position. The level of precision is not always the same: city in the best of cases, country otherwise.

The [geolocation data is informative](http://en.wikipedia.org/wiki/Geolocation_software) and depends on the country as well as the internet access provider.

#### Parameters (headers) ####

**Geoip:** geolocation data that can be added to the results. 

By default: `geoip-longitude, geoip-latitude, geoip-country`

  * `all` can be used to include all possible fields
  * `none` to deactivate the geolocation. 

The available fields are: 
  * `geoip-host`
  * `geoip-addr`
  * `geoip-family`
  * `geoip-country`
  * `geoip-region`
  * `geoip-city`
  * `geoip-latitude`
  * `geoip-longitude`

Usage example:
```shell
curl -v -X POST --proxy "" --no-buffer \
  -F "file=@test/dataset/geolocalize.log" \
  -H 'Geoip: all' \
 	http://127.0.0.1:59599
```
Advanced usage example:

This example uses the ''csv2geojson'' and ''geojsonio-cli'' librairies.

```shell
npm install csv2geojson geojsonio-cli
```
It is then possible to directly visualize the results on a map.

```shell
curl -X POST http://127.0.0.1:59599 \
  --proxy "" \
  --no-buffer \
  --data-binary @./test/dataset/edp.2013-01-23.log  \
  -H 'Geoip: geoip-latitude, geoip-longitude' \
  -H 'Output-Fields: -doi,-identd,-url,-status,-size,+datetime' \
  | csv2geojson --lat "geoip-latitude" --lon "geoip-longitude" --delimiter ";" 2> /dev/null \
  | geojsonio
```

That opens a web browser with the following graphical representation : 

<img src="../_static/images/ezPAARSE-SR16-02.jpg" alt="EDP Sciences Anonyme" style="width: 600px"/>

##### Video Demonstration #####

This [screencast](https://www.youtube.com/watch?v=SXSIb7oczbI) demonstrates the previous usage (ie geolocation information visualized on a map)
