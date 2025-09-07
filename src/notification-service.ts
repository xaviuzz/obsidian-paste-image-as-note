import { Notice } from 'obsidian';

export class NotificationService {
	success(): void {
		new Notice('Created note with pasted image');
	}

	error(error: Error): void {
		new Notice(`Failed to paste image: ${error.message}`);
	}

	noImage(): void {
		new Notice('No image found in clipboard');
	}
}