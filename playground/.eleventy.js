const {
	pluginPrismic,
	definePrismicPluginOptions,
} = require("eleventy-plugin-prismic");

module.exports = function (eleventyConfig) {
	const prismicPluginOptions = definePrismicPluginOptions({
		endpoint: "200629-sms-hoy",
		singletons: ["motd", "partials", "settings"],
		linkResolver: (doc) => {
			if (doc.type === "post__blog") {
				return `/blog/${doc.uid}`;
			}

			return "/";
		},
		shortcodesNamespace: "prismic",
	});
	eleventyConfig.addPlugin(pluginPrismic, prismicPluginOptions);
};
