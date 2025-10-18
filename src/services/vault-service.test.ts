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
			imageNotesFolder: '',
			showPreviewModal: false,
			includeAssetProperty: false
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

		it('uses custom name with underscores for image filename', () => {
			const imageBuffer: Buffer = Buffer.from('fake-image-data');
			const customName = 'my_custom_name';

			const result: string = service.saveImage(imageBuffer, customName);

			expect(result).toBe('my_custom_name.png');
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

		it('uses custom name with underscores for note filename', () => {
			const imagePath = 'test-image.png';
			const customName = 'my_custom_note';

			const result: string = service.createNote(imagePath, customName);

			expect(result).toBe('my_custom_note.md');
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

	describe('tags frontmatter behavior', () => {
		it('creates note without frontmatter when no tags provided', () => {
			const imagePath = 'test-image.png';

			service.createNote(imagePath, undefined, undefined);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toBe('![](test-image.png)');
		});

		it('creates note without frontmatter when empty tags array provided', () => {
			const imagePath = 'test-image.png';

			service.createNote(imagePath, undefined, []);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toBe('![](test-image.png)');
		});

		it('creates note with YAML frontmatter when tags provided', () => {
			const imagePath = 'test-image.png';
			const tags: string[] = ['screenshot', 'work'];

			service.createNote(imagePath, undefined, tags);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain('---');
			expect(note?.content).toContain('tags: ["screenshot", "work"]');
		});

		it('creates note with frontmatter before image markdown', () => {
			const imagePath = 'test-image.png';
			const tags: string[] = ['test'];

			service.createNote(imagePath, undefined, tags);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			const content: string = note?.content as string;
			const frontmatterIndex: number = content.indexOf('---');
			const imageIndex: number = content.indexOf('![](');
			expect(frontmatterIndex).toBeLessThan(imageIndex);
		});

		it('supports multiple tags in frontmatter', () => {
			const imagePath = 'test-image.png';
			const tags: string[] = ['tag1', 'tag2', 'tag3', 'tag4'];

			service.createNote(imagePath, undefined, tags);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain('tags: ["tag1", "tag2", "tag3", "tag4"]');
		});
	});

	describe('asset property frontmatter behavior', () => {
		it('creates note without asset property when setting disabled', () => {
			settings.includeAssetProperty = false;
			const imagePath = 'test-image.png';

			service.createNote(imagePath);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toBe('![](test-image.png)');
			expect(note?.content).not.toContain('asset:');
		});

		it('creates note with asset property when setting enabled', () => {
			settings.includeAssetProperty = true;
			const imagePath = 'test-image.png';

			service.createNote(imagePath);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain('---');
			expect(note?.content).toContain('asset: "[[test-image.png]]"');
		});

		it('creates note with asset property using relative path when folders configured', () => {
			settings.includeAssetProperty = true;
			settings.imageFolder = 'images';
			settings.imageNotesFolder = 'notes';
			const imagePath = 'images/test-image.png';

			service.createNote(imagePath);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain('asset: "[[../images/test-image.png]]"');
		});

		it('creates note with both asset property and tags when both enabled', () => {
			settings.includeAssetProperty = true;
			const imagePath = 'test-image.png';
			const tags: string[] = ['screenshot', 'work'];

			service.createNote(imagePath, undefined, tags);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain('---');
			expect(note?.content).toContain('asset: "[[test-image.png]]"');
			expect(note?.content).toContain('tags: ["screenshot", "work"]');
		});

		it('places asset property before tags in frontmatter', () => {
			settings.includeAssetProperty = true;
			const imagePath = 'test-image.png';
			const tags: string[] = ['test'];

			service.createNote(imagePath, undefined, tags);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			const content: string = note?.content as string;
			const assetIndex: number = content.indexOf('asset:');
			const tagsIndex: number = content.indexOf('tags:');
			expect(assetIndex).toBeLessThan(tagsIndex);
		});

		it('creates note with only asset property when tags empty', () => {
			settings.includeAssetProperty = true;
			const imagePath = 'test-image.png';

			service.createNote(imagePath, undefined, []);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain('---');
			expect(note?.content).toContain('asset: "[[test-image.png]]"');
			expect(note?.content).not.toContain('tags:');
		});
	});

	describe('createNoteFromExistingFile behavior', () => {
		it('creates note with reference to existing image file', () => {
			const existingImagePath = 'assets/photo.png';

			service.createNoteFromExistingFile(existingImagePath);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain('![](assets/photo.png)');
		});

		it('creates note with custom name for existing file', () => {
			const existingImagePath = 'images/screenshot.png';
			const customName = 'my-custom-note';

			const noteFilename: string = service.createNoteFromExistingFile(existingImagePath, customName);

			expect(noteFilename).toBe('my-custom-note.md');
			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path === 'my-custom-note.md'
			);
			expect(note).toBeDefined();
		});

		it('creates note with tags for existing file', () => {
			const existingImagePath = 'photo.png';
			const tags: string[] = ['imported', 'context-menu'];

			service.createNoteFromExistingFile(existingImagePath, undefined, tags);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.includes('.md')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain('tags: ["imported", "context-menu"]');
		});

		it('respects folder configuration when creating note from existing file', () => {
			settings.imageFolder = 'images';
			settings.imageNotesFolder = 'notes';
			const existingImagePath = 'images/photo.png';

			service.createNoteFromExistingFile(existingImagePath);

			const files: VaultFile[] = Array.from((app.vault as any).files.values());
			const note: VaultFile | undefined = files.find((f: VaultFile): boolean =>
				f.path.startsWith('notes/')
			);
			expect(note).toBeDefined();
			expect(note?.content).toContain('![](../images/photo.png)');
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
