import { it, expect } from "vitest";

import { canCreatePreviewFromOptions } from "../src";

const repositoryName = "canCreatePreviewFromOptions-test-ts";

it("returns true for a preview capable options object", () => {
	expect(
		canCreatePreviewFromOptions({
			endpoint: repositoryName,
			preview: { name: "preview" },
		}),
	).toBe(true);
});

it("returns false for a non preview capable options object", () => {
	expect(canCreatePreviewFromOptions({})).toBe(false);
	expect(canCreatePreviewFromOptions({ endpoint: repositoryName })).toBe(false);
});
