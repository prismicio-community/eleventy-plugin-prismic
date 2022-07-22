import { it, expect, beforeAll, afterAll } from "vitest";
import * as mswNode from "msw/node";

import { cookie } from "@prismicio/client";

import { createMockQueryHandler } from "./__testutils__/createMockQueryHandler";
import { createMockRepositoryHandler } from "./__testutils__/createMockRepositoryHandler";
import { createDocument } from "./__testutils__/createDocument";

import { prismicPreview } from "../src";

const options = {
	endpoint: "prismicpreview-resolve-test-ts",
	preview: { name: "preview" },
};

const server = mswNode.setupServer(
	createMockRepositoryHandler(options.endpoint),
	createMockQueryHandler(options.endpoint, [
		createDocument({ lang: "en-us", url: "/foo" }),
	]),
);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

it("returns null when query strings are missing", async () => {
	expect(await prismicPreview.resolve({}, options)).toBeNull();
	expect(await prismicPreview.resolve(null, options)).toBeNull();
});

it("returns redirect response when query strings are valid and set cookies", async () => {
	expect(
		await prismicPreview.resolve({ token: "foo", documentId: "bar" }, options),
	).toStrictEqual({
		statusCode: 302,
		headers: {
			location: "/preview/foo?preview=true",
			"set-cookie": `${cookie.preview}=${encodeURIComponent(
				JSON.stringify({
					[`${options.endpoint}.prismic.io`]: { preview: "foo" },
				}),
			)}; Path=/`,
		},
	});
});

it("returns redirect response when query strings are valid and set secured cookies on Netlify", async () => {
	process.env.AWS_LAMBDA_FUNCTION_NAME = "true";

	expect(
		await prismicPreview.resolve({ token: "foo", documentId: "bar" }, options),
	).toStrictEqual({
		statusCode: 302,
		headers: {
			location: "/preview/foo?preview=true",
			"set-cookie": `${cookie.preview}=${encodeURIComponent(
				JSON.stringify({
					[`${options.endpoint}.prismic.io`]: { preview: "foo" },
				}),
			)}; Path=/; Secure`,
		},
	});

	delete process.env.AWS_LAMBDA_FUNCTION_NAME;
});
