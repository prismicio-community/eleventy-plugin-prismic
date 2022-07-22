import { it, expect } from "vitest";

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

it("returns `srcset` attribute value from image field", () => {
	expect(asImageWidthSrcSet()(imageField)).toBe(
		"https://example.com/?width=640 640w, https://example.com/?width=828 828w, https://example.com/?width=1200 1200w, https://example.com/?width=2048 2048w, https://example.com/?width=3840 3840w",
	);
});

it("returns `srcset` attribute value from image field with specified widths", () => {
	expect(asImageWidthSrcSet()(imageField, { widths: [100, 200, 300] })).toBe(
		"https://example.com/?width=100 100w, https://example.com/?width=200 200w, https://example.com/?width=300 300w",
	);
});

it("returns `srcset` attribute value from image field with imgix parameters", () => {
	expect(asImageWidthSrcSet()(imageField, { sat: 100 })).toBe(
		"https://example.com/?sat=100&width=640 640w, https://example.com/?sat=100&width=828 828w, https://example.com/?sat=100&width=1200 1200w, https://example.com/?sat=100&width=2048 2048w, https://example.com/?sat=100&width=3840 3840w",
	);
});

it("returns an empty string when image field is empty", () => {
	expect(asImageWidthSrcSet()({})).toBe("");
});
