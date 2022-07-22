import { EleventyConfig } from "../../src/types";

export const eleventyConfig: Pick<
	EleventyConfig,
	"addPlugin" | "addGlobalData" | "addShortcode" | "addPairedShortcode"
> & { globalData: Record<string, unknown> } = {
	addPlugin<TOptions>(
		_plugin: (eleventyConfig: EleventyConfig, options?: TOptions) => void,
		_options?: TOptions,
	) {
		return;
	},

	/** @internal */
	globalData: {},

	addGlobalData(name, data) {
		if (typeof data === "function") {
			(this.globalData as Record<string, unknown>)[name] = data();
		} else {
			(this.globalData as Record<string, unknown>)[name] = data;
		}

		return this as unknown as EleventyConfig;
	},
	addShortcode(_name, _callback) {
		return;
	},
	addPairedShortcode(_name, _callback) {
		return;
	},
};
