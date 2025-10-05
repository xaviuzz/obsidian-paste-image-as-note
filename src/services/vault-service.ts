import { App } from 'obsidian';
import { Settings } from '../settings';

export class VaultService {
	private app: App;
	private settings: Settings;

	private readonly imagePrefix = 'pasted-image-';
	private readonly imageExtension = '.png';
	private readonly notePrefix = 'Image Note ';
	private readonly noteExtension = '.md';
	private readonly markdownImagePrefix = '![](';
	private readonly markdownImageSuffix = ')';
	private readonly pathSeparator = '/';
	private readonly parentPath = '../';

	constructor(app: App, settings: Settings) {
		this.app = app;
		this.settings = settings;
	}

	saveImage(imageBuffer: Buffer, customName?: string): string {
		const filename: string = customName 
			? `${customName}${this.imageExtension}` 
			: `${this.imagePrefix}${Date.now()}${this.imageExtension}`;
		const imagePath: string = this.getImagePath(filename);
		
		this.ensureFolderExists(this.settings.imageFolder);
		this.createImage(imageBuffer, imagePath);
		return imagePath;
	}

	private createImage(imageBuffer: Buffer, imagePath: string) {
		const startOffset: number = imageBuffer.byteOffset;
		const endOffset: number = imageBuffer.byteOffset + imageBuffer.byteLength;
		const arrayBuffer: ArrayBuffer = imageBuffer.buffer.slice(startOffset, endOffset) as ArrayBuffer;
		this.app.vault.createBinary(imagePath, arrayBuffer);
	}

	createNote(imagePath: string, customName?: string, tags?: string[]): string {
		const noteFilename: string = customName
			? `${customName}${this.noteExtension}`
			: `${this.notePrefix}${Date.now()}${this.noteExtension}`;
		const notePath: string = this.getNotePath(noteFilename);
		const frontmatter: string = this.generateFrontmatter(tags);
		const imageMarkdown: string = `${this.markdownImagePrefix}${this.getRelativeImagePath(imagePath, notePath)}${this.markdownImageSuffix}`;
		const noteContent: string = frontmatter ? `${frontmatter}\n${imageMarkdown}` : imageMarkdown;

		this.ensureFolderExists(this.settings.imageNotesFolder);

		this.app.vault.create(notePath, noteContent);
		return noteFilename;
	}

	private getImagePath(filename: string): string {
		if (this.settings.imageFolder) {
			return `${this.settings.imageFolder}${this.pathSeparator}${filename}`;
		}
		return filename;
	}

	private getNotePath(filename: string): string {
		if (this.settings.imageNotesFolder) {
			return `${this.settings.imageNotesFolder}${this.pathSeparator}${filename}`;
		}
		return filename;
	}

	private getRelativeImagePath(imagePath: string, notePath: string): string {
		const noteFolder: string = this.settings.imageNotesFolder;
		const imageFolder: string = this.settings.imageFolder;
		
		let relativePath: string = imagePath;
		
		if (noteFolder && noteFolder === imageFolder) {
			relativePath = imagePath.split(this.pathSeparator).pop() || imagePath;
		} else if (noteFolder) {
			relativePath = `${this.parentPath}${imagePath}`;
		}
		
		return relativePath;
	}

	private ensureFolderExists(folderPath: string): void {
		if (folderPath && !this.app.vault.getAbstractFileByPath(folderPath)) {
			this.app.vault.createFolder(folderPath);
		}
	}

	private generateFrontmatter(tags?: string[]): string {
		if (!tags || tags.length === 0) {
			return '';
		}

		const tagsList: string = tags.map((tag: string): string => `"${tag}"`).join(', ');
		return `---\ntags: [${tagsList}]\n---`;
	}
}