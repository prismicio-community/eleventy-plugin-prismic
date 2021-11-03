import test from "ava";

import { definePrismicPluginOptions } from "../src";

test("returns the same object", (t) => {
	const options = {
		endpoint: "my-repo",
	};

	t.deepEqual(definePrismicPluginOptions(options), options);
});
