import { App, TFile } from 'obsidian';
import { VaultService } from './services/vault-service';
import { NotificationService } from './services/notification-service';
import { EditorService } from './services/editor-service';
import { Settings } from './settings';
import { ImagePreviewModal, ModalResult } from './ui/image-preview-modal';

export interface FileContextCommandDependencies {
	app: App;
	vaultService: VaultService;
	notificationService: NotificationService;
	editorService: EditorService;
	settings: Settings;
}

export class FileContextCommand {
	private app: App;
	private vaultService: VaultService;
	private notificationService: NotificationService;
	private editorService: EditorService;
	private settings: Settings;

	private readonly extension = '.md';
	private readonly prefix = '![[';
	private readonly suffix = ']]';

	constructor(dependencies: FileContextCommandDependencies) {
		this.app = dependencies.app;
		this.vaultService = dependencies.vaultService;
		this.notificationService = dependencies.notificationService;
		this.editorService = dependencies.editorService;
		this.settings = dependencies.settings;
	}

	async execute(file: TFile): Promise<void> {
		const imageBuffer: Buffer = await this.readFileAsBuffer(file);

		if (this.settings.showPreviewModal) {
			await this.showPreviewAndCreateNote(imageBuffer, file);
		} else {
			this.createNoteFromFile(file.path);
		}
	}

	private async readFileAsBuffer(file: TFile): Promise<Buffer> {
		const arrayBuffer: ArrayBuffer = await this.app.vault.readBinary(file);
		return Buffer.from(arrayBuffer);
	}

	private async showPreviewAndCreateNote(imageBuffer: Buffer, file: TFile): Promise<void> {
		const defaultName: string = this.getFileNameWithoutExtension(file.name);
		const modal: ImagePreviewModal = new ImagePreviewModal(this.app, imageBuffer, defaultName);
		modal.open();
		const result: ModalResult = await modal.waitForClose();

		if (result.cancelled) {
			return;
		}

		const customName: string = result.name || defaultName;
		this.createNoteFromFileWithNameAndTags(file.path, customName, result.tags);
	}

	private createNoteFromFile(existingImagePath: string): void {
		const noteTitle: string = this.vaultService.createNoteFromExistingFile(existingImagePath);

		if (this.isNoteBeingEdited()) {
			this.insertNoteLinkAtCursor(noteTitle);
		}

		this.notifySuccess();
	}

	private createNoteFromFileWithNameAndTags(existingImagePath: string, customName: string, tags: string[]): void {
		const noteTitle: string = this.vaultService.createNoteFromExistingFile(existingImagePath, customName, tags);

		if (this.isNoteBeingEdited()) {
			this.insertNoteLinkAtCursor(noteTitle);
		}

		this.notifySuccess();
	}

	private getFileNameWithoutExtension(fileName: string): string {
		const lastDot: number = fileName.lastIndexOf('.');
		if (lastDot === -1) {
			return fileName;
		}
		return fileName.substring(0, lastDot);
	}

	private isNoteBeingEdited(): boolean {
		return this.editorService.isEditing();
	}

	private insertNoteLinkAtCursor(noteTitle: string): void {
		const cleanTitle: string = noteTitle.replace(this.extension, '');
		const embedLink = `${this.prefix}${cleanTitle}${this.suffix}`;
		this.editorService.insertAtCursor(embedLink);
	}

	private notifySuccess(): void {
		this.notificationService.success();
	}
}
