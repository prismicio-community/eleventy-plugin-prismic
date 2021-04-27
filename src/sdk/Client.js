const debug = require("debug")("Eleventy:Prismic:Client");
const Prismic = require("@prismicio/client");

class ArgumentError extends Error {}

class Client {
	/**
	 * @constructor
	 * @param {EleventyConfig} eleventyConfig
	 * @param {import("../types").ResolvedPrismicPluginOptions} options
	 *
	 * @throws {ArgumentError}
	 */
	constructor(eleventyConfig, options) {
		// Validate options
		if (typeof options.client === "string") {
			if (!options.client) {
				throw new ArgumentError(
					`Expected argument \`options.client\` to reference a Prismic repository API endpoint when of type \`string\` but received \`${options.client}\``
				);
			}
		} else if (Array.isArray(options.client)) {
			if (typeof options.client[0] !== "string") {
				throw new ArgumentError(
					`Expected argument \`options.client[0]\` to be of type \`string\` but received type \`${typeof options
						.client[0]}\``
				);
			} else if (!options.client[0]) {
				throw new ArgumentError(
					`Expected argument \`options.client[0]\` to reference a Prismic repository API endpoint when of type \`string\` but received \`${options.client[0]}\``
				);
			}
		} else {
			throw new ArgumentError(
				`Expected argument \`options.client\` to be of type \`string|[string, ?object]\` but received type \`${typeof options.client}\``
			);
		}

		this.options = options;

		// Create client according to options format
		if (typeof options.client === "string") {
			// @ts-expect-error Prismic.client is defined
			this.client = Prismic.client(options.client);
		} else {
			// @ts-expect-error Prismic.client is defined
			this.client = Prismic.client(...options.client);
		}
	}

	/**
	 * Crawl documents from client
	 * @param {number} [page] - page to crawl
	 * @return {Promise<Array>} - array of documents
	 */
	async crawl(page = 1) {
		const { next_page: next, results: docs } = await this.client.query("", {
			lang: "*",
			pageSize: 100,
			page
		});

		if (next) {
			docs.push(...(await this.crawl(page + 1)));
		}

		if (page > 1) {
			debug("Crawling documents... %o found", docs.length);
		}

		return docs;
	}

	/**
	 * Sort documents by type
	 * @param {array} [docs] - documents to sort
	 * @return {Object} sorted documents
	 */
	sort(docs = []) {
		return docs.reduce((collections, current) => {
			if (this.options.singletons.includes(current.type)) {
				collections[current.type] = current;
			} else {
				if (!collections[current.type]) {
					collections[current.type] = [];
				}
				collections[current.type].push(current);
			}

			return collections;
		}, {});
	}

	/**
	 * Crawl and sort documents from client
	 * @return {Promise<Object>} - all documents sorted
	 */
	async crawlAndSort() {
		debug("Starts crawling documents...");
		const docs = await this.crawl();
		debug("Done crawling documents: %o found", docs.length);
		const sorted = this.sort(docs);
		debug(
			"Documents sorted, available types: %o",
			Object.entries(sorted).map(([key, value]) => {
				if (this.options.singletons.includes(key)) {
					return `${key} (singleton)`;
				} else {
					return `${key} (${value.length})`;
				}
			})
		);
		return sorted;
	}
}

exports.Client = Client;
