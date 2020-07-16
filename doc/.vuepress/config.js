const fs = require('fs');
const path = require('path');

/**
 *
 * @param {String} dir the directory to read
 * @param {String} root the root directory used to resolved relative path
 */
function findMarkdownFiles(dir, root) {
  root = root || dir;

  const files = fs.readdirSync(dir)
    .map(filename => ({
      name: filename,
      path: path.resolve(dir, filename),
      stat: fs.statSync(path.resolve(dir, filename))
    }))
    .filter(file => file.name !== 'node_modules');

  return files.reduce((acc, file) => {
    if (file.stat.isDirectory()) {
      return acc.concat(findMarkdownFiles(file.path, root));
    }

    if (dir === root || !file.stat.isFile() || !file.name.endsWith('.md')) {
      return acc;
    }

    let relativePath = path.relative(root, file.path).replace(/\.md$/, '.html');

    if (relativePath.indexOf('README')) {
      relativePath = relativePath.replace('README', 'doc')
    }

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

const mwRootDir = path.resolve(__dirname, '../../middlewares');
const mwPages = findMarkdownFiles(mwRootDir);

module.exports = {
  title: 'ezPAARSE',
  description: 'Usage analyzer for your e-resources',
  serviceWorker: true,
  base: '/ezpaarse/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  plugins: [
    '@vuepress/plugin-back-to-top',
    [
      "vuepress-plugin-meilisearch",
      {
        hostUrl: 'http://localhost:7700',
        apiKey: 'doc.ezpaarse.org',
        indexUid: 'ezpaarse',
        placeholder: 'Search',
        maxSuggestions: 10
      }
    ]
  ],
  additionalPages: mwPages,
  themeConfig: {
    repo: 'ezpaarse-project/ezpaarse',
    docsDir: 'doc',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    sidebarDepth: 0,
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
          '/development/tools.md',
          '/development/doc.md',
          '/development/tree.md',
          '/development/multilinguisme.md'
        ]
      },
      {
        title: 'Middlewares',
        collapsable: false,
        children: [
          '/middlewares/infos.md',
          '/middlewares/usage.md',
          '/middlewares/create.md',
          {
            title: 'Available middlewares',
            collapsable: false,
            children: mwPages.filter(page => page.showInSidebar).map(page => page.path)
          }
        ]
      }
    ]
  }
}
