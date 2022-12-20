import * as prismic from "@prismicio/client";

import enRichTextJSON from "./enRichText.json";

export const richTextFixture = {
	en: enRichTextJSON as prismic.RichTextField,
};
