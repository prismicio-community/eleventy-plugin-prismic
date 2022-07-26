import * as prismicH from "@prismicio/helpers";

import { dPrismicShortcodes } from "./lib/debug";
import { EleventyAddGlobalDataFunction, PrismicPluginOptions } from "./types";

export const isFilled = () => {
	return () => prismicH.isFilled;
};

/**
 * Injects all helper shortcodes with given injector
 *
 * @param prefix - The prefix to apply to shortcode names
 * @param injector - Injector function to use from `eleventyConfig`
 * @param options - Prismic plugin options
 *
 * @internal
 */
export const injectHelperShortcodes = (
	prefix: string,
	injector: EleventyAddGlobalDataFunction,
	_options: PrismicPluginOptions = {},
): void => {
	const helpersShortcodes: string[] = [];

	helpersShortcodes.push(`${prefix}isFilled`);
	injector(`${prefix}isFilled`, isFilled());

	dPrismicShortcodes("Helper shortcodes %o injected", helpersShortcodes);
};
