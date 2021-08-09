const { pluginPrismic } = require("../dist/index.cjs");

module.exports = function (eleventyConfig) {
	/**
	 * @type {import("../dist").PrismicPluginOptions}
	 */
	const prismicPluginOptions = {
		endpoint: "200629-sms-hoy",
		singletons: ["motd", "partials", "settings"],
		linkResolver: (doc) => {
			if (doc.type === "post__blog") {
				return `/blog/${doc.uid}`;
			}

			return "/";
		},
		shortcodesNamespace: "prismic",
	};
	eleventyConfig.addPlugin(pluginPrismic, prismicPluginOptions);
};
