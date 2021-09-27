import * as prismicH from "@prismicio/helpers";
import {
	DateField,
	EmbedField,
	ImageField,
	LinkField,
	PrismicDocument,
	RichTextField,
	TimestampField,
} from "@prismicio/types";
import dayjs from "dayjs";
import { attributesToHtml } from "./lib/attributesToHTML";

import { dPrismicShortcodes } from "./lib/debug";
import { EleventyShortcodeFunction, PrismicPluginOptions } from "./types";

/**
 * `asText` shortcode factory
 *
 * @returns `asText` shortcode ready to be injected
 *
 * @internal
 */
export const asText = (): typeof prismicH.asText => prismicH.asText;

/**
 * `asHTML` shortcode factory
 *
 * @param linkResolver - An optional link resolver function used to resolve links to Prismic documents when not using the route resolver parameter with the client
 * @param htmlSerializer - An optional HTML serializer to customize the way rich text fields are rendered
 *
 * @returns `asHTML` shortcode ready to be injected
 *
 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
 * @see HTML serializer documentation {@link https://prismic.io/docs/core-concepts/html-serializer}
 *
 * @internal
 */
export const asHTML = (
	linkResolver?: prismicH.LinkResolverFunction,
	htmlSerializer?: prismicH.HTMLFunctionSerializer | prismicH.HTMLMapSerializer,
) => {
	return (richTextField: RichTextField): ReturnType<typeof prismicH.asHTML> =>
		prismicH.asHTML(richTextField, linkResolver, htmlSerializer);
};

/**
 * `asLink` shortcode factory
 *
 * @param linkResolver - An optional link resolver function used to resolve links to Prismic documents when not using the route resolver parameter with the client
 *
 * @returns `asLink` shortcode ready to be injected
 *
 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
 *
 * @internal
 */
export const asLink = (linkResolver?: prismicH.LinkResolverFunction) => {
	return (linkFieldOrDocument: LinkField | PrismicDocument): string =>
		prismicH.asLink(linkFieldOrDocument, linkResolver) ?? "";
};

/**
 * The default date format to use when none is provided
 */
const defaultDateFormat = "MM/DD/YYYY";

/**
 * `asDate` shortcode factory
 *
 * @returns `asDate` shortcode ready to be injected
 *
 * @internal
 */
export const asDate = () => {
	return (dateField: DateField | TimestampField, format?: string): string => {
		const date = prismicH.asDate(dateField);

		if (date) {
			return dayjs(date).format(format || defaultDateFormat);
		} else {
			return "invalid";
		}
	};
};

/**
 * `image` shortcode factory
 *
 * @returns `image` shortcode ready to be injected
 *
 * @internal
 */
export const image = () => {
	return (imageField: ImageField, ...classOrAttributes: string[]): string => {
		const { url: src, alt, copyright } = imageField;

		return `<img${attributesToHtml(classOrAttributes, {
			src,
			alt,
			copyright,
		})} />`;
	};
};

/**
 * The default tag rendered to wrap the embed
 */
const defaultEmbedWrapper = "div";

/**
 * `embed` shortcode factory
 *
 * @returns `embed` shortcode ready to be injected
 *
 * @internal
 */
export const embed = () => {
	return (
		embedField: EmbedField,
		wrapper?: string,
		...classOrAttributes: string[]
	): string => {
		const { html, embed_url, type, provider_name } = embedField;

		return `<${wrapper || defaultEmbedWrapper}${attributesToHtml(
			classOrAttributes,
			{
				"data-oembed": embed_url,
				"data-oembed-type": type,
				"data-oembed-provider": provider_name,
			},
		)}>${html}</${wrapper || defaultEmbedWrapper}>`;
	};
};

/**
 * Injects all shortcodes with given injector
 *
 * @param injector - Injector function to use from `eleventyConfig`
 * @param options - Options of the plugin
 *
 * @internal
 */
export const injectShortcodes = (
	injector: EleventyShortcodeFunction,
	options: PrismicPluginOptions = {},
): void => {
	let prefix = "";
	if (options.shortcodesNamespace && options.shortcodesNamespace !== "") {
		prefix = `${options.shortcodesNamespace}_`;
	}

	const shortcodes: string[] = [];

	shortcodes.push(`${prefix}asText`);
	injector(`${prefix}asText`, asText());

	shortcodes.push(`${prefix}asHTML`);
	injector(
		`${prefix}asHTML`,
		asHTML(options.linkResolver, options.htmlSerializer),
	);

	shortcodes.push(`${prefix}asLink`);
	injector(`${prefix}asLink`, asLink(options.linkResolver));

	shortcodes.push(`${prefix}asDate`);
	injector(`${prefix}asDate`, asDate());

	shortcodes.push(`${prefix}image`);
	injector(`${prefix}image`, image());

	shortcodes.push(`${prefix}embed`);
	injector(`${prefix}embed`, embed());

	dPrismicShortcodes("Shortcodes %o injected", shortcodes);
};
