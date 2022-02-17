import test from "ava";

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

test("returns `srcset` attribute value from image field", (t) => {
	t.is(
		asImagePixelDensitySrcSet()(imageField),
		"https://example.com/?dpr=1 1x, https://example.com/?dpr=2 2x, https://example.com/?dpr=3 3x",
	);
});

test("returns `srcset` attribute value from image field with specified widths", (t) => {
	t.is(
		asImagePixelDensitySrcSet()(imageField, {
			pixelDensities: [1, 2],
		}),
		"https://example.com/?dpr=1 1x, https://example.com/?dpr=2 2x",
	);
});

test("returns `srcset` attribute value from image field with imgix parameters", (t) => {
	t.is(
		asImagePixelDensitySrcSet()(imageField, { sat: 100 }),
		"https://example.com/?sat=100&dpr=1 1x, https://example.com/?sat=100&dpr=2 2x, https://example.com/?sat=100&dpr=3 3x",
	);
});

test("returns an empty string when image field is empty", (t) => {
	t.is(asImagePixelDensitySrcSet()({}), "");
});
