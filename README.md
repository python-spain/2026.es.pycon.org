# 2026.es.pycon.org

Website for the most important Python [event](https://2026.es.pycon.org/) in Spain in the year 2026.

## Requirements

- Node.js v22.0.0 (see `.nvmrc`)
- pnpm

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Preview

```bash
pnpm preview
```

## SEO & New Pages

To maintain good SEO and consistency as the project grows, follow these guidelines when adding new pages:

### 1. Creating Multi-language Pages

New pages should be created in `src/pages/[lang]/` using `getStaticPaths`.

- Ensure you use the `<Layout>` component.
- Always provide a unique `title` and `description` to the Layout.

Example:

```astro
---
import Layout from '../../layouts/Layout.astro'
// ...
---

<Layout title="Your Page Title" description="Concise description (150-160 chars)">
  <!-- Content -->
</Layout>
```

### 2. SEO Best Practices

- **Semantic HTML**: Use only one `<h1>` per page. Follow a logical heading hierarchy (`<h2>`, `<h3>`).
- **Image Alt Tags**: All `<img>` tags MUST have descriptive `alt` attributes.
- **Internal Linking**: Use descriptive link text (avoid "click here").

### 3. Analytics

- Set the `PUBLIC_GA_ID` environment variable in your `.env` file to enable Google Analytics.
  ```text
  PUBLIC_GA_ID=G-XXXXXXXXXX
  ```

### 4. Structured Data

- The main event structured data (JSON-LD) is globally included in `Layout.astro`.
- For specific pages (like "Sponsors" or "Talks"), consider adding additional [schema.org](https://schema.org) types locally if necessary.

### 5. Sitemap

- The sitemap is automatically generated on every build. No manual action is required.

## Development & Deployment

### Branching Strategy

The main branch is `main`. All development work should be done in feature branches created from `main`. All changes must go through a pull request and require approval from the team before merging.

### Deployment Process

When it's time to deploy a new version, follow these steps:

1. Create a new branch from `main` using the format: `chore/<VERSION>`. For example: `chore/v1.0.0`
2. Update the version in `package.json`
3. Create a commit with the message: `chore: version 1.0.0`
4. Create a pull request. Once merged to `main`, pull the latest code.
5. Create a new tag: `git tag v1.0.0`
6. Push the tag: `git push origin v1.0.0`
7. Go to GitHub, navigate to the Releases section, and create a new release. Select the tag and click "Generate release notes", then publish.
8. Finally, go to GitHub Actions, select "Deploy to GitHub Pages", choose the tag you want to deploy, and run the workflow.
