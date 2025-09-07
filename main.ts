import { Plugin } from 'obsidian';

interface PasteImageAsNoteSettings {
}

const DEFAULT_SETTINGS: PasteImageAsNoteSettings = {
}

export default class PasteImageAsNotePlugin extends Plugin {
	settings: PasteImageAsNoteSettings;

	async onload() {
		await this.loadSettings();
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}