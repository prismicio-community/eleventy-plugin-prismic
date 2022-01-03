import { Client, ClientConfig } from "@prismicio/client";
import {
	HTMLFunctionSerializer,
	HTMLMapSerializer,
	LinkResolverFunction,
} from "@prismicio/helpers";

// Eleventy types

export type EleventyShortcodeFunction = (
	name: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (...value: any[]) => string | null,
) => void;

export type EleventyPairedShortcodeFunction = (
	name: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (slot: string, ...value: any[]) => string | null,
) => void;

export type EleventyConfig = {
	addGlobalData: (
		name: string,
		data: () => Promise<unknown> | unknown,
	) => EleventyConfig;
	addShortcode: EleventyShortcodeFunction;
	addPairedShortcode: EleventyPairedShortcodeFunction;
	[key: string]: unknown;
};

// Eleventy plugin Prismic types

type PrismicPluginOptionsBase = {
	/**
	 * An optional list of IDs of custom types defined as singletons within Prismic
	 *
	 * Used to avoid unnecessary array nesting on the `prismic` global data object
	 */
	singletons?: string[];

	/**
	 * @experimental
	 *
	 * Indicates to the 11ty plugin that the site is a multi-language site, when used, the plugin will nest documents under their language code (`prismic.settings.data` becomes `prismic.settings["en-us"].data`)
	 *
	 * For convenience a map of language codes to language shortcuts can be provided, e.g. `{ "en-us": "en", "fr-fr": "fr" }`, documents will then be nested under the shortut matching their language code if available
	 *
	 * @defaultValue `false`
	 */
	i18n?: boolean | Record<string, string>;

	/**
	 * An optional link resolver function used to resolve links to Prismic documents when not using the route resolver parameter with the client
	 *
	 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
	 */
	linkResolver?: LinkResolverFunction;

	/**
	 * An optional HTML serializer to customize the way rich text fields are rendered
	 *
	 * @see HTML serializer documentation {@link https://prismic.io/docs/core-concepts/html-serializer}
	 */
	htmlSerializer?: HTMLFunctionSerializer | HTMLMapSerializer;

	/**
	 * Whether or not to inject shortcodes
	 *
	 * @defaultValue `true`
	 */
	injectShortcodes?: boolean;

	/**
	 * An optional namespace to use to prefix injected shortcode
	 */
	shortcodesNamespace?: string;

	/**
	 * Function used to inject shortcodes
	 *
	 * @defaultValue `eleventyConfig.addShortcode`
	 */
	shortcodesInjector?: EleventyShortcodeFunction;

	/**
	 * Function used to inject paired shortcodes
	 *
	 * @defaultValue `eleventyConfig.addPairedShortcode`
	 */
	shortcodesPairedInjector?: EleventyPairedShortcodeFunction;

	/**
	 * Value of the `rel` attribute on links with `target="_blank"` rendered by shortcodes
	 *
	 * @defaultValue `"noopener noreferrer"`
	 */
	linkBlankTargetRelAttribute?: string;
};

type PrismicPluginOptionsWithClient = PrismicPluginOptionsBase & {
	/**
	 * A Prismic client instance
	 *
	 * @see Prismic client documentation {@link https://prismic.io/docs/technologies/javascript}
	 */
	client: Client;
};

type PrismicPluginOptionsWithEndpoint = PrismicPluginOptionsBase & {
	/**
	 * A Prismic repository endpoint
	 *
	 * @see Prismic client documentation {@link https://prismic.io/docs/technologies/javascript}
	 *
	 * @example
	 * A repository ID
	 *
	 * ```
	 * "my-repo"
	 * ```
	 *
	 * @example
	 * A full repository endpoint
	 *
	 * ```
	 * "https://my-repo.cdn.prismic.io/api/v2"
	 * ```
	 */
	endpoint: string;

	/**
	 * An optional object to configure `@prismicio/client` instance
	 *
	 * @see Prismic client documentation {@link https://prismic.io/docs/technologies/javascript}
	 * @see Route resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#route-resolver}
	 *
	 * @example
	 * Accessing a private private repository
	 *
	 * ```
	 * {
	 *   accessToken: "abc",
	 * }
	 * ```
	 *
	 * @example
	 * Using a route resolver
	 *
	 * ```
	 * {
	 *   defaultParams: {
	 *     routes: [
	 *       {
	 *         type: "page",
	 *         path: "/:uid"
	 *       },
	 *       {
	 *         type: "post",
	 *         path: "/blog/:uid"
	 *       }
	 *     ]
	 *   }
	 * }
	 * ```
	 */
	clientConfig?: ClientConfig;
};

/**
 * `eleventy-prismic-plugin` options
 *
 * @see Plugin repository: {@link https://github.com/prismicio-community/eleventy-plugin-prismic}
 */
export type PrismicPluginOptions =
	// `singletons` is only relevant when a client is configured
	| Omit<PrismicPluginOptionsBase, "singletons">
	| PrismicPluginOptionsWithClient
	| PrismicPluginOptionsWithEndpoint;
