// @ts-expect-error - 11ty does not provide any sort of type definition
import { EleventyServerless } from "@11ty/eleventy";
import { cookie } from "@prismicio/client";

import { createClientFromOptions } from "./createClientFromOptions";
import { hasPreviewInOptions } from "./hasPreviewInOptions";
import { PrismicPluginOptions, PrismicPluginOptionsWithPreview } from "./types";

type ServerlessResponse = {
	statusCode: number;
	body?: string;
	headers?: Record<string, string>;
};

export const resolve = async (
	query: Record<string, string>,
	options: PrismicPluginOptionsWithPreview,
): Promise<ServerlessResponse | null> => {
	const { token: previewToken, documentId: documentID } = query;

	if (!previewToken || !documentID) {
		return null;
	}

	const client = createClientFromOptions(options);
	const href = await client.resolvePreviewURL({
		documentID,
		previewToken,
		linkResolver: options.linkResolver,
		defaultURL: `/${options.preview.name}`,
	});

	const previewCookie = {
		[new URL(client.endpoint).host.replace(/\.cdn/i, "")]: {
			preview: previewToken,
		},
	};

	return {
		statusCode: 302,
		headers: {
			location: `/${options.preview.name}${href}`,
			"set-cookie": `${cookie.preview}=${encodeURIComponent(
				JSON.stringify(previewCookie),
			)}; Path=/${process.env.NETLIFY ? "; Secure" : ""}`,
		},
	};
};

export const get = async (
	path: string,
	query: Record<string, string>,
	headers: Record<string, string> | undefined,
	options: PrismicPluginOptionsWithPreview,
): Promise<ServerlessResponse> => {
	globalThis.document = globalThis.document || {};
	globalThis.document.cookie = headers?.cookie ?? "";

	const elev = new EleventyServerless(options.preview.name, {
		path,
		query,
		functionsDir: options.preview.functionsDir || "./functions/",
	});

	const output = await elev.getOutput();

	const page = output.find((o: { url: string }) =>
		/** @see Regex101 expression: {@link https://regex101.com/r/7AKhyO/1} */
		path.includes(o.url.replace(/^\/|\/(index(\.html)?)?$/gim, "")),
	);

	let response: ServerlessResponse;
	if (!page) {
		response = {
			statusCode: 404,
			body: `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Loading preview...</title>
	<style>
		body, h1 {
			font-family: monospace;
			font-weight: 400;
			font-size: 16px;
		}
	</style>
</head>
<body>
	<section>
		<h1>Not found</h1>
		<p><a href="/">Get back to home</a></p>
	</section>
	<script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=${new URL(
		createClientFromOptions(options).endpoint,
	).host.replace(/\.cdn/i, "")}"></script>
</body>
</html>`,
		};
	} else {
		response = {
			statusCode: 200,
			body: page.content,
		};
	}

	return {
		...response,
		headers: {
			...response.headers,
			"Content-Type": "text/html; charset=UTF-8",
		},
	};
};

export const handle = async (
	path: string,
	query: Record<string, string>,
	headers: Record<string, string> | undefined,
	options: PrismicPluginOptions,
): Promise<ServerlessResponse> => {
	if (!hasPreviewInOptions(options)) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: "`eleventy-prismic-plugin` preview is not configured",
			}),
		};
	}

	let response: ServerlessResponse;

	try {
		response =
			(await resolve(query, options)) ||
			(await get(path, query, headers, options));
	} catch (error) {
		response = {
			statusCode:
				error instanceof Error && "httpStatusCode" in error
					? (error as Error & { httpStatusCode: number }).httpStatusCode
					: 500,
			body: JSON.stringify({
				error: error instanceof Error ? error.message : "",
			}),
		};
	}

	return {
		...response,
		headers: {
			...response.headers,
			"X-Robots-Tag": "noindex, nofollow",
		},
	};
};