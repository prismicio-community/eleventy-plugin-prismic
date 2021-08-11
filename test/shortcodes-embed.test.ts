import test from "ava";

import { EmbedType } from "@prismicio/types";

import { embed } from "../src";

test("returns a valid embed component", (t) => {
	t.is(
		embed()({
			url: "foo",
			embed_url: "foo",
			type: EmbedType.Rich,
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
		}),
		`<div data-oembed="foo" data-oembed-type="${EmbedType.Rich}" data-oembed-provider="bar">baz</div>`,
	);
});
