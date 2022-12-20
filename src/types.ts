import * as prismic from "@prismicio/client";

// Eleventy types

export type EleventyAddPluginFunction = <TOptions>(
	plugin: (eleventyConfig: EleventyConfig, options?: TOptions) => void,
	options?: TOptions,
) => void;

export type EleventyAddGlobalDataFunction = <TData = unknown>(
	name: string,
	data: () => Promise<TData> | TData,
) => EleventyConfig;

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
	addPlugin: EleventyAddPluginFunction;
	addGlobalData: EleventyAddGlobalDataFunction;
	addShortcode: EleventyShortcodeFunction;
	addPairedShortcode: EleventyPairedShortcodeFunction;
	[key: string]: unknown;
};

export type EleventyServerlessBundlerPluginOptions = {
	name: string;
	inputDir?: string;
	functionsDir?: string;
	copy?: (string | { from: string; to: string })[];
	copyOptions?: Record<string, unknown>;
	copyEnabled?: boolean;
	redirects?:
		| ((name: string, outputMap: Record<string, string>) => void)
		| "netlify-toml"
		| "netlify-toml-functions"
		| "netlify-toml-builders";
	excludeDependencies?: string[];
	[key: string]: unknown;
};

// Eleventy plugin Prismic types

export type PrismicPluginOptionsBase = {
	/**
	 * An optional link resolver function used to resolve links to Prismic documents when not using the route resolver parameter with the client
	 *
	 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
	 */
	linkResolver?: prismic.LinkResolverFunction;

	/**
	 * An optional HTML serializer to customize the way rich text fields are rendered
	 *
	 * @see HTML serializer documentation {@link https://prismic.io/docs/core-concepts/html-serializer}
	 */
	htmlSerializer?: prismic.HTMLFunctionSerializer | prismic.HTMLMapSerializer;

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
	 * Function used to inject helper shortcodes
	 *
	 * @defaultValue `eleventyConfig.addGlobalData`
	 */
	shortcodesHelperInjector?: EleventyAddGlobalDataFunction;

	/**
	 * Value of the `rel` attribute on links with `target="_blank"` rendered by shortcodes
	 *
	 * @defaultValue `"noopener noreferrer"`
	 */
	linkBlankTargetRelAttribute?: string;

	/**
	 * Default widths to use when rendering an image with `{ widths: "defaults" }`
	 *
	 * @remarks
	 * Consider configuring image widths within your content type definition and
	 * using `widths="thumbnails"` instead to give content writers the ability to crop
	 * images in the editor.
	 * @defaultValue `@prismicio/helpers` defaults
	 */
	imageWidthSrcSetDefaults?: number[];

	/**
	 * Default pixel densities to use when rendering an image with
	 * `{ pixelDensities: "defaults" }`
	 *
	 * @defaultValue `@prismicio/helpers` defaults
	 */
	imagePixelDensitySrcSetDefaults?: number[];
};

export type PrismicPluginOptionsWithClientOrEndpointBase =
	PrismicPluginOptionsBase & {
		/**
		 * An optional list of IDs of custom types defined as singletons within Prismic
		 *
		 * Used to avoid unnecessary array nesting on the `prismic` global data object
		 */
		singletons?: string[];

		/**
		 * An optional list of documents types to fetch. Not providing this list (`undefined`)
		 * will result in all documents being fetched.
		 */
		documentTypes?: string[];

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
		 * @experimental
		 *
		 * Enables Prismic previews by providing an 11ty Serverless Bundler Plugin configuration object
		 *
		 * @see 11ty Serverless Bundler Plugin documentation {@link https://www.11ty.dev/docs/plugins/serverless/#step-1-add-the-bundler-plugin}
		 */
		preview?: EleventyServerlessBundlerPluginOptions;
	};

export type PrismicPluginOptionsWithClient =
	PrismicPluginOptionsWithClientOrEndpointBase & {
		/**
		 * A Prismic client instance
		 *
		 * @see Prismic client documentation {@link https://prismic.io/docs/technologies/javascript}
		 */
		client: prismic.Client;
	};

export type PrismicPluginOptionsWithEndpoint =
	PrismicPluginOptionsWithClientOrEndpointBase & {
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
		clientConfig?: prismic.ClientConfig;
	};

/**
 * `eleventy-prismic-plugin` options
 *
 * @see Plugin repository: {@link https://github.com/prismicio-community/eleventy-plugin-prismic}
 */
export type PrismicPluginOptions =
	// `singletons` is only relevant when a client is configured
	| PrismicPluginOptionsBase
	| PrismicPluginOptionsWithClient
	| PrismicPluginOptionsWithEndpoint;

/**
 * `eleventy-prismic-plugin` options with preview enabled
 */
export type PrismicPluginOptionsWithPreview = (
	| PrismicPluginOptionsWithClient
	| PrismicPluginOptionsWithEndpoint
) & {
	preview: Required<PrismicPluginOptionsWithClientOrEndpointBase>["preview"];
};
