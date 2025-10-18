import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/dom';
import { TagInput } from './tag-input';
import { extendHTMLElementWithObsidian, extendAllElementsWithObsidian } from '../../test-utils/obsidian-dom-extensions';

describe('TagInput', () => {
	let container: HTMLElement;
	let tagInput: TagInput;
	let mockTagSource: any;

	beforeEach(() => {
		container = document.createElement('div');
		extendHTMLElementWithObsidian(container);
		document.body.appendChild(container);

		mockTagSource = {
			getTags: vi.fn().mockReturnValue(['work', 'personal', 'project']),
			loadTags: vi.fn(),
		};
		tagInput = new TagInput(mockTagSource);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	describe('render behavior', () => {
		it('returns input element', () => {
			const input = tagInput.render(container);

			expect(input).toBeInTheDocument();
			expect(input.type).toBe('text');
		});

		it('sets input placeholder', () => {
			const input = tagInput.render(container);

			expect(input.placeholder).toBe('Add more tags...');
		});

		it('creates label with Tags text', () => {
			tagInput.render(container);
			extendAllElementsWithObsidian(container);

			expect(screen.getByText('Tags:')).toBeInTheDocument();
		});

		it('creates input container with flex display', () => {
			tagInput.render(container);

			const inputContainer = container.querySelector('div[style*="display: flex"]');
			expect(inputContainer).toBeInTheDocument();
		});

		it('applies gap 6px to container', () => {
			tagInput.render(container);

			const inputContainer = container.querySelector('div[style*="display: flex"]') as HTMLElement;
			expect(inputContainer.style.gap).toBe('6px');
		});

		it('applies padding to container', () => {
			tagInput.render(container);

			const inputContainer = container.querySelector('div[style*="display: flex"]') as HTMLElement;
			expect(inputContainer.style.padding).toBe('6px 8px');
		});

		it('applies flex-wrap wrap to container', () => {
			tagInput.render(container);

			const inputContainer = container.querySelector('div[style*="display: flex"]') as HTMLElement;
			expect(inputContainer.style.flexWrap).toBe('wrap');
		});

		it('applies border to input container', () => {
			tagInput.render(container);

			const inputContainer = container.querySelector('div[style*="display: flex"]') as HTMLElement;
			expect(inputContainer.style.border).toContain('1px solid');
		});

		it('applies transparent background to input field', () => {
			const input = tagInput.render(container);

			expect(input.style.background).toBe('transparent');
		});

		it('applies flex: 1 1 auto to input', () => {
			const input = tagInput.render(container);

			expect(input.style.flex).toBe('1 1 auto');
		});
	});

	describe('addTag behavior', () => {
		it('adds tag to selected tags list', () => {
			tagInput.render(container);

			tagInput.addTag('work');

			expect(tagInput.getSelectedTags()).toContain('work');
		});

		it('prevents duplicate tags', () => {
			tagInput.render(container);

			tagInput.addTag('work');
			tagInput.addTag('work');

			const tags = tagInput.getSelectedTags();
			const workCount = tags.filter((t: string) => t === 'work').length;
			expect(workCount).toBe(1);
		});

		it('ignores empty tags', () => {
			tagInput.render(container);

			tagInput.addTag('');

			expect(tagInput.getSelectedTags()).not.toContain('');
		});

		it('renders chip when tag added', () => {
			tagInput.render(container);
			extendAllElementsWithObsidian(container);

			tagInput.addTag('work');

			expect(screen.getByText('work')).toBeInTheDocument();
		});

		it('adds multiple tags in order', () => {
			tagInput.render(container);

			tagInput.addTag('work');
			tagInput.addTag('personal');
			tagInput.addTag('project');

			const tags = tagInput.getSelectedTags();
			expect(tags).toEqual(['work', 'personal', 'project']);
		});

		it('increments count with each unique tag', () => {
			tagInput.render(container);

			tagInput.addTag('work');
			expect(tagInput.getSelectedTags().length).toBe(1);

			tagInput.addTag('personal');
			expect(tagInput.getSelectedTags().length).toBe(2);

			tagInput.addTag('project');
			expect(tagInput.getSelectedTags().length).toBe(3);
		});
	});

	describe('removeTag behavior', () => {
		it('removes tag from selected tags', () => {
			tagInput.render(container);
			tagInput.addTag('work');
			tagInput.addTag('personal');

			tagInput.removeTag('work');

			const tags = tagInput.getSelectedTags();
			expect(tags).not.toContain('work');
			expect(tags).toContain('personal');
		});

		it('removes chip from DOM', () => {
			tagInput.render(container);
			extendAllElementsWithObsidian(container);
			tagInput.addTag('work');

			tagInput.removeTag('work');

			expect(screen.queryByText('work')).not.toBeInTheDocument();
		});

		it('handles removing non-existent tag gracefully', () => {
			tagInput.render(container);
			tagInput.addTag('work');

			tagInput.removeTag('non-existent');

			const tags = tagInput.getSelectedTags();
			expect(tags).toContain('work');
			expect(tags.length).toBe(1);
		});

		it('removes correct tag among multiple', () => {
			tagInput.render(container);
			tagInput.addTag('work');
			tagInput.addTag('personal');
			tagInput.addTag('project');

			tagInput.removeTag('personal');

			const tags = tagInput.getSelectedTags();
			expect(tags).toEqual(['work', 'project']);
		});

		it('decreases count with each removal', () => {
			tagInput.render(container);
			tagInput.addTag('work');
			tagInput.addTag('personal');
			tagInput.addTag('project');

			expect(tagInput.getSelectedTags().length).toBe(3);
			tagInput.removeTag('work');
			expect(tagInput.getSelectedTags().length).toBe(2);
		});
	});

	describe('getSelectedTags behavior', () => {
		it('returns empty array initially', () => {
			tagInput.render(container);

			const tags = tagInput.getSelectedTags();

			expect(tags).toEqual([]);
		});

		it('returns all added tags', () => {
			tagInput.render(container);
			tagInput.addTag('work');
			tagInput.addTag('personal');

			const tags = tagInput.getSelectedTags();

			expect(tags).toEqual(['work', 'personal']);
		});

		it('returns tags in order added', () => {
			tagInput.render(container);
			tagInput.addTag('z-tag');
			tagInput.addTag('a-tag');
			tagInput.addTag('m-tag');

			const tags = tagInput.getSelectedTags();

			expect(tags).toEqual(['z-tag', 'a-tag', 'm-tag']);
		});

		it('reflects changes after add/remove', () => {
			tagInput.render(container);
			tagInput.addTag('work');

			let tags = tagInput.getSelectedTags();
			expect(tags.length).toBe(1);

			tagInput.addTag('personal');
			tags = tagInput.getSelectedTags();
			expect(tags.length).toBe(2);

			tagInput.removeTag('work');
			tags = tagInput.getSelectedTags();
			expect(tags.length).toBe(1);
		});
	});

	describe('getInput behavior', () => {
		it('returns rendered input element', () => {
			const input = tagInput.render(container);

			const result = tagInput.getInput();

			expect(result).toBe(input);
		});

		it('returns null before render', () => {
			const tagInput2 = new TagInput(mockTagSource);

			const result = tagInput2.getInput();

			expect(result).toBeNull();
		});
	});

	describe('clearInput behavior', () => {
		it('clears input field value', () => {
			const input = tagInput.render(container);
			input.value = 'test value';

			tagInput.clearInput();

			expect(input.value).toBe('');
		});

		it('works when input is rendered', () => {
			tagInput.render(container);

			expect(() => tagInput.clearInput()).not.toThrow();
		});

		it('does not affect selected tags', () => {
			const input = tagInput.render(container);
			tagInput.addTag('work');
			input.value = 'test';

			tagInput.clearInput();

			expect(tagInput.getSelectedTags()).toContain('work');
		});
	});

	describe('integration behavior', () => {
		it('supports add then remove flow', () => {
			tagInput.render(container);

			tagInput.addTag('work');
			expect(tagInput.getSelectedTags()).toContain('work');

			tagInput.removeTag('work');
			expect(tagInput.getSelectedTags()).not.toContain('work');
		});

		it('maintains state across multiple operations', () => {
			const input = tagInput.render(container);

			tagInput.addTag('work');
			tagInput.addTag('personal');
			tagInput.clearInput();
			tagInput.removeTag('work');

			const tags = tagInput.getSelectedTags();
			expect(tags).toEqual(['personal']);
		});

		it('handles remove button callback from chip', () => {
			tagInput.render(container);
			extendAllElementsWithObsidian(container);
			tagInput.addTag('work');

			const removeBtn = screen.getByText('×');
			fireEvent.click(removeBtn);

			const tags = tagInput.getSelectedTags();
			expect(tags).not.toContain('work');
		});

		it('supports multiple add and remove cycles', () => {
			tagInput.render(container);

			tagInput.addTag('work');
			tagInput.addTag('personal');
			expect(tagInput.getSelectedTags().length).toBe(2);

			tagInput.removeTag('work');
			expect(tagInput.getSelectedTags().length).toBe(1);

			tagInput.addTag('project');
			expect(tagInput.getSelectedTags().length).toBe(2);

			tagInput.removeTag('personal');
			tagInput.removeTag('project');
			expect(tagInput.getSelectedTags().length).toBe(0);
		});
	});
});
