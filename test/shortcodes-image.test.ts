import test from "ava";

import { image } from "../src";

test("returns a valid image component", (t) => {
	t.is(
		image()({
			dimensions: {
				width: 10,
				height: 10,
			},
			alt: "foo",
			copyright: "bar",
			url: "baz",
		}),
		'<img src="baz" alt="foo" copyright="bar" />',
	);
});
