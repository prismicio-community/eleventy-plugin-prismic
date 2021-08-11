import test from "ava";

import { attributesToHtml } from "../src/lib/attributesToHTML";

test("outputs a class if only one provided", (t) => {
	t.is(attributesToHtml(["foo bar baz"]), ' class="foo bar baz"');
});

test("outputs attributes if an even number is provided", (t) => {
	t.is(attributesToHtml(["foo", "bar", "baz", "qux"]), ' foo="bar" baz="qux"');
});

test("outputs attributes and ignore last value if an odd number is provided", (t) => {
	t.is(
		attributesToHtml(["foo", "bar", "baz", "qux", "quux"]),
		' foo="bar" baz="qux"',
	);
});

test("outputs nothing if nothing is provided", (t) => {
	t.is(attributesToHtml([]), "");
});

test("appends provided object to attributes", (t) => {
	t.is(
		attributesToHtml(["foo", "bar"], { baz: "qux" }),
		' baz="qux" foo="bar"',
	);
});

test("ignores falsy values", (t) => {
	t.is(attributesToHtml(["foo", ""], { baz: null }), "");
});
