import type { ApiOptions } from "@prismicio/client/types/Api";

type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

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

type EleventyShortcodeFunction = (
	name: string,
	handler: (...value: unknown) => string
) => string;
type EleventyPairedShortcodeFunction = (
	name: string,
	handler: (slort: string, ...value: unknown) => string
) => string;

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

interface ResolvedPrismicPluginOptions extends Required<PrismicPluginOptions> {
	/** {@inheritDoc PrismicPluginOptions.shortcodes} */
	shortcodes: false | Required<ShortcodesOptions>;
}

// Fields
type RichTextField = RichTextBlock[];

interface LinkFieldRaw extends Partial<LinkResolverDoc> {
	url?: string;
}

interface LinkField extends LinkFieldRaw {
	link_type?: string;
	_linkType?: string;
	linkType?: string;
	value?: { document: LinkFieldRaw; isBroken?: boolean };
	target?: string;
}

export interface ImageField {
	url: string;
	alt?: string;
	copyright?: string;
}

export interface EmbedField {
	html: string;
	embed_url?: string;
	type?: string;
	provider_name?: string;
}

// Missing types from underlying kits
type EleventyConfig = { [key: string]: unknown };

interface LinkResolverDoc {
	id: string;
	uid: string;
	type: string;
	tags: string[];
	lang: string;
	slug?: string;
	isBroken?: boolean;
}

type LinkResolver = (doc: LinkResolverDoc) => string;

interface RichTextSpan {
	start: number;
	end: number;
	type: string;
	text: string;
}

interface RichTextBlock {
	type: string;
	text: string;
	spans: RichTextSpan[];
}

type HtmlSerializer<T> = (
	type: string,
	element: RichTextBlock | RichTextSpan,
	text: string | null,
	children: T[],
	index: number
) => T | null;
