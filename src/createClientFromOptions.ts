import nodeFetch from "node-fetch";
import { Client, createClient } from "@prismicio/client";

import {
	PrismicPluginOptionsWithClient,
	PrismicPluginOptionsWithEndpoint,
} from "./types";

/* eslint-disable @typescript-eslint/no-unused-vars */

// Imports for @link references:

import { canCreateClientFromOptions } from "./canCreateClientFromOptions";

/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Creates a Prismic client from the given plugin options assuming they've already been validated by {@link canCreateClientFromOptions}
 *
 * @param options - Plugin options
 *
 * @returns Client created after options
 *
 * @internal
 */
export const createClientFromOptions = (
	options: PrismicPluginOptionsWithClient | PrismicPluginOptionsWithEndpoint,
): Client => {
	return "client" in options
		? options.client
		: createClient(options.endpoint, {
				fetch: nodeFetch,
				...options.clientConfig,
		  });
};
