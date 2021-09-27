import test from "ava";
import * as mswNode from "msw/node";
import * as sinon from "sinon";

import { createClient, getEndpoint } from "@prismicio/client";

import { createMockQueryHandler } from "./__testutils__/createMockQueryHandler";
import { createMockRepositoryHandler } from "./__testutils__/createMockRepositoryHandler";
import { eleventyConfig } from "./__fixtures__/eleventyConfig";

import { pluginPrismic } from "../src";
import { EleventyConfig } from "../src/types";

const repositoryName = "pluginPrismic.test.ts";

const server = mswNode.setupServer(
	createMockRepositoryHandler(repositoryName),
	createMockQueryHandler(repositoryName),
);
test.before(() => server.listen({ onUnhandledRequest: "error" }));
test.after(() => server.close());

let spiedEleventyConfig: sinon.SinonSpiedInstance<EleventyConfig>;
test.beforeEach(() => {
	spiedEleventyConfig = sinon.spy(eleventyConfig);
});
test.afterEach.always(() => {
	sinon.restore();
});

test.serial("injects documents from repository name", (t) => {
	pluginPrismic(spiedEleventyConfig, {
		endpoint: repositoryName,
	});

	t.true(spiedEleventyConfig.addGlobalData.calledOnce);
});

test.serial("injects documents from API endpoint", (t) => {
	pluginPrismic(spiedEleventyConfig, {
		endpoint: getEndpoint(repositoryName),
	});

	t.true(spiedEleventyConfig.addGlobalData.calledOnce);
});

test.serial("injects documents from client instance", async (t) => {
	const client = createClient(getEndpoint(repositoryName), {
		fetch: (...args) =>
			import("node-fetch").then(({ default: fetch }) => fetch(...args)),
	});
	const spiedClient = sinon.spy(client);

	pluginPrismic(spiedEleventyConfig, {
		client,
	});

	await new Promise((res) => {
		setTimeout(() => {
			t.true(spiedClient.getAll.calledOnce);
			t.true(spiedEleventyConfig.addGlobalData.calledOnce);
			res(null);
		}, 200);
	});
});

test.serial("injects shortcodes", (t) => {
	pluginPrismic(spiedEleventyConfig);

	t.true(spiedEleventyConfig.addShortcode.called);
	t.true(spiedEleventyConfig.addPairedShortcode.called);
});

test.serial("injects shortcodes with namespace", (t) => {
	const namespace = "prismic";

	pluginPrismic(spiedEleventyConfig, {
		shortcodesNamespace: namespace,
	});

	t.true(spiedEleventyConfig.addShortcode.called);
	t.true(spiedEleventyConfig.addPairedShortcode.called);

	t.true(
		spiedEleventyConfig.addShortcode.args.every((args) =>
			args[0].startsWith(namespace),
		),
	);
	t.true(
		spiedEleventyConfig.addPairedShortcode.args.every((args) =>
			args[0].startsWith(namespace),
		),
	);
});

test.serial("injects shortcodes with provided injectors", (t) => {
	const shortcodesInjector = sinon.spy();
	const shortcodesPairedInjector = sinon.spy();

	pluginPrismic(spiedEleventyConfig, {
		shortcodesInjector,
		shortcodesPairedInjector,
	});

	t.true(shortcodesInjector.called);
	t.true(shortcodesPairedInjector.called);
});

test.serial("doesn't inject shortcodes when disabled", (t) => {
	pluginPrismic(spiedEleventyConfig, {
		injectShortcodes: false,
	});

	t.false(spiedEleventyConfig.addShortcode.called);
	t.false(spiedEleventyConfig.addPairedShortcode.called);
});
