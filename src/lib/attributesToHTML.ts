import { dPrismicShortcodes } from "./debug";

/**
 * Map attributes to an HTML string
 *
 * @param classOrAttributes - attributes array
 * @param attributes - attributes map
 *
 * @returns Truthy attributes as an HTML string
 */
export const attributesToHtml = (
	classOrAttributes: string[],
	attributes: Record<string, string | null | undefined> = {},
): string => {
	if (classOrAttributes.length === 1) {
		attributes.class = classOrAttributes[0];
	} else {
		for (let i = 0; i < classOrAttributes.length; i += 2) {
			if (classOrAttributes[i + 1]) {
				attributes[classOrAttributes[i]] = classOrAttributes[i + 1];
			}
		}

		// If not pair
		if (classOrAttributes.length % 2) {
			dPrismicShortcodes(
				"Expected argument `classOrAttributes` to contain a pair amount of items but received %o, dropping last one",
				classOrAttributes,
			);
		}
	}

	const attributesArray = Object.entries(attributes)
		.filter(([_, value]) => !!value)
		.map(([key, value]) => `${key}="${value}"`);

	return attributesArray.length ? ` ${attributesArray.join(" ")}` : "";
};
