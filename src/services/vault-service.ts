import { App, TFile, TAbstractFile } from 'obsidian';
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

	async createNote(imagePath: string, customName?: string, tags?: string[]): Promise<string> {
		const noteFilename: string = customName
			? `${customName}${this.noteExtension}`
			: `${this.notePrefix}${Date.now()}${this.noteExtension}`;
		const notePath: string = this.getNotePath(noteFilename);
		const relativeImagePath: string = this.getRelativeImagePath(imagePath, notePath);
		const imageMarkdown: string = `${this.markdownImagePrefix}${relativeImagePath}${this.markdownImageSuffix}`;
		const assetLink: string | undefined = this.settings.includeAssetProperty ? relativeImagePath : undefined;

		let noteContent: string = '';

		if (this.settings.templateFile) {
			try {
				const templateContent: string = await this.readTemplateContent(this.settings.templateFile);
				const mergedContent: string = this.mergeTemplateWithProperties(templateContent, tags, assetLink);
				noteContent = `${mergedContent}\n${imageMarkdown}`;
			} catch (error: unknown) {
				const frontmatter: string = this.generateFrontmatter(tags, assetLink);
				noteContent = frontmatter ? `${frontmatter}\n${imageMarkdown}` : imageMarkdown;
			}
		} else {
			const frontmatter: string = this.generateFrontmatter(tags, assetLink);
			noteContent = frontmatter ? `${frontmatter}\n${imageMarkdown}` : imageMarkdown;
		}

		this.ensureFolderExists(this.settings.imageNotesFolder);

		this.app.vault.create(notePath, noteContent);
		return noteFilename;
	}

	async createNoteFromExistingFile(existingImagePath: string, customName?: string, tags?: string[]): Promise<string> {
		return await this.createNote(existingImagePath, customName, tags);
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

	private generateFrontmatter(tags?: string[], assetLink?: string): string {
		const hasTags: boolean = tags !== undefined && tags.length > 0;
		const hasAsset: boolean = assetLink !== undefined;

		if (!hasTags && !hasAsset) {
			return '';
		}

		let frontmatterContent: string = '---\n';

		if (hasAsset) {
			frontmatterContent += `asset: "[[${assetLink}]]"\n`;
		}

		if (hasTags && tags) {
			const tagsList: string = tags.map((tag: string): string => `"${tag}"`).join(', ');
			frontmatterContent += `tags: [${tagsList}]\n`;
		}


		frontmatterContent += '---';

		return frontmatterContent;
	}

	private mergeTemplateWithProperties(templateContent: string, tags?: string[], assetLink?: string): string {
		const hasFrontmatter: boolean = templateContent.startsWith('---\n');

		if (!hasFrontmatter) {
			const frontmatter: string = this.generateFrontmatter(tags, assetLink);
			return frontmatter ? `${frontmatter}\n${templateContent}` : templateContent;
		}

		const frontmatterEnd: number = templateContent.indexOf('\n---', 4);
		if (frontmatterEnd === -1) {
			const frontmatter: string = this.generateFrontmatter(tags, assetLink);
			return frontmatter ? `${frontmatter}\n${templateContent}` : templateContent;
		}

		const existingFrontmatter: string = templateContent.substring(4, frontmatterEnd);
		const templateBody: string = templateContent.substring(frontmatterEnd + 4);

		let mergedFrontmatter: string = '---\n';
		mergedFrontmatter += existingFrontmatter;

		if (assetLink) {
			mergedFrontmatter += `\nasset: "[[${assetLink}]]"`;
		}

		if (tags && tags.length > 0) {
			const tagsList: string = tags.map((tag: string): string => `"${tag}"`).join(', ');
			mergedFrontmatter += `\ntags: [${tagsList}]`;
		}

		mergedFrontmatter += '\n---';

		return `${mergedFrontmatter}${templateBody}`;
	}

	private async getTemplatesFolder(): Promise<string> {
		const defaultFolder: string = 'Templates';
		const configPath: string = '.obsidian/templates.json';
		
		let configContent: string = '';
		
		try {
			configContent = await this.app.vault.adapter.read(configPath);
		} catch (error: unknown) {
			return defaultFolder;
		}
		
		let config: { folder?: string } = {};
		
		try {
			config = JSON.parse(configContent);
		} catch (error: unknown) {
			return defaultFolder;
		}
		
		const folder: string = config.folder || defaultFolder;
		return folder;
	}

	private async getTemplateFiles(): Promise<string[]> {
		const templatesFolder: string = await this.getTemplatesFolder();
		const allMarkdownFiles: TFile[] = this.app.vault.getMarkdownFiles();
		const templateFiles: TFile[] = allMarkdownFiles.filter((file: TFile): boolean => 
			file.path.startsWith(`${templatesFolder}${this.pathSeparator}`)
		);
		const filenames: string[] = templateFiles.map((file: TFile): string => 
			file.path.substring(templatesFolder.length + 1)
		);
		return filenames;
	}

	private async readTemplateContent(templateFile: string): Promise<string> {
		const templatesFolder: string = await this.getTemplatesFolder();
		const templatePath: string = `${templatesFolder}${this.pathSeparator}${templateFile}`;
		const file: TAbstractFile | null = this.app.vault.getAbstractFileByPath(templatePath);
		
		if (!file) {
			throw new Error(`Template file not found: ${templatePath}`);
		}
		
		const content: string = await this.app.vault.cachedRead(file as TFile);
		return content;
	}

	async getTemplateOptions(): Promise<Record<string, string>> {
		const templateFiles: string[] = await this.getTemplateFiles();
		const options: Record<string, string> = { '': 'None' };
		
		templateFiles.forEach((filename: string): void => {
			const displayName: string = filename.replace(this.noteExtension, '');
			options[filename] = displayName;
		});
		
		return options;
	}

}