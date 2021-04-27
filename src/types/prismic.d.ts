// Fields
type RichTextField = RichTextBlock[];

interface LinkFieldRaw extends Partial<LinkResolverDoc> {
	url?: string;
}

interface LinkField extends LinkFieldRaw {
	link_type?: string;
	_linkType?: string;
	linkType?: string;
	value?: { document: LinkFieldRaw; isBroken?: boolean };
	target?: string;
}

interface ImageField {
	url: string;
	alt?: string;
	copyright?: string;
}

interface EmbedField {
	html: string;
	embed_url?: string;
	type?: string;
	provider_name?: string;
}

// DOM
interface LinkResolverDoc {
	id: string;
	uid: string;
	type: string;
	tags: string[];
	lang: string;
	slug?: string;
	isBroken?: boolean;
}

type LinkResolver = (doc: LinkResolverDoc) => string;

interface RichTextSpan {
	start: number;
	end: number;
	type: string;
	text: string;
}

interface RichTextBlock {
	type: string;
	text: string;
	spans: RichTextSpan[];
}

type HtmlSerializer<T> = (
	type: string,
	element: RichTextBlock | RichTextSpan,
	text: string | null,
	children: T[],
	index: number
) => T | null;

// Prismic DOM
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
