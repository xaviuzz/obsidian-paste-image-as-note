import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/dom';
import { NameInput } from './name-input';
import { extendHTMLElementWithObsidian } from '../../test-utils/obsidian-dom-extensions';

describe('NameInput', () => {
	let container: HTMLElement;
	let nameInput: NameInput;

	beforeEach(() => {
		container = document.createElement('div');
		extendHTMLElementWithObsidian(container);
		document.body.appendChild(container);
		nameInput = new NameInput();
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
	});

	afterEach(() => {
		document.body.removeChild(container);
		vi.useRealTimers();
	});

	describe('render behavior', () => {
		it('returns input element', () => {
			const input: HTMLInputElement = nameInput.render(container);

			expect(input).toBeInTheDocument();
			expect(input.type).toBe('text');
		});

		it('creates label with Name text', () => {
			nameInput.render(container);

			const label = screen.getByText('Name:');
			expect(label.tagName.toLowerCase()).toBe('label');
		});

		it('sets default name value with timestamp', () => {
			const input: HTMLInputElement = nameInput.render(container);

			expect(input.value).toMatch(/^pasted-image-\d+$/);
		});

		it('applies width 100% style', () => {
			const input: HTMLInputElement = nameInput.render(container);

			expect(input.style.width).toBe('100%');
		});

		it('applies padding 8px style', () => {
			const input: HTMLInputElement = nameInput.render(container);

			expect(input.style.padding).toBe('8px');
		});

		it('applies marginBottom 10px style', () => {
			const input: HTMLInputElement = nameInput.render(container);

			expect(input.style.marginBottom).toBe('10px');
		});

		it('label appears before input', () => {
			nameInput.render(container);

			const label = screen.getByText('Name:');
			const input = container.querySelector('input');

			expect(container.children[0]).toBe(label.parentElement);
		});

		it('generates unique default names per instance', () => {
			const input1: HTMLInputElement = nameInput.render(container);
			const name1: string = input1.value;

			vi.advanceTimersByTime(1000);

			const nameInput2: NameInput = new NameInput();
			const container2: HTMLElement = document.createElement('div');
			extendHTMLElementWithObsidian(container2);
			document.body.appendChild(container2);
			const input2: HTMLInputElement = nameInput2.render(container2);
			const name2: string = input2.value;

			expect(name1).not.toEqual(name2);
			document.body.removeChild(container2);
		});

		it('pre-fills input with initialValue when provided', () => {
			const initialValue = 'my-custom-filename';

			const input: HTMLInputElement = nameInput.render(container, initialValue);

			expect(input.value).toBe('my-custom-filename');
		});

		it('uses default timestamp name when initialValue not provided', () => {
			const input: HTMLInputElement = nameInput.render(container);

			expect(input.value).toMatch(/^pasted-image-\d+$/);
		});

		it('uses default timestamp name when initialValue is empty string', () => {
			const input: HTMLInputElement = nameInput.render(container, '');

			expect(input.value).toMatch(/^pasted-image-\d+$/);
		});
	});

	describe('getValue behavior', () => {
		it('returns trimmed input value', () => {
			const input: HTMLInputElement = nameInput.render(container);
			input.value = '  test name  ';

			const result: string = nameInput.getValue();

			expect(result).toBe('test_name');
		});

		it('replaces spaces with underscores', () => {
			const input: HTMLInputElement = nameInput.render(container);
			input.value = 'my test image';

			const result: string = nameInput.getValue();

			expect(result).toBe('my_test_image');
		});

		it('returns default name when input empty', () => {
			const input: HTMLInputElement = nameInput.render(container);
			input.value = '';

			const result: string = nameInput.getValue();

			expect(result).toMatch(/^pasted-image-\d+$/);
		});

		it('returns default name when only whitespace', () => {
			const input: HTMLInputElement = nameInput.render(container);
			input.value = '   ';

			const result: string = nameInput.getValue();

			expect(result).toMatch(/^pasted-image-\d+$/);
		});

		it('handles multiple consecutive spaces', () => {
			const input: HTMLInputElement = nameInput.render(container);
			input.value = 'test    multiple    spaces';

			const result: string = nameInput.getValue();

			expect(result).toBe('test____multiple____spaces');
		});

		it('preserves existing underscores', () => {
			const input: HTMLInputElement = nameInput.render(container);
			input.value = 'my_custom_name with spaces';

			const result: string = nameInput.getValue();

			expect(result).toBe('my_custom_name_with_spaces');
		});

		it('handles mixed case and special characters', () => {
			const input: HTMLInputElement = nameInput.render(container);
			input.value = 'My Test Image-2024';

			const result: string = nameInput.getValue();

			expect(result).toBe('My_Test_Image-2024');
		});
	});

	describe('getInput behavior', () => {
		it('returns rendered input element', () => {
			const input: HTMLInputElement = nameInput.render(container);

			const result: HTMLInputElement | null = nameInput.getInput();

			expect(result).toBe(input);
		});

		it('returns null before render called', () => {
			const nameInput2: NameInput = new NameInput();

			const result: HTMLInputElement | null = nameInput2.getInput();

			expect(result).toBeNull();
		});
	});
});
