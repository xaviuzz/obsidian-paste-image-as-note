import { Plugin } from 'obsidian';
import { Command } from './command';

export default class PasteImagePlugin extends Plugin {
	private command: Command;

	async onload() {
		this.command = new Command(this.app);

		this.addCommand({
			id: 'paste-image-as-note',
			name: 'Paste image as note',
			callback: () => this.command.execute()
		});
	}

	onunload() {
	}

}