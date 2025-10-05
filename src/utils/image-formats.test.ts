import { describe, it, expect } from 'vitest';
import { ImageFormats } from './image-formats';

describe('ImageFormats', () => {
	describe('check', () => {
		it('detects standard image MIME types', () => {
			const formats: string[] = ['image/png', 'text/plain'];
			
			const result: boolean = ImageFormats.check(formats);
			
			expect(result).toBe(true);
		});

		it('detects image/jpeg MIME type', () => {
			const formats: string[] = ['image/jpeg'];
			
			const result: boolean = ImageFormats.check(formats);
			
			expect(result).toBe(true);
		});

		it('detects generic image keyword', () => {
			const formats: string[] = ['NSFilenamesPboardType', 'image'];
			
			const result: boolean = ImageFormats.check(formats);
			
			expect(result).toBe(true);
		});

		it('detects macOS public.png format', () => {
			const formats: string[] = ['public.png'];
			
			const result: boolean = ImageFormats.check(formats);
			
			expect(result).toBe(true);
		});

		it('detects macOS public.jpeg format', () => {
			const formats: string[] = ['public.jpeg'];
			
			const result: boolean = ImageFormats.check(formats);
			
			expect(result).toBe(true);
		});

		it('returns false when no image formats present', () => {
			const formats: string[] = ['text/plain', 'text/html'];
			
			const result: boolean = ImageFormats.check(formats);
			
			expect(result).toBe(false);
		});

		it('returns false for empty format array', () => {
			const formats: string[] = [];
			
			const result: boolean = ImageFormats.check(formats);
			
			expect(result).toBe(false);
		});

		it('detects image format among multiple non-image formats', () => {
			const formats: string[] = ['text/plain', 'text/html', 'image/gif', 'application/json'];
			
			const result: boolean = ImageFormats.check(formats);
			
			expect(result).toBe(true);
		});
	});
});
