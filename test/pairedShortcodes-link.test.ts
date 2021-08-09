import test from "ava";
import * as sinon from "sinon";

import { injectPairedShortcodes } from "../src";

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
