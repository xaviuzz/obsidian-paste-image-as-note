import { App, PluginSettingTab, Setting } from 'obsidian';
import PasteImagePlugin from '../main';

export class SettingsTab extends PluginSettingTab {
	plugin: PasteImagePlugin;

	constructor(app: App, plugin: PasteImagePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		
		containerEl.createEl('h2', { text: 'Paste Image as Note Settings' });

		new Setting(containerEl)
			.setName('Image folder')
			.setDesc('Folder to save pasted images (leave empty for vault root)')
			.addText(text => text
				.setPlaceholder('images')
				.setValue(this.plugin.settings.imageFolder)
				.onChange(async (value: string) => {
					this.plugin.settings.imageFolder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Image notes folder')
			.setDesc('Folder to save image notes (leave empty for vault root)')
			.addText(text => text
				.setPlaceholder('notes')
				.setValue(this.plugin.settings.imageNotesFolder)
				.onChange(async (value: string) => {
					this.plugin.settings.imageNotesFolder = value;
					await this.plugin.saveSettings();
				}));
	}
}