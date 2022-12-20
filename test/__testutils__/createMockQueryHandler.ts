import * as msw from "msw";

import * as prismic from "@prismicio/client";

import { createQueryResponse } from "./createQueryResponse";

export const createMockQueryHandler = (
	repositoryName: string,
	docs: prismic.PrismicDocument[] = [],
): msw.RestHandler => {
	const endpoint = `https://${repositoryName}.cdn.prismic.io/api/v2/documents/search`;

	return msw.rest.get(endpoint, (req, res, ctx) => {
		let responseDocs = docs;

		const lang = req.url.searchParams.get("lang") || "en-us";
		if (lang !== "*") {
			responseDocs = responseDocs.filter((doc) => doc.lang === lang);
		}

		const q = req.url.searchParams.get("q");
		if (q?.startsWith("[[any(document.type")) {
			const types: string[] = JSON.parse(
				q.replace("[[any(document.type, ", "").replace(")]]", ""),
			);

			responseDocs = responseDocs.filter((doc) => types.includes(doc.type));
		}

		return res(ctx.json(createQueryResponse(responseDocs)));
	});
};
