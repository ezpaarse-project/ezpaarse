const { path } = require('@vuepress/shared-utils');

module.exports = (options, ctx) => ({
  extendPageData ($page) {
    const { _content } = $page;
    $page.content = _content;
  },
  alias: {
    '@SearchBox': path.resolve(__dirname, 'SearchBox.vue')
  }
});
