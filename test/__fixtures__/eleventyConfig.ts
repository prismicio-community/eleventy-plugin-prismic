import { EleventyConfig } from "../../src/types";

export const eleventyConfig: EleventyConfig = {
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

		return this;
	},
	addShortcode(_name, _callback) {
		return;
	},
	addPairedShortcode(_name, _callback) {
		return;
	},
};
