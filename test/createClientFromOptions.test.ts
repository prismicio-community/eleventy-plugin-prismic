import { it, expect } from "vitest";

import * as prismic from "@prismicio/client";

import { createClientFromOptions } from "../src";

const repositoryName = "createClientFromOptions-test-ts";

it("returns a Prismic client instance", () => {
	expect(
		createClientFromOptions({
			client: prismic.createClient(repositoryName, {
				fetch: async (url) => ({ status: 200, json: async () => url }),
			}),
		}) instanceof prismic.Client,
	).toBe(true);
	expect(
		createClientFromOptions({ endpoint: repositoryName }) instanceof
			prismic.Client,
	).toBe(true);
	expect(
		createClientFromOptions({
			endpoint: `https://${repositoryName}.cdn.prismic.io/api/v2`,
		}) instanceof prismic.Client,
	).toBe(true);
});
