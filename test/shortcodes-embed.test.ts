import test from "ava";

import { OEmbedType } from "@prismicio/types";

import { embed } from "../src";

const embedField = {
	url: "foo",
	embed_url: "foo",
	type: OEmbedType.Link,
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

test("returns a valid embed tag", (t) => {
	t.is(
		embed()(embedField),
		`<div data-oembed="foo" data-oembed-type="${OEmbedType.Link}" data-oembed-provider="bar">baz</div>`,
	);
});

test("returns a valid embed tag with specified wrapper", (t) => {
	t.is(
		embed()(embedField, { wrapper: "blockquote" }),
		`<blockquote data-oembed="foo" data-oembed-type="${OEmbedType.Link}" data-oembed-provider="bar">baz</blockquote>`,
	);
});

test("returns a valid embed tag with class", (t) => {
	t.is(
		embed()(embedField, "foo"),
		`<div data-oembed="foo" data-oembed-type="${OEmbedType.Link}" data-oembed-provider="bar" class="foo">baz</div>`,
	);
});

test("returns a valid embed tag with attributes", (t) => {
	t.is(
		embed()(embedField, { foo: "bar", baz: "qux" }),
		`<div data-oembed="foo" data-oembed-type="${OEmbedType.Link}" data-oembed-provider="bar" foo="bar" baz="qux">baz</div>`,
	);
});
