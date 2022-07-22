import { it, expect } from "vitest";

import { richTextFixture } from "./__fixtures__/richText";

import { asText } from "../src";

it("returns plain text value from rich text field", () => {
	expect(asText()(richTextFixture.en)).toMatchSnapshot();
});
