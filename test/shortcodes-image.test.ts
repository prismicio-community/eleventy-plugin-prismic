import { ImageField } from "@prismicio/types";
import { it, expect } from "vitest";

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

it("returns a valid image tag", () => {
	expect(image()(imageField)).toBe(
		'<img alt="foo" src="https://example.com/" />',
	);
});

it("returns a valid image tag with an accessible default alt value", () => {
	expect(image()({ ...imageField, alt: null })).toBe(
		'<img alt="" src="https://example.com/" />',
	);
});

it("renders image field with provided alt value", () => {
	expect(image()({ ...imageField, alt: "foo" }, { alt: "bar" })).toBe(
		'<img alt="bar" src="https://example.com/" />',
	);
});

it("returns a valid image tag with class", () => {
	expect(image()(imageField, "foo")).toBe(
		'<img alt="foo" src="https://example.com/" class="foo" />',
	);
});

it("returns a valid image tag with attributes", () => {
	expect(image()(imageField, { foo: "bar", baz: "qux" })).toBe(
		'<img alt="foo" src="https://example.com/" foo="bar" baz="qux" />',
	);
});

it("returns a valid image tag with imgix URL parameters", () => {
	expect(image()(imageField, { imgixParams: { sat: 100 } })).toBe(
		'<img alt="foo" src="https://example.com/?sat=100" />',
	);
});

it("returns a valid image tag with width-based `srcset`", () => {
	expect(
		image()(imageField, { imgixParams: { sat: 100 }, widths: [100, 200, 300] }),
	).toBe(
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&width=100 100w, https://example.com/?sat=100&width=200 200w, https://example.com/?sat=100&width=300 300w" />',
	);
});

it("returns a valid image tag with thumbnails width-based `srcset`", () => {
	expect(
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
			{ imgixParams: { sat: 100 }, widths: "thumbnails" },
		),
	).toBe(
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&width=10 10w, https://example.com/?sat=100&width=100 100w" />',
	);
});

it("returns a valid image tag with defaults width-based `srcset`", () => {
	expect(
		image()(imageField, { imgixParams: { sat: 100 }, widths: "defaults" }),
	).toBe(
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&width=640 640w, https://example.com/?sat=100&width=828 828w, https://example.com/?sat=100&width=1200 1200w, https://example.com/?sat=100&width=2048 2048w, https://example.com/?sat=100&width=3840 3840w" />',
	);
});

it("returns a valid image tag with plugin defaults width-based `srcset`", () => {
	expect(
		image([400, 500, 600])(imageField, {
			imgixParams: { sat: 100 },
			widths: "defaults",
		}),
	).toBe(
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&width=400 400w, https://example.com/?sat=100&width=500 500w, https://example.com/?sat=100&width=600 600w" />',
	);
});

it("returns a valid image tag with pixel-density-based `srcset`", () => {
	expect(
		image()(imageField, { imgixParams: { sat: 100 }, pixelDensities: [1, 2] }),
	).toBe(
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&dpr=1 1x, https://example.com/?sat=100&dpr=2 2x" />',
	);
});

it("returns a valid image tag with defaults pixel-density-based `srcset`", () => {
	expect(
		image()(imageField, {
			imgixParams: { sat: 100 },
			pixelDensities: "defaults",
		}),
	).toBe(
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&dpr=1 1x, https://example.com/?sat=100&dpr=2 2x, https://example.com/?sat=100&dpr=3 3x" />',
	);
});

it("returns a valid image tag with plugin defaults pixel-density-based `srcset`", () => {
	expect(
		image(undefined, [3, 4])(imageField, {
			imgixParams: { sat: 100 },
			pixelDensities: "defaults",
		}),
	).toBe(
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&dpr=3 3x, https://example.com/?sat=100&dpr=4 4x" />',
	);
});

it("returns a valid image tag with width-based over pixel-density-based `srcset`", () => {
	expect(
		image(undefined, [3, 4])(imageField, {
			imgixParams: { sat: 100 },
			widths: "defaults",
			pixelDensities: "defaults",
		}),
	).toBe(
		'<img alt="foo" src="https://example.com/?sat=100" srcset="https://example.com/?sat=100&width=640 640w, https://example.com/?sat=100&width=828 828w, https://example.com/?sat=100&width=1200 1200w, https://example.com/?sat=100&width=2048 2048w, https://example.com/?sat=100&width=3840 3840w" />',
	);
});

it("returns a valid image tag from a partial image field", () => {
	expect(image()({})).toBe('<img alt="" />');
});
