import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/dom';
import { TagChip } from './tag-chip';
import { extendHTMLElementWithObsidian, extendAllElementsWithObsidian } from '../../test-utils/obsidian-dom-extensions';

describe('TagChip', () => {
	let container: HTMLElement;
	let tagChip: TagChip;

	beforeEach(() => {
		container = document.createElement('div');
		extendHTMLElementWithObsidian(container);
		document.body.appendChild(container);
		tagChip = new TagChip();
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	describe('render behavior', () => {
		it('creates chip element with data-tag-chip attribute', () => {
			tagChip.render(container, 'test-tag', () => {});

			const chip = container.querySelector('[data-tag-chip="true"]');
			expect(chip).toBeInTheDocument();
		});

		it('displays tag text in chip', () => {
			tagChip.render(container, 'my-tag', () => {});
			extendAllElementsWithObsidian(container);

			expect(screen.getByText('my-tag')).toBeInTheDocument();
		});

		it('applies inline-flex display', () => {
			tagChip.render(container, 'test-tag', () => {});

			const chip = container.querySelector('[data-tag-chip="true"]') as HTMLElement;
			expect(chip.style.display).toBe('inline-flex');
		});

		it('applies alignItems center', () => {
			tagChip.render(container, 'test-tag', () => {});

			const chip = container.querySelector('[data-tag-chip="true"]') as HTMLElement;
			expect(chip.style.alignItems).toBe('center');
		});

		it('applies gap 4px', () => {
			tagChip.render(container, 'test-tag', () => {});

			const chip = container.querySelector('[data-tag-chip="true"]') as HTMLElement;
			expect(chip.style.gap).toBe('4px');
		});

		it('applies padding 4px 8px', () => {
			tagChip.render(container, 'test-tag', () => {});

			const chip = container.querySelector('[data-tag-chip="true"]') as HTMLElement;
			expect(chip.style.padding).toBe('4px 8px');
		});

		it('applies background modifier border color', () => {
			tagChip.render(container, 'test-tag', () => {});

			const chip = container.querySelector('[data-tag-chip="true"]') as HTMLElement;
			expect(chip.style.background).toBe('var(--background-modifier-border)');
		});

		it('applies border-radius 4px', () => {
			tagChip.render(container, 'test-tag', () => {});

			const chip = container.querySelector('[data-tag-chip="true"]') as HTMLElement;
			expect(chip.style.borderRadius).toBe('4px');
		});

		it('applies font-size 12px', () => {
			tagChip.render(container, 'test-tag', () => {});

			const chip = container.querySelector('[data-tag-chip="true"]') as HTMLElement;
			expect(chip.style.fontSize).toBe('12px');
		});

		it('creates remove button with × symbol', () => {
			tagChip.render(container, 'test-tag', () => {});
			extendAllElementsWithObsidian(container);

			const removeBtn = screen.getByText('×');
			expect(removeBtn.tagName.toLowerCase()).toBe('span');
		});

		it('sets remove button cursor to pointer', () => {
			tagChip.render(container, 'test-tag', () => {});

			const chip = container.querySelector('[data-tag-chip="true"]') as HTMLElement;
			const removeBtn = chip.querySelector('span:last-child') as HTMLElement;
			expect(removeBtn.style.cursor).toBe('pointer');
		});
	});

	describe('remove button behavior', () => {
		it('calls onRemove callback when clicked', () => {
			const onRemove = vi.fn();
			tagChip.render(container, 'test-tag', onRemove);
			extendAllElementsWithObsidian(container);

			const removeBtn = screen.getByText('×');
			fireEvent.click(removeBtn);

			expect(onRemove).toHaveBeenCalledWith('test-tag');
		});

		it('passes correct tag to callback', () => {
			const onRemove = vi.fn();
			tagChip.render(container, 'my-custom-tag', onRemove);
			extendAllElementsWithObsidian(container);

			const removeBtn = screen.getByText('×');
			fireEvent.click(removeBtn);

			expect(onRemove).toHaveBeenCalledWith('my-custom-tag');
		});

		it('handles multiple chips with different callbacks', () => {
			const onRemove1 = vi.fn();
			const onRemove2 = vi.fn();

			const chip1Container = document.createElement('div');
			const chip2Container = document.createElement('div');
			extendHTMLElementWithObsidian(chip1Container);
			extendHTMLElementWithObsidian(chip2Container);
			document.body.appendChild(chip1Container);
			document.body.appendChild(chip2Container);

			tagChip.render(chip1Container, 'tag1', onRemove1);
			tagChip.render(chip2Container, 'tag2', onRemove2);
			extendAllElementsWithObsidian(chip1Container);
			extendAllElementsWithObsidian(chip2Container);

			const removeBtns = screen.getAllByText('×');
			fireEvent.click(removeBtns[0]);
			fireEvent.click(removeBtns[1]);

			expect(onRemove1).toHaveBeenCalledWith('tag1');
			expect(onRemove2).toHaveBeenCalledWith('tag2');

			document.body.removeChild(chip1Container);
			document.body.removeChild(chip2Container);
		});

		it('callback called only once per click', () => {
			const onRemove = vi.fn();
			tagChip.render(container, 'test-tag', onRemove);
			extendAllElementsWithObsidian(container);

			const removeBtn = screen.getByText('×');
			fireEvent.click(removeBtn);
			fireEvent.click(removeBtn);

			expect(onRemove).toHaveBeenCalledTimes(2);
		});
	});
});
