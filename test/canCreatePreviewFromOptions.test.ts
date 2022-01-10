import test from "ava";

import { canCreatePreviewFromOptions } from "../src";

const repositoryName = "canCreatePreviewFromOptions-test-ts";

test("returns true for a preview capable options object", (t) => {
	t.true(
		canCreatePreviewFromOptions({
			endpoint: repositoryName,
			preview: { name: "preview" },
		}),
	);
});

test("returns false for a non preview capable options object", (t) => {
	t.false(canCreatePreviewFromOptions({}));
	t.false(canCreatePreviewFromOptions({ endpoint: repositoryName }));
});
