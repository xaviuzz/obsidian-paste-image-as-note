import { describe, it, expect, beforeEach } from 'vitest';
import { VaultService } from './vault-service';
import { Settings } from '../settings';

describe('VaultService', () => {
	let app: FakeApp;
	let settings: Settings;
	let service: VaultService;

	beforeEach(() => {
		app = new FakeApp();
		settings = {
			imageFolder: '',
			imageNotesFolder: ''
		};
		service = new VaultService(app as any, settings);
	});

	describe('getImagePath behavior', () => {
		it('returns filename only when no image folder configured', () => {
			settings.imageFolder = '';
			const imageBuffer: Buffer = Buffer.from('fake-image-data');

			const result: string = service.saveImage(imageBuffer);

			expect(result).toMatch(/^pasted-image-\d+\.png$/);
		});

		it('returns folder/filename when image folder configured', () => {
			settings.imageFolder = 'images';
			const imageBuffer: Buffer = Buffer.from('fake-image-data');

			const result: string = service.saveImage(imageBuffer);

			expect(result).toMatch(/^images\/pasted-image-\d+\.png$/);
		});
	});

	describe('getNotePath behavior', () => {
		it('returns filename only when no notes folder configured', () => {
			settings.imageNotesFolder = '';
			const imagePath = 'test-image.png';

			const result: string = service.createNote(imagePath);

			expect(result).toMatch(/^Image Note \d+\.md$/);
		});

		it('returns folder/filename when notes folder configured', () => {
			settings.imageNotesFolder = 'notes';
			const imagePath = 'test-image.png';

			const result: string = service.createNote(imagePath);

			expect(result).toMatch(/^Image Note \d+\.md$/);
			const createdPath: string = `notes/${result}`;
			const content: string | undefined = app.vault.getCreatedContent(createdPath);
			expect(content).toBeDefined();
		});
	});

	describe('relative path calculation', () => {
		it('uses image path as-is when no folders configured', () => {
			settings.imageFolder = '';
			settings.imageNotesFolder = '';
			const imagePath = 'pasted-image-123.png';

			service.createNote(imagePath);

			const noteContent: string | undefined = app.vault.getCreatedContent(imagePath.replace('.png', '.md').replace('pasted-image', 'Image Note '));
			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean => 
				typeof f.content === 'string' && f.content.includes(imagePath)
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain(`![](${imagePath})`);
		});

		it('uses filename only when both folders are the same', () => {
			settings.imageFolder = 'media';
			settings.imageNotesFolder = 'media';
			const imagePath = 'media/pasted-image-123.png';

			service.createNote(imagePath);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean => 
				typeof f.content === 'string' && f.content.includes('pasted-image-123.png')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain('![](pasted-image-123.png)');
		});

		it('uses parent path prefix when note folder exists but differs from image folder', () => {
			settings.imageFolder = '';
			settings.imageNotesFolder = 'notes';
			const imagePath = 'pasted-image-123.png';

			service.createNote(imagePath);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean => 
				typeof f.content === 'string' && f.content.includes('../')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain(`![](../${imagePath})`);
		});

		it('uses parent path when notes in subfolder and images in different subfolder', () => {
			settings.imageFolder = 'images';
			settings.imageNotesFolder = 'notes';
			const imagePath = 'images/pasted-image-123.png';

			service.createNote(imagePath);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean => 
				typeof f.content === 'string' && f.content.includes('../')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain(`![](../${imagePath})`);
		});
	});

	describe('folder creation behavior', () => {
		it('creates image folder when configured and does not exist', () => {
			settings.imageFolder = 'images';
			const imageBuffer: Buffer = Buffer.from('fake-image-data');

			service.saveImage(imageBuffer);

			expect(app.vault.hasFolder('images')).toBe(true);
		});

		it('creates notes folder when configured and does not exist', () => {
			settings.imageNotesFolder = 'notes';
			const imagePath = 'test-image.png';

			service.createNote(imagePath);

			expect(app.vault.hasFolder('notes')).toBe(true);
		});

		it('does not create folder when empty string configured', () => {
			settings.imageFolder = '';
			const imageBuffer: Buffer = Buffer.from('fake-image-data');

			service.saveImage(imageBuffer);

			expect(app.vault.hasFolder('')).toBe(false);
		});
	});
});

interface VaultFile {
	path: string;
	content?: string | ArrayBuffer;
}

class FakeVault {
	private files: Map<string, VaultFile> = new Map();
	private folders: Set<string> = new Set();

	createBinary(path: string, data: ArrayBuffer): void {
		this.files.set(path, { path, content: data });
	}

	create(path: string, content: string): void {
		this.files.set(path, { path, content });
	}

	getAbstractFileByPath(path: string): VaultFile | null {
		if (this.folders.has(path)) {
			return { path };
		}
		return this.files.get(path) || null;
	}

	createFolder(path: string): void {
		this.folders.add(path);
	}

	getCreatedContent(path: string): string | undefined {
		const file: VaultFile | undefined = this.files.get(path);
		return file?.content as string | undefined;
	}

	hasFolder(path: string): boolean {
		return this.folders.has(path);
	}
}

class FakeApp {
	vault: FakeVault;

	constructor() {
		this.vault = new FakeVault();
	}
}
