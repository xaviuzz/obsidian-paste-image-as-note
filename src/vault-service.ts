import { App } from 'obsidian';
import { Settings } from './settings';

export class VaultService {
	private app: App;
	private settings: Settings;

	constructor(app: App, settings: Settings) {
		this.app = app;
		this.settings = settings;
	}

	saveImage(imageBuffer: Buffer): string {
		const filename = `pasted-image-${Date.now()}.png`;
		const imagePath: string = this.getImagePath(filename);
		
		this.ensureFolderExists(this.settings.imageFolder);
		
		const startOffset: number = imageBuffer.byteOffset;
		const endOffset: number = imageBuffer.byteOffset + imageBuffer.byteLength;
		const arrayBuffer: ArrayBuffer = imageBuffer.buffer.slice(startOffset, endOffset) as ArrayBuffer;
		this.app.vault.createBinary(imagePath, arrayBuffer);
		return imagePath;
	}

	createNote(imagePath: string): string {
		const noteFilename = `Image Note ${Date.now()}.md`;
		const notePath: string = this.getNotePath(noteFilename);
		const noteContent = `![](${this.getRelativeImagePath(imagePath, notePath)})`;
		
		this.ensureFolderExists(this.settings.imageNotesFolder);
		
		this.app.vault.create(notePath, noteContent);
		return noteFilename;
	}

	private getImagePath(filename: string): string {
		if (this.settings.imageFolder) {
			return `${this.settings.imageFolder}/${filename}`;
		}
		return filename;
	}

	private getNotePath(filename: string): string {
		if (this.settings.imageNotesFolder) {
			return `${this.settings.imageNotesFolder}/${filename}`;
		}
		return filename;
	}

	private getRelativeImagePath(imagePath: string, notePath: string): string {
		const noteFolder: string = this.settings.imageNotesFolder;
		const imageFolder: string = this.settings.imageFolder;
		
		if (!noteFolder && !imageFolder) {
			return imagePath;
		}
		
		if (!noteFolder && imageFolder) {
			return imagePath;
		}
		
		if (noteFolder && !imageFolder) {
			return `../${imagePath}`;
		}
		
		if (noteFolder === imageFolder) {
			const filename: string = imagePath.split('/').pop() || imagePath;
			return filename;
		}
		
		return `../${imagePath}`;
	}

	private ensureFolderExists(folderPath: string): void {
		if (folderPath && !this.app.vault.getAbstractFileByPath(folderPath)) {
			this.app.vault.createFolder(folderPath);
		}
	}
}