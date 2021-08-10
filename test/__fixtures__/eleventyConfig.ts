import { EleventyConfig } from "../../src/types";

export const eleventyConfig: EleventyConfig = {
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
