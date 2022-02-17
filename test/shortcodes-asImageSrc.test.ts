import test from "ava";

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

test("returns `src` attribute value from image field", (t) => {
	t.is(asImageSrc()(imageField), "https://example.com/");
});

test("returns `src` attribute value from image field with imgix parameters", (t) => {
	t.is(asImageSrc()(imageField, { sat: 100 }), "https://example.com/?sat=100");
});

test("returns an empty string when image field is empty", (t) => {
	t.is(asImageSrc()({}), "");
});
