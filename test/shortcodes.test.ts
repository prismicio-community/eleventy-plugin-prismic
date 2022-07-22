import { it, expect, vi } from "vitest";

import { createDocument } from "./__testutils__/createDocument";

import { injectShortcodes } from "../src";

const repositoryName = "shortcodes-test-ts";

it("injects shorcodes", () => {
	const injector = vi.fn();

	injectShortcodes(injector);

	expect(injector).toHaveBeenCalled();
});

it("injects shorcodes with namespace", () => {
	const namespace = "prismic";

	const injector = vi.fn();

	injectShortcodes(injector, { shortcodesNamespace: namespace });

	// @ts-expect-error - type is broken
	expect(injector.calls.every((args) => args[0].startsWith(namespace))).toBe(
		true,
	);
});

it("injects asLink shorcodes with internal prefix on 11ty Serverless", () => {
	const internalPrefix = "/preview";

	const injector = vi.fn();

	process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW = "true";

	injectShortcodes(injector, {
		endpoint: repositoryName,
		preview: { name: "preview" },
	});

	expect(
		// @ts-expect-error - type is broken
		injector.calls.some((args) => {
			try {
				return args[1](createDocument({ uid: "foo", url: "/bar" })).startsWith(
					internalPrefix,
				);
			} catch (error) {
				return false;
			}
		}),
	).toBe(true);

	delete process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW;
});
