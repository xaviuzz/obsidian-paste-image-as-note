import { describe, it, expect } from 'vitest';
import { FileService } from './file-service';
import { TFile } from 'obsidian';

describe('FileService', () => {
	let service: FileService;

	beforeEach(() => {
		service = new FileService();
	});

	describe('image file detection', () => {
		it('returns true for .png files', () => {
			const file: TFile = createFakeFile('image.png');

			const result: boolean = service.isImage(file);

			expect(result).toBe(true);
		});

		it('returns true for .jpg files', () => {
			const file: TFile = createFakeFile('photo.jpg');

			const result: boolean = service.isImage(file);

			expect(result).toBe(true);
		});

		it('returns true for .jpeg files', () => {
			const file: TFile = createFakeFile('photo.jpeg');

			const result: boolean = service.isImage(file);

			expect(result).toBe(true);
		});

		it('returns true for .gif files', () => {
			const file: TFile = createFakeFile('animation.gif');

			const result: boolean = service.isImage(file);

			expect(result).toBe(true);
		});

		it('returns true for .webp files', () => {
			const file: TFile = createFakeFile('modern.webp');

			const result: boolean = service.isImage(file);

			expect(result).toBe(true);
		});

		it('returns true for .bmp files', () => {
			const file: TFile = createFakeFile('bitmap.bmp');

			const result: boolean = service.isImage(file);

			expect(result).toBe(true);
		});

		it('returns true for .svg files', () => {
			const file: TFile = createFakeFile('vector.svg');

			const result: boolean = service.isImage(file);

			expect(result).toBe(true);
		});

		it('returns false for .md files', () => {
			const file: TFile = createFakeFile('note.md');

			const result: boolean = service.isImage(file);

			expect(result).toBe(false);
		});

		it('returns false for .txt files', () => {
			const file: TFile = createFakeFile('document.txt');

			const result: boolean = service.isImage(file);

			expect(result).toBe(false);
		});

		it('returns false for .pdf files', () => {
			const file: TFile = createFakeFile('document.pdf');

			const result: boolean = service.isImage(file);

			expect(result).toBe(false);
		});

		it('returns false for files without extensions', () => {
			const file: TFile = createFakeFile('README');

			const result: boolean = service.isImage(file);

			expect(result).toBe(false);
		});

		it('handles uppercase extensions case-insensitively', () => {
			const file: TFile = createFakeFile('PHOTO.PNG');

			const result: boolean = service.isImage(file);

			expect(result).toBe(true);
		});

		it('handles mixed case extensions case-insensitively', () => {
			const file: TFile = createFakeFile('image.JpEg');

			const result: boolean = service.isImage(file);

			expect(result).toBe(true);
		});

		it('detects image in nested folder path', () => {
			const file: TFile = createFakeFile('assets/images/photo.png');

			const result: boolean = service.isImage(file);

			expect(result).toBe(true);
		});
	});
});

function createFakeFile(path: string): TFile {
	return { path } as TFile;
}
