import * as prismicH from "@prismicio/helpers";

import { LinkField, PrismicDocument } from "@prismicio/types";
import { canCreateClientFromOptions } from "./canCreateClientFromOptions";
import { canCreatePreviewFromOptions } from "./canCreatePreviewFromOptions";
import { attributesToHtml } from "./lib/attributesToHTML";
import { dPrismicShortcodes } from "./lib/debug";
import { isInternalURL } from "./lib/isInternalURL";
import { EleventyPairedShortcodeFunction, PrismicPluginOptions } from "./types";

/**
 * The default rel attribute rendered for blank target URLs
 */
const defaultBlankTargetRelAttribute = "noopener noreferrer";

/**
 * Paired `link` shortcode factory
 *
 * @param linkResolver - An optional link resolver function used to resolve links to Prismic documents when not using the route resolver parameter with the client
 * @param linkBlankTargetRelAttribute - Value of the `rel` attribute on links with `target="_blank"` rendered by shortcodes, defaults to `"noopener noreferrer"`
 * @param internalPrefix - An optional prefix to be prepended to internal URL (used with preview)
 *
 * @returns `link` paired shortcode ready to be injected
 *
 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
 *
 * @internal
 */
export const link = (
	linkResolver?: prismicH.LinkResolverFunction,
	linkBlankTargetRelAttribute?: string,
	internalPrefix = "",
) => {
	return (
		slot: string,
		page: Record<string, string>,
		linkFieldOrDocument: LinkField | PrismicDocument,
		...classOrAttributes: string[]
	): string => {
		let href: string = prismicH.asLink(linkFieldOrDocument, linkResolver) ?? "";
		if (isInternalURL(href)) {
			href = `${internalPrefix}${href}`;
		}
		let target: string | null = null;
		let rel: string | null = null;

		if ("target" in linkFieldOrDocument && linkFieldOrDocument.target) {
			target = linkFieldOrDocument.target;
			if (target === "_blank") {
				rel = linkBlankTargetRelAttribute || defaultBlankTargetRelAttribute;
			}
		}

		// Determine if page is current page
		const ariaCurrent =
			page &&
			page.url &&
			href.replace(/\/$/, "") === page.url.replace(/\/$/, "")
				? "page"
				: null;

		return `<a${attributesToHtml(classOrAttributes, {
			href,
			target,
			rel,
			"aria-current": ariaCurrent,
		})}>${slot}</a>`;
	};
};

/**
 * Injects all paired shortcodes with given injector
 *
 * @param injector - Injector function to use from `eleventyConfig`
 * @param options - Prismic plugin options
 *
 * @internal
 */
export const injectPairedShortcodes = (
	injector: EleventyPairedShortcodeFunction,
	options: PrismicPluginOptions = {},
): void => {
	let prefix = "";
	if (options.shortcodesNamespace && options.shortcodesNamespace !== "") {
		prefix = `${options.shortcodesNamespace}_`;
	}

	const pairedShortcodes: string[] = [];

	pairedShortcodes.push(`${prefix}link`);
	injector(
		`${prefix}link`,
		link(
			options.linkResolver,
			options.linkBlankTargetRelAttribute,
			process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW &&
				canCreateClientFromOptions(options) &&
				canCreatePreviewFromOptions(options)
				? `/${options.preview.name}`
				: "",
		),
	);

	dPrismicShortcodes("Paired shortcodes %o injected", pairedShortcodes);
};
