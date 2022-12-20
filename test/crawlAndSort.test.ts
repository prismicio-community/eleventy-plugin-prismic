import { it, expect, beforeAll, afterAll } from "vitest";
import * as mswNode from "msw/node";

import nodeFetch from "node-fetch";
import * as prismic from "@prismicio/client";

import { createMockQueryHandler } from "./__testutils__/createMockQueryHandler";
import { createMockRepositoryHandler } from "./__testutils__/createMockRepositoryHandler";
import { createDocument } from "./__testutils__/createDocument";
import { linkResolver } from "./__testutils__/linkResolver";

import { crawlAndSort } from "../src";

const repositoryName = "crawlAndSort-test-ts";

const server = mswNode.setupServer(
	createMockRepositoryHandler(repositoryName),
	createMockQueryHandler(repositoryName, [
		createDocument({ type: "foo", uid: "foo1", lang: "en-us" }),
		createDocument({ type: "foo", url: null, uid: "foo2", lang: "en-us" }),
		createDocument({ type: "foo", uid: "foo3", lang: "fr-fr" }),
		createDocument({ type: "foo", uid: "foo4", lang: "fr-fr" }),
		// order's on purpose
		createDocument({ type: "bar", uid: "bar2", lang: "fr-fr" }),
		createDocument({ type: "bar", uid: "bar1", lang: "en-us" }),
	]),
);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

const client = prismic.createClient(repositoryName, {
	fetch: nodeFetch,
});

it("gets documents and sorts them", async () => {
	const result = await crawlAndSort(client, { client });

	expect(Array.isArray(result.foo)).toBe(true);
	expect((result.foo as unknown[]).length).toBe(2);

	expect(Array.isArray(result.bar)).toBe(true);
	expect((result.bar as unknown[]).length).toBe(1);
});

it("gets only documents of types when provided and sorts them", async () => {
	const result = await crawlAndSort(client, { client, documentTypes: ["foo"] });

	expect(Array.isArray(result.foo)).toBe(true);
	expect((result.foo as unknown[]).length).toBe(2);

	expect(result.bar).toBeUndefined();
});

it("gets documents and sorts them with i18n enabled", async () => {
	const result = (await crawlAndSort(client, { client, i18n: true })) as Record<
		string,
		Record<string, prismic.PrismicDocument | prismic.PrismicDocument[]>
	>;

	expect(Array.isArray(result.foo["en-us"])).toBe(true);
	expect((result.foo["en-us"] as unknown[]).length).toBe(2);

	expect(Array.isArray(result.bar["en-us"])).toBe(true);
	expect((result.bar["en-us"] as unknown[]).length).toBe(1);
});

it("creates a special `__all` collection when i18n is enabled", async () => {
	const result = (await crawlAndSort(client, { client, i18n: true })) as Record<
		string,
		Record<string, prismic.PrismicDocument | prismic.PrismicDocument[]>
	>;

	expect(Array.isArray(result.foo.__all)).toBe(true);
	expect((result.foo.__all as unknown[]).length).toBe(4);

	expect(Array.isArray(result.bar.__all)).toBe(true);
	expect((result.bar.__all as unknown[]).length).toBe(2);
});

it("does not wrap singletons", async () => {
	const result = await crawlAndSort(client, { client, singletons: ["bar"] });

	expect(Array.isArray(result.foo)).toBe(true);
	expect((result.foo as unknown[]).length).toBe(2);

	expect(Array.isArray(result.bar)).toBe(false);
	expect(result.bar).toBeTypeOf("object");
});

it("does not wrap singletons with i18n enabled", async () => {
	const result = (await crawlAndSort(client, {
		client,
		singletons: ["bar"],
		i18n: true,
	})) as Record<
		string,
		Record<string, prismic.PrismicDocument | prismic.PrismicDocument[]>
	>;

	expect(Array.isArray(result.foo["en-us"])).toBe(true);
	expect((result.foo["en-us"] as unknown[]).length).toBe(2);

	expect(Array.isArray(result.bar["en-us"])).toBe(false);
	expect(result.bar["en-us"]).toBeTypeOf("object");
});

it("unwraps singletons that obviously are not", async () => {
	const result = await crawlAndSort(client, { client, singletons: ["foo"] });

	expect(Array.isArray(result.foo)).toBe(true);
	expect((result.foo as unknown[]).length).toBe(2);

	expect(Array.isArray(result.bar)).toBe(true);
	expect((result.bar as unknown[]).length).toBe(1);
});

it("unwraps singletons that obviously are not with i18n enabled", async () => {
	const result = (await crawlAndSort(client, {
		client,
		singletons: ["foo"],
		i18n: true,
	})) as Record<
		string,
		Record<string, prismic.PrismicDocument | prismic.PrismicDocument[]>
	>;

	expect(Array.isArray(result.foo["en-us"])).toBe(true);
	expect((result.foo["en-us"] as unknown[]).length).toBe(2);

	expect(Array.isArray(result.foo["fr-fr"])).toBe(true);
	expect((result.foo["fr-fr"] as unknown[]).length).toBe(2);

	expect(Array.isArray(result.bar["en-us"])).toBe(true);
	expect((result.bar["en-us"] as unknown[]).length).toBe(1);

	expect(Array.isArray(result.bar["fr-fr"])).toBe(true);
	expect((result.bar["fr-fr"] as unknown[]).length).toBe(1);
});

it("uses provided language shortcuts instead of languages codes when available", async () => {
	const result = (await crawlAndSort(client, {
		client,
		singletons: ["foo"],
		i18n: { "en-us": "en" },
	})) as Record<
		string,
		Record<string, prismic.PrismicDocument | prismic.PrismicDocument[]>
	>;

	expect(Array.isArray(result.foo.en)).toBe(true);
	expect((result.foo.en as unknown[]).length).toBe(2);

	expect(Array.isArray(result.bar.en)).toBe(true);
	expect((result.bar.en as unknown[]).length).toBe(1);
});

it("resolves document URL when a link resolver is provided", async () => {
	const result = await crawlAndSort(client, {
		client,
		linkResolver,
	});

	expect(Array.isArray(result.foo)).toBe(true);
	expect((result.foo as { url: string }[])[0].url).toBe("/foo1");
	expect((result.foo as { url: string }[])[1].url).toBe("/foo2");

	expect(Array.isArray(result.bar)).toBe(true);
	expect((result.bar as { url: string }[])[0].url).toBe("/bar1");
});
