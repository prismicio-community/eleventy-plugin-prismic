import * as prismic from "@prismicio/client";

export const linkResolver: prismic.LinkResolverFunction = (doc) =>
	`/${doc.uid}`;
