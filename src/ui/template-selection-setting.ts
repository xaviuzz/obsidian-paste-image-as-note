import { Setting } from 'obsidian';
import PasteImagePlugin from '../main';
import { SettingComponent } from './setting-component';

export class TemplateSelectionSetting extends SettingComponent {
	constructor(plugin: PasteImagePlugin, containerEl: HTMLElement) {
		super(plugin, containerEl);
	}

	async render(): Promise<void> {
		const options: Record<string, string> = await this.getTemplateOptions();

		new Setting(this.containerEl)
			.setName('Template for image notes')
			.setDesc('Select a template to use when creating image notes')
			.addDropdown((dropdown) => dropdown
				.addOptions(options)
				.setValue(this.plugin.settings.templateFile)
				.onChange(async (value: string) => {
					this.plugin.settings.templateFile = value;
					await this.plugin.saveSettings();
				})
			);
	}

	private async getTemplateOptions(): Promise<Record<string, string>> {
		return await this.plugin.vaultService.getTemplateOptions();
	}
}
