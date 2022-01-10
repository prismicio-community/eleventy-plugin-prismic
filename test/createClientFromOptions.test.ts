import test from "ava";

import { Client } from "@prismicio/client";

import { createClientFromOptions } from "../src";

const repositoryName = "createClientFromOptions-test-ts";

test("returns a Prismic client instance", (t) => {
	t.true(
		createClientFromOptions({ endpoint: repositoryName }) instanceof Client,
	);
});
