import {
	PrismicPluginOptions,
	PrismicPluginOptionsWithClient,
	PrismicPluginOptionsWithEndpoint,
} from "./types";

export const hasClientInOptions = (
	options: PrismicPluginOptions,
): options is
	| PrismicPluginOptionsWithClient
	| PrismicPluginOptionsWithEndpoint => {
	return (
		("endpoint" in options && typeof options.endpoint === "string") ||
		("client" in options && typeof options.client === "object")
	);
};
