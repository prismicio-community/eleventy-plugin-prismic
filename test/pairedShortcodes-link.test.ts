import { it, expect } from "vitest";

import { createDocument } from "./__testutils__/createDocument";

import { linkResolver } from "./__testutils__/linkResolver";

import { link } from "../src";

const args = ["testSlots"] as const;
const context = { page: { url: "/bar" } };

it("returns link field resolved anchor tag", () => {
	expect(
		link().bind(context)(...args, {
			link_type: "Web",
			url: "https://google.com",
		}),
	).toBe(`<a href="https://google.com">${args[0]}</a>`);
});

it("returns link field resolved targetted anchor tag", () => {
	expect(
		link().bind(context)(...args, {
			link_type: "Web",
			url: "https://google.com",
			target: "_blank",
		}),
	).toBe(
		`<a href="https://google.com" target="_blank" rel="noopener noreferrer">${args[0]}</a>`,
	);

	expect(
		link().bind(context)(...args, {
			link_type: "Web",
			url: "https://google.com",
			target: "something",
		}),
	).toBe(`<a href="https://google.com" target="something">${args[0]}</a>`);
});

it("returns link field resolved anchor tag with class", () => {
	expect(
		link().bind(context)(
			...args,
			{
				link_type: "Web",
				url: "https://google.com",
			},
			"foo",
		),
	).toBe(`<a href="https://google.com" class="foo">${args[0]}</a>`);
});

it("returns link field resolved anchor tag with attributes", () => {
	expect(
		link().bind(context)(
			...args,
			{
				link_type: "Web",
				url: "https://google.com",
			},
			{ foo: "bar", baz: "qux" },
		),
	).toBe(`<a href="https://google.com" foo="bar" baz="qux">${args[0]}</a>`);
});

it("uses provided blank target rel attribute", () => {
	expect(
		link(undefined, "noopener").bind(context)(...args, {
			link_type: "Web",
			url: "https://google.com",
			target: "_blank",
		}),
	).toBe(
		`<a href="https://google.com" target="_blank" rel="noopener">${args[0]}</a>`,
	);
});

it("returns document resolved anchor tag", () => {
	expect(link().bind(context)(...args, createDocument({ url: "/foo" }))).toBe(
		`<a href="/foo">${args[0]}</a>`,
	);
});

it("returns document resolved anchor tag using link resolver", () => {
	expect(
		link(linkResolver).bind(context)(
			...args,
			createDocument({ uid: "foo", url: "/bar" }),
		),
	).toBe(`<a href="/foo">${args[0]}</a>`);
});

it("returns an empty anchor tag when link resolver is required but not provided", () => {
	expect(link().bind(context)(...args, createDocument()), `<a>${args[0]}</a>`);
});

it("uses provided internal prefix for internal links", () => {
	expect(
		link(linkResolver, undefined, "/preview").bind(context)(
			...args,
			createDocument({ uid: "foo", url: "/bar" }),
		),
	).toBe(`<a href="/preview/foo">${args[0]}</a>`);
});

it("doesn't use provided internal prefix for external links", () => {
	expect(
		link(linkResolver, undefined, "/preview").bind(context)(...args, {
			link_type: "Web",
			url: "https://google.com",
		}),
	).toBe(`<a href="https://google.com">${args[0]}</a>`);
});

it("returns document resolved anchor tag for current page using function context", () => {
	expect(link().bind(context)(...args, createDocument({ url: "/bar" }))).toBe(
		`<a href="/bar" aria-current="page">${args[0]}</a>`,
	);
});

it("returns document resolved anchor tag for current page preferring page options", () => {
	expect(
		link().bind(context)(...args, createDocument({ url: "/baz" }), {
			page: { url: "/baz" },
		}),
	).toBe(`<a href="/baz" aria-current="page">${args[0]}</a>`);
});

it("returns document resolved anchor tag ignoring current if context is not available", () => {
	expect(link().bind(undefined)(...args, createDocument({ url: "/bar" }))).toBe(
		`<a href="/bar">${args[0]}</a>`,
	);
});
