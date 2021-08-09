import { Ref } from "@prismicio/client";

export const createRef = (
	isMasterRef = false,
	overrides?: Partial<Ref>,
): Ref => {
	const id = Math.random().toString();
	const ref = Math.random().toString();
	const label = Math.random().toString();

	return {
		id,
		ref,
		label,
		isMasterRef,
		...overrides,
	};
};
