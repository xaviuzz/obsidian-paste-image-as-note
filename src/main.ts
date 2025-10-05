import { Plugin } from 'obsidian';
import { Command, CommandDependencies } from './command';
import { ClipboardService } from './services/clipboard-service';
import { VaultService } from './services/vault-service';
import { NotificationService } from './services/notification-service';
import { EditorService } from './services/editor-service';
import { Settings, DEFAULT_SETTINGS } from './settings';
import { SettingsTab } from './ui/settings-tab';

export default class PasteImagePlugin extends Plugin {
	private command: Command;
	settings: Settings;

	async onload() {
		await this.loadSettings();
		this.initializeCommand();

		this.addCommand({
			id: 'paste-image-as-note',
			name: 'Paste image as note',
			callback: () => this.command.execute()
		});

		this.registerDomEvent(document, 'paste', (event: ClipboardEvent) => this.handlePasteEvent(event), { capture: true });

		this.addSettingTab(new SettingsTab(this.app, this));
	}

	private initializeCommand() {
		const services: CommandDependencies = {
			app: this.app,
			clipboardService: new ClipboardService(),
			vaultService: new VaultService(this.app, this.settings),
			notificationService: new NotificationService(),
			editorService: new EditorService(this.app),
			settings: this.settings
		};

		this.command = new Command(services);
	}

	private handlePasteEvent(event: ClipboardEvent): void {
		if (this.hasImage()) {
			event.preventDefault();
			event.stopPropagation();
			this.command.execute();
		}
	}

	private hasImage(): boolean {
		const clipboardService: ClipboardService = new ClipboardService();
		return clipboardService.hasImage();
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