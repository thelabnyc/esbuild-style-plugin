# esbuild-style-plugin

Another esbuild plugin for your styling.

- Supports Sass as a preprocessor
- Handles CSS modules automatically with PostCSS
- You can include PostCSS plugins (autoprefixer, preset-env)
- Support PostCSS/TailwindCSS dependencies for watching files - <https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#3-dependencies>
- Supported server-side rendering.
- Includes d.ts files in dist
- Support esbuild watch
- Written in Typescript with maintainable code

## Install

`npm i --save-dev @thelabnyc/esbuild-style-plugin`

## Usage

Look at the test files or here is a basic example.

```ts
import stylePlugin from "esbuild-style-plugin";

esbuild.build({
    plugins: [stylePlugin()],
});
```

### Config

- `extract` default to true
- `cssModulesMatch` match `.module.` by default
- `cssModulesOptions` <https://github.com/madyankin/postcss-modules#usage>
- `renderOptions`
    - `sassOptions` <https://sass-lang.com/documentation/js-api/interfaces/options/>
- `postcss`
    - `plugins` array of postcss accepted plugins
    - `parser` | `syntax` parse source css - use with postcss-scss

## CSS Modules

### Server-side Rendering

Set `extract: false`. This will cause ESBuild to not process CSS on server-side, but will keep the CSS class name mapping for CSS modules.

## PostCSS

The plugin is using PostCSS to handle CSS module files. You can include any other plugins with the `postcss` option.

### CSSNano

Do not use cssnano plugin. It won't work and if it did it minifies all files seperatly (slow not efficient). Instead, just let ESBuild minify do its job.

### Preprocessor Import Types

Use [typed-scss-modules](https://www.npmjs.com/package/typed-scss-modules).
