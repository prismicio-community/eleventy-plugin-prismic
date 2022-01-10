import test from "ava";
import * as sinon from "sinon";

import { createDocument } from "./__testutils__/createDocument";

import { injectPairedShortcodes } from "../src";

const repositoryName = "pairedShortcodes-test-ts";

test.afterEach.always(() => {
	sinon.restore();
});

test.serial("injects paired shorcodes", (t) => {
	const injector = sinon.spy();

	injectPairedShortcodes(injector);

	t.true(injector.called);
});

test.serial("injects paired shorcodes with namespace", (t) => {
	const namespace = "prismic";

	const injector = sinon.spy();

	injectPairedShortcodes(injector, { shortcodesNamespace: namespace });

	t.true(injector.args.every((args) => args[0].startsWith(namespace)));
});

test.serial(
	"injects link paired shorcodes with internal prefix on 11ty Serverless",
	(t) => {
		const internalPrefix = "/preview";

		const injector = sinon.spy();

		process.env.ELEVENTY_SERVERLESS = "true";

		injectPairedShortcodes(injector, {
			endpoint: repositoryName,
			preview: { name: "preview" },
		});

		t.true(
			injector.args.some((args) => {
				try {
					return args[1](
						"testSlots",
						{ url: "/bar" },
						createDocument({ uid: "foo", url: "/bar" }),
					).includes(internalPrefix);
				} catch (error) {
					return false;
				}
			}),
		);

		delete process.env.ELEVENTY_SERVERLESS;
	},
);
