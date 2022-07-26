import { it, expect, vi } from "vitest";

import { createDocument } from "./__testutils__/createDocument";

import { injectPairedShortcodes } from "../src";

const repositoryName = "pairedShortcodes-test-ts";

it("injects paired shorcodes", () => {
	const injector = vi.fn();

	injectPairedShortcodes("", injector);

	expect(injector).toHaveBeenCalled();
});

it("injects paired shorcodes with namespace", () => {
	const namespace = "prismic";

	const injector = vi.fn();

	injectPairedShortcodes(namespace, injector, {
		shortcodesNamespace: namespace,
	});

	expect(
		injector.mock.calls.every((args) => args[0].startsWith(namespace)),
	).toBe(true);
});

it("injects link paired shorcodes with internal prefix on 11ty Serverless", () => {
	const internalPrefix = "/preview";

	const injector = vi.fn();

	process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW = "true";

	injectPairedShortcodes("", injector, {
		endpoint: repositoryName,
		preview: { name: "preview" },
	});

	expect(
		injector.mock.calls.some((args) => {
			try {
				return args[1](
					"testSlots",
					createDocument({ uid: "foo", url: "/bar" }),
				).includes(internalPrefix);
			} catch (error) {
				return false;
			}
		}),
	).toBe(true);

	delete process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW;
});
