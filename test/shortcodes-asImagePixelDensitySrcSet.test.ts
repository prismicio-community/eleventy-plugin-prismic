import { it, expect } from "vitest";

import { asImagePixelDensitySrcSet } from "../src";

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
	expect(asImagePixelDensitySrcSet()(imageField)).toBe(
		"https://example.com/?dpr=1 1x, https://example.com/?dpr=2 2x, https://example.com/?dpr=3 3x",
	);
});

it("returns `srcset` attribute value from image field with specified widths", () => {
	expect(
		asImagePixelDensitySrcSet()(imageField, {
			pixelDensities: [1, 2],
		}),
	).toBe("https://example.com/?dpr=1 1x, https://example.com/?dpr=2 2x");
});

it("returns `srcset` attribute value from image field with imgix parameters", () => {
	expect(asImagePixelDensitySrcSet()(imageField, { sat: 100 })).toBe(
		"https://example.com/?sat=100&dpr=1 1x, https://example.com/?sat=100&dpr=2 2x, https://example.com/?sat=100&dpr=3 3x",
	);
});

it("returns an empty string when image field is empty", () => {
	expect(asImagePixelDensitySrcSet()({})).toBe("");
});
