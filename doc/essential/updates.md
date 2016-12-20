# Updates #

## Core ##

The following commands update and rebuild the core of ezPAARSE. They also update the working materials (parsers, knowledge bases, scrapers, robots lists and predefined settings).

```bash
make update         # latest stable version
make update-latest  # latest development version
```

### Video Demonstration ###
This [screencast](https://www.youtube.com/watch?v=tNwUw_9IJCw) demonstrates the update command.
It is also possible to update ezPAARSE directly from the GUI, see this [screencast](https://www.youtube.com/watch?v=2tGUyAiw9no) to learn more.

## Working materials ##

The following commands update the materials needed by ezPAARSE. There is one distinct command per material type, see comments.

```bash
make platforms-update   # update parsers, knowledge bases, scrapers
make exclusions-update  # update the lists of hosts identified as robots
make resources-update   # update predefined settings, default proxy formats
```
