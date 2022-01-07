import test from "ava";
import * as mswNode from "msw/node";

import nodeFetch from "node-fetch";
import { createClient, getEndpoint } from "@prismicio/client";

import { createMockQueryHandler } from "./__testutils__/createMockQueryHandler";
import { createMockRepositoryHandler } from "./__testutils__/createMockRepositoryHandler";
import { createDocument } from "./__testutils__/createDocument";
import { linkResolver } from "./__testutils__/linkResolver";

import { crawlAndSort } from "../src";
import { PrismicDocument } from "@prismicio/types";

const repositoryName = "crawlAndSort.test.ts";

const server = mswNode.setupServer(
	createMockRepositoryHandler(repositoryName),
	createMockQueryHandler(repositoryName, [
		createDocument({ type: "foo", uid: "foo1", lang: "en-us" }),
		createDocument({ type: "foo", uid: "foo2", lang: "en-us" }),
		createDocument({ type: "foo", uid: "foo3", lang: "fr-fr" }),
		createDocument({ type: "foo", uid: "foo4", lang: "fr-fr" }),
		// order's on purpose
		createDocument({ type: "bar", uid: "bar2", lang: "fr-fr" }),
		createDocument({ type: "bar", uid: "bar1", lang: "en-us" }),
	]),
);
test.before(() => server.listen({ onUnhandledRequest: "error" }));
test.after(() => server.close());

const client = createClient(getEndpoint(repositoryName), {
	fetch: nodeFetch,
});

test("gets documents and sort them", async (t) => {
	const result = await crawlAndSort(client, { client });

	t.true(Array.isArray(result.foo));
	Array.isArray(result.foo) && t.is(result.foo.length, 2);

	t.true(Array.isArray(result.bar));
	Array.isArray(result.bar) && t.is(result.bar.length, 1);
});

test("gets documents and sort them with i18n enabled", async (t) => {
	const result = (await crawlAndSort(client, { client, i18n: true })) as Record<
		string,
		Record<string, PrismicDocument | PrismicDocument[]>
	>;

	t.true(Array.isArray(result.foo["en-us"]));
	Array.isArray(result.foo["en-us"]) && t.is(result.foo["en-us"].length, 2);

	t.true(Array.isArray(result.bar["en-us"]));
	Array.isArray(result.bar["en-us"]) && t.is(result.bar["en-us"].length, 1);
});

test("creates a special `__all` collection when i18n is enabled", async (t) => {
	const result = (await crawlAndSort(client, { client, i18n: true })) as Record<
		string,
		Record<string, PrismicDocument | PrismicDocument[]>
	>;

	t.true(Array.isArray(result.foo.__all));
	Array.isArray(result.foo.__all) && t.is(result.foo.__all.length, 4);

	t.true(Array.isArray(result.bar.__all));
	Array.isArray(result.bar.__all) && t.is(result.bar.__all.length, 2);
});

test("does not wrap singletons", async (t) => {
	const result = await crawlAndSort(client, { client, singletons: ["bar"] });

	t.true(Array.isArray(result.foo));
	Array.isArray(result.foo) && t.is(result.foo.length, 2);

	t.true(!Array.isArray(result.bar));
	!Array.isArray(result.bar) && t.is(typeof result.bar, "object");
});

test("does not wrap singletons with i18n enabled", async (t) => {
	const result = (await crawlAndSort(client, {
		client,
		singletons: ["bar"],
		i18n: true,
	})) as Record<string, Record<string, PrismicDocument | PrismicDocument[]>>;

	t.true(Array.isArray(result.foo["en-us"]));
	Array.isArray(result.foo["en-us"]) && t.is(result.foo["en-us"].length, 2);

	t.true(!Array.isArray(result.bar["en-us"]));
	!Array.isArray(result.bar["en-us"]) &&
		t.is(typeof result.bar["en-us"], "object");
});

test("unwraps singletons that obviously are not", async (t) => {
	const result = await crawlAndSort(client, { client, singletons: ["foo"] });

	t.true(Array.isArray(result.foo));
	Array.isArray(result.foo) && t.is(result.foo.length, 2);

	t.true(Array.isArray(result.bar));
	Array.isArray(result.bar) && t.is(result.bar.length, 1);
});

test("unwraps singletons that obviously are not with i18n enabled", async (t) => {
	const result = (await crawlAndSort(client, {
		client,
		singletons: ["foo"],
		i18n: true,
	})) as Record<string, Record<string, PrismicDocument | PrismicDocument[]>>;

	t.true(Array.isArray(result.foo["en-us"]));
	Array.isArray(result.foo["en-us"]) && t.is(result.foo["en-us"].length, 2);
	t.true(Array.isArray(result.foo["fr-fr"]));
	Array.isArray(result.foo["fr-fr"]) && t.is(result.foo["fr-fr"].length, 2);
	t.true(Array.isArray(result.foo.__all));
	Array.isArray(result.foo.__all) && t.is(result.foo.__all.length, 4);

	t.true(Array.isArray(result.bar["en-us"]));
	Array.isArray(result.bar["en-us"]) && t.is(result.bar["en-us"].length, 1);
});

test("uses provided language shortcuts instead of languages codes when available", async (t) => {
	const result = (await crawlAndSort(client, {
		client,
		singletons: ["foo"],
		i18n: { "en-us": "en" },
	})) as Record<string, Record<string, PrismicDocument | PrismicDocument[]>>;

	t.true(Array.isArray(result.foo.en));
	Array.isArray(result.foo.en) && t.is(result.foo.en.length, 2);

	t.true(Array.isArray(result.bar.en));
	Array.isArray(result.bar.en) && t.is(result.bar.en.length, 1);
});

test("resolves document URL when a link resolver is provided", async (t) => {
	const result = await crawlAndSort(client, {
		client,
		linkResolver,
	});

	t.true(Array.isArray(result.foo));
	Array.isArray(result.foo) &&
		t.is(result.foo[0].url, "/foo1") &&
		t.is(result.foo[1].url, "/foo2");

	t.true(Array.isArray(result.bar));
	Array.isArray(result.bar) && t.is(result.bar[0].url, "/bar1");
});
