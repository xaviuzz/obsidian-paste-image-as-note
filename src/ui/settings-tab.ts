import { App, PluginSettingTab } from 'obsidian';
import PasteImagePlugin from '../main';
import { SettingComponent } from './setting-component';
import { ImageFolderSetting } from './image-folder-setting';
import { ImageNotesFolderSetting } from './image-notes-folder-setting';

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

		const settings: SettingComponent[] = [
			new ImageFolderSetting(this.plugin, containerEl),
			new ImageNotesFolderSetting(this.plugin, containerEl)
		];

		settings.forEach(setting => setting.render());
	}
}