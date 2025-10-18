import { Setting } from 'obsidian';
import { SettingComponent } from './setting-component';

export class AssetPropertyToggleSetting extends SettingComponent {
	render(): void {
		new Setting(this.containerEl)
			.setName('Include asset property in frontmatter')
			.setDesc('Add frontmatter property "asset" with link to image file')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeAssetProperty)
				.onChange(async (value: boolean) => {
					this.plugin.settings.includeAssetProperty = value;
					await this.plugin.saveSettings();
				}));
	}
}
