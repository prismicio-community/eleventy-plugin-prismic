import nodeFetch from "node-fetch";
import { Client, createClient, getEndpoint } from "@prismicio/client";

import {
	PrismicPluginOptionsWithClient,
	PrismicPluginOptionsWithEndpoint,
} from "./types";

export const createClientFromOptions = (
	options: PrismicPluginOptionsWithClient | PrismicPluginOptionsWithEndpoint,
): Client => {
	return "client" in options
		? options.client
		: createClient(
				/** @see Regex101 expression: {@link https://regex101.com/r/GT2cl7/1} */
				/^(https?:)?\/\//gim.test(options.endpoint)
					? options.endpoint
					: getEndpoint(options.endpoint),
				{
					fetch: nodeFetch,
					...options.clientConfig,
				},
		  );
};
