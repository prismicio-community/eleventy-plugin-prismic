import { it, expect } from "vitest";

import { toolbar } from "../src";

const repositoryName = "shortcodes-toolbar-test-ts";

it("doesn't inject the toolbar when not running on 11ty Serverless", () => {
	expect(toolbar(repositoryName, "preview")()).toBe("");
});

it("Injects the toolbar when running on 11ty Serverless", () => {
	process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW = "true";

	expect(toolbar(repositoryName, "preview")()).toMatchInlineSnapshot(`
		"<script async defer src=\\"https://static.cdn.prismic.io/prismic.js?new=true&repo=shortcodes-toolbar-test-ts\\"></script>
		<script>window.addEventListener(\\"prismicPreviewEnd\\", (event) => {
			event.preventDefault();
			window.location.replace(window.location.pathname.replace(/^\\\\/preview/g, \\"\\"));
		});</script>"
	`);

	delete process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW;
});
