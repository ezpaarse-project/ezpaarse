# Field splitter (to be deprecated) #

This section will soon be removed.
To achieve the same results, you can now use the [cut middleware](../development/middlewares.html#cut). Read the [documentation](configuration/parametres.html#cut) on Parameters to learn how to use and configure it.


The `user-fields` headers can extract user data from a specified log field and explode it in other fields, thanks to regular expressions.

They can be specified with <span style="color: blue">numbered header blocks</span> *(in blue the editable zones)* like follows :

  * User-field<span style="color: blue">0</span>-src: <span style="color: red">SourceFieldName</span></br>
  * User-field<span style="color: blue">0</span>-sep: <span style="color: green">Separator</span></br>
  * User-field<span style="color: blue">0</span>-dest-<span style="color: red">TargetFieldName1</span>: <span style="color: magenta">RegExp1</span></br>
  * User-field<span style="color: blue">0</span>-dest-<span style="color: red">TargetFieldName2</span>: <span style="color: magenta">RegExp2</span></br>
  * User-field<span style="color: blue">0</span>-residual: <span style="color: red">ResidualFieldName</span></br>

## Parameters (headers) ##

-   **User-field<span style="color: blue">0</span>-src:** name of the field that will be used to extract user information *(the field must be present in the logs)* .
-   **User-field<span style="color: blue">0</span>-sep:** separator character found in the user information source field *(we will use the the **space** word if a space is used as separator)*

-   **User-field<span style="color: blue">0</span>-dest-<span style="color: red">TargetFieldName1</span>:** <span>target field definition containing the name of the field after the **User-field<span style="color: blue">0</span>-dest-** string and the regexp corresponding to the data.</br> There can be more than one field name *(each with its corresponding header)*. The regular expressions are evaluated in the order of declaration. The separator is used in the output if the field contains many values.</br> The strings that don't match are sent to the **User-field<span style="color: blue">0</span>-residual** if it's specified.</span>

-   **User-field<span style="color: blue">0</span>-residual: ** Optional. Target field name used to receive the user information that was not recognized by the regexps used for the previous target fields.

Example:
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
