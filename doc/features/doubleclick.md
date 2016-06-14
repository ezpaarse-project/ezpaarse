### Double-click deduplication ###

The Double-Click headers are optional. They set the deduplication applied to ECs. By default, the deduplication is performed following the COUNTER algorithm (available on [page 4 of Annex D](http://couperin.org/images/stories/documents/Statistiques/COUNTER/V4_FR/appd_fr.pdf))

They are written like follows *(in red: the editable zones)*:

Double-Click-Removal: <span style="color: red">true</span>
Double-Click-HTML: <span style="color: red">10</span>
Double-Click-PDF: <span style="color: red">30</span>
Double-Click-MISC: <span style="color: red">20</span>
Double-Click-Strategy: <span style="color: red">CLI</span>
Double-Click-C-field: <span style="color: red">NomDuChampCookie</span>
Double-Click-L-field: <span style="color: red">NomDuChampLogin</span>
Double-Click-I-field: <span style="color: red">NomDuChampHost</span>


#### Parameters (headers) ####

-   **Double-Click-Removal:** COUNTER deduplication activated *(true by default)*. If this header is used, it means the deduplication is not activated (with the *false* value) and the other Double-Click- headers are useless.
-   **Double-Click-HTML:** sets the minimum delay (in seconds) between two requests considered identical to an [HTML resource](./ec-attributes.html#formats-de-ressources) *(10 by default)*.
-   **Double-Click-PDF:** sets the minimum delay (in seconds) between two requests considered identical to a [PDF resource](./ec-attributes.html#formats-de-ressources) *(30 by default)*.
-   **Double-Click-MISC:** sets the minimum delay (in seconds) between two requests considered identical to a [MISC resource](./ec-attributes.html#formats-de-ressources) *(neither HTML, nor PDF)* *(20 by default)*.
-   **Double-Click-MIXED:** sets the minimum delay (in seconds) between two requests considered identical to a resource, **whatever its format** (ie. the access to a same resource in HTML then in PDF can be considered as a double-click). The delays set for each format are then ignored.
-   **Double-Click-Strategy:** the strategy (in the form of a sequence of ordered letters) used to define the uniqueness of the user accessing a resource. The fields are searched sequentially. If one field is lacking, the following one is used. The letter **C** corresponds to the field containing the **cookie** (or **session ID**). The letter **L** corresponds to the **login** of the user. The letter **I** corresponds to the **IP address** contained in the host field. *(CLI by default)*
-   **Double-Click-C-field:** field name that will be looked for in the logs. This field coming from the [custom log format parameters](./formats.html#paramtres-personnaliss) will be used to trace the cookie identifying the user (or its session ID). By default, it is not possible for ezPAARSE to know the field if it's not specified in the custom log format parameter. *(ignored by default)*
-   **Double-Click-L-field:** field name that will be looked for in the logs to identify the user login *(corresponds to %u in the [log format syntax](./formats.html))*. *(%u by default)*.
-   **Double-Click-I-field:** field name that will be looked for in the logs to identify the user host *(corresponds to %h in the [log format syntax](./formats.html))*. *(%h by default)*.


Usage:
```shell
curl -v -X POST --proxy "" --no-buffer\
  -F "file=@test/dataset/sd.duplicates.log"\
  -H 'Log-Format-ezproxy: %h %u %{session}<[a-zA-Z0-9\\-]+> %t "%r" %s'\
  -H 'Double-Click-HTML: 15'\
  -H 'Double-Click-PDF: 30'\
  -H 'Double-Click-MISC: 40'\
     http://127.0.0.1:59599
```
