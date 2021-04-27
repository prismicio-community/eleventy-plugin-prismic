import type { ApiOptions } from "@prismicio/client/types/Api";
import type { DeepRequired } from "ts-essentials";

/**
 * Client SDK options
 *
 * @see Prismic documentation: {@link https://github.com/prismicio/prismic-javascript#instantiate-the-prismic-client}
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
 *
 * @example
 * Make shortcodes only available in Nunjucks
 * ```
 * {
 *   injector: eleventyConfig.addNunjucksShortcode,
 *   pairedInjector: eleventyConfig.addPairedNunjucksShortcode
 * }
 * ```
 *
 * @example
 * Use another `rel` attribute on links with `target="_blank"`
 * ```
 * {
 *   link: {
 *     blankTargetRelAttribute: "noreferrer"
 *   }
 * }
 * ```
 */
interface ShortcodesOptions {
	/**
	 * Function from EleventyConfig to use for injecting shortcodes
	 *
	 * @see Eleventy documentation: {@link https://www.11ty.dev/docs/shortcodes/#shortcodes}
	 *
	 * @defaultValue `eleventyConfig.addShortcode`
	 */
	injector?: EleventyShortcodeFunction;

	/**
	 * Function from EleventyConfig to use for injecting paired shortcodes
	 *
	 * @see Eleventy documentation: {@link https://www.11ty.dev/docs/shortcodes/#paired-shortcodes}
	 *
	 * @defaultValue `eleventyConfig.addPairedShortcode`
	 */
	pairedInjector?: EleventyPairedShortcodeFunction;

	/**
	 * Namespace to apply on injected shortcode, can be an empty string
	 * for no namespace
	 *
	 * @defaultValue `"prismic"`
	 */
	namespace?: string;

	/**
	 * Options for `link` shortcode
	 *
	 * @defaultValue
	 * ```
	 * {
	 *   blankTargetRelAttribute: "noopener"
	 * }
	 * ```
	 */
	link?: {
		/**
		 * Value of the `rel` attribute on links with `target="_blank"`
		 *
		 * @defaultValue `"noopener"`
		 */
		blankTargetRelAttribute?: string;
	};
}

/**
 * Plugin options object
 *
 * @defaultValue
 * ```
 * {
 *  client: false,
 *  shortcodes: {
 *  injector: eleventyConfig.addShortcode,
 *  pairedInjector: eleventyConfig.addPairedShortcode,
 *  namespace: "prismic",
 *   link: {
 *     blankTargetRelAttribute: "noopener"
 *     }
 *   },
 *
 *   singletons: [],
 *   linkResolver: () => "/",
 *   htmlSerializer: () => null
 * }
 * ```
 */
interface PrismicPluginOptions {
	/**
	 * Cient SDK options
	 *
	 * @see Prismic documentation: {@link https://github.com/prismicio/prismic-javascript#instantiate-the-prismic-client}
	 *
	 * @see ClientOptions
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
	 *
	 * @example
	 * Disabling client
	 * ```
	 * false
	 * ```
	 *
	 * @defaultValue `false`
	 */
	client?: false | ClientOptions;

	/**
	 * Shortcodes SDK options
	 *
	 * @see ShortcodesOptions
	 *
	 * @example
	 * Make shortcodes only available in Nunjucks
	 * ```
	 * {
	 *   injector: eleventyConfig.addNunjucksShortcode,
	 *   pairedInjector: eleventyConfig.addPairedNunjucksShortcode
	 * }
	 * ```
	 *
	 * @example
	 * Use another `rel` attribute on links with `target="_blank"`
	 * ```
	 * {
	 *   link: {
	 *     blankTargetRelAttribute: "noreferrer"
	 *   }
	 * }
	 * ```
	 *
	 * @example
	 * Disabling shortcodes
	 * ```
	 * false
	 * ```
	 *
	 * @defaultValue
	 * ```
	 * {
	 *   injector: eleventyConfig.addShortcode,
	 *   pairedInjector: eleventyConfig.addPairedShortcode,
	 *   namespace: "prismic",
	 *   link: {
	 *     blankTargetRelAttribute: "noopener"
	 *   }
	 * }
	 * ```
	 */
	shortcodes?: false | ShortcodesOptions;

	/**
	 * Singletons custom types from Prismic to avoid unnecessary array
	 * nesting on the `prismic` global data object
	 *
	 * @defaultValue `[]`
	 */
	singletons?: string[];

	/**
	 * A custom link resolver function to use
	 *
	 * @see Prismic documentation: {@link https://prismic.io/docs/technologies/link-resolver-javascript}
	 *
	 * @defaultValue `() => "/"`
	 */
	linkResolver?: LinkResolver;

	/**
	 * A custom HTML serializer function to use
	 *
	 * @see Prismic documentation: {@link https://prismic.io/docs/technologies/html-serializer-javascript}
	 *
	 * @defaultValue `() => null`
	 */
	htmlSerializer?: HtmlSerializer<string>;
}

/**
 * Resolved Prismic plugin options
 *
 * @internal
 */
interface ResolvedPrismicPluginOptions extends Required<PrismicPluginOptions> {
	shortcodes: false | DeepRequired<ShortcodesOptions>;
}
