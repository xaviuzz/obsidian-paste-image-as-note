import { Setting } from 'obsidian';
import { SettingComponent } from './setting-component';

export class PreviewModalToggleSetting extends SettingComponent {
	render(): void {
		new Setting(this.containerEl)
			.setName('Show preview before creating note')
			.setDesc('Display image preview modal before creating the note (press Enter to confirm)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showPreviewModal)
				.onChange(async (value: boolean) => {
					this.plugin.settings.showPreviewModal = value;
					await this.plugin.saveSettings();
				}));
	}
}
