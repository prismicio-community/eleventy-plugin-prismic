import test from "ava";

import { asDate } from "../src";

test("returns formatted date", (t) => {
	t.is("05/12/2021", asDate()("2021-05-12"));
	t.is("05/12/2021", asDate()("2021-05-11T22:00:00+0000"));
});

test("returns formatted date using given date format", (t) => {
	t.is("05/2021", asDate()("2021-05-12", "MM/YYYY"));
	t.is("05/2021", asDate()("2021-05-11T22:00:00+0000", "MM/YYYY"));
});

test("returns invalid if date is not valid", (t) => {
	t.is("invalid", asDate()(""));
});
