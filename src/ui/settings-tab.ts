import { App, PluginSettingTab } from 'obsidian';
import PasteImagePlugin from '../main';
import { SettingComponent } from './setting-component';
import { ImageFolderSetting } from './image-folder-setting';
import { ImageNotesFolderSetting } from './image-notes-folder-setting';
import { TemplateSelectionSetting } from './template-selection-setting';
import { PreviewModalToggleSetting } from './preview-modal-toggle-setting';
import { AssetPropertyToggleSetting } from './asset-property-toggle-setting';


export class SettingsTab extends PluginSettingTab {
	plugin: PasteImagePlugin;

	constructor(app: App, plugin: PasteImagePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	async display(): Promise<void> {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Paste Image as Note Settings' });

		const settings: SettingComponent[] = [
			new ImageFolderSetting(this.plugin, containerEl),
			new ImageNotesFolderSetting(this.plugin, containerEl),
			new TemplateSelectionSetting(this.plugin, containerEl),
			new PreviewModalToggleSetting(this.plugin, containerEl),
			new AssetPropertyToggleSetting(this.plugin, containerEl)
		];

		for (const setting of settings) {
			await setting.render();
		}
	}
}