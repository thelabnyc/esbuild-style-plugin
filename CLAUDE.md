# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Build**: `npm run build` (generates CSS type definitions then compiles TypeScript)
- **Test**: `npm test` (runs Jest tests)
- **Single test**: `npm test -- test/css_modules` (run a specific test directory)
- **Type check**: `npm run check:types`
- **Watch mode test**: `npm run test-watch` (starts esbuild in watch mode for manual testing)

## Architecture

This is an esbuild plugin that handles CSS/Sass preprocessing with CSS Modules support via PostCSS.

### Source Structure (`src/`)

- `index.ts` - Main plugin entry point. Defines the esbuild plugin with resolve/load hooks:
    - `onStyleResolve` - Intercepts style file imports, routes them to the `stylePlugin` namespace
    - `onStyleLoad` - Renders styles (Sass/CSS), processes through PostCSS, handles CSS Modules
    - `onTempStyleResolve`/`onTempLoad` - Handles the CSS content injection via hash-based URLs
- `utils.ts` - Style rendering utilities (Sass compilation, PostCSS watch file extraction)
- `postcssModulesOptions.ts` - TypeScript types for postcss-modules configuration

### Plugin Flow

1. Style imports (`.css`, `.scss`, `.sass`) are intercepted by `onStyleResolve`
2. Files are rendered via `renderStyle()` (Sass compilation for `.scss`/`.sass`)
3. If file matches `cssModulesMatch` pattern (default: `.module.`), PostCSS modules plugin extracts class mappings
4. CSS content is injected using a hash-based URL scheme (`ni:sha-256;...`)
5. Module exports the CSS class name mapping for CSS Modules

### Test Structure (`test/`)

Each test is a self-contained directory with its own source files and expected outputs:

- `css_modules/` - CSS Modules functionality
- `preprocessors/` - Sass preprocessing
- `postcss_plugins/` - PostCSS plugin integration
- `ssr/` - Server-side rendering (extract: false)
- `with_imports/` - CSS @import handling
- `render_options/` - Sass configuration options
- `tsconfig_path_aliases/` - TypeScript path alias resolution
- `asset_resolve/` - Asset URL resolution in CSS

### Key Configuration Options

- `extract: false` - For SSR; keeps CSS module mappings but skips CSS bundling
- `cssModulesMatch` - Regex to identify CSS module files (default: `/\.module\./`)
- `cssModulesOptions` - Passed to postcss-modules
- `renderOptions.sassOptions` - Passed to Sass compiler
- `postcss.plugins` - Array of PostCSS plugins to apply
