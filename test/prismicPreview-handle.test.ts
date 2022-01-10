import test from "ava";
import * as mswNode from "msw/node";

import { cookie } from "@prismicio/client";

import { createMockQueryHandler } from "./__testutils__/createMockQueryHandler";
import { createMockRepositoryHandler } from "./__testutils__/createMockRepositoryHandler";
import { createDocument } from "./__testutils__/createDocument";

import { prismicPreview } from "../src";

const options = {
	endpoint: "prismicpreview-handle-test-ts",
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

test("returns 500 when misconfigured", async (t) => {
	t.deepEqual(await prismicPreview.handle("/preview/foo", {}, {}, {}), {
		statusCode: 500,
		body: JSON.stringify({
			error: "`eleventy-prismic-plugin` preview is not configured",
		}),
	});
});

test("resolves preview when query strings are valid", async (t) => {
	t.deepEqual(
		await prismicPreview.handle(
			"/preview/foo",
			{ token: "foo", documentId: "bar" },
			{},
			options,
		),
		{
			statusCode: 302,
			headers: {
				"X-Robots-Tag": "noindex, nofollow",
				location: "/preview/foo",
				"set-cookie": `${cookie.preview}=${encodeURIComponent(
					JSON.stringify({
						[`${options.endpoint}.prismic.io`]: { preview: "foo" },
					}),
				)}; Path=/`,
			},
		},
	);
});

test("returns previewed page when in a preview session", async (t) => {
	t.deepEqual(
		await prismicPreview.handle("/preview/foo", {}, headers, options),
		{
			statusCode: 200,
			body: `<h1>foo</h1>
`,
			headers: {
				"X-Robots-Tag": "noindex, nofollow",
				"Content-Type": "text/html; charset=UTF-8",
			},
		},
	);
});

test("returns fallback page when not in a preview session", async (t) => {
	const response = await prismicPreview.handle("/preview/foo", {}, {}, options);

	t.snapshot(response);
	t.is(response.statusCode, 404);
});

test("returns fallback page when previewed page is not found", async (t) => {
	const response = await prismicPreview.handle(
		"/preview/404",
		{},
		headers,
		options,
	);

	t.snapshot(response);
	t.is(response.statusCode, 404);
});

test("catches and handle thrown errors", async (t) => {
	// 11ty unknown route pattern
	t.is(
		(await prismicPreview.handle("/preview/foo/bar", {}, headers, options))
			.statusCode,
		404,
	);

	// 11ty 500
	t.is((await prismicPreview.handle("", {}, headers, options)).statusCode, 500);
});
