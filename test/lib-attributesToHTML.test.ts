import { it, expect } from "vitest";

import { attributesToHTML } from "../src/lib/attributesToHTML";

it("outputs given attribute map as HTML", () => {
	expect(attributesToHTML({ foo: "bar", baz: "qux" })).toBe(
		' foo="bar" baz="qux"',
	);
});

it("outputs an empty string when map is empty", () => {
	expect(attributesToHTML({})).toBe("");
});

it("ignores nullish values", () => {
	expect(attributesToHTML({ foo: "bar", baz: null, qux: undefined })).toBe(
		' foo="bar"',
	);
});

it("doesn't consider `0` as a nullish value", () => {
	expect(attributesToHTML({ foo: "bar", baz: 0 })).toBe(' foo="bar" baz="0"');
});
