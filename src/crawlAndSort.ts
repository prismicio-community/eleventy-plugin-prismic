import { Client } from "@prismicio/client";
import { asLink } from "@prismicio/helpers";
import { PrismicDocument } from "@prismicio/types";

import {
	PrismicPluginOptionsWithClient,
	PrismicPluginOptionsWithEndpoint,
} from "./types";
import { dPrismicClient } from "./lib/debug";

// Helper types
type SimpleDocuments = PrismicDocument | PrismicDocument[];
type I18nDocuments =
	| ({ __all: PrismicDocument[] } & Record<string, PrismicDocument>)
	| ({ __all: PrismicDocument[] } & Record<string, PrismicDocument[]>);

/**
 * Get all documents from given client and sort them
 *
 * @param client - A Prismic client instance
 * @param options - Options of the plugin
 *
 * @returns A promise resolving to a map of sorted documents
 *
 * @internal
 */
export const crawlAndSort = async (
	client: Client,
	options: PrismicPluginOptionsWithClient | PrismicPluginOptionsWithEndpoint,
): Promise<Record<string, SimpleDocuments> | Record<string, I18nDocuments>> => {
	const docs = await client.dangerouslyGetAll({
		// If the website is i18n, fetch for all languages
		lang: options.i18n ? "*" : undefined,
	});

	const fakeSingletons: string[] = [];
	const sortedDocs = docs.reduce(
		(
			collections:
				| Record<string, SimpleDocuments>
				| Record<string, I18nDocuments>,
			current,
		) => {
			// Resolve document URL if using a link resolver
			if (
				"linkResolver" in options &&
				typeof options.linkResolver === "function" &&
				!("url" in current && current.url)
			) {
				current.url = asLink(current, options.linkResolver);
			}

			let key: string | null = null;

			// If we're on a i18n site...
			if (options.i18n) {
				// ...set key to the language of the document
				key =
					typeof options.i18n === "object" && current.lang in options.i18n
						? options.i18n[current.lang]
						: current.lang;

				// If the collection is not yet defined
				if (!collections[current.type]) {
					collections[current.type] = {
						__all: [],
					};
				}
			}

			// Get current collection
			const get = () =>
				key
					? (collections[current.type] as I18nDocuments)[key]
					: collections[current.type];
			// Set current collection
			const set = (value: PrismicDocument | PrismicDocument[]) => {
				if (key) {
					(collections[current.type] as I18nDocuments)[key] = value;
					(collections[current.type] as I18nDocuments).__all.push(
						...(Array.isArray(value) ? value : [value]),
					);
				} else {
					collections[current.type] = value;
				}
			};
			// Push to current collection
			const push = (value: PrismicDocument) => {
				(get() as PrismicDocument[]).push(value);
				if (key) {
					(collections[current.type] as I18nDocuments).__all.push(value);
				}
			};

			if (
				"singletons" in options &&
				Array.isArray(options.singletons) &&
				options.singletons.includes(current.type) &&
				!fakeSingletons.includes(current.type) &&
				!get()
			) {
				set(current);
			} else {
				if (!get()) {
					set([]);
				} else if (!Array.isArray(get())) {
					dPrismicClient(
						"Document type %o was declared as a singleton but is not, converting to array gracefully",
						current.type,
					);

					fakeSingletons.push(current.type);

					if (key) {
						Object.entries(collections[current.type] as I18nDocuments)
							.filter(([key]) => key !== "__all")
							.forEach(([locale, document]) => {
								(collections[current.type] as I18nDocuments)[locale] = [
									document as PrismicDocument,
								];
							});
					} else {
						collections[current.type] = [get() as PrismicDocument];
					}
				}

				push(current);
			}

			return collections;
		},
		{},
	);

	// Give a pretty console overview of available documents
	const longestType =
		Math.max(...Object.keys(sortedDocs).map((type) => type.length), 8) + 2;
	dPrismicClient(
		[
			"Documents sorted, available types:",
			`  type${" ".repeat(longestType - 4)}   singleton   entries`,
			Object.entries(sortedDocs)
				.map(([type, documentsOrDocumentMap]) => {
					// Type
					let line = `  %o${" ".repeat(longestType - type.length)}`;

					// Singleton
					if (
						!(
							(options.i18n &&
								Object.values(documentsOrDocumentMap).every((v) =>
									Array.isArray(v),
								)) ||
							Array.isArray(documentsOrDocumentMap)
						)
					) {
						line = `${line} *${" ".repeat("singleton".length + 1)}`;
					} else {
						line = `${line} ${" ".repeat("singleton".length + 2)}`;
					}

					// Entries
					if (options.i18n) {
						line = `${line} ${Object.entries(documentsOrDocumentMap)
							.filter(([key]) => key !== "__all")
							.sort((a, b) => (a[0] > b[0] ? 1 : -1))
							.map(
								([locale, documents]) =>
									`${locale}:${
										Array.isArray(documents) ? documents.length : 1
									}`,
							)
							.join(", ")}`;
					} else {
						line = `${line} ${
							Array.isArray(documentsOrDocumentMap)
								? documentsOrDocumentMap.length
								: 1
						}`;
					}

					return line;
				})
				.join("\n"),
			"",
		].join("\n\n"),
		...Object.keys(sortedDocs),
	);

	return sortedDocs;
};
