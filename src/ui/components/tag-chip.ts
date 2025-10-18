export class TagChip {
	render(container: HTMLElement, tag: string, onRemove: (tag: string) => void): void {
		const chip: HTMLDivElement = container.createDiv();
		chip.setAttribute('data-tag-chip', 'true');
		chip.style.display = 'inline-flex';
		chip.style.alignItems = 'center';
		chip.style.gap = '4px';
		chip.style.padding = '4px 8px';
		chip.style.background = 'var(--background-modifier-border)';
		chip.style.borderRadius = '4px';
		chip.style.fontSize = '12px';
		chip.style.cursor = 'default';

		chip.createSpan({ text: tag });

		const removeBtn: HTMLSpanElement = chip.createSpan({ text: '×' });
		removeBtn.style.cursor = 'pointer';
		removeBtn.style.fontSize = '16px';
		removeBtn.style.fontWeight = 'bold';
		removeBtn.style.marginLeft = '2px';
		removeBtn.addEventListener('click', () => {
			onRemove(tag);
		});
	}
}
