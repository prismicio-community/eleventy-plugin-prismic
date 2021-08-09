import test from "ava";

import { richTextFixture } from "./__fixtures__/richText";

import { asText } from "../src";

test("returns plain text value from rich text field", (t) => {
	t.snapshot(asText()(richTextFixture.en));
});
