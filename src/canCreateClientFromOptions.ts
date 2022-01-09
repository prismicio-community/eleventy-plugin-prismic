import {
	PrismicPluginOptions,
	PrismicPluginOptionsWithClient,
	PrismicPluginOptionsWithEndpoint,
} from "./types";

/**
 * Checks if options are capable of creating a client
 *
 * @param options - Plugin options
 *
 * @returns `true` when options are capable of creating a client, `false` otherwise
 *
 * @internal
 */
export const canCreateClientFromOptions = (
	options: PrismicPluginOptions,
): options is
	| PrismicPluginOptionsWithClient
	| PrismicPluginOptionsWithEndpoint => {
	return (
		("endpoint" in options && typeof options.endpoint === "string") ||
		("client" in options && typeof options.client === "object")
	);
};
