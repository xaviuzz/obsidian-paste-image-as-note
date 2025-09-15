import { Setting } from 'obsidian';
import { SettingComponent } from './setting-component';

export class ImageNotesFolderSetting extends SettingComponent {
	render(): void {
		new Setting(this.containerEl)
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