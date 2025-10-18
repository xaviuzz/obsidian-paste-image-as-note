import { Plugin, TFile, TAbstractFile, Menu } from 'obsidian';
import { Command, CommandDependencies } from './command';
import { FileContextCommand, FileContextCommandDependencies } from './file-context-command';
import { ClipboardService } from './services/clipboard-service';
import { VaultService } from './services/vault-service';
import { NotificationService } from './services/notification-service';
import { EditorService } from './services/editor-service';
import { FileService } from './services/file-service';
import { Settings, DEFAULT_SETTINGS } from './settings';
import { SettingsTab } from './ui/settings-tab';

export default class PasteImagePlugin extends Plugin {
	private command: Command;
	private fileContextCommand: FileContextCommand;
	private fileService: FileService;
	settings: Settings;

	async onload() {
		await this.loadSettings();
		this.initializeServices();

		this.addCommand({
			id: 'paste-image-as-note',
			name: 'Paste image as note',
			callback: () => this.command.execute()
		});

		this.registerDomEvent(document, 'paste', (event: ClipboardEvent) => this.handlePasteEvent(event), { capture: true });

		this.registerEvent(
			this.app.workspace.on('file-menu', (menu: Menu, file: TAbstractFile) => this.handleFileMenu(menu, file))
		);

		this.addSettingTab(new SettingsTab(this.app, this));
	}

	private initializeServices() {
		const vaultService: VaultService = new VaultService(this.app, this.settings);
		const notificationService: NotificationService = new NotificationService();
		const editorService: EditorService = new EditorService(this.app);

		const commandDependencies: CommandDependencies = {
			app: this.app,
			clipboardService: new ClipboardService(),
			vaultService: vaultService,
			notificationService: notificationService,
			editorService: editorService,
			settings: this.settings
		};

		const fileContextDependencies: FileContextCommandDependencies = {
			app: this.app,
			vaultService: vaultService,
			notificationService: notificationService,
			editorService: editorService,
			settings: this.settings
		};

		this.command = new Command(commandDependencies);
		this.fileContextCommand = new FileContextCommand(fileContextDependencies);
		this.fileService = new FileService();
	}

	private handlePasteEvent(event: ClipboardEvent): void {
		if (this.hasImage()) {
			event.preventDefault();
			event.stopPropagation();
			this.command.execute();
		}
	}

	private handleFileMenu(menu: Menu, file: TAbstractFile): void {
		if (!(file instanceof TFile)) {
			return;
		}

		if (!this.fileService.isImage(file)) {
			return;
		}

		menu.addItem((item) => {
			item
				.setTitle('Create image note')
				.setIcon('file-plus')
				.onClick(() => this.fileContextCommand.execute(file));
		});
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