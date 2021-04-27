const debug = require("debug")("Eleventy:Prismic:Shortcodes");
const PrismicDOM = require("prismic-dom");
const dayjs = require("dayjs");

class ArgumentError extends Error {}

const ShortcodeType = {
	Default: "default",
	Paired: "paired"
};

/**
 * Map attributes to an html string
 * @param {string[]} [classOrAttributes] - attributes map
 * @param {Object<string, string|undefined>} [attributes] - attributes map
 * @return {string} - truthy attributes as HTML string
 */
const attributesToHtml = (classOrAttributes = [], attributes = {}) => {
	if (classOrAttributes.length === 1) {
		attributes.class = classOrAttributes[0];
	} else {
		for (let i = 0; i < classOrAttributes.length; i += 2) {
			if (classOrAttributes[i + 1]) {
				attributes[classOrAttributes[i]] = classOrAttributes[i + 1];
			}
		}

		// If not pair
		if (classOrAttributes.length % 2) {
			debug(
				"Expected argument `classOrAttributes` to contain a pair amount of items but received %o, dropping last one",
				classOrAttributes
			);
		}
	}

	const attributesArray = Object.entries(attributes)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		.filter(([_, value]) => value)
		.map(([key, value]) => `${key}="${value}"`);

	return attributesArray ? ` ${attributesArray.join(" ")}` : "";
};

class Shortcodes {
	static shortcodes = {
		asText: ShortcodeType.Default,
		asHtml: ShortcodeType.Default,
		asLink: ShortcodeType.Default,
		asDate: ShortcodeType.Default,

		link: ShortcodeType.Paired,
		image: ShortcodeType.Default,
		embed: ShortcodeType.Default
	};

	/**
	 * @constructor
	 * @param {EleventyConfig} eleventyConfig
	 * @param {import("../types").ResolvedPrismicPluginOptions} options
	 *
	 * @throws {ArgumentError}
	 */
	constructor(eleventyConfig, options) {
		// Validate options
		if (!options.shortcodes) {
			throw new ArgumentError(
				`Expected argument \`options.shortcodes\` to be of type \`ShortcodesOptions\` but received type \`${typeof options.shortcodes}\``
			);
		} else if (typeof options.shortcodes.injector !== "function") {
			throw new ArgumentError(
				`Expected argument \`options.shortcodes.injector\` to be of type \`function\` but received type \`${typeof options
					.shortcodes.injector}\``
			);
		} else if (typeof options.shortcodes.pairedInjector !== "function") {
			throw new ArgumentError(
				`Expected argument \`options.shortcodes.pairedInjector\` to be of type \`function\` but received type \`${typeof options
					.shortcodes.pairedInjector}\``
			);
		} else if (typeof options.linkResolver !== "function") {
			throw new ArgumentError(
				`Expected argument \`options.linkResolver\` to be of type \`function\` but received type \`${typeof options.linkResolver}\``
			);
		} else if (typeof options.htmlSerializer !== "function") {
			throw new ArgumentError(
				`Expected argument \`options.htmlSerializer\` to be of type \`function\` but received type \`${typeof options.htmlSerializer}\``
			);
		}

		// Fix injectors scope
		options.shortcodes.injector = options.shortcodes.injector.bind(
			eleventyConfig
		);
		options.shortcodes.pairedInjector = options.shortcodes.pairedInjector.bind(
			eleventyConfig
		);

		this.options = options;
		this.shortcodes = options.shortcodes;
	}

	/**
	 * Serializes a rich text field into a plain text string
	 * @param {RichTextField} richTextField - rich text field to serialize
	 * @return {string} - Serialized plain text string
	 */
	asText = richTextField => {
		return PrismicDOM.RichText.asText(richTextField);
	};

