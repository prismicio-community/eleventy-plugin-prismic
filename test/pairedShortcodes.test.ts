import test from "ava";

import { createDocument } from "./__testutils__/createDocument";

import { linkResolver } from "./__testutils__/linkResolver";

import { link } from "../src";

const args = ["testSlots", { url: "/bar" }] as const;

test("returns link field resolved anchor tag", (t) => {
	t.is(
		`<a href="https://google.com">${args[0]}</a>`,
		link()(...args, {
			link_type: "Web",
			url: "https://google.com",
		}),
	);
});

test("returns link field resolved blank anchor tag", (t) => {
	t.is(
		`<a href="https://google.com" target="_blank" rel="noopener noreferrer">${args[0]}</a>`,
		link()(...args, {
			link_type: "Web",
			url: "https://google.com",
			target: "_blank",
		}),
	);
});

test("returns document resolved anchor tag", (t) => {
	t.is(
		`<a href="/foo">${args[0]}</a>`,
		link()(...args, createDocument({ url: "/foo" })),
	);
});

test("returns document resolved anchor tag using link resolver", (t) => {
	t.is(
		`<a href="/foo">${args[0]}</a>`,
		link(linkResolver)(...args, createDocument({ url: "/foo" })),
	);
});

test("returns document resolved anchor tag for current page", (t) => {
	t.is(
		`<a href="/bar" aria-current="page">${args[0]}</a>`,
		link()(...args, createDocument({ url: "/bar" })),
	);
});
