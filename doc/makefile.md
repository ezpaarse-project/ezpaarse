# Utilisation du makefile #

Le makefile situé dans le répertoire ezpaarse autorise un certain nombre d'actions, dont l'éxécution des tests de comportement, la génération de la documentation ou la vérification syntaxique des fichiers javascripts.

## Installation des modules node ##
- <code>make setup</code>
  > Installe les modules nécessaires au fonctionnement de l'application.

Les modules sont renseignés dans le fichier ``ezpaarse/package.json``

## Tests mocha ##

- <code>make test</code>
  > Lance l'intégralité des tests.

Les fichiers de test sont situés dans le dossier ``ezpaarse/test``. Leur nom se termine par "``-test.js``".

NB: n'oubliez pas de relancer l'application si des changements ont été opérés.

## Vérification syntaxique ##

- <code>make jshint</code>
  > Vérifie la syntaxe des fichiers javascript à l'aide de ``jshint``.

La précision de JSHint peut être modifiée au besoin via un fichier de configuration (*config-jshint.json*) situé dans le même répertoire que le makefile. Le détail des différentes options peut être trouvé sur [le site de JSHint](http://www.jshint.com/options/).

## Gestion de la documentation ##
- <code>make doc</code>
  > Génère une documentation au format html à l'aide des fichiers markdown présents dans le dossier ``ezpaarse/markdown``. Cette dernière est placée dans le dossier ``ezpaarse/public/doc``.

- <code>make doctest</code>
  > Liste les fichiers présents dans le dossier ``ezpaarse/markdown``

- <code>make docclean</code>
  > Nettoie la documentation en supprimant le dossier ``ezpaarse/public/doc``.

- <code>make docopen</code>
  > Ouvre la documentation dans le navigateur Google Chrome. (via le protocole ``file://``)
  
  > Lorsque l'application est lancée, la documentation est également consultable à l'adresse /doc.