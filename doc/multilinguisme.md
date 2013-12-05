# Gestion du multilinguisme

ezPAARSE est diponible en français et en anglais.

Les langues sont gérées grâce au module node [i18n-2](https://github.com/jeresig/i18n-node-2). 
Ce module est intégrable facilement à [Express.js](https://github.com/visionmedia/express) utilisé pour générer les pages HTML d'ezPAARSE.

Les fichiers de langues sont déposés dans le [repertoire "locales"](./tree.html) sous la forme de fichiers json. Le nom des fichiers suit la syntaxe : *code_pays.json* ( ex : [fr.json](https://raw.github.com/ezpaarse-project/ezpaarse/master/locales/fr.json) ou en.json)

Le contenu des fichiers de langues est constitué d'une clé et de sa traduction dans la langue concernée.

La clé est consituée d'un contexte et du libellé dans la langue française : *contexte+libellé_dans_la_langue_française*.

Le contexte correspond au nom de la page dans laquelle se trouve le libellé.

#### Version windows #### 

Pour la version windows, l'installeur comprend un certain nombre de pages traduites.
Les traductions sont gérées dans des fichiers séparés.

Les fichiers de langues sont déposés dans le [repertoire "misc/windows"](./tree.html) sous la forme de fichiers nsh. Le nom des fichiers suit la syntaxe : *Langue.nsh* ( ex : [French.nsh](https://raw.github.com/ezpaarse-project/ezpaarse/master/misc/windows/French.nsh) ou English.nsh)

Le contenu des fichiers de langues est constitué d'une macro, une clé et de sa traduction dans la langue concernée.

La clé est consituée d'un contexte et du libellé dans la langue française : *contexte+libellé_dans_la_langue_française*.

Le contexte correspond au nom de la page dans laquelle se trouve le libellé.

