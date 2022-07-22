import { it, expect } from "vitest";

import { definePrismicPluginOptions } from "../src";

it("returns the same object", () => {
	const options = {
		endpoint: "my-repo",
	};

	expect(definePrismicPluginOptions(options)).toStrictEqual(options);
});
