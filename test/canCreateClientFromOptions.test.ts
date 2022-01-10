import test from "ava";

import nodeFetch from "node-fetch";
import { createClient, getEndpoint } from "@prismicio/client";

import { canCreateClientFromOptions } from "../src";

const repositoryName = "canCreateClientFromOptions-test-ts";

test("returns true for a client capable options object", (t) => {
	t.true(canCreateClientFromOptions({ endpoint: repositoryName }));
	t.true(canCreateClientFromOptions({ endpoint: getEndpoint(repositoryName) }));
	t.true(
		canCreateClientFromOptions({
			client: createClient(getEndpoint(repositoryName), { fetch: nodeFetch }),
		}),
	);
});

test("returns false for a non client capable options object", (t) => {
	t.false(canCreateClientFromOptions({}));
});
