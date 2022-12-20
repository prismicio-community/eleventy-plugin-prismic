import { it, expect } from "vitest";

import nodeFetch from "node-fetch";
import * as prismic from "@prismicio/client";

import { canCreateClientFromOptions } from "../src";

const repositoryName = "canCreateClientFromOptions-test-ts";

it("returns true for a client capable options object", () => {
	expect(canCreateClientFromOptions({ endpoint: repositoryName })).toBe(true);
	expect(
		canCreateClientFromOptions({
			endpoint: prismic.getRepositoryEndpoint(repositoryName),
		}),
	).toBe(true);
	expect(
		canCreateClientFromOptions({
			client: prismic.createClient(repositoryName, { fetch: nodeFetch }),
		}),
	).toBe(true);
});

it("returns false for a non client capable options object", () => {
	expect(canCreateClientFromOptions({})).toBe(false);
});
