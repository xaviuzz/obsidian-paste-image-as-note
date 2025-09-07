
import { ClipboardService } from './clipboard-service';
import { VaultService } from './vault-service';
import { NotificationService } from './notification-service';
import { EditorService } from './editor-service';

export class Command {
	private clipboardService: ClipboardService;
	private vaultService: VaultService;
	private notificationService: NotificationService;
	private editorService: EditorService;

	constructor(clipboardService: ClipboardService, vaultService: VaultService, notificationService: NotificationService, editorService: EditorService) {
		this.clipboardService = clipboardService;
		this.vaultService = vaultService;
		this.notificationService = notificationService;
		this.editorService = editorService;
	}

	execute(): void {
		if (this.hasNoImage()) {
			this.notifyNoImage();
			return;
		}
		
		this.executeImagePaste();
	}

	private executeImagePaste(): void {
		const imageBuffer: Buffer = this.readImage();
		const filename: string = this.saveImage(imageBuffer);
		const noteTitle: string = this.createNote(filename);
		
		if (this.isNoteBeingEdited()) {
			this.insertNoteLinkAtCursor(noteTitle);
			this.notifySuccessWithLink();
		} else {
			this.notifySuccess();
		}
	}

	private hasNoImage(): boolean {
		return this.clipboardService.hasNoImage();
	}

	private readImage(): Buffer {
		return this.clipboardService.readImage();
	}

	private saveImage(imageBuffer: Buffer): string {
		return this.vaultService.saveImage(imageBuffer);
	}

	private createNote(filename: string): string {
		return this.vaultService.createNote(filename);
	}

	private notifySuccess(): void {
		this.notificationService.success();
	}

	private notifySuccessWithLink(): void {
		this.notificationService.success();
	}

	private notifyError(error: unknown): void {
		if (error instanceof Error) {
			this.notificationService.error(error);
		} else {
			this.notificationService.error(new Error('Unknown error'));
		}
	}
	
	private notifyNoImage(): void {
		this.notificationService.noImage();
	}
	
	private isNoteBeingEdited(): boolean {
		return this.editorService.isEditing();
	}

	private insertNoteLinkAtCursor(noteTitle: string): void {
		const cleanTitle: string = noteTitle.replace('.md', '');
		const embedLink = `![[${cleanTitle}]]`;
		this.editorService.insertAtCursor(embedLink);
	}
}