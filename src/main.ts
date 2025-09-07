import { Plugin } from 'obsidian';
import { Command } from './command';

export default class Plugin extends Plugin {
	private command: Command;

	async onload() {
		this.command = new Command();

		this.addCommand({
			id: 'paste-image-as-note',
			name: 'Paste image as note',
			callback: () => this.command.execute()
		});
	}

	onunload() {
	}

}