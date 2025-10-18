import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ImagePreview } from './image-preview';
import { extendHTMLElementWithObsidian } from '../../test-utils/obsidian-dom-extensions';

describe('ImagePreview', () => {
	let container: HTMLElement;
	let imagePreview: ImagePreview;

	beforeEach(() => {
		container = document.createElement('div');
		extendHTMLElementWithObsidian(container);
		document.body.appendChild(container);
		imagePreview = new ImagePreview();
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	describe('render behavior', () => {
		it('creates img element in container', () => {
			const buffer: Buffer = Buffer.from('fake-image-data');

			imagePreview.render(container, buffer);

			const img = container.querySelector('img');
			expect(img).toBeInTheDocument();
		});

		it('sets img src to blob URL', () => {
			const buffer: Buffer = Buffer.from('fake-image-data');

			imagePreview.render(container, buffer);

			const img = container.querySelector('img') as HTMLImageElement;
			expect(img.src).toContain('blob:');
		});

		it('applies maxWidth 100% style', () => {
			const buffer: Buffer = Buffer.from('fake-image-data');

			imagePreview.render(container, buffer);

			const img = container.querySelector('img') as HTMLImageElement;
			expect(img.style.maxWidth).toBe('100%');
		});

		it('applies maxHeight 400px style', () => {
			const buffer: Buffer = Buffer.from('fake-image-data');

			imagePreview.render(container, buffer);

			const img = container.querySelector('img') as HTMLImageElement;
			expect(img.style.maxHeight).toBe('400px');
		});

		it('applies display block style', () => {
			const buffer: Buffer = Buffer.from('fake-image-data');

			imagePreview.render(container, buffer);

			const img = container.querySelector('img') as HTMLImageElement;
			expect(img.style.display).toBe('block');
		});

		it('applies margin 20px auto style', () => {
			const buffer: Buffer = Buffer.from('fake-image-data');

			imagePreview.render(container, buffer);

			const img = container.querySelector('img') as HTMLImageElement;
			expect(img.style.margin).toBe('20px auto');
		});

		it('calls URL.createObjectURL with blob', () => {
			const buffer: Buffer = Buffer.from('fake-image-data');

			imagePreview.render(container, buffer);

			expect(vi.mocked(global.URL.createObjectURL)).toHaveBeenCalled();
		});

		it('handles buffer with byteOffset and byteLength', () => {
			const fullBuffer: Buffer = Buffer.from('0123456789');
			const slicedBuffer: Buffer = fullBuffer.slice(2, 8) as Buffer;

			imagePreview.render(container, slicedBuffer);

			const img = container.querySelector('img');
			expect(img).toBeInTheDocument();
		});
	});
});
