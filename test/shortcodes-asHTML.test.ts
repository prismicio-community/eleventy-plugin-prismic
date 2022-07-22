import { it, expect } from "vitest";

import { richTextFixture } from "./__fixtures__/richText";

import { asHTML } from "../src";

it("returns serialized value from rich text field", () => {
	expect(asHTML()(richTextFixture.en)).toMatchSnapshot();
});
