import * as prismicH from "@prismicio/helpers";

import { LinkField, PrismicDocument } from "@prismicio/types";
import { canCreateClientFromOptions } from "./canCreateClientFromOptions";
import { canCreatePreviewFromOptions } from "./canCreatePreviewFromOptions";
import { attributesToHTML } from "./lib/attributesToHTML";
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
	return function (
		this:
			| {
					page?: Record<string, string>;
			  }
			| unknown,
		slot: string,
		linkFieldOrDocument: LinkField | PrismicDocument,
		options:
			| ({ page?: Record<string, string> } & Record<
					string,
					string | number | null | undefined | unknown
			  >)
			| string = {},
	): string {
		// Resolve href
		let href: string = prismicH.asLink(linkFieldOrDocument, linkResolver) ?? "";
		if (isInternalURL(href)) {
			href = `${internalPrefix}${href}`;
		}

		// Resolve attributes
		let target: string | null = null;
		let rel: string | null = null;

		if ("target" in linkFieldOrDocument && linkFieldOrDocument.target) {
			target = linkFieldOrDocument.target;
			if (target === "_blank") {
				rel = linkBlankTargetRelAttribute || defaultBlankTargetRelAttribute;
			}
		}

		// Resolve aria-current
		// eslint-disable-next-line prefer-const
		let { page, ...attributes } =
			typeof options === "string"
				? {
						page: undefined,
						class: options,
				  }
				: options;

		// If page is not in options, then try to get it from context
		if (!page) {
			page =
				this && typeof this === "object" && "page" in this
					? (
							this as {
								page?: Record<string, string>;
							}
					  ).page
					: undefined;
		}

		let ariaCurrent = null;
		if (page && page.url) {
			if (href.replace(/\/$/, "") === page.url.replace(/\/$/, "")) {
				ariaCurrent = "page";
			}
		} else {
			dPrismicShortcodes(
				"Failed to resolve %o from context, %o attribute won't get computed\nYou can manually provide 11ty page object through the %o options",
				"page",
				"aria-current",
				"page",
			);
		}

		return `<a${attributesToHTML({
			href,
			target,
			rel,
			"aria-current": ariaCurrent,
			...attributes,
		})}>${slot}</a>`;
	};
};

/**
 * Injects all paired shortcodes with given injector
 *
 * @param prefix - The prefix to apply to shortcode names
 * @param injector - Injector function to use from `eleventyConfig`
 * @param options - Prismic plugin options
 *
 * @internal
 */
export const injectPairedShortcodes = (
	prefix: string,
	injector: EleventyPairedShortcodeFunction,
	options: PrismicPluginOptions = {},
): void => {
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
