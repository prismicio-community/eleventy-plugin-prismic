import test from "ava";
import * as sinon from "sinon";

import { createDocument } from "./__testutils__/createDocument";

import { injectShortcodes } from "../src";

const repositoryName = "shortcodes-test-ts";

test.afterEach.always(() => {
	sinon.restore();
});

test.serial("injects shorcodes", (t) => {
	const injector = sinon.spy();

	injectShortcodes(injector);

	t.true(injector.called);
});

test.serial("injects shorcodes with namespace", (t) => {
	const namespace = "prismic";

	const injector = sinon.spy();

	injectShortcodes(injector, { shortcodesNamespace: namespace });

	t.true(injector.args.every((args) => args[0].startsWith(namespace)));
});

test.serial(
	"injects asLink shorcodes with internal prefix on 11ty Serverless",
	(t) => {
		const internalPrefix = "/preview";

		const injector = sinon.spy();

		process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW = "true";

		injectShortcodes(injector, {
			endpoint: repositoryName,
			preview: { name: "preview" },
		});

		t.true(
			injector.args.some((args) => {
				try {
					return args[1](
						createDocument({ uid: "foo", url: "/bar" }),
					).startsWith(internalPrefix);
				} catch (error) {
					return false;
				}
			}),
		);

		delete process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW;
	},
);
