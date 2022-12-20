import { it, expect } from "vitest";

import * as prismic from "@prismicio/client";

import { embed } from "../src";

const embedField = {
	url: "foo",
	embed_url: "foo",
	type: prismic.OEmbedType.Link,
	version: "0",
	title: null,
	author_name: null,
	author_url: null,
	provider_name: "bar",
	cache_age: null,
	thumbnail_url: null,
	thumbnail_width: null,
	thumbnail_height: null,
	html: "baz",
};

it("returns a valid embed tag", () => {
	expect(embed()(embedField)).toBe(
		`<div data-oembed="foo" data-oembed-type="${prismic.OEmbedType.Link}" data-oembed-provider="bar">baz</div>`,
	);
});

it("returns a valid embed tag with specified wrapper", () => {
	expect(embed()(embedField, { wrapper: "blockquote" })).toBe(
		`<blockquote data-oembed="foo" data-oembed-type="${prismic.OEmbedType.Link}" data-oembed-provider="bar">baz</blockquote>`,
	);
});

it("returns a valid embed tag with class", () => {
	expect(embed()(embedField, "foo")).toBe(
		`<div data-oembed="foo" data-oembed-type="${prismic.OEmbedType.Link}" data-oembed-provider="bar" class="foo">baz</div>`,
	);
});

it("returns a valid embed tag with attributes", () => {
	expect(embed()(embedField, { foo: "bar", baz: "qux" })).toBe(
		`<div data-oembed="foo" data-oembed-type="${prismic.OEmbedType.Link}" data-oembed-provider="bar" foo="bar" baz="qux">baz</div>`,
	);
});
