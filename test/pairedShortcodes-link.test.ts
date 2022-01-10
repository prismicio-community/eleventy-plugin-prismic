import test from "ava";

import { createDocument } from "./__testutils__/createDocument";

import { linkResolver } from "./__testutils__/linkResolver";

import { link } from "../src";

const args = ["testSlots", { url: "/bar" }] as const;

test("returns link field resolved anchor tag", (t) => {
	t.is(
		link()(...args, {
			link_type: "Web",
			url: "https://google.com",
		}),
		`<a href="https://google.com">${args[0]}</a>`,
	);
});

test("returns link field resolved targetted anchor tag", (t) => {
	t.is(
		link()(...args, {
			link_type: "Web",
			url: "https://google.com",
			target: "_blank",
		}),
		`<a href="https://google.com" target="_blank" rel="noopener noreferrer">${args[0]}</a>`,
	);

	t.is(
		link()(...args, {
			link_type: "Web",
			url: "https://google.com",
			target: "something",
		}),
		`<a href="https://google.com" target="something">${args[0]}</a>`,
	);
});

test("uses provided blank target rel attribute", (t) => {
	t.is(
		link(undefined, "noopener")(...args, {
			link_type: "Web",
			url: "https://google.com",
			target: "_blank",
		}),
		`<a href="https://google.com" target="_blank" rel="noopener">${args[0]}</a>`,
	);
});

test("returns document resolved anchor tag", (t) => {
	t.is(
		link()(...args, createDocument({ url: "/foo" })),
		`<a href="/foo">${args[0]}</a>`,
	);
});

test("returns document resolved anchor tag using link resolver", (t) => {
	t.is(
		link(linkResolver)(...args, createDocument({ uid: "foo", url: "/bar" })),
		`<a href="/foo">${args[0]}</a>`,
	);
});

test("returns an empty anchor tag when link resolver is required but not provided", (t) => {
	t.is(link()(...args, createDocument()), `<a>${args[0]}</a>`);
});

test("uses provided internal prefix for internal links", (t) => {
	t.is(
		link(
			linkResolver,
			undefined,
			"/preview",
		)(...args, createDocument({ uid: "foo", url: "/bar" })),
		`<a href="/preview/foo">${args[0]}</a>`,
	);
});

test("doesn't use provided internal prefix for external links", (t) => {
	t.is(
		link(
			linkResolver,
			undefined,
			"/preview",
		)(...args, {
			link_type: "Web",
			url: "https://google.com",
		}),
		`<a href="https://google.com">${args[0]}</a>`,
	);
});

test("returns document resolved anchor tag for current page", (t) => {
	t.is(
		link()(...args, createDocument({ url: "/bar" })),
		`<a href="/bar" aria-current="page">${args[0]}</a>`,
	);
});
