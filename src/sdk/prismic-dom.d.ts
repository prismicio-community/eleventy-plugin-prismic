declare module "prismic-dom" {
	type LinkResolver = import("../types").LinkResolver;
	type RichTextBlock = import("../types").RichTextBlock;
	type HtmlSerializer = import("../types").HtmlSerializer;

	const Link: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		url: (link?: any, linkResolver?: LinkResolver) => string;
	};

	function Date(date?: string): Date | null;

	interface Elements {
		heading1: "heading1";
		heading2: "heading2";
		heading3: "heading3";
		heading4: "heading4";
		heading5: "heading5";
		heading6: "heading6";
		paragraph: "paragraph";
		preformatted: "preformatted";
		strong: "strong";
		em: "em";
		listItem: "list-item";
		oListItem: "o-list-item";
		list: "group-list-item";
		oList: "group-o-list-item";
		image: "image";
		embed: "embed";
		hyperlink: "hyperlink";
		label: "label";
		span: "span";
	}
	const RichText: {
		asText: (richText: RichTextBlock[], joinString?: string) => string;
		asHtml: (
			richText: RichTextBlock[],
			linkResolver?: LinkResolver,
			htmlSerializer?: HtmlSerializer
		) => string;
		Elements: Elements;
	};
}
