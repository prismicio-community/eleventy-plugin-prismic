import { it, expect } from "vitest";

import { asImageSrc } from "../src";

const imageField = {
	dimensions: {
		width: 10,
		height: 10,
	},
	alt: "foo",
	copyright: "bar",
	url: "https://example.com/",
};

it("returns `src` attribute value from image field", () => {
	expect(asImageSrc()(imageField)).toBe("https://example.com/");
});

it("returns `src` attribute value from image field with imgix parameters", () => {
	expect(asImageSrc()(imageField, { sat: 100 })).toBe(
		"https://example.com/?sat=100",
	);
});

it("returns an empty string when image field is empty", () => {
	expect(asImageSrc()({})).toBe("");
});
