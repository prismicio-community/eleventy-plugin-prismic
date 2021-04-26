const pluginPrismic = require("../src");

module.exports = function (eleventyConfig) {
	/**
	 * @type {import("../src/types").PrismicPluginOptions}
	 */
	const prismicPluginOptions = {
		client: ["https://200629-sms-hoy.cdn.prismic.io/api/v2"],
		shortcodes: {
			link: {
				blankTargetRelAttribute: "noreferrer"
			}
		},
		singletons: ["motd", "partials", "settings"],
		linkResolver: doc => {
			if (doc.type === "post__blog") {
				return `/blog/${doc.uid}`;
			}

			return "/";
		}
	};
	eleventyConfig.addPlugin(pluginPrismic, prismicPluginOptions);
};
