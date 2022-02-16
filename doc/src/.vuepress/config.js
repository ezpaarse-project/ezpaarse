const fs = require('fs');
const path = require('path');

const { description } = require('../../package')

/**
 *
 * @param {String} dir the directory to read
 * @param {String} root the root directory used to resolved relative path
 */
 function findMarkdownFiles(dir, root) {
  root = root || dir;

  const exclusions = [
    'node_modules',
    '.github',
    '.git',
    '.eslintrc',
    '.gitignore',
    '.travis.yml',
    'mock.js',
    'package.json',
    'utils.js',
  ];

  const files = fs.readdirSync(dir)
    .map(filename => ({
      name: filename,
      path: path.resolve(dir, filename),
      stat: fs.statSync(path.resolve(dir, filename))
    }))
    .filter(file => exclusions.includes(file.name) === false);

  return files.reduce((acc, file) => {
    if (file.stat.isDirectory()) {
      return acc.concat(findMarkdownFiles(file.path, root));
    }

    if (dir === root || !file.stat.isFile() || !file.name.endsWith('.md')) {
      return acc;
    }

    const relativePath = path.relative(root, file.path).replace(/\.md$/, '.html');

    acc.push({
      path: path.normalize(`/middlewares/${relativePath}`),
      filePath: file.path,
      showInSidebar: file.name === 'README.md',
      frontmatter: {
        editLink: false
      }
    })
    return acc.concat()
  }, []);
}

const mwRootDir = path.resolve(__dirname, '../../../middlewares');
const mwPages = findMarkdownFiles(mwRootDir);

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'ezPAARSE',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  additionalPages: mwPages,

  /**
   * ref：https://v1.vuepress.vuejs.org/config/#base
   */
  base: '/ezpaarse/',

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'ezpaarse-project/ezpaarse',
    editLinks: false,
    docsDir: 'doc',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: true,
    nav: [
      {
        text: 'Homepage',
        link: 'https://www.ezpaarse.org'
      },
      {
        text: 'Release Notes',
        link: 'https://github.com/ezpaarse-project/ezpaarse/releases'
      }
    ],
    sidebar: [
      '/',
      {
        title: 'Getting started',
        collapsable: false,
        children: [
          '/start/requirements.md',
          '/start/install.md',
          '/start/usage.md',
        ]
      },
      {
        title: 'Essential things to know',
        collapsable: false,
        children: [
          '/essential/ec-attributes.md',
          '/essential/formats.md',
          '/essential/knowledge-base.md',
          '/essential/report.md',
          '/essential/updates.md',
        ]
      },
      {
        title: 'Features',
        collapsable: false,
        children: [
          'features/outputfields.md',
          'features/metadata-enrichment.md',
          'features/exclusions.md',
          'features/counter.md',
          'features/alerts.md',
          'features/geolocalisation.md',
          'features/doubleclick.md',
          'features/qualification.md',
        ]
      },
      {
        title: 'Configuration',
        collapsable: false,
        children: [
          '/configuration/config.md',
          '/configuration/parametres.md',
        ]
      },
      {
        title: 'Developer documentation',
        collapsable: false,
        children: [
          '/development/routes.md',
          '/development/admin.md',
          '/development/makefile.md',
          '/development/core.md',
          '/development/platforms.md',
          '/development/middlewares.md',
          '/development/tools.md',
          '/development/doc.md',
          '/development/tree.md',
          '/development/multilinguisme.md'
        ]
      },
      {
        title: 'Troubleshooting',
        collapsable: false,
        children: [
          '/troubleshooting/core-dumped.md'
        ]
      },
      {
        title: 'Middlewares',
        collapsable: false,
        children: mwPages.filter(page => page.showInSidebar).map(page => page.path)
      },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    require.resolve('./components/SearchBox'),
  ]
}
