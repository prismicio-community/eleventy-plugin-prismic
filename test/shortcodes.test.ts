import test from "ava";
import * as sinon from "sinon";

import { injectShortcodes } from "../src";

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
