import test from "ava";
import * as mswNode from "msw/node";

import { createMockQueryHandler } from "./__testutils__/createMockQueryHandler";
import { createMockRepositoryHandler } from "./__testutils__/createMockRepositoryHandler";
import { createDocument } from "./__testutils__/createDocument";

import { prismicPreview } from "../src";

const options = {
	endpoint: "prismicpreview-get-test-ts",
	preview: {
		name: "preview",
		inputDir: "./test/__fixtures__/preview",
		functionsDir: "./test/__fixtures__/preview/functions",
	},
};

const headers = {
	cookie: `${options.endpoint}.prismic.io=${encodeURIComponent(
		JSON.stringify({ preview: "foo" }),
	)}`,
};

const server = mswNode.setupServer(
	createMockRepositoryHandler(options.endpoint),
	createMockQueryHandler(options.endpoint, [
		createDocument({ lang: "en-us", url: "/foo" }),
	]),
);
test.before(() => server.listen({ onUnhandledRequest: "error" }));
test.after(() => server.close());

test("returns previewed page when in a preview session", async (t) => {
	t.deepEqual(await prismicPreview.get("/preview/foo", {}, headers, options), {
		statusCode: 200,
		body: `<h1>foo</h1>
`,
		headers: {
			"Content-Type": "text/html; charset=UTF-8",
		},
	});
});

test("returns fallback page when not in a preview session", async (t) => {
	const response = await prismicPreview.get("/preview/404", {}, {}, options);

	t.snapshot(response);
	t.is(response.statusCode, 404);
});

test("returns fallback page when previewed page is not found", async (t) => {
	const response = await prismicPreview.get(
		"/preview/404",
		{},
		headers,
		options,
	);

	t.snapshot(response);
	t.is(response.statusCode, 404);
});
