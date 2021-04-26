# eleventy-plugin-prismic [![Conventional Commits][conventional-commits-src]][conventional-commits-href] [![npm version][npm-version-src]][npm-version-href] [![npm downloads][npm-downloads-src]][npm-downloads-href] [![License][license-src]][license-href]

> Easily connect your [Eleventy](https://11ty.dev) application to your content hosted on [Prismic](https://prismic.io)

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [🚀 &nbsp;Installation](#installation)
- [🛠 &nbsp;Usage](#usage)
- [📚 &nbsp;Configuration References](#configuration-references)
- [💥 &nbsp;Caveats](#caveats)

## About

> ℹ This is a community plugin created and maintained by the community and Eleventy enthusiasts.

`eleventy-plugin-prismic` helps you connect you [Eleventy](https://www.11ty.dev) application to your content hosted on [Prismic](https://prismic.io/?utm_campaign=devexp&utm_source=11tydoc&utm_medium=homepage) while providing you a lot of helpers to template Prismic data.

## Installation

> ⚠ This plugin relies on the new `eleventyConfig.addGlobalData` method that comes with Eleventy 1.0.0, [see documentation](https://www.11ty.dev/docs/data-global-custom) for more.
>
> To use it make sure you upgrade Eleventy to the latest canary version:
>
> - With yarn: `yarn add --dev @11ty/eleventy@canary`;
> - Or npm: `npm install --save-dev @11ty/eleventy@canary`.

Add `eleventy-plugin-prismic` dependency to your project:

```bash
$ yarn add --dev eleventy-plugin-prismic
# or with npm
$ npm install --save-dev eleventy-plugin-prismic
```

Then open up your Eleventy config file (probably `.eleventy.js`) and use `addPlugin`:

```javascript
const pluginPrismic = require("eleventy-plugin-prismic");

module.exports = function (eleventyConfig) {
	/**
	 * @type {import("eleventy-plugin-prismic/src/types").PrismicPluginOptions}
	 */
	const prismicPluginOptions = {
		client: "https://your-repo-name.cdn.prismic.io/api/v2"
		/* see configuration references for more */
	};

	eleventyConfig.addPlugin(pluginPrismic, prismicPluginOptions);
};
```

> 🈂 In the above snippet we use a JSDoc declaration to get proper intellisense on the different plugin options! You're free to remove it~

## Usage

### Using Data

All data are injected under the `prismic` global data object when launching Eleventy and available on all your templates:

```nunjucks
{# ./index.njk #}

<h1>{% prismic_asText prismic.home.data.title %}</h1>

{# Use the built-in `log` filter to explore available data #}
{{ prismic.home.data | log }}

...
```

Pagination example:

```nunjucks
{# ./blog/slug.njk #}

---
pagination:
  data: prismic.post
  size: 1
  alias: post
permalink: "blog/{{ post.uid }}/"
---

<h1>{% prismic_asText post.data.title %}</h1>

{# Use the built-in `log` filter to explore available data #}
{{ post.data | log }}

...
```

### Using Shortcodes

Many shortcodes and paired shortcodes are made available inside your templates to help you with Prismic data templating:

#### asText

Serializes a rich text field into a plain text string:

```njk
{% prismic_asText document.data.richtext %}
```

Renders to:

<!-- prettier-ignore-start -->
```html
Hello World

Lorem ipsum dolor sit amet.

...
```
<!-- prettier-ignore-end -->

#### asHtml

Serializes a rich text field into an HTML string:

```njk
{% prismic_asHtml document.data.richtext %}
```

Renders to:

<!-- prettier-ignore-start -->
```html
<h1>Hello World</h1>

<p>Lorem ipsum dolor sit amet.</p>

...
```
<!-- prettier-ignore-end -->

#### asLink

Resolves a link field into an `href` value:

```njk
{% prismic_asLink document.data.link %}

<a href="{% prismic_asLink document.data.link %}">Example</a>
```

Renders to:

<!-- prettier-ignore-start -->
```html
https://example.com

<a href="https://example.com">Example</a>
```
<!-- prettier-ignore-end -->

#### asDate

Format a date field with given format:

```njk
{% prismic_asDate document.data.date %}

{% prismic_asDate document.data.date, "MMMM YYYY" %}
```

Renders to:

<!-- prettier-ignore-start -->
```html
04/26/2021

April 2021
```
<!-- prettier-ignore-end -->

> Under the hood the plugin makes use of day.js, [check their documentation](https://day.js.org/docs/en/display/format) for more format!

#### link (paired shortcode)

Display a link field with the right attributes and accessibility options:

```njk
{% prismic_link page, document.data.link %}
  Example
{% endprismic_link}

{% prismic_link page, document.data.targetBlankLink %}
  Blank target
{% endprismic_link}

{% prismic_link page, document %}
  Current page
{% endprismic_link}

{% prismic_link page, document.data.link, "no-underline" %}
  Width class
{% endprismic_link}

{% prismic_link page, document.data.link, "class", "no-underline", "data-foo", "bar" %}
  With any attribute
{% endprismic_link}
```

> Always provide Eleventy's `page` object for the plugin to known if provided link is the current page or not!

Renders to:

<!-- prettier-ignore-start -->
```html
<a href="https://example.com">
  Example
</a>

<a href="https://example.com" target="_blank" rel="noopener">
  Blank target
</a>

<a href="/document" aria-current="page">
  Current page
</a>

<a href="https://example.com" class="no-underline">
  Width class
</a>

<a href="https://example.com" class="no-underline" data-foo="bar">
  With any attribute
</a>
```
<!-- prettier-ignore-end -->

#### image

Display an image field:

```njk
{% prismic_image document.data.image %}

{% prismic_image document.data.image, "block p-5" %}

{% prismic_image document.data.image, "class", "block p-5", "width", "200px", "loading", "lazy" %}
```

Renders to:

<!-- prettier-ignore-start -->
```html
<img src="https://images.prismic.io/..." />

<img src="https://images.prismic.io/..." class="block p-5" />

<img src="https://images.prismic.io/..." class="block p-5" width="200px" loading="lazy" />
```
<!-- prettier-ignore-end -->

#### embed

Display an embed field:

```njk
{% prismic_embed document.data.embed %}

{% prismic_embed document.data.embed, "blockquote", "block p-5" %}

{% prismic_embed document.data.embed, "blockquote", "class", "block p-5", "width", "200px" %}
```

Renders to:

<!-- prettier-ignore-start -->
```html
<div data-oembed="..." data-oembed-type="..." data-oembed-provider="...">
  <!-- Embed HTML snippet -->
</div>

<blockquote data-oembed="..." data-oembed-type="..." data-oembed-provider="..." class="block p-5">
  <!-- Embed HTML snippet -->
</blockquote>

<div data-oembed="..." data-oembed-type="..." data-oembed-provider="..." class="block p-5" width="200px">
  <!-- Embed HTML snippet -->
</div>
```
<!-- prettier-ignore-end -->

### Debug

Like Eleventy, this plugin makes use of the [debug](https://www.npmjs.com/package/debug) package to log a lot of useful things. Get logs along Eleventy's debug logs:

```bash
# Installed globally
DEBUG=Eleventy* eleventy
# Installed locally
DEBUG=Eleventy* npx @11ty/eleventy
```

Or get just Prismic related logs:

```bash
# Installed globally
DEBUG=Eleventy:Prismic* eleventy
# Installed locally
DEBUG=Eleventy:Prismic* npx @11ty/eleventy
```

## Configuration References

### Interface

````typescript
/**
 * Client SDK options
 *
 * @example
 * Just a repository endpoint
 * ```
 * "https://your-repo-name.cdn.prismic.io/api/v2"
 * ```
 *
 * @example
 * Private repository
 * ```
 * [
 *   "https://your-repo-name.cdn.prismic.io/api/v2",
 *   { accessToken: "abc" }
 * ]
 * ```
 */
type ClientOptions = string | [string] | [string, ApiOptions];

/**
 * Shortcodes SDK options
 */
interface ShortcodesOptions {
	/**
	 * Function from EleventyConfig to use for injecting shortcodes
	 */
	injector?: EleventyShortcodeFunction;
	/**
	 * Function from EleventyConfig to use for injecting paired shortcodes
	 */
	pairedInjector?: EleventyPairedShortcodeFunction;
	/**
	 * Namespace to apply on injected shortcode, can be an empty string
	 * for no namespace
	 */
	namespace?: string;
	/**
	 * Options for `link` shortcode
	 */
	link: {
		/**
		 * Value of the `rel` attribute on links with `target="_blank"`
		 */
		blankTargetRelAttribute: string;
	};
}

/**
 * Plugin options object
 */
interface PrismicPluginOptions {
	/**
	 * @see ClientOptions
	 * Use `false` to disable
	 */
	client?: false | ClientOptions;
	/**
	 * @see ShortcodesOptions
	 * Use `false` to disable
	 */
	shortcodes?: false | DeepPartial<ShortcodesOptions>;

	/**
	 * Singletons custom types from Prismic to avoid unnecessary array
	 * nesting on the `prismic` global data object
	 */
	singletons?: string[];
	/**
	 * A custom link resolver function to use
	 * Documentation: {@link https://prismic.io/docs/technologies/link-resolver-javascript}
	 */
	linkResolver?: LinkResolver;
	/**
	 * A custom HTML serializer function to use
	 * Documentation: {@link https://prismic.io/docs/technologies/html-serializer-javascript}
	 */
	htmlSerializer?: HtmlSerializer<string>;
}
````

### Defaults

```javascript
{
	client: false,
	singletons: [],
	shortcodes: {
		injector: eleventyConfig.addShortcode,
		pairedInjector: eleventyConfig.addPairedShortcode,
		namespace: "prismic",
		link: {
			blankTargetRelAttribute: "noopener"
		}
	},
	linkResolver: () => "/",
	htmlSerializer: () => null
}
```

## Caveats

Due to the nature of Eleventy applications, [Prismic previews](https://prismic.io/docs/technologies/previews-and-the-prismic-toolbar-rest-api?utm_campaign=devexp&utm_source=11tydoc&utm_medium=restpreviewdoc) aren't supported for now. Although I have some idea as of _how to support them_ so stay tuned by watching this repository or by following me on [Twitter](https://twitter.com/li_hbr)!

## License

[MIT License](./LICENSE)

<!-- Badges -->

[conventional-commits-src]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[conventional-commits-href]: https://conventionalcommits.org
[npm-version-src]: https://img.shields.io/npm/v/eleventy-plugin-prismic/latest.svg
[npm-version-href]: https://npmjs.com/package/eleventy-plugin-prismic
[npm-downloads-src]: https://img.shields.io/npm/dm/eleventy-plugin-prismic.svg
[npm-downloads-href]: https://npmjs.com/package/eleventy-plugin-prismic
[license-src]: https://img.shields.io/npm/l/eleventy-plugin-prismic.svg
[license-href]: https://npmjs.com/package/eleventy-plugin-prismic
