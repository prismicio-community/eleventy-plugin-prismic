import test from "ava";

import { toolbar } from "../src";

const repositoryName = "shortcodes-toolbar-test-ts";

test.serial(
	"doesn't inject the toolbar when not running on 11ty Serverless",
	(t) => {
		t.is(toolbar(repositoryName, "preview")(), "");
	},
);

test.serial("Injects the toolbar when running on 11ty Serverless", (t) => {
	process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW = "true";

	t.snapshot(toolbar(repositoryName, "preview")());

	delete process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW;
});
