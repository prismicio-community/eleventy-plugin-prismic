import test from "ava";
import * as mswNode from "msw/node";

import { createClient, getEndpoint } from "@prismicio/client";
import nodeFetch from "node-fetch";

import { createMockQueryHandler } from "./__testutils__/createMockQueryHandler";
import { createMockRepositoryHandler } from "./__testutils__/createMockRepositoryHandler";
import { createDocument } from "./__testutils__/createDocument";
import { linkResolver } from "./__testutils__/linkResolver";

import { crawlAndSort } from "../src";

const repositoryName = "crawlAndSort.test.ts";

const server = mswNode.setupServer(
	createMockRepositoryHandler(repositoryName),
	createMockQueryHandler(repositoryName, [
		createDocument({ type: "foo", uid: "foo1" }),
		createDocument({ type: "foo", uid: "foo2" }),
		createDocument({ type: "bar", uid: "bar1" }),
	]),
);
test.before(() => server.listen({ onUnhandledRequest: "error" }));
test.after(() => server.close());

const client = createClient(getEndpoint(repositoryName), { fetch: nodeFetch });

test("get documents and sort them", async (t) => {
	const result = await crawlAndSort(client);

	t.true(Array.isArray(result.foo));
	Array.isArray(result.foo) && t.is(2, result.foo.length);

	t.true(Array.isArray(result.bar));
	Array.isArray(result.bar) && t.is(1, result.bar.length);
});

test("does not wrap singletons", async (t) => {
	const result = await crawlAndSort(client, { client, singletons: ["bar"] });

	t.true(Array.isArray(result.foo));
	Array.isArray(result.foo) && t.is(2, result.foo.length);

	t.true(!Array.isArray(result.bar));
	!Array.isArray(result.bar) && t.is("object", typeof result.bar);
});

test("unwraps singletons that obviously are not", async (t) => {
	const result = await crawlAndSort(client, { client, singletons: ["foo"] });

	t.true(Array.isArray(result.foo));
	Array.isArray(result.foo) && t.is(2, result.foo.length);

	t.true(Array.isArray(result.bar));
	Array.isArray(result.bar) && t.is(1, result.bar.length);
});

test("resolves document URL when a link resolver is provided", async (t) => {
	const result = await crawlAndSort(client, {
		client,
		linkResolver,
	});

	t.true(Array.isArray(result.foo));
	Array.isArray(result.foo) &&
		t.is("/foo1", result.foo[0].url) &&
		t.is("/foo2", result.foo[1].url);

	t.true(Array.isArray(result.bar));
	Array.isArray(result.bar) && t.is("/bar1", result.bar[0].url);
});
