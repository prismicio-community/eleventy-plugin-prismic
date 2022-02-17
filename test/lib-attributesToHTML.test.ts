import test from "ava";

import { attributesToHTML } from "../src/lib/attributesToHTML";

test("outputs given attribute map as HTML", (t) => {
	t.is(attributesToHTML({ foo: "bar", baz: "qux" }), ' foo="bar" baz="qux"');
});

test("outputs an empty string when map is empty", (t) => {
	t.is(attributesToHTML({}), "");
});

test("ignores nullish values", (t) => {
	t.is(
		attributesToHTML({ foo: "bar", baz: null, qux: undefined }),
		' foo="bar"',
	);
});

test("doesn't consider `0` as a nullish value", (t) => {
	t.is(attributesToHTML({ foo: "bar", baz: 0 }), ' foo="bar" baz="0"');
});
