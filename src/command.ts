import { App } from 'obsidian';
import { ClipboardService } from './services/clipboard-service';
import { VaultService } from './services/vault-service';
import { NotificationService } from './services/notification-service';
import { EditorService } from './services/editor-service';
import { Settings } from './settings';
import { ImagePreviewModal, ModalResult } from './ui/image-preview-modal';


export interface CommandDependencies {
	app: App;
	clipboardService: ClipboardService;
	vaultService: VaultService;
	notificationService: NotificationService;
	editorService: EditorService;
	settings: Settings;
}


export class Command {
	private app: App;
	private clipboardService: ClipboardService;
	private vaultService: VaultService;
	private notificationService: NotificationService;
	private editorService: EditorService;
	private settings: Settings;


	private readonly extension = '.md';
	private readonly prefix = '![[';
	private readonly suffix = ']]';

	constructor(dependencies: CommandDependencies) {
		this.app = dependencies.app;
		this.clipboardService = dependencies.clipboardService;
		this.vaultService = dependencies.vaultService;
		this.notificationService = dependencies.notificationService;
		this.editorService = dependencies.editorService;
		this.settings = dependencies.settings;

	}

	async execute(): Promise<void> {
		if (!this.hasImage()) {
			this.notifyNoImage();
			return;
		}

		await this.executeImagePaste();
	}

	private async executeImagePaste(): Promise<void> {
		if (this.settings.showPreviewModal) {
			await this.showPreviewAndCreateNote();
		} else {
			this.createNote();
		}
	}

	private async showPreviewAndCreateNote(): Promise<void> {
		const imageBuffer: Buffer = this.readImage();
		const modal: ImagePreviewModal = new ImagePreviewModal(this.app, imageBuffer);
		modal.open();
		const result: ModalResult = await modal.waitForClose();

		if (result.cancelled) {
			return;
		}

		this.createNoteFromBufferWithNameAndTags(imageBuffer, result.name, result.tags);
	}

	private createNoteFromBuffer(imageBuffer: Buffer): void {
		const filename: string = this.saveImage(imageBuffer);
		const noteTitle: string = this.createNoteInVault(filename);

		if (this.isNoteBeingEdited()) {
			this.insertNoteLinkAtCursor(noteTitle);
		}

		this.notifySuccess();
	}

	private createNoteFromBufferWithNameAndTags(imageBuffer: Buffer, customName: string, tags: string[]): void {
		const filename: string = this.saveImageWithName(imageBuffer, customName);
		const noteTitle: string = this.createNoteInVaultWithNameAndTags(filename, customName, tags);

		if (this.isNoteBeingEdited()) {
			this.insertNoteLinkAtCursor(noteTitle);
		}

		this.notifySuccess();
	}

	private createNote(): void {
		const imageBuffer: Buffer = this.readImage();
		this.createNoteFromBuffer(imageBuffer);
	}

	private hasImage(): boolean {
		return this.clipboardService.hasImage();
	}

	private readImage(): Buffer {
		return this.clipboardService.readImage();
	}

	private saveImage(imageBuffer: Buffer): string {
		return this.vaultService.saveImage(imageBuffer);
	}

	private saveImageWithName(imageBuffer: Buffer, customName: string): string {
		return this.vaultService.saveImage(imageBuffer, customName);
	}

	private createNoteInVault(filename: string): string {
		return this.vaultService.createNote(filename);
	}

	private createNoteInVaultWithNameAndTags(filename: string, customName: string, tags: string[]): string {
		return this.vaultService.createNote(filename, customName, tags);
	}

	private notifySuccess(): void {
		this.notificationService.success();
	}
	
	private notifyNoImage(): void {
		this.notificationService.noImage();
	}
	
	private isNoteBeingEdited(): boolean {
		return this.editorService.isEditing();
	}

	private insertNoteLinkAtCursor(noteTitle: string): void {
		const cleanTitle: string = noteTitle.replace(this.extension, '');
		const embedLink = `${this.prefix}${cleanTitle}${this.suffix}`;
		this.editorService.insertAtCursor(embedLink);
	}
}