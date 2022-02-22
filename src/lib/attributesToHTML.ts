/**
 * Transforms an attribute map to an HTML string
 *
 * @param attributes - Attribute map
 *
 * @returns Truthy (and `0`) attributes as an HTML string
 */
export const attributesToHTML = (
	attributes: Record<string, string | number | null | undefined>,
): string => {
	const attributesArray = Object.entries(attributes)
		// Keep attributes with a value of `0`
		.filter(([key, value]) => {
			switch (key) {
				case "alt":
					return value != null;

				default:
					return !!value || typeof value === "number";
			}
		})
		.map(([key, value]) => `${key}="${value}"`);

	return attributesArray.length ? ` ${attributesArray.join(" ")}` : "";
};
