import { it, expect, vi, beforeAll, afterAll } from "vitest";
import * as mswNode from "msw/node";

// @ts-expect-error - 11ty does not provide any sort of type definition
import { EleventyServerlessBundlerPlugin } from "@11ty/eleventy";
import nodeFetch from "node-fetch";
import * as prismic from "@prismicio/client";

import { createMockQueryHandler } from "./__testutils__/createMockQueryHandler";
import { createMockRepositoryHandler } from "./__testutils__/createMockRepositoryHandler";
import { eleventyConfig } from "./__fixtures__/eleventyConfig";

import { pluginPrismic } from "../src";

const repositoryName = "pluginPrismic-test-ts";

const server = mswNode.setupServer(
	createMockRepositoryHandler(repositoryName),
	createMockQueryHandler(repositoryName),
);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

it("injects documents from repository name", () => {
	const addGlobalDataSpy = vi.spyOn(eleventyConfig, "addGlobalData");

	pluginPrismic(eleventyConfig, {
		endpoint: repositoryName,
	});

	expect(addGlobalDataSpy).toHaveBeenCalled();
	expect(addGlobalDataSpy).toHaveBeenNthCalledWith(
		1,
		"prismic",
		expect.any(Function),
	);

	vi.restoreAllMocks();
});

it("injects documents from API endpoint", () => {
	const addGlobalDataSpy = vi.spyOn(eleventyConfig, "addGlobalData");

	pluginPrismic(eleventyConfig, {
		endpoint: repositoryName,
	});

	expect(addGlobalDataSpy).toHaveBeenCalled();
	expect(addGlobalDataSpy).toHaveBeenNthCalledWith(
		1,
		"prismic",
		expect.any(Function),
	);

	vi.restoreAllMocks();
});

it("injects documents from client instance", async () => {
	const client = prismic.createClient(repositoryName, {
		fetch: nodeFetch,
	});
	const dangerouslyGetAllSpy = vi.spyOn(client, "dangerouslyGetAll");
	const addGlobalDataSpy = vi.spyOn(eleventyConfig, "addGlobalData");

	pluginPrismic(eleventyConfig, {
		client,
	});

	await new Promise((res) => {
		setTimeout(() => {
			expect(dangerouslyGetAllSpy).toHaveBeenCalledOnce();
			expect(addGlobalDataSpy).toHaveBeenCalled();
			expect(addGlobalDataSpy).toHaveBeenNthCalledWith(
				1,
				"prismic",
				expect.any(Function),
			);
			res(null);
		}, 200);
	});

	expect.assertions(3);
});

it("sets up preview when enabled", async () => {
	const addPluginSpy = vi.spyOn(eleventyConfig, "addPlugin");

	const options = {
		endpoint: repositoryName,
		preview: {
			name: "preview",
		},
	};
	pluginPrismic(eleventyConfig, options);

	expect(addPluginSpy).toHaveBeenCalled();
	expect(addPluginSpy).toHaveBeenCalledWith(
		EleventyServerlessBundlerPlugin,
		options.preview,
	);
});

it("doesn't set up preview when not enabled", async () => {
	const addPluginSpy = vi.spyOn(eleventyConfig, "addPlugin");

	const options = {
		endpoint: repositoryName,
	};
	pluginPrismic(eleventyConfig, options);

	expect(addPluginSpy).not.toHaveBeenCalled();
});

it("injects shortcodes", () => {
	const addShortcodeSpy = vi.spyOn(eleventyConfig, "addShortcode");
	const addPairedShortcodeSpy = vi.spyOn(eleventyConfig, "addPairedShortcode");

	pluginPrismic(eleventyConfig);

	expect(addShortcodeSpy).toHaveBeenCalled();
	expect(addPairedShortcodeSpy).toHaveBeenCalled();
});

it("injects shortcodes with namespace", () => {
	const addShortcodeSpy = vi.spyOn(eleventyConfig, "addShortcode");
	const addPairedShortcodeSpy = vi.spyOn(eleventyConfig, "addPairedShortcode");
	const addHelperShortcodeSpy = vi.spyOn(eleventyConfig, "addGlobalData");

	const namespace = "prismic";

	pluginPrismic(eleventyConfig, {
		shortcodesNamespace: namespace,
	});

	expect(addShortcodeSpy).toHaveBeenCalled();
	expect(addPairedShortcodeSpy).toHaveBeenCalled();
	expect(addHelperShortcodeSpy).toHaveBeenCalled();

	expect(
		addShortcodeSpy.mock.calls.every((args) => args[0].startsWith(namespace)),
	).toBe(true);
	expect(
		addPairedShortcodeSpy.mock.calls.every((args) =>
			args[0].startsWith(namespace),
		),
	).toBe(true);
	expect(
		addHelperShortcodeSpy.mock.calls.every((args) =>
			args[0].startsWith(namespace),
		),
	).toBe(true);
});

it("injects shortcodes with provided injectors", () => {
	const shortcodesInjector = vi.fn();
	const shortcodesPairedInjector = vi.fn();
	const shortcodesHelperInjector = vi.fn();

	pluginPrismic(eleventyConfig, {
		shortcodesInjector,
		shortcodesPairedInjector,
		shortcodesHelperInjector,
	});

	expect(shortcodesInjector).toHaveBeenCalled();
	expect(shortcodesPairedInjector).toHaveBeenCalled();
	expect(shortcodesHelperInjector).toHaveBeenCalled();
});

it("doesn't inject shortcodes when disabled", () => {
	const addShortcodeSpy = vi.spyOn(eleventyConfig, "addShortcode");
	const addPairedShortcodeSpy = vi.spyOn(eleventyConfig, "addPairedShortcode");
	const addHelperShortcodeSpy = vi.spyOn(eleventyConfig, "addGlobalData");

	pluginPrismic(eleventyConfig, {
		injectShortcodes: false,
	});

	expect(addShortcodeSpy).not.toHaveBeenCalled();
	expect(addPairedShortcodeSpy).not.toHaveBeenCalled();
	expect(addHelperShortcodeSpy).not.toHaveBeenCalled();
});
