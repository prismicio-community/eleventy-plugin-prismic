import { it, expect } from "vitest";

import { createDocument } from "./__testutils__/createDocument";

import { linkResolver } from "./__testutils__/linkResolver";

import { asLink } from "../src";

it("returns link field resolved URL", () => {
	expect(
		asLink()({
			link_type: "Web",
			url: "https://google.com",
		}),
	).toBe("https://google.com");
	expect(asLink()({ link_type: "Any" })).toBe("");
});

it("returns document resolved URL", () => {
	expect(asLink()(createDocument({ url: "/foo" }))).toBe("/foo");
	expect(asLink()(createDocument())).toBe("");
});

it("returns document resolved URL using link resolver", () => {
	expect(
		asLink(linkResolver)(createDocument({ uid: "foo", url: "/bar" })),
	).toBe("/foo");
});
