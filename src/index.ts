export { pluginPrismic } from "./pluginPrismic";
export { definePrismicPluginOptions } from "./definePrismicPluginOptions";

export * as prismicPreview from "./prismicPreview";

// Internal helpers
export { canCreateClientFromOptions } from "./canCreateClientFromOptions";
export { canCreatePreviewFromOptions } from "./canCreatePreviewFromOptions";
export { createClientFromOptions } from "./createClientFromOptions";
export { crawlAndSort } from "./crawlAndSort";

export {
	asText,
	asHTML,
	asLink,
	asDate,
	asImageSrc,
	asImageWidthSrcSet,
	asImagePixelDensitySrcSet,
	image,
	embed,
	toolbar,
	injectShortcodes,
} from "./shortcodes";

export { link, injectPairedShortcodes } from "./pairedShortcodes";

export type { PrismicPluginOptions } from "./types";
