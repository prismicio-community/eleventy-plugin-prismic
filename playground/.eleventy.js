const {
	pluginPrismic,
	definePrismicPluginOptions,
} = require("eleventy-plugin-prismic");

const prismicPluginOptions = definePrismicPluginOptions({
	endpoint: "200629-sms-hoy",
	singletons: ["motd", "partials", "settings"],
	// i18n: { "en-us": "en" },
	preview: {
		name: "preview",
		functionsDir: "./netlify/functions/",
	},
	linkResolver: (doc) => {
		if (doc.type === "post") {
			return `/blog/${doc.uid}/`;
		}

		return "/";
	},
	shortcodesNamespace: "prismic",
});

const config = function (eleventyConfig) {
	eleventyConfig.addPlugin(pluginPrismic, prismicPluginOptions);
};
config.prismicPluginOptions = prismicPluginOptions;

module.exports = config;
