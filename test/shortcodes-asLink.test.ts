import test from "ava";

import { createDocument } from "./__testutils__/createDocument";

import { linkResolver } from "./__testutils__/linkResolver";

import { asLink } from "../src";

test("returns link field resolved URL", (t) => {
	t.is(
		"https://google.com",
		asLink()({
			link_type: "Web",
			url: "https://google.com",
		}),
	);
	t.is("", asLink()({ link_type: "Any" }));
});

test("returns document resolved URL", (t) => {
	t.is("/foo", asLink()(createDocument({ url: "/foo" })));
	t.is("", asLink()(createDocument()));
});

test("returns document resolved URL using link resolver", (t) => {
	t.is("/foo", asLink(linkResolver)(createDocument({ url: "/foo" })));
});
