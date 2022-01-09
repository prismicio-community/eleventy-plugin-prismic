/**
 * Determines if a URL is internal or external.
 *
 * @param url - The URL to check if internal or external
 *
 * @returns `true` if `url` is internal, `false` otherwise
 */
// TODO: This does not detect all relative URLs as internal, such as `about` or `./about`. This function assumes relative URLs start with a "/"`.
export const isInternalURL = (url: string): boolean => {
	/**
	 * @see Regex101 expression: {@link https://regex101.com/r/1y7iod/1}
	 */
	const isInternal = /^\/(?!\/)/.test(url);
	/**
	 * @see Regex101 expression: {@link https://regex101.com/r/RnUseS/1}
	 */
	const isSpecialLink = !isInternal && !/^https?:\/\//i.test(url);

	return isInternal && !isSpecialLink;
};
