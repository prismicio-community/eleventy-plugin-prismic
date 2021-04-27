// Might not be accurate but works well here
type EleventyConfig = { [key: string]: (...unknown) => void };

type EleventyShortcodeFunction = (
	name: string,
	handler: (...value: unknown) => string
) => void;

type EleventyPairedShortcodeFunction = (
	name: string,
	handler: (slort: string, ...value: unknown) => string
) => void;
