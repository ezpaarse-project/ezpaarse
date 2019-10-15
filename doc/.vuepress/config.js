module.exports = {
  title: 'ezPAARSE',
  description: 'Usage analyzer for your e-resources',
  serviceWorker: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
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
          '/development/middlewares.md',
          '/development/tools.md',
          '/development/doc.md',
          '/development/tree.md',
          '/development/multilinguisme.md'
        ]
      },
    ]
  }
}
