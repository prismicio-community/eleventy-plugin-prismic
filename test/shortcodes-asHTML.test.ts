import test from "ava";

import { richTextFixture } from "./__fixtures__/richText";

import { asHTML } from "../src";

test("returns serialized value from rich text field", (t) => {
	t.snapshot(asHTML()(richTextFixture.en));
});
