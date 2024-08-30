const { Nuxt, Builder } = require('nuxt');

const nuxtConfig = require('./nuxt.config');

module.exports = function setupClient (options) {
  // Import and Set Nuxt.js options
  nuxtConfig.dev = options.isDev;
  nuxtConfig.buildDir = undefined;

  // Init Nuxt.js
  const nuxt = new Nuxt(nuxtConfig);

  // Build only in dev mode
  if (nuxtConfig.dev) {
    new Builder(nuxt).build()
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        process.exit(1);
      });
  }

  return nuxt.render;
};
