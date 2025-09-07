// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clipboard } = require('electron');
import { App } from 'obsidian';
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
			const imageBuffer: Buffer = this.getClipboardImage();
			const filename: string = this.saveImageToVault(imageBuffer);
			const noteFilename: string = this.createNoteWithImage(filename);
			console.log('Created note with image:', noteFilename);
		} else {
			console.log('No image in clipboard');
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