import { PrismicPluginOptions, PrismicPluginOptionsWithPreview } from "./types";

export const hasPreviewInOptions = (
	options: PrismicPluginOptions,
): options is PrismicPluginOptionsWithPreview => {
	return "preview" in options;
};
