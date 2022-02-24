# Documentation

The documentation you are reading just now is powered by [Vuepress](https://vuepress.vuejs.org).

## Development

You can run a live server with the following command :

```bash
npm run docs:dev
```

Then visit [http://localhost:8080/](http://localhost:8080/)

## Deployment

To generate static assets, run :

```bash
npm run docs:build
```

The documentation is generated in `doc/.vuepress/dist/` and can be deployed to any static file server. However, please note that the base URL is `/ezpaarse/`, so you won't be able to serve it from root.

Any change to the `doc` directory on the `master` branch will automatically trigger a build and a deployment to `GitHub Pages`. This deployment workflow is achieved via `Github Actions`.

## Configuration

The Vuepress configuration is located in `.vuepress/config.js`. Head to this file if you need to update the `sidebar`, `menu`, `theme`, or any other option.

[More details](https://vuepress.vuejs.org/config/)

## Asssets handling

Assets are stored in the `.vuepress/public` directory. You can reference them using relative URLs.

```markdown
<img :src="$withBase('/images/image.png')" alt="An image"/>
```

[More details](https://vuepress.vuejs.org/guide/assets.html)

## Frontmatter

Markdown files can contain a YAML frontmatter block containing page-specific variables. You can set predefined variables to alter some page components (sidebar, title, previous and next buttons...), or create your own. Those variables are available to use through the `$frontmatter` variable.

```markdown
---
title: Blogging with VuePress
lang: en-US
---

# {{ $frontmatter.title }}

My blog post is written in {{ $frontmatter.language }}.
```

[More details](https://vuepress.vuejs.org/guide/frontmatter.html)

## Using Vue in Markdown

Any `*.vue` file found in `.vuepress/components` is automatically registered as a global component and can be used in Markdown files. Please note that components' name must be in `PascalCase`.

You can also define a page-specific Vue component by writting a `<script>` or `<style>` tag in the Markdown file.

[More details](https://vuepress.vuejs.org/guide/using-vue.html)