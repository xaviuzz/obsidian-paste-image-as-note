import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/dom';
import { TagSuggestions } from './tag-suggestions';
import { extendHTMLElementWithObsidian, extendAllElementsWithObsidian } from '../../test-utils/obsidian-dom-extensions';

describe('TagSuggestions', () => {
	let container: HTMLElement;
	let input: HTMLInputElement;
	let mockTagSource: any;
	let suggestions: TagSuggestions;

	beforeEach(() => {
		container = document.createElement('div');
		extendHTMLElementWithObsidian(container);
		document.body.appendChild(container);

		input = document.createElement('input');
		container.appendChild(input);

		mockTagSource = {
			getTags: vi.fn().mockReturnValue(['apple', 'apricot', 'banana', 'cherry']),
			loadTags: vi.fn(),
		};
		suggestions = new TagSuggestions(mockTagSource);
		suggestions.render(container, input);
		suggestions.setGetSelectedTags(() => []);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	describe('render behavior', () => {
		it('renders suggestions container', () => {
			const suggestionsContainer = container.querySelector('div[style*="position: fixed"]');
			expect(suggestionsContainer).toBeInTheDocument();
		});

		it('hides suggestions initially', () => {
			const suggestionsContainer = container.querySelector('div[style*="position: fixed"]') as HTMLElement;
			expect(suggestionsContainer.style.display).toBe('none');
		});

		it('sets max height to 224px', () => {
			const suggestionsContainer = container.querySelector('div[style*="position: fixed"]') as HTMLElement;
			expect(suggestionsContainer.style.maxHeight).toBe('224px');
		});

		it('enables overflow-y auto', () => {
			const suggestionsContainer = container.querySelector('div[style*="position: fixed"]') as HTMLElement;
			expect(suggestionsContainer.style.overflowY).toBe('auto');
		});

		it('uses fixed positioning', () => {
			const suggestionsContainer = container.querySelector('div[style*="position: fixed"]') as HTMLElement;
			expect(suggestionsContainer.style.position).toBe('fixed');
		});
	});

	describe('updateSuggestions behavior', () => {
		it('hides suggestions when query empty', () => {
			input.value = '';

			suggestions.updateSuggestions(input);

			expect(suggestions.isVisible()).toBe(false);
		});

		it('hides suggestions when no matches', () => {
			input.value = 'xyz';

			suggestions.updateSuggestions(input);

			expect(suggestions.isVisible()).toBe(false);
		});

		it('filters tags by query', () => {
			input.value = 'ap';
			extendAllElementsWithObsidian(container);

			suggestions.updateSuggestions(input);

			expect(screen.getByText('apple')).toBeInTheDocument();
			expect(screen.getByText('apricot')).toBeInTheDocument();
			expect(screen.queryByText('banana')).not.toBeInTheDocument();
		});

		it('performs case-insensitive filtering', () => {
			input.value = 'APP';
			extendAllElementsWithObsidian(container);

			suggestions.updateSuggestions(input);

			expect(screen.getByText('apple')).toBeInTheDocument();
		});

		it('excludes already selected tags', () => {
			suggestions.setGetSelectedTags(() => ['apple']);
			input.value = 'a';
			extendAllElementsWithObsidian(container);

			suggestions.updateSuggestions(input);

			expect(screen.queryByText('apple')).not.toBeInTheDocument();
			expect(screen.getByText('apricot')).toBeInTheDocument();
		});

		it('limits suggestions to 7', () => {
			mockTagSource.getTags.mockReturnValue(
				Array.from({ length: 20 }, (_, i: number) => `tag${i}`)
			);
			suggestions = new TagSuggestions(mockTagSource);
			suggestions.render(container, input);
			suggestions.setGetSelectedTags(() => []);

			input.value = 'tag';
			suggestions.updateSuggestions(input);

			const suggestionsContainer = container.querySelector('div[style*="position: fixed"]') as HTMLElement;
			const suggestionElements = suggestionsContainer.querySelectorAll('div[style*="cursor: pointer"]');
			expect(suggestionElements.length).toBeLessThanOrEqual(7);
		});

		it('shows suggestions when matches found', () => {
			input.value = 'ban';

			suggestions.updateSuggestions(input);

			expect(suggestions.isVisible()).toBe(true);
		});

		it('resets selection index on update', () => {
			input.value = 'app';
			suggestions.updateSuggestions(input);
			suggestions.navigateDown();

			input.value = 'b';
			suggestions.updateSuggestions(input);

			expect((suggestions as any).selectedIndex).toBe(-1);
		});
	});

	describe('navigation behavior', () => {
		beforeEach(() => {
			input.value = 'app';
			suggestions.updateSuggestions(input);
		});

		it('navigateDown selects next suggestion', () => {
			suggestions.navigateDown();

			expect((suggestions as any).selectedIndex).toBe(0);
		});

		it('navigateDown loops to first at end', () => {
			suggestions.navigateDown();
			suggestions.navigateDown();

			expect((suggestions as any).selectedIndex).toBe(0);
		});

		it('navigateUp selects previous suggestion', () => {
			suggestions.navigateDown();
			suggestions.navigateDown();
			suggestions.navigateUp();

			expect((suggestions as any).selectedIndex).toBeGreaterThanOrEqual(0);
		});

		it('navigateUp loops to last at start', () => {
			suggestions.navigateUp();

			expect((suggestions as any).selectedIndex).toBeGreaterThanOrEqual(0);
		});

		it('navigateDown increments index within bounds', () => {
			const initialIndex = (suggestions as any).selectedIndex;
			suggestions.navigateDown();
			const afterIndex = (suggestions as any).selectedIndex;

			expect(afterIndex).toBeGreaterThan(initialIndex);
		});
	});

	describe('selection behavior', () => {
		beforeEach(() => {
			input.value = 'app';
			suggestions.updateSuggestions(input);
		});

		it('selectCurrent calls callback with selected tag', () => {
			const onSelected = vi.fn();
			suggestions.setOnTagSelected(onSelected);
			suggestions.selectSuggestion(0);

			suggestions.selectCurrent();

			expect(onSelected).toHaveBeenCalledWith('apple');
		});

		it('selectCurrent returns true when selected', () => {
			suggestions.setOnTagSelected(() => {});
			suggestions.selectSuggestion(0);

			const result = suggestions.selectCurrent();

			expect(result).toBe(true);
		});

		it('selectCurrent returns false when none selected', () => {
			suggestions.setOnTagSelected(() => {});

			const result = suggestions.selectCurrent();

			expect(result).toBe(false);
		});

		it('selectSuggestion updates selected index', () => {
			suggestions.selectSuggestion(1);

			expect((suggestions as any).selectedIndex).toBe(1);
		});

		it('selectSuggestion marks element as selected', () => {
			suggestions.selectSuggestion(0);

			const suggestionsContainer = container.querySelector('div[style*="position: fixed"]') as HTMLElement;
			const selected = suggestionsContainer.querySelector('[data-selected="true"]');
			expect(selected).toBeInTheDocument();
		});
	});

	describe('visibility behavior', () => {
		it('hide hides suggestions', () => {
			input.value = 'app';
			suggestions.updateSuggestions(input);

			suggestions.hide();

			expect(suggestions.isVisible()).toBe(false);
		});

		it('isVisible returns true when visible', () => {
			input.value = 'ban';
			suggestions.updateSuggestions(input);

			expect(suggestions.isVisible()).toBe(true);
		});

		it('isVisible returns false when hidden', () => {
			expect(suggestions.isVisible()).toBe(false);
		});

		it('isVisible reflects display state', () => {
			input.value = 'app';
			suggestions.updateSuggestions(input);

			expect(suggestions.isVisible()).toBe(true);

			suggestions.hide();

			expect(suggestions.isVisible()).toBe(false);
		});
	});
});
