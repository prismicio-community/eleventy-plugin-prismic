import test from "ava";

import { asDate } from "../src";

test("returns formatted date", (t) => {
	t.is(asDate()("2021-05-12"), "05/12/2021");
	t.is(asDate()("2021-05-12T12:00:00+0000"), "05/12/2021");
});

test("returns formatted date using given date format", (t) => {
	t.is(asDate()("2021-05-12", "MM/YYYY"), "05/2021");
	t.is(asDate()("2021-05-12T12:00:00+0000", "MM/YYYY"), "05/2021");
});

test("returns invalid if date is not valid", (t) => {
	t.is(asDate()(""), "invalid");
});
