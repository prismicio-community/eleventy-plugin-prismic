import test from "ava";
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
test.before(() => server.listen({ onUnhandledRequest: "error" }));
test.after(() => server.close());

test("returns null when query strings are missing", async (t) => {
	t.is(await prismicPreview.resolve({}, options), null);
});

test.serial(
	"returns redirect response when query strings are valid and set cookies",
	async (t) => {
		t.deepEqual(
			await prismicPreview.resolve(
				{ token: "foo", documentId: "bar" },
				options,
			),
			{
				statusCode: 302,
				headers: {
					location: "/preview/foo",
					"set-cookie": `${cookie.preview}=${encodeURIComponent(
						JSON.stringify({
							[`${options.endpoint}.prismic.io`]: { preview: "foo" },
						}),
					)}; Path=/`,
				},
			},
		);
	},
);

test.serial(
	"returns redirect response when query strings are valid and set secured cookies on Netlify",
	async (t) => {
		process.env.NETLIFY = "true";

		t.deepEqual(
			await prismicPreview.resolve(
				{ token: "foo", documentId: "bar" },
				options,
			),
			{
				statusCode: 302,
				headers: {
					location: "/preview/foo",
					"set-cookie": `${cookie.preview}=${encodeURIComponent(
						JSON.stringify({
							[`${options.endpoint}.prismic.io`]: { preview: "foo" },
						}),
					)}; Path=/; Secure`,
				},
			},
		);

		delete process.env.NETLIFY;
	},
);
