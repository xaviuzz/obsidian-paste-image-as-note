import { describe, it, expect, beforeEach } from 'vitest';
import { Command, CommandDependencies } from './command';
import { ClipboardService } from './services/clipboard-service';
import { VaultService } from './services/vault-service';
import { NotificationService } from './services/notification-service';
import { EditorService } from './services/editor-service';

describe('Command', () => {
	let clipboardService: FakeClipboardService;
	let vaultService: FakeVaultService;
	let notificationService: FakeNotificationService;
	let editorService: FakeEditorService;
	let command: Command;

	beforeEach(() => {
		clipboardService = new FakeClipboardService();
		vaultService = new FakeVaultService();
		notificationService = new FakeNotificationService();
		editorService = new FakeEditorService();

		const dependencies: CommandDependencies = {
			clipboardService: clipboardService as unknown as ClipboardService,
			vaultService: vaultService as unknown as VaultService,
			notificationService: notificationService as unknown as NotificationService,
			editorService: editorService as unknown as EditorService
		};
		command = new Command(dependencies);
	});

	describe('no image in clipboard workflow', () => {
		it('notifies user when no image available', () => {
			clipboardService.imageAvailable = false;

			command.execute();

			expect(notificationService.noImageCalled).toBe(true);
			expect(notificationService.successCalled).toBe(false);
		});

		it('does not create note when no image available', () => {
			clipboardService.imageAvailable = false;

			command.execute();

			expect(vaultService.imageSaved).toBe(false);
			expect(vaultService.noteCreated).toBe(false);
		});
	});

	describe('image paste with editing workflow', () => {
		it('creates note and inserts link when editing', () => {
			clipboardService.imageAvailable = true;
			editorService.editing = true;

			command.execute();

			expect(vaultService.imageSaved).toBe(true);
			expect(vaultService.noteCreated).toBe(true);
			expect(editorService.textInserted).toBe(true);
			expect(notificationService.successCalled).toBe(true);
		});

		it('inserts link without file extension', () => {
			clipboardService.imageAvailable = true;
			editorService.editing = true;
			vaultService.noteTitle = 'Image Note 123.md';

			command.execute();

			expect(editorService.insertedText).toBe('![[Image Note 123]]');
		});

		it('creates image before note', () => {
			clipboardService.imageAvailable = true;
			editorService.editing = true;

			command.execute();

			expect(vaultService.imageSaveOrder).toBeLessThan(vaultService.noteCreateOrder);
		});
	});

	describe('image paste without editing workflow', () => {
		it('creates note without inserting link when not editing', () => {
			clipboardService.imageAvailable = true;
			editorService.editing = false;

			command.execute();

			expect(vaultService.imageSaved).toBe(true);
			expect(vaultService.noteCreated).toBe(true);
			expect(editorService.textInserted).toBe(false);
			expect(notificationService.successCalled).toBe(true);
		});
	});

	describe('service orchestration', () => {
		it('reads image from clipboard service', () => {
			clipboardService.imageAvailable = true;

			command.execute();

			expect(clipboardService.imageRead).toBe(true);
		});

		it('saves image with buffer from clipboard', () => {
			clipboardService.imageAvailable = true;
			clipboardService.imageData = Buffer.from('test-image-data');

			command.execute();

			expect(vaultService.savedImageBuffer?.toString()).toBe('test-image-data');
		});

		it('creates note with image path from vault', () => {
			clipboardService.imageAvailable = true;
			vaultService.imagePath = 'images/test.png';

			command.execute();

			expect(vaultService.noteImagePath).toBe('images/test.png');
		});
	});
});

class FakeClipboardService {
	imageAvailable: boolean = false;
	imageRead: boolean = false;
	imageData: Buffer = Buffer.from('fake-image');

	hasImage(): boolean {
		return this.imageAvailable;
	}

	readImage(): Buffer {
		this.imageRead = true;
		return this.imageData;
	}
}

class FakeVaultService {
	imageSaved: boolean = false;
	noteCreated: boolean = false;
	imagePath: string = 'pasted-image-123.png';
	noteTitle: string = 'Image Note 123.md';
	savedImageBuffer: Buffer | null = null;
	noteImagePath: string | null = null;
	imageSaveOrder: number = 0;
	noteCreateOrder: number = 0;
	private operationCounter: number = 0;

	saveImage(imageBuffer: Buffer): string {
		this.imageSaved = true;
		this.savedImageBuffer = imageBuffer;
		this.imageSaveOrder = ++this.operationCounter;
		return this.imagePath;
	}

	createNote(imagePath: string): string {
		this.noteCreated = true;
		this.noteImagePath = imagePath;
		this.noteCreateOrder = ++this.operationCounter;
		return this.noteTitle;
	}
}

class FakeNotificationService {
	successCalled: boolean = false;
	noImageCalled: boolean = false;
	errorCalled: boolean = false;

	success(): void {
		this.successCalled = true;
	}

	noImage(): void {
		this.noImageCalled = true;
	}

	error(error: Error): void {
		this.errorCalled = true;
	}
}

class FakeEditorService {
	editing: boolean = false;
	textInserted: boolean = false;
	insertedText: string = '';

	isEditing(): boolean {
		return this.editing;
	}

	insertAtCursor(text: string): void {
		this.textInserted = true;
		this.insertedText = text;
	}
}
