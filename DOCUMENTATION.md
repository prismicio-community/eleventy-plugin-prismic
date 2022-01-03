# `eleventy-plugin-prismic@0.1.x` Documentation

- [🚀 &nbsp;Installation](#installation)
- [🛠 &nbsp;Usage](#usage)
- [📚 &nbsp;Configuration References](#configuration-references)
- [🛶 &nbsp;Migrating From `0.0.x`](#migrating-from-00x)

## Installation

> ⚠ This plugin relies on the new `eleventyConfig.addGlobalData` method that comes with Eleventy 1.0.0, [see documentation](https://www.11ty.dev/docs/data-global-custom) for more.
>
> To use it, make sure you upgrade Eleventy to the latest canary version:
>
> - With npm: `npm install --save-dev @11ty/eleventy@canary`;
> - Yarn: `yarn add --dev @11ty/eleventy@canary`;
> - Or npx: `npx @11ty/eleventy@canary`.

Add `eleventy-plugin-prismic` dependency to your project:

```bash
$ npm install --save-dev eleventy-plugin-prismic
# or with Yarn
$ yarn add --dev eleventy-plugin-prismic
```

Then open up your Eleventy config file (probably `.eleventy.js`) and use the `addPlugin` method:

```javascript
const {
	pluginPrismic,
	definePrismicPluginOptions,
} = require("eleventy-plugin-prismic");

module.exports = function (eleventyConfig) {
	// This is a sugar function that gives you intellisense and
	// documentation in your IDE while defining plugin options.
	const prismicPluginOptions = definePrismicPluginOptions({
		endpoint: "your-repo-name",

		// Optional, additional parameters to pass to the client
		clientConfig: {
			accessToken: "abc",
		},

		/* see configuration references for more */
	});

	eleventyConfig.addPlugin(pluginPrismic, prismicPluginOptions);
};
```

### i18n _(experimental)_

By default the plugin only loads documents from the [master locale](https://prismic.io/docs/core-concepts/languages-locales#set-the-master-locale) defined on your Prismic repository. If you want to load documents from other locales you have to enable the `i18n` option when defining the plugin options. This option will tell the plugin to load documents from all available locales:

```javascript
const prismicPluginOptions = definePrismicPluginOptions({
	/* ... */

	i18n: true,
});
```

To later ease the templating process, you can also enable this options by providing a map of your locale codes to more convenient shortcuts (think of this alternative as a way to avoid the verbose `prismic.post["en-us"]` accessor in your templates):

```javascript
const prismicPluginOptions = definePrismicPluginOptions({
	/* ... */

	i18n: {
		"en-us": "en", // `en-us` documents will be indexed at the `en` key instead
		"fr-fr": "fr",
	},
});
```

## Usage

### Data

All data are injected under the `prismic` global data object when launching Eleventy and available on all your templates:

```nunjucks
{# ./index.njk #}

<h1>{% asText prismic.home.data.title %}</h1>

{# Use the built-in `log` filter to explore available data #}
{{ prismic.home.data | log }}

...
```

Pagination example:

<!-- prettier-ignore-start -->
```nunjucks
{# ./blog/slug.njk #}

---
pagination:
  data: prismic.post
  size: 1
  alias: post
	addAllPagesToCollections: true
permalink: "blog/{{ post.uid }}/"
---

<h1>{% asText post.data.title %}</h1>

{# Use the built-in `log` filter to explore available data #}
{{ post.data | log }}

...
```
<!-- prettier-ignore-end -->

#### With the `i18n` option _(experimental)_

If you're using the `i18n` option, each documents get nested under their locale code, an additional `__all` key is also made to ease pagination:

```nunjucks
{# ./index.njk #}

<h1>{% asText prismic.home["en-us"].data.title %}</h1>

{# Use the built-in `log` filter to explore available data #}
{{ prismic.home["en-us"].data | log }}

...
```

Pagination example:

<!-- prettier-ignore-start -->
```nunjucks
{# ./blog/slug.njk #}

---
pagination:
  data: prismic.post.__all
  size: 1
  alias: post
	addAllPagesToCollections: true
permalink: "blog/{{post.lang}}/{{ post.uid }}/"
---

<h1>{% asText post.data.title %}</h1>

{# Use the built-in `log` filter to explore available data #}
{{ post.data | log }}

...
```
<!-- prettier-ignore-end -->

### Shortcodes

Many shortcodes and paired shortcodes are made available inside your templates to help you with Prismic data templating.

By default shortcodes are unprefixed. You can provide a namespace when registering the Prismic plugin inside your `.eleventy.js` config file using the `shortcodesNamespace` options. Shortcodes will then be injected under the provided namespace like so: `${NAMESPACE}_${SHORTCODE_NAME}`

#### `asText`

Serializes a rich text field into a plain text string:

```njk
{% asText document.data.richtext %}
```

Renders to:

<!-- prettier-ignore-start -->
```html
Hello World

Lorem ipsum dolor sit amet.

...
```
<!-- prettier-ignore-end -->

#### `asHTML`

Serializes a rich text field into an HTML string:

```njk
{% asHTML document.data.richtext %}
```

Renders to:

<!-- prettier-ignore-start -->
```html
<h1>Hello World</h1>

<p>Lorem ipsum dolor sit amet.</p>

...
```
<!-- prettier-ignore-end -->

#### `asLink`

Resolves a link field or document into an `href` value:

```njk
{% asLink document.data.link %}

<a href="{% asLink document.data.link %}">Example</a>
```

Renders to:

<!-- prettier-ignore-start -->
```html
https://example.com

<a href="https://example.com">Example</a>
```
<!-- prettier-ignore-end -->

#### `asDate`

Formats a date or timestamp field with given format:

```njk
{% asDate document.data.date %}

{% asDate document.data.date, "MMMM YYYY" %}
```

Renders to:

<!-- prettier-ignore-start -->
```html
04/26/2021

April 2021
```
<!-- prettier-ignore-end -->

> Under the hood the plugin makes use of day.js, [check their documentation](https://day.js.org/docs/en/display/format) for more format!

#### `link` (paired shortcode)

Displays a link field or document as link with the right attributes and accessibility options:

```njk
{% link page, document.data.link %}
  Example
{% endlink %}

{% link page, document.data.targetBlankLink %}
  Blank target
{% endlink %}

{% link page, document %}
  Current page
{% endlink %}

{% link page, document.data.link, "no-underline" %}
  Width class
{% endlink %}

{% link page, document.data.link, "class", "no-underline", "data-foo", "bar" %}
  With any attribute
{% endlink %}
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

#### `image`

Displays an image field:

```njk
{% image document.data.image %}

{% image document.data.image, "block p-5" %}

{% image document.data.image, "class", "block p-5", "width", "200px", "loading", "lazy" %}
```

Renders to:

<!-- prettier-ignore-start -->
```html
<img src="https://images.prismic.io/..." />

<img src="https://images.prismic.io/..." class="block p-5" />

<img src="https://images.prismic.io/..." class="block p-5" width="200px" loading="lazy" />
```
<!-- prettier-ignore-end -->

#### `embed`

Displays an embed field:

```njk
{% embed document.data.embed %}

{% embed document.data.embed, "blockquote", "block p-5" %}

{% embed document.data.embed, "blockquote", "class", "block p-5", "width", "200px" %}
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

### Previews

Soon™ with Eleventy serverless 🚀

### Debug

Like Eleventy, this plugin makes use of the [debug](https://www.npmjs.com/package/debug) package to log a lot of useful information. Get logs along Eleventy's debug logs:

```bash
# Installed globally
DEBUG=Eleventy* eleventy
# Installed locally
DEBUG=Eleventy* npx @11ty/eleventy@canary # until 1.0.0 is released on latest
```

Or get just Prismic related logs:

```bash
# Installed globally
DEBUG=Eleventy:Prismic* eleventy
# Installed locally
DEBUG=Eleventy:Prismic* npx @11ty/eleventy@canary # until 1.0.0 is released on latest
```

## Configuration References

### Interface

```typescript
type PrismicPluginOptions = {
	// You can provide your own client instance directly instead of using `endpoint` and `clientConfig`
	client?: Client;

	// Or just let the plugin create one from your repository endpoint or name
	endpoint?: string;

	// Additional parameters to pass to the client along the endpoint option
	clientConfig?: ClientConfig;

	// Optional list of custom types defined as singletons
	singletons?: string[];

	// Indicates that the website will handle multiple locales, see the `i18n` section above
	i18n?: boolean | Record<string, string>;

	// See https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver
	linkResolver?: LinkResolverFunction;

	// See https://prismic.io/docs/core-concepts/html-serializer
	htmlSerializer?: HTMLFunctionSerializer | HTMLMapSerializer;

	// Used to disable shortcodes injection, defaults to `true`
	injectShortcodes?: boolean;

	// An optional namespace to prefix injected shortcodes
	shortcodesNamespace?: string;

	// `eleventyConfig` method to use to inject shortcodes, defaults to `eleventyConfig.addShortcode`
	shortcodesInjector?: EleventyShortcodeFunction;

	// `eleventyConfig` method to use to inject paired shortcodes, defaults to `eleventyConfig.addPairedShortcode`
	shortcodesPairedInjector?: EleventyPairedShortcodeFunction;

	// Value of the `rel` attribute on links with `target="_blank"` rendered by shortcodes, defaults to `noopener noreferrer`
	linkBlankTargetRelAttribute?: string;
};
```

> 💡 See [src/types.ts](./src/types.ts#L32-L168) for comprehensive definition, don't be afraid to check it out! You don't actually need TypeScript knowledge to understand it~

### Defaults

```javascript
{
	i18n: false,
	injectShortcodes: true,
	shortcodesNamespace: "",
	shortcodesInjector: eleventyConfig.addShortcode,
	shortcodesPairedInjector: eleventyConfig.addPairedShortcode,
	linkBlankTargetRelAttribute: "noopener noreferrer",
}
```

## Migrating From `0.0.x`

Package exports have changed from `0.0.x` to `0.1.x`, `pluginPrismic` is not longer default exported:

```diff
- const pluginPrismic = require("eleventy-plugin-prismic");
+ const { pluginPrismic } = require("eleventy-plugin-prismic");
```

Plugin options have also changed, to migrate you need to update the plugin configuration as follows:

```diff
{
	// `client` has to be renamed to `endpoint`, optional configuration has to be moved to `clientConfig`
-	client: "https://your-repo-name.cdn.prismic.io/api/v2",
+	endpoint: "https://your-repo-name.cdn.prismic.io/api/v2",

	// Optional additional configuration provided to your client
+	clientConfig: { /* ... */ }

	// `singletons` stays the same
	singletons: ["settings"],

	// `linkResolver` stays the same
	linkResolver: yourLinkResolver,

	// `htmlSerializer` stays the same
	htmlSerializer: yourHTMLSerializer

	// `shortcodes` has to be refactored
-	shortcodes: {
-		namespace: "foo",
-		injector: eleventyConfig.addShortcode,
-		pairedInjector: eleventyConfig.addPairedShortcode,
-		link: {
-			blankTargetRelAttribute: "noopener noreferrer"
-		}
-	},

	// Set this to false to disable shortcodes injection
+	injectShortcodes: false,

	// Shortcodes are now unprefixed by default, specify `"prismic"` here if you were using the default prefixed version from `0.0.x`
+	shortcodesNamespace: "foo",

	// Injectors have been moved top level
+	shortcodesInjector: eleventyConfig.addShortcode,
+	shortcodesPairedInjector: eleventyConfig.addPairedShortcode,

	// `rel` attribute value has been moved to top level
+	linkBlankTargetRelAttribute: "noopener noreferrer",
}
```

Finally the case of the `asHTML` shortcodes has changed from `asHtml` to `asHTML`:

```diff
- {% asHtml document.data.richtext %}
+ {% asHTML document.data.richtext %}
```
