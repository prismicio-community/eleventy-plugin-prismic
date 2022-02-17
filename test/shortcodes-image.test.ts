import { ImageField } from "@prismicio/types";
import test from "ava";

import { image } from "../src";

const imageField = {
	dimensions: {
		width: 10,
		height: 10,
	},
	alt: "foo",
	copyright: "bar",
	url: "https://example.com/",
};

test("returns a valid image tag", (t) => {
	t.is(image()(imageField), '<img alt="foo" src="https://example.com/" />');
});

test("returns a valid image tag with class", (t) => {
	t.is(
		image()(imageField, "foo"),
		'<img alt="foo" src="https://example.com/" class="foo" />',
	);
});

test("returns a valid image tag with attributes", (t) => {
	t.is(
		image()(imageField, { foo: "bar", baz: "qux" }),
		'<img alt="foo" src="https://example.com/" foo="bar" baz="qux" />',
	);
});

test("returns a valid image tag with imgix URL parameters", (t) => {
	t.is(
		image()(imageField, { imgixParams: { sat: 100 } }),
		'<img alt="foo" src="https://example.com/?sat=100" />',
	);
});

test("returns a valid image tag with width-based `srcset`", (t) => {
	t.is(
		image()(imageField, { imgixParams: { sat: 100 }, widths: [100, 200, 300] }),
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&width=100 100w, https://example.com/?sat=100&width=200 200w, https://example.com/?sat=100&width=300 300w" />',
	);
});

test("returns a valid image tag with auto width-based `srcset`", (t) => {
	t.is(
		image()(
			{
				...imageField,
				foo: {
					...imageField,
					dimensions: {
						width: 100,
						height: 100,
					},
				},
			} as ImageField<"foo">,
			{ imgixParams: { sat: 100 }, widths: "auto" },
		),
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&width=10 10w, https://example.com/?sat=100&width=100 100w" />',
	);
});

test("returns a valid image tag with defaults width-based `srcset`", (t) => {
	t.is(
		image()(imageField, { imgixParams: { sat: 100 }, widths: "defaults" }),
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&width=640 640w, https://example.com/?sat=100&width=828 828w, https://example.com/?sat=100&width=1200 1200w, https://example.com/?sat=100&width=2048 2048w, https://example.com/?sat=100&width=3840 3840w" />',
	);
});

test("returns a valid image tag with plugin defaults width-based `srcset`", (t) => {
	t.is(
		image([400, 500, 600])(imageField, {
			imgixParams: { sat: 100 },
			widths: "defaults",
		}),
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&width=400 400w, https://example.com/?sat=100&width=500 500w, https://example.com/?sat=100&width=600 600w" />',
	);
});

test("returns a valid image tag with pixel-density-based `srcset`", (t) => {
	t.is(
		image()(imageField, { imgixParams: { sat: 100 }, pixelDensities: [1, 2] }),
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&dpr=1 1x, https://example.com/?sat=100&dpr=2 2x" />',
	);
});

test("returns a valid image tag with defaults pixel-density-based `srcset`", (t) => {
	t.is(
		image()(imageField, {
			imgixParams: { sat: 100 },
			pixelDensities: "defaults",
		}),
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&dpr=1 1x, https://example.com/?sat=100&dpr=2 2x, https://example.com/?sat=100&dpr=3 3x" />',
	);
});

test("returns a valid image tag with plugin defaults pixel-density-based `srcset`", (t) => {
	t.is(
		image(undefined, [3, 4])(imageField, {
			imgixParams: { sat: 100 },
			pixelDensities: "defaults",
		}),
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&dpr=3 3x, https://example.com/?sat=100&dpr=4 4x" />',
	);
});

test("returns a valid image tag with width-based over pixel-density-based `srcset`", (t) => {
	t.is(
		image(undefined, [3, 4])(imageField, {
			imgixParams: { sat: 100 },
			widths: "defaults",
			pixelDensities: "defaults",
		}),
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&width=640 640w, https://example.com/?sat=100&width=828 828w, https://example.com/?sat=100&width=1200 1200w, https://example.com/?sat=100&width=2048 2048w, https://example.com/?sat=100&width=3840 3840w" />',
	);
});

test("returns a valid image tag from a partial image field", (t) => {
	t.is(image()({}), "<img />");
});
