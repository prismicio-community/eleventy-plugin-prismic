const pkg = require("../package.json");
const defu = require("defu");
const debug = require("debug")("Eleventy:Prismic");

const { Client, Shortcodes } = require("./sdk");

/**
 * Eleventy Prismic Plugin
 * @param {EleventyConfig} eleventyConfig
 * @param {import("./types").PrismicPluginOptions} pluginOptions
 */
module.exports = (eleventyConfig, pluginOptions = {}) => {
	debug("Initing plugin!");
	debug("Running: %o", `${pkg.name}@${pkg.version}`);

	// Resolve options

	/**
	 * @type {import("./types").ResolvedPrismicPluginOptions}
	 */
	const DEFAULTS = {
		client: false,
		shortcodes: {
			injector: eleventyConfig.addShortcode,
			pairedInjector: eleventyConfig.addPairedShortcode,
			namespace: "prismic",
			link: {
				blankTargetRelAttribute: "noopener"
			}
		},

		singletons: [],
		linkResolver: () => "/",
		htmlSerializer: () => null
	};

	/**
	 * @type {import("./types").ResolvedPrismicPluginOptions}
	 */
	// @ts-expect-error defu is defined
	const options = defu(pluginOptions, DEFAULTS);
	if (
		Array.isArray(options.client) &&
		options.client[1] &&
		options.client[1].accessToken
	) {
		// Prevent access token leak, log it yourself if you're unsure of its value!
		const accessToken = options.client[1].accessToken;
		options.client[1].accessToken = "obstructed";
		debug("Resolved options: %o", options);
		options.client[1].accessToken = accessToken;
	} else {
		debug("Resolved options: %o", options);
	}

	// Client SDK
	if (options.client) {
		debug(
			"Client activated: all documents will be available under the %o namespace",
			"prismic"
		);

		const docs = new Client(eleventyConfig, options).crawlAndSort();

		eleventyConfig.addGlobalData("prismic", () => docs);
	}

	// Shortcodes SDK
	if (options.shortcodes) {
		if (options.shortcodes.namespace) {
			debug(
				"Shortcodes activated: all shortcodes will be injected under the %o namespace",
				options.shortcodes.namespace
			);
		} else {
			debug(
				`Shortcodes activated: all shortcodes will be injected at root (no namespace)`
			);
		}

		new Shortcodes(eleventyConfig, options).inject();
	}

	debug("Plugin inited!");
};
