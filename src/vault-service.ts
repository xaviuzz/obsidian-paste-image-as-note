import { App } from 'obsidian';

export class VaultService {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	saveImage(imageBuffer: Buffer): string {
		const filename = `pasted-image-${Date.now()}.png`;
		const startOffset: number = imageBuffer.byteOffset;
		const endOffset: number = imageBuffer.byteOffset + imageBuffer.byteLength;
		const arrayBuffer: ArrayBuffer = imageBuffer.buffer.slice(startOffset, endOffset) as ArrayBuffer;
		this.app.vault.createBinary(filename, arrayBuffer);
		return filename;
	}

	createNote(imagePath: string): string {
		const noteFilename = `Image Note ${Date.now()}.md`;
		const noteContent = `![](${imagePath})`;
		this.app.vault.create(noteFilename, noteContent);
		return noteFilename;
	}
}