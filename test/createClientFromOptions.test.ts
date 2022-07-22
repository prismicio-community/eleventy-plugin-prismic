import { it, expect } from "vitest";

import { Client, createClient } from "@prismicio/client";

import { createClientFromOptions } from "../src";

const repositoryName = "createClientFromOptions-test-ts";

it("returns a Prismic client instance", () => {
	expect(
		createClientFromOptions({
			client: createClient(repositoryName, {
				fetch: async (url) => ({ status: 200, json: async () => url }),
			}),
		}) instanceof Client,
	).toBe(true);
	expect(
		createClientFromOptions({ endpoint: repositoryName }) instanceof Client,
	).toBe(true);
	expect(
		createClientFromOptions({
			endpoint: `https://${repositoryName}.cdn.prismic.io/api/v2`,
		}) instanceof Client,
	).toBe(true);
});
