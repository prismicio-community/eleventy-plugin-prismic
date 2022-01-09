import { PrismicPluginOptions, PrismicPluginOptionsWithPreview } from "./types";

/**
 * Checks if options are capable of creating a preview with 11ty Serverless
 *
 * @param options - Plugin options
 *
 * @returns `true` when options are capable of creating a preview with 11ty Serverless, `false` otherwise
 *
 * @internal
 */
export const canCreatePreviewFromOptions = (
	options: PrismicPluginOptions,
): options is PrismicPluginOptionsWithPreview => {
	return "preview" in options;
};
