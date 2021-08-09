import { LinkResolverFunction } from "@prismicio/helpers";

export const linkResolver: LinkResolverFunction = (doc) => `/${doc.uid}`;
