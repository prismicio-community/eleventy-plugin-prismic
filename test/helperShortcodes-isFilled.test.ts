import { it, expect } from "vitest";

import * as prismicH from "@prismicio/helpers";

import { isFilled } from "../src";

it("returns `isFilled` helpers from `@prismicio/helpers.isFilled` object", () => {
	expect(isFilled()()).toStrictEqual(prismicH.isFilled);
});
