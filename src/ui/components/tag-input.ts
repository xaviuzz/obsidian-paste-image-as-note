import { TagChip } from './tag-chip';
import { TagSuggestions } from './tag-suggestions';
import { TagSource } from '../../services/tag-provider';

export class TagInput {
	private input: HTMLInputElement | null = null;
	private inputContainer: HTMLDivElement | null = null;
	private selectedTags: string[] = [];
	private tagChip: TagChip;
	private tagSuggestions: TagSuggestions;

	constructor(private tagSource: TagSource) {
		this.tagChip = new TagChip();
		this.tagSuggestions = new TagSuggestions(tagSource);
	}

	render(container: HTMLElement): HTMLInputElement {
		const tagsContainer: HTMLDivElement = container.createDiv();
		tagsContainer.style.marginTop = '10px';

		const tagsLabel: HTMLLabelElement = tagsContainer.createEl('label', {
			text: 'Tags:',
		});
		tagsLabel.style.display = 'block';
		tagsLabel.style.marginBottom = '5px';

		this.inputContainer = tagsContainer.createDiv();
		this.inputContainer.style.display = 'flex';
		this.inputContainer.style.flexWrap = 'wrap';
		this.inputContainer.style.gap = '6px';
		this.inputContainer.style.padding = '6px 8px';
		this.inputContainer.style.border = '1px solid var(--background-modifier-border)';
		this.inputContainer.style.borderRadius = '4px';
		this.inputContainer.style.background = 'var(--background-primary)';
		this.inputContainer.style.marginBottom = '10px';
		this.inputContainer.style.position = 'relative';
		this.inputContainer.style.minHeight = '36px';
		this.inputContainer.style.alignItems = 'center';

		this.input = this.inputContainer.createEl('input');
		this.input.type = 'text';
		this.input.placeholder = 'Add more tags...';
		this.input.style.border = 'none';
		this.input.style.outline = 'none';
		this.input.style.padding = '0 4px';
		this.input.style.flex = '1 1 auto';
		this.input.style.minWidth = '80px';
		this.input.style.background = 'transparent';
		this.input.style.font = 'inherit';
		this.input.style.color = 'inherit';
		this.input.style.height = 'auto';
		this.input.style.lineHeight = 'inherit';

		const suggestionsContainer = this.tagSuggestions.render(this.inputContainer, this.input);

		this.tagSuggestions.setGetSelectedTags(() => this.selectedTags);
		this.tagSuggestions.setOnTagSelected((tag: string) => {
			this.addTag(tag);
			if (this.input) {
				this.input.value = '';
			}
			this.tagSuggestions.hide();
		});

		return this.input;
	}

	addTag(tag: string): void {
		if (tag && !this.selectedTags.includes(tag)) {
			this.selectedTags.push(tag);
			this.renderChips();
		}
	}

	removeTag(tag: string): void {
		this.selectedTags = this.selectedTags.filter((t: string): boolean => t !== tag);
		this.renderChips();
	}

	private renderChips(): void {
		if (!this.inputContainer || !this.input) {
			return;
		}

		const existingChips = this.inputContainer.querySelectorAll('[data-tag-chip]');
		existingChips.forEach((chip) => chip.remove());

		this.selectedTags.forEach((tag: string) => {
			this.tagChip.render(this.inputContainer!, tag, (removedTag: string) => {
				this.removeTag(removedTag);
			});

			const chip = this.inputContainer!.querySelector('[data-tag-chip]:last-of-type') as HTMLDivElement;
			if (chip) {
				this.inputContainer!.insertBefore(chip, this.input);
			}
		});
	}

	getSelectedTags(): string[] {
		return this.selectedTags;
	}

	getInput(): HTMLInputElement | null {
		return this.input;
	}

	getSuggestions(): TagSuggestions {
		return this.tagSuggestions;
	}

	clearInput(): void {
		if (this.input) {
			this.input.value = '';
		}
	}
}
