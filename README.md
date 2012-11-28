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

Conclusion : les submodule sont compliqués à utiliser et posent problème lorsqu'on modifie localement dans un sous module et qu'on désire le pusher, ce n'est pas trivial car un simple git push ne suffit pas.
cf http://git-scm.com/book/fr/Utilitaires-Git-Sous-modules

Solution alternative :
make setup pourrait se charger de faire un git clone du dépot ezpaarse-kb dans un sous répertoire platforms-kb à la racine d'ezpaarse, ainsi on peut push facilement sur ce dépôt sans aucun lien avec le dépôt classique ezpaarse