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

## Releases & Deploys

### Creating a Release

The release workflow automatically detects version changes in `package.json`. When you push to `main` with an updated version, it automatically:

1. Creates a git tag
2. Generates a changelog from commit history
3. Creates a GitHub Release

### Deploying

Deployment is manual and triggered from GitHub Actions:

1. Go to **Actions → Deploy to GitHub Pages**
2. Select the tag you want to deploy (e.g., `v1.0.0`)
3. Click **Run workflow**

The site is deployed to GitHub Pages at `https://2026.es.pycon.org/`.

