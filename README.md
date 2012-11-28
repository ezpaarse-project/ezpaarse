ezpaarse
========


Mémo pour initialiser les sous modules (pour avoir le contenu) quand on fait un git clone du dépôt :

```bash
git submodule init
git submodule update
```

TODO : l'automatiser dans dans le "make setup"


Mémo pour mettre à jour le sous module git (platforms-kb) :

```bash
cd platforms-kb
git pull
cd ..
git submodule update
```