import test from "ava";

import { asImageWidthSrcSet } from "../src";

const imageField = {
	dimensions: {
		width: 10,
		height: 10,
	},
	alt: "foo",
	copyright: "bar",
	url: "https://example.com/",
};

test("returns `srcset` attribute value from image field", (t) => {
	t.is(
		asImageWidthSrcSet()(imageField),
		"https://example.com/?width=640 640w, https://example.com/?width=828 828w, https://example.com/?width=1200 1200w, https://example.com/?width=2048 2048w, https://example.com/?width=3840 3840w",
	);
});

test("returns `srcset` attribute value from image field with specified widths", (t) => {
	t.is(
		asImageWidthSrcSet()(imageField, { widths: [100, 200, 300] }),
		"https://example.com/?width=100 100w, https://example.com/?width=200 200w, https://example.com/?width=300 300w",
	);
});

test("returns `srcset` attribute value from image field with imgix parameters", (t) => {
	t.is(
		asImageWidthSrcSet()(imageField, { sat: 100 }),
		"https://example.com/?sat=100&width=640 640w, https://example.com/?sat=100&width=828 828w, https://example.com/?sat=100&width=1200 1200w, https://example.com/?sat=100&width=2048 2048w, https://example.com/?sat=100&width=3840 3840w",
	);
});

test("returns an empty string when image field is empty", (t) => {
	t.is(asImageWidthSrcSet()({}), "");
});
