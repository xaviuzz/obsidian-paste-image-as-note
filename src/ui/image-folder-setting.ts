import { Setting } from 'obsidian';
import { SettingComponent } from './setting-component';

export class ImageFolderSetting extends SettingComponent {
	render(): void {
		new Setting(this.containerEl)
			.setName('Image folder')
			.setDesc('Folder to save pasted images (leave empty for vault root)')
			.addText(text => text
				.setPlaceholder('images')
				.setValue(this.plugin.settings.imageFolder)
				.onChange(async (value: string) => {
					this.plugin.settings.imageFolder = value;
					await this.plugin.saveSettings();
				}));
	}
}