# Utilisation du makefile #

Le makefile situé dans le répertoire racine d'ezpaarse autorise un certain nombre d'actions, 
dont l'éxécution des tests de comportement, la génération de la documentation 
ou la vérification du respect des règles de codage.

## Installation des modules node ##

```console
make nodejs
```

Télécharge, compile, et configure les modules nécessaires au fonctionnement de l'application.

## Tests mocha ##

```console
make test
```

Lance l'intégralité des tests de non régression. Lancer cette commande est également un moyen simple
de s'assurer qu'ezPAARSE est opérationel.

Les fichiers de test sont situés dans le dossier ``test/`` et le nom des fichiers contenant les tests se terminent par ``-test.js``.

Remarque : n'oubliez pas de relancer l'application si vous avez modifié le code source.

```console
make test-platforms
```
Vérifie le bon fonctionnement des parseurs disponibles

```console
make test-platforms-verbose
```
Propose une vérification avec la liste des parseurs testés

```console
make test-pkb
```
Vérifie la cohérence des fichiers base de connaissance des parseurs

```console
make test-pkb-verbose
```
Vérifie la cohérence des fichiers base de connaissance des parseurs et affiche les erreurs potentielles


## Vérification syntaxique ##

```console
make jshint
```

Vérifie la syntaxe des fichiers javascript à l'aide du programme ``jshint``.

La précision de JSHint peut être modifiée au besoin via un fichier de configuration (``.jshintrc``). Le détail des différentes options peut être trouvé sur [le site de JSHint](http://www.jshint.com/options/).

## Gestion de la documentation ##

```console
make doc
```

Génère une documentation au format html à l'aide des fichiers markdown présents 
dans le dossier ``doc/``. La documentation HTML est placée dans le dossier ``public/doc/``.

```console
make docclean
```

Nettoie la documentation HTML générée en supprimant le dossier ``public/doc/``.

```console
make docopen
```

Ouvre la documentation dans le navigateur Google Chrome. (via le protocole ``file://``)
  
Lorsque l'application est lancée, la documentation est également consultable depuis le serveur Web d'ezPAARSE.
