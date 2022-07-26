import { it, expect, vi } from "vitest";

import { injectHelperShortcodes } from "../src";

it("injects helper shorcodes", () => {
	const injector = vi.fn();

	injectHelperShortcodes("", injector);

	expect(injector).toHaveBeenCalled();
});

it("injects helper shorcodes with namespace", () => {
	const namespace = "prismic";

	const injector = vi.fn();

	injectHelperShortcodes(namespace, injector, {
		shortcodesNamespace: namespace,
	});

	expect(
		injector.mock.calls.every((args) => args[0].startsWith(namespace)),
	).toBe(true);
});
