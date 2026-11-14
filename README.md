# tools.ohrt.dev

<p align="center">
  <a href="https://tools.ohrt.dev"><img src=".github/screenshots.webp" width="571" alt="tools.ohrt.dev on a desktop browser and on a phone"></a>
</p>

<p align="center">
  <a href="https://github.com/Lavanic/tools.ohrt.dev/actions/workflows/deploy.yml"><img src="https://github.com/Lavanic/tools.ohrt.dev/actions/workflows/deploy.yml/badge.svg" alt="deploy"></a>
  <a href="https://tools.ohrt.dev"><img src="https://img.shields.io/website?url=https%3A%2F%2Ftools.ohrt.dev&label=tools.ohrt.dev" alt="site status"></a>
  <a href="https://github.com/Lavanic/tools.ohrt.dev/commits/main"><img src="https://img.shields.io/github/last-commit/Lavanic/tools.ohrt.dev" alt="last commit"></a>
  <a href="https://astro.build"><img src="https://img.shields.io/github/package-json/dependency-version/Lavanic/tools.ohrt.dev/astro?logo=astro&logoColor=white" alt="astro version"></a>
  <a href="https://pages.github.com"><img src="https://img.shields.io/badge/hosted%20on-GitHub%20Pages-222?logo=github" alt="hosted on GitHub Pages"></a>
</p>

My projects page, laid out like the index of a 2010 forum. Written in [Astro](https://astro.build), every page is a plain static file. Each project is one Markdown file in [`src/content/projects/`](src/content/projects), and its stars, commit count and latest commit are read from GitHub when the site is built.

## Development

```sh
npm install
npm run dev
```

Runs at `localhost:4321`. `npm run check` type-checks and `npm run format` runs Prettier.

## Deployment

Automatically deployed to GitHub Pages on every push to `main`, plus a rebuild every six hours so the numbers stay fresh.
