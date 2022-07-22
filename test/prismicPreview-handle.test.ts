import { it, expect, beforeAll, afterAll } from "vitest";
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
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

it("returns 500 when misconfigured", async () => {
	expect(await prismicPreview.handle("/preview/foo", {}, {}, {})).toStrictEqual(
		{
			statusCode: 500,
			body: JSON.stringify({
				error: "`eleventy-prismic-plugin` preview is not configured",
			}),
		},
	);
});

it("resolves preview when query strings are valid", async () => {
	expect(
		await prismicPreview.handle(
			"/preview/foo",
			{ token: "foo", documentId: "bar" },
			{},
			options,
		),
	).toStrictEqual({
		statusCode: 302,
		headers: {
			"X-Robots-Tag": "noindex, nofollow",
			location: "/preview/foo?preview=true",
			"set-cookie": `${cookie.preview}=${encodeURIComponent(
				JSON.stringify({
					[`${options.endpoint}.prismic.io`]: { preview: "foo" },
				}),
			)}; Path=/`,
		},
	});
});

it("returns previewed page when in a preview session", async () => {
	expect(
		await prismicPreview.handle("/preview/foo", {}, headers, options),
	).toStrictEqual({
		statusCode: 200,
		body: `<h1>foo</h1>
`,
		headers: {
			"X-Robots-Tag": "noindex, nofollow",
			"Content-Type": "text/html; charset=UTF-8",
		},
	});
});

it("returns fallback page when not in a preview session", async () => {
	const response = await prismicPreview.handle("/preview/foo", {}, {}, options);

	expect(response).toMatchSnapshot();
	expect(response.statusCode).toBe(404);
});

it("returns fallback page when previewed page is not found", async () => {
	const response = await prismicPreview.handle(
		"/preview/404",
		{},
		headers,
		options,
	);

	expect(response).toMatchSnapshot();
	expect(response.statusCode).toBe(404);
});

it("catches and handle thrown errors", async () => {
	// 11ty unknown route pattern
	expect(
		(await prismicPreview.handle("/preview/foo/bar", {}, headers, options))
			.statusCode,
	).toBe(404);

	// 11ty 500
	expect(
		(await prismicPreview.handle("", {}, headers, options)).statusCode,
	).toBe(500);
});
