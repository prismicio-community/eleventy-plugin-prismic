import test from "ava";

import { Client, createClient } from "@prismicio/client";

import { createClientFromOptions } from "../src";

const repositoryName = "createClientFromOptions-test-ts";

test("returns a Prismic client instance", (t) => {
	t.true(
		createClientFromOptions({
			client: createClient(repositoryName, {
				fetch: async (url) => ({ status: 200, json: async () => url }),
			}),
		}) instanceof Client,
	);
	t.true(
		createClientFromOptions({ endpoint: repositoryName }) instanceof Client,
	);
	t.true(
		createClientFromOptions({
			endpoint: `https://${repositoryName}.cdn.prismic.io/api/v2`,
		}) instanceof Client,
	);
});
