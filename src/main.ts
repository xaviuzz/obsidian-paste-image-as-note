import { Plugin } from 'obsidian';
import { Command } from './command';
import { ClipboardService } from './clipboard-service';
import { VaultService } from './vault-service';
import { NotificationService } from './notification-service';

export default class PasteImagePlugin extends Plugin {
	private command: Command;

	async onload() {
		const clipboardService: ClipboardService = new ClipboardService();
		const vaultService: VaultService = new VaultService(this.app);
		const notificationService: NotificationService = new NotificationService();
		
		this.command = new Command(clipboardService, vaultService, notificationService);

		this.addCommand({
			id: 'paste-image-as-note',
			name: 'Paste image as note',
			callback: () => this.command.execute()
		});
	}

	onunload() {
	}

}