import * as msw from "msw";

import { createRepositoryResponse } from "./createRepositoryResponse";

export const createMockRepositoryHandler = (
	repositoryName: string,
	response = createRepositoryResponse(),
): msw.RestHandler => {
	const endpoint = `https://${repositoryName}.cdn.prismic.io/api/v2`;

	return msw.rest.get(endpoint, (req, res, ctx) => {
		return res(ctx.json(response));
	});
};