	/**
	 * Serializes a rich text field into an HTML string
	 * @param {RichTextField} richTextField - rich text field to serialize
	 * @return {string} - Serialized HTML string
	 */
	asHtml = richTextField => {
		return PrismicDOM.RichText.asHtml(
			richTextField,
			this.options.linkResolver,
			this.options.htmlSerializer
		);
	};

	/**
	 * Resolve a link field into an `href` value
	 * @param {LinkField} linkField - link field to resolve
	 * @return {string} - resolved link
	 */
	asLink = linkField => {
		// Transform documents into valid link field
		if (
			["id", "uid", "type", "tags", "lang", "data"].every(
				key => typeof linkField[key] !== "undefined"
			)
		) {
			linkField.linkType = "Document";
		}

		return PrismicDOM.Link.url(linkField, this.options.linkResolver);
	};

	/**
	 * Format a date field into a given date format
	 * @param {string} dateField - date field to format
	 * @param {string} [format] - format to use, see https://day.js.org/docs/en/display/format
	 * @return {string} - Formatted date
	 */
	asDate = (dateField, format = "MM/DD/YYYY") => {
		const date = PrismicDOM.Date(dateField);
		if (date) {
			return dayjs(date).format(format);
		} else {
			return "invalid";
		}
	};

	/**
	 * Display a link field
	 * @param {string} slot - HTML slot string
	 * @param {Object<string, string>} page - Eleventy page object
	 * @param {LinkField} linkField - link field to display
	 * @param {...string} [classOrAttributes] - additional classes or attributes to add
	 * @return {string} - a link tag
	 */
	link = (slot, page, linkField, ...classOrAttributes) => {
		const href = this.asLink(linkField);
		const target = linkField.target ?? "";
		const rel = linkField.target
			? this.shortcodes.link.blankTargetRelAttribute
			: "";
		const ariaCurrent =
			page &&
			page.url &&
			href.replace(/\/$/, "") === page.url.replace(/\/$/, "")
				? "page"
				: "";

		return `<a${attributesToHtml(classOrAttributes, {
			href,
			target,
			rel,
			"aria-current": ariaCurrent
		})}>${slot}</a>`;
	};

	/**
	 * Display an image field
	 * @param {ImageField} imageField - image field to display
	 * @param {...string} [classOrAttributes] - additional classes or attributes to add
	 * @return {string} - an image tag
	 */
	image = (imageField, ...classOrAttributes) => {
		const { url: src, alt, copyright } = imageField;

		return `<img${attributesToHtml(classOrAttributes, {
			src,
			alt,
			copyright
		})} />`;
	};

	/**
	 * Display an embed field
	 * @param {EmbedField} embedField - embed field to display
	 * @param {string} [wrapper] - wrapper tag to use, defaults to a div tag
	 * @param {...string} [classOrAttributes] - additional classes or attributes to add
	 * @return {string} - an image tag
	 */
	embed = (embedField, wrapper = "div", ...classOrAttributes) => {
		const { html, embed_url, type, provider_name } = embedField;

		return `<${wrapper}${attributesToHtml(classOrAttributes, {
			"data-oembed": embed_url,
			"data-oembed-type": type,
			"data-oembed-provider": provider_name
		})}>${html}</${wrapper}>`;
	};

	/**
	 * Inject all shortcodes with injector
	 * @return {void}
	 */
	inject() {
		const prefix = this.shortcodes.namespace
			? `${this.shortcodes.namespace}_`
			: "";

		Object.entries(Shortcodes.shortcodes).forEach(([shortcode, type]) => {
			if (type === ShortcodeType.Default) {
				this.shortcodes.injector(`${prefix}${shortcode}`, this[shortcode]);
				debug("Shortcode %o injected", shortcode);
			} else if (type === ShortcodeType.Paired) {
				this.shortcodes.pairedInjector(
					`${prefix}${shortcode}`,
					this[shortcode]
				);
				debug("Paired shortcode %o injected", shortcode);
			}
		});
	}
}

exports.Shortcodes = Shortcodes;
