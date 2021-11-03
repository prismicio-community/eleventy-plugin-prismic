import { PrismicPluginOptions } from "./types";

/**
 * Sugar function to get intellisense while writing configuration of the plugin
 *
 * @param options - The options to configure the plugin
 *
 * @returns the same options object
 *
 * @example
 * Basic usage
 *
 * ```
 * const prismicPluginOptions = definePrismicPluginOptions({
 *   endpoint: "my-repo",
 * });
 *
 * eleventyConfig.addPlugin(pluginPrismic, prismicPluginOptions);
 * ```
 */
export const definePrismicPluginOptions = (
	options: PrismicPluginOptions,
): PrismicPluginOptions => options;
