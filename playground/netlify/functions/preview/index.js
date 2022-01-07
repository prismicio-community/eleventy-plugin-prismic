const { prismicPreview } = require("eleventy-plugin-prismic");

const { prismicPluginOptions } = require("./eleventy.config.js");

require("./eleventy-bundler-modules.js");

const handler = async (event) => {
	return await prismicPreview.handle(
		event.path,
		event.queryStringParameters,
		event.headers,
		prismicPluginOptions,
	);
};

exports.handler = handler;
