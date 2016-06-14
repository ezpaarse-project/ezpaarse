# Updates #

## Core ##

The following commands update and rebuild the core of ezPAARSE. It also uptates the working materials.

```bash
make update         # latest stable version
make update-latest  # latest development version
```

## Working materials ##

The following commands update the materials needed by ezPAARSE.

```bash
make platforms-update   # update parsers, knowledge bases, scrapers
make exclusions-update  # update the lists of hosts identified as robots
make resources-update   # update predefined settings, default proxy formats
```
