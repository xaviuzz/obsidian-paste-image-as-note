// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clipboard } = require('electron');
import { App, Notice } from 'obsidian';
import { ImageFormats } from './image-formats';

interface NativeImage {
	isEmpty(): boolean;
	toPNG(): Buffer;
}


export class Command {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}
	execute(): void {
		if (this.hasClipboardImage()) {
			try {
				const imageBuffer: Buffer = this.getClipboardImage();
				const filename: string = this.saveImageToVault(imageBuffer);
				this.createNoteWithImage(filename);
				new Notice('Created note with pasted image');
			} catch (error: unknown) {
				new Notice(`Failed to paste image: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		} else {
			new Notice('No image found in clipboard');
		}
	}

	private hasClipboardImage(): boolean {
		const formats: string[] = clipboard.availableFormats();
		return ImageFormats.check(formats);
	}
	
	private getClipboardImage(): Buffer {
		const image: NativeImage = clipboard.readImage();
		if (image.isEmpty()) {
			throw new Error('Clipboard image is empty');
		}
		return image.toPNG();
	}
	
	private saveImageToVault(imageBuffer: Buffer): string {
		const filename = `pasted-image-${Date.now()}.png`;
		const startOffset = imageBuffer.byteOffset;
		const endOffset = imageBuffer.byteOffset + imageBuffer.byteLength;
		const arrayBuffer = imageBuffer.buffer.slice(startOffset, endOffset) as ArrayBuffer;
		this.app.vault.createBinary(filename, arrayBuffer);
		return filename;
	}

	private createNoteWithImage(imagePath: string): string {
		const noteFilename = `Image Note ${Date.now()}.md`;
		const noteContent = `![](${imagePath})`;
		this.app.vault.create(noteFilename, noteContent);
		return noteFilename;
	}
}