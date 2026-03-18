# AGENTS.md

This document provides a detailed guide for agents interacting with this codebase, which is built on the Astro framework. Follow these standards to ensure consistency and maintainability. For further details on Astro, refer to the [official documentation](https://docs.astro.build/).

---

## 1. Build, Lint, and Test Commands

### Build Commands

- **Development Server**:

  ```bash
  pnpm dev
  ```

  Use this command to spin up a development server. It includes live-reloading.

- **Build for Production**:

  ```bash
  pnpm build
  ```

  This compiles the codebase into optimized production-ready files under the `dist/` directory.

- **Preview Production Build**:
  ```bash
  pnpm preview
  ```
  This command serves the production build locally for testing.

### Linting and Formatting

- **Run Prettier**:
  ```bash
  pnpm format
  ```
  This formats all code under the `src` folder according to the Prettier settings.

### Testing Commands

This project uses **Vitest** for unit/logic testing and **Playwright** for E2E/smoke testing.

- **Run all tests**:
  ```bash
  pnpm test
  ```

- **Run unit tests only**:
  ```bash
  pnpm test:unit
  ```

- **Run E2E tests only**:
  ```bash
  pnpm test:e2e
  ```

Vitest tests should be located in `__tests__` directories relative to the code they test.
Playwright tests are located in the `e2e/` directory.

---

## 2. Code Style Guidelines

### General Formatting Rules

This codebase uses **Prettier** for consistent formatting. Key settings include:

- **Tab Width**: 2 spaces
- **Line Width**: 110 characters max
- **Semicolons**: Disabled
- **Quotes**: Single quotes preferred (`'example'`, not `"example"`)
- **Plugins**: Uses `prettier-plugin-astro` for `.astro` files.

Run the formatter before committing code:

```bash
pnpm format
```

### Import Conventions

1. Place **external imports** above internal ones:

```typescript
import { useState } from 'react'
import utils from '@/lib/utils'
```

2. **Do not use wildcard imports** (e.g., `import * as fs`).
3. Maintain alphabetical order where possible.

### Code Organization

1. Use TypeScript for all new files (`.ts`, `.tsx`).
2. Follow the directory structure:
   - Components in `src/components`
   - Pages in `src/pages`
   - Utilities in `src/lib`

### Naming Conventions

#### Files/Folders

- Use `kebab-case` for filenames (`example-file.ts`).
- Directories reflect their contents (`components`, `utils`).

#### Variables and Functions

Use `camelCase` for variables and methods:

```javascript
const fetchData = () => {}
```

#### Types

- Interface names should use `PascalCase`:

```typescript
interface User {
  id: string
  name: string
}
```

### Error Handling

1. Always check for edge cases in asynchronous operations:

```typescript
try {
  const response = await fetch('/api/data')
  const data = response.json()
} catch (error) {
  console.error('Error fetching data:', error)
}
```

2. Avoid silent failures. Log or handle errors appropriately.

---

## 3. Guidelines for Agents

Agents (like Copilot) must adhere to these coding standards to ensure consistency.

1. **Pre-Execution**
   - Ensure Prettier is configured. Adjust any settings, such as overriding `tabWidth` or `printWidth`, to align with this repository.
   - Validate TypeScript definitions before proceeding.

2. **During Execution**
   - When generating test files, suggest using Jest or Vitest (if no tests are found).
   - For updates, refactor to use modular imports and maintain concise separation of logic.
   - **Follow SEO and i18n guidelines** defined in section 4 when creating or modifying pages.

3. **Post-Execution**
   - Always include a test or linting step before suggesting commits.
   - Suggest meaningful commit messages, such as:
     ```bash
     chore: format code with Prettier
     ```

---

## 4. SEO and Page Creation Guidelines

Agents must ensure all new pages are optimized for search engines and follow the project's internationalization (i18n) structure.

### Multi-language Pages
- All new pages must be placed in `src/pages/[lang]/`.
- Use `getStaticPaths()` to support all configured locales (`es`, `en`, `ca`).
- Example structure:
  ```typescript
  export function getStaticPaths() {
    return [{ params: { lang: 'es' } }, { params: { lang: 'en' } }, { params: { lang: 'ca' } }]
  }
  ```

### Layout and Metadata
- Every page **must** use the `Layout` component from `src/layouts/Layout.astro`.
- Pass a unique and descriptive `title` and `description` (150-160 characters) to the `Layout` component.
- The `Layout` component automatically handles canonical URLs, social media tags (OG/Twitter), and `hreflang` tags.

### Semantic HTML and Accessibility
- **H1 Tags**: Use exactly one `<h1>` per page.
- **Headings**: Maintain a logical hierarchy (`h2`, `h3`, etc.).
- **Images**: All `<img>` tags must include a descriptive `alt` attribute.
- **Links**: Use descriptive text for links. Avoid generic phrases like "click here".

### Analytics and Monitoring
- Use the `PUBLIC_GA_ID` environment variable for Google Analytics.
- Do not hardcode tracking IDs.

---

Adhering to these standards will ensure contributions are cohesive, minimizing review cycles and enhancing overall productivity.
