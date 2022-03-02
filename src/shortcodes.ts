import * as prismicH from "@prismicio/helpers";
import {
	DateField,
	EmbedField,
	ImageFieldImage,
	LinkField,
	PrismicDocument,
	RichTextField,
	TimestampField,
} from "@prismicio/types";
import dayjs from "dayjs";

import { canCreateClientFromOptions } from "./canCreateClientFromOptions";
import { canCreatePreviewFromOptions } from "./canCreatePreviewFromOptions";
import { createClientFromOptions } from "./createClientFromOptions";
import { attributesToHTML } from "./lib/attributesToHTML";
import { dPrismicShortcodes } from "./lib/debug";
import { isInternalURL } from "./lib/isInternalURL";
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
 * @param internalPrefix - An optional prefix to be prepended to internal URL (used with preview)
 *
 * @returns `asLink` shortcode ready to be injected
 *
 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
 *
 * @internal
 */
export const asLink = (
	linkResolver?: prismicH.LinkResolverFunction,
	internalPrefix = "",
) => {
	return (linkFieldOrDocument: LinkField | PrismicDocument): string => {
		const href: string =
			prismicH.asLink(linkFieldOrDocument, linkResolver) ?? "";

		return `${isInternalURL(href) ? internalPrefix : ""}${href}`;
	};
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
 * `asImageSrc` shortcode factory
 *
 * @returns `asImageSrc` shortcode ready to be injected
 *
 * @internal
 */
export const asImageSrc = () => {
	return (
		imageField: ImageFieldImage,
		params?: Parameters<typeof prismicH.asImageSrc>[1],
	): string => {
		return prismicH.asImageSrc(imageField, params) ?? "";
	};
};

/**
 * `asImageWidthSrcSet` shortcode factory
 *
 * @returns `asImageWidthSrcSet` shortcode ready to be injected
 *
 * @internal
 */
export const asImageWidthSrcSet = () => {
	return (
		imageField: ImageFieldImage,
		params?: Parameters<typeof prismicH.asImageWidthSrcSet>[1],
	): string => {
		return prismicH.asImageWidthSrcSet(imageField, params)?.srcset ?? "";
	};
};

/**
 * `asImagePixelDensitySrcSet` shortcode factory
 *
 * @returns `asImagePixelDensitySrcSet` shortcode ready to be injected
 *
 * @internal
 */
export const asImagePixelDensitySrcSet = () => {
	return (
		imageField: ImageFieldImage,
		params?: Parameters<typeof prismicH.asImagePixelDensitySrcSet>[1],
	): string => {
		return prismicH.asImagePixelDensitySrcSet(imageField, params)?.srcset ?? "";
	};
};

/**
 * `image` shortcode factory
 *
 * @returns `image` shortcode ready to be injected
 *
 * @internal
 */
export const image = (
	widthSrcSetDefaults?: number[],
	pixelDensitySrcSetDefaults?: number[],
) => {
	return (
		imageField: ImageFieldImage,
		options:
			| ({
					imgixParams?: Parameters<typeof prismicH.asImageSrc>[1];
					widths?:
						| NonNullable<
								Parameters<typeof prismicH.asImageWidthSrcSet>[1]
						  >["widths"]
						| "auto"
						| "defaults";
					pixelDensities?:
						| NonNullable<
								Parameters<typeof prismicH.asImagePixelDensitySrcSet>[1]
						  >["pixelDensities"]
						| "defaults";
			  } & Record<string, string | number | null | undefined | unknown>)
			| string = {},
	): string => {
		const { alt } = imageField;
		const { imgixParams, widths, pixelDensities, ...attributes } =
			typeof options === "string"
				? {
						imgixParams: undefined,
						widths: undefined,
						pixelDensities: undefined,
						class: options,
				  }
				: options;

		const { src, srcset } = (() => {
			if (!prismicH.isFilled.imageThumbnail(imageField)) {
				return { src: null, srcset: null };
			} else if (widths) {
				if (pixelDensities) {
					dPrismicShortcodes(
						"`widths` and `pixelDensities` props should not be use alongside each others, only `widths` will be applied",
						{ imageField, attributes, imgixParams, widths, pixelDensities },
					);
				}

				if (widths === "auto") {
					return prismicH.asImageWidthSrcSet(imageField, imgixParams);
				} else {
					// Remove potential thumbnails when using manual widths
					const { url, dimensions, alt, copyright } = imageField;

					return prismicH.asImageWidthSrcSet(
						{ url, dimensions, alt, copyright },
						{
							...imgixParams,
							widths: widths === "defaults" ? widthSrcSetDefaults : widths,
						},
					);
				}
			} else if (pixelDensities) {
				return prismicH.asImagePixelDensitySrcSet(imageField, {
					...imgixParams,
					pixelDensities:
						pixelDensities === "defaults"
							? pixelDensitySrcSetDefaults
							: pixelDensities,
				});
			} else {
				return {
					src: prismicH.asImageSrc(imageField, imgixParams),
					srcset: null,
				};
			}
		})();

		return `<img${attributesToHTML({
			alt: alt ?? "",
			src,
			srcset,
			...attributes,
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
		options:
			| ({ wrapper?: string } & Record<
					string,
					string | number | null | undefined
			  >)
			| string = {},
	): string => {
		const { html, embed_url, type, provider_name } = embedField;
		const { wrapper = defaultEmbedWrapper, ...attributes } =
			typeof options === "string"
				? { wrapper: undefined, class: options }
				: options;

		return `<${wrapper}${attributesToHTML({
			"data-oembed": embed_url,
			"data-oembed-type": type,
			"data-oembed-provider": provider_name,
			...attributes,
		})}>${html}</${wrapper}>`;
	};
};

/**
 * `toolbar` shortcode factory
 *
 * @param repository - The repository to link the toolbar to
 * @param previewName - Preview name from plugin options
 *
 * @returns `toolbar` shortcode ready to be injected
 *
 * @internal
 */
export const toolbar = (repository: string, previewName: string) => {
	const script = process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW
		? `<script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=${repository}"></script>
<script>window.addEventListener("prismicPreviewEnd", (event) => {
	event.preventDefault();
	window.location.replace(window.location.pathname.replace(/^\\/${previewName}/g, ""));
});</script>`
		: "";

	return (): string => script;
};

/**
 * Injects all shortcodes with given injector
 *
 * @param injector - Injector function to use from `eleventyConfig`
 * @param options - Prismic plugin options
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
	injector(
		`${prefix}asLink`,
		asLink(
			options.linkResolver,
			process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW &&
				canCreateClientFromOptions(options) &&
				canCreatePreviewFromOptions(options)
				? `/${options.preview.name}`
				: "",
		),
	);

	shortcodes.push(`${prefix}asDate`);
	injector(`${prefix}asDate`, asDate());

	shortcodes.push(`${prefix}asImageSrc`);
	injector(`${prefix}asImageSrc`, asImageSrc());

	shortcodes.push(`${prefix}asImageWidthSrcSet`);
	injector(`${prefix}asImageWidthSrcSet`, asImageWidthSrcSet());

	shortcodes.push(`${prefix}asImagePixelDensitySrcSet`);
	injector(`${prefix}asImagePixelDensitySrcSet`, asImagePixelDensitySrcSet());

	shortcodes.push(`${prefix}image`);
	injector(
		`${prefix}image`,
		image(
			options.imageWidthSrcSetDefaults,
			options.imagePixelDensitySrcSetDefaults,
		),
	);

	shortcodes.push(`${prefix}embed`);
	injector(`${prefix}embed`, embed());

	if (
		canCreateClientFromOptions(options) &&
		canCreatePreviewFromOptions(options)
	) {
		shortcodes.push(`${prefix}toolbar`);
		injector(
			`${prefix}toolbar`,
			toolbar(
				new URL(createClientFromOptions(options).endpoint).host.replace(
					/\.cdn/i,
					"",
				),
				options.preview.name,
			),
		);
	} else {
		shortcodes.push(`${prefix}toolbar (dummy)`);
		injector(`${prefix}toolbar`, () => "");
	}

	dPrismicShortcodes("Shortcodes %o injected", shortcodes);
};
