# Website languages

ezPAARSE is available in french and in english.

The [vue-i18n](https://github.com/kazupon/vue-i18n) Vue.js plugin was chosen because it integrates well with [Vue.js](https://github.com/vuejs/vue), used to generate the HTML pages of ezPAARSE.

The language files are located in the ["client/locales" folder](./tree.html) in the form of json files. Those filenames follow the pattern:  *country_code.json* (eg: [fr.json](https://raw.github.com/ezpaarse-project/ezpaarse/master/client/locales/fr.json) or en.json)

The language files contain series of keys. Each key is followed by a translation in the target language.

The context matches the name of the HTML page in which the label appears.
