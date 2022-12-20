import { it, expect } from "vitest";

import * as prismic from "@prismicio/client";

import { isFilled } from "../src";

it("returns `isFilled` helpers from `@prismicio/helpers.isFilled` object", () => {
	expect(isFilled()()).toStrictEqual(prismic.isFilled);
});
