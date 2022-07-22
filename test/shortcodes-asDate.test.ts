import { it, expect } from "vitest";

import { asDate } from "../src";

it("returns formatted date", () => {
	expect(asDate()("2021-05-12")).toBe("05/12/2021");
	expect(asDate()("2021-05-12T12:00:00+0000")).toBe("05/12/2021");
});

it("returns formatted date using given date format", () => {
	expect(asDate()("2021-05-12", "MM/YYYY")).toBe("05/2021");
	expect(asDate()("2021-05-12T12:00:00+0000", "MM/YYYY")).toBe("05/2021");
});

it("returns invalid if date is not valid", () => {
	// @ts-expect-error - testing invalid input
	expect(asDate()("")).toBe("invalid");
});
