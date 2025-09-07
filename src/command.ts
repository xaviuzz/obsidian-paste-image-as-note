import { App, Editor, MarkdownView } from 'obsidian';
import { ClipboardService } from './clipboard-service';
import { VaultService } from './vault-service';
import { NotificationService } from './notification-service';

export class Command {
	private app: App;
	private clipboardService: ClipboardService;
	private vaultService: VaultService;
	private notificationService: NotificationService;

	constructor(app: App, clipboardService: ClipboardService, vaultService: VaultService, notificationService: NotificationService) {
		this.app = app;
		this.clipboardService = clipboardService;
		this.vaultService = vaultService;
		this.notificationService = notificationService;
	}

	execute(): void {
		if (this.hasNoImage()) {
			this.notifyNoImage();
			return;
		}
		
		this.executeImagePaste();
	}

	private executeImagePaste(): void {
		try {
			const imageBuffer: Buffer = this.readImage();
			const filename: string = this.saveImage(imageBuffer);
			this.createNote(filename);
			this.notifySuccess();
		} catch (error: unknown) {
			this.notifyError(error);
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
	isNoteBeingEdited(): boolean {
		const activeView: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView);
		const isEditing: boolean = activeView !== null && activeView.getMode() === 'source';
		console.log("Editing context:", isEditing);
		return isEditing;
	}

	getCurrentEditor(): Editor | null {
		const activeView: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView === null || activeView.getMode() !== 'source') {
			console.log("No active editor available");
			return null;
		}
		const editor: Editor = activeView.editor;
		console.log("Active editor found");
		return editor;
	}
}