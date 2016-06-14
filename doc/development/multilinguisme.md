# Website languages #

ezPAARSE is available in french and in english.

The [i18n-2](https://github.com/jeresig/i18n-node-2) NodeJS module was chosen because it integrates well with [Express.js](https://github.com/visionmedia/express) that is used to generate the HTML pages of ezPAARSE.

The language files are located in the ["locales" folder](./tree.html) in the form od json files. Those filenames follow the pattern :  *country_code.json* (eg: [fr.json](https://raw.github.com/ezpaarse-project/ezpaarse/master/locales/fr.json) or en.json)

The language files contain series of keys. Each key is followed by a translation in the target language.

The key is composed of a context and a french label : *context+french_label*.

The context matches the name of the HTML page in which the label appears.

#### Windows Version ####

For the Windows version, the installer contains a number of translated pages.
The translations are in distincts files.

The languages files are located in the ["misc/windows" folder](./tree.html) and they are nsh formatted. The filenames follow the pattern: *Language.nsh* (eg: [French.nsh](https://raw.github.com/ezpaarse-project/ezpaarse/master/misc/windows/French.nsh) or English.nsh)

Thoses file contain a macro, a series of keys and their translation to the target language.

The key is composed of a context and a french label : *context+french_label*.

The context matches the name of the HTML page in which the label appears.
