import * as msw from "msw";

import { PrismicDocument } from "@prismicio/types";

import { createQueryResponse } from "./createQueryResponse";

export const createMockQueryHandler = (
	repositoryName: string,
	docs: PrismicDocument[] = [],
): msw.RestHandler => {
	const endpoint = `https://${repositoryName}.cdn.prismic.io/api/v2/documents/search`;

	return msw.rest.get(endpoint, (req, res, ctx) => {
		const lang = req.url.searchParams.get("lang") || "en-us";

		return res(
			ctx.json(
				createQueryResponse(
					lang === "*" ? docs : docs.filter((doc) => doc.lang === lang),
				),
			),
		);
	});
};
