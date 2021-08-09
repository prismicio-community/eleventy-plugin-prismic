/**
 * Determines if a URL is external
 *
 * @param url - The url to check
 *
 * @returns `true` if the url is external, `false` otherwise
 *
 * @see Regex101 expression: {@link https://regex101.com/r/GT2cl7/1}
 */
export const isExternal = (url: string): boolean =>
	/^(https?:)?\/\//gim.test(url);
