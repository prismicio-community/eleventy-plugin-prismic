import { Client } from "@prismicio/client";
import { documentAsLink } from "@prismicio/helpers";
import { PrismicDocument } from "@prismicio/types";

import { PrismicPluginOptions } from "./types";
import { dPrismicClient } from "./lib/debug";

/**
 * Get all documents from given client and sort them
 *
 * @param client - A Prismic client instance
 * @param options - Options of the plugin
 *
 * @return A promise resolving to a map of sorted documents
 *
 * @internal
 */
export const crawlAndSort = async (
	client: Client,
	options: PrismicPluginOptions = {},
): Promise<Record<string, PrismicDocument | PrismicDocument[]>> => {
	const docs = await client.getAll();

	const sortedDocs = docs.reduce(
		(
			collections: Record<string, PrismicDocument | PrismicDocument[]>,
			current,
		) => {
			// Resolve document URL if using a link resolver
			if (
				"linkResolver" in options &&
				typeof options.linkResolver === "function" &&
				!("url" in current)
			) {
				current.url = documentAsLink(current, options.linkResolver);
			}

			if (
				"singletons" in options &&
				Array.isArray(options.singletons) &&
				options.singletons.includes(current.type) &&
				!(current.type in collections)
			) {
				collections[current.type] = current;
			} else {
				if (!collections[current.type]) {
					collections[current.type] = [];
				} else if (!Array.isArray(collections[current.type])) {
					dPrismicClient(
						"Document type %o was declared as a singleton but is not, converting to array gracefully",
						current.type,
					);
					collections[current.type] = [
						collections[current.type] as PrismicDocument,
					];
				}

				(collections[current.type] as PrismicDocument[]).push(current);
			}

			return collections;
		},
		{},
	);

	dPrismicClient(
		"Documents sorted, available types: %o",
		Object.entries(sortedDocs).map(([key, value]) => {
			if (Array.isArray(value)) {
				return `${key} (${value.length})`;
			} else {
				return `${key} (singleton)`;
			}
		}),
	);

	return sortedDocs;
};
