import { TagSource } from '../../services/tag-provider';

export class TagSuggestions {
	private container: HTMLDivElement | null = null;
	private currentSuggestions: string[] = [];
	private selectedIndex: number = -1;
	private readonly maxSuggestions = 7;
	private readonly maxHeight = '224px';
	private readonly zIndex = '10000';

	constructor(private tagSource: TagSource) {}

	render(parentContainer: HTMLElement, input: HTMLInputElement): HTMLDivElement {
		this.container = parentContainer.createDiv();
		this.container.style.display = 'none';
		this.container.style.position = 'fixed';
		this.container.style.maxHeight = this.maxHeight;
		this.container.style.overflowY = 'auto';
		this.container.style.background = 'var(--background-primary)';
		this.container.style.border = '1px solid var(--background-modifier-border)';
		this.container.style.borderRadius = '4px';
		this.container.style.zIndex = this.zIndex;
		this.container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

		input.addEventListener('input', () => {
			this.updateSuggestions(input);
		});

		return this.container;
	}

	updateSuggestions(input: HTMLInputElement): void {
		const query: string = input.value.toLowerCase().trim();

		if (!query) {
			this.hide();
			return;
		}

		const selectedTags: string[] = this.getSelectedTags();
		const matches: string[] = this.tagSource
			.getTags()
			.filter(
				(tag: string): boolean =>
					tag.toLowerCase().includes(query) && !selectedTags.includes(tag)
			)
			.slice(0, this.maxSuggestions);

		if (matches.length === 0) {
			this.hide();
			return;
		}

		this.currentSuggestions = matches;
		this.selectedIndex = -1;

		this.renderSuggestions(input, matches);
	}

	private renderSuggestions(input: HTMLInputElement, matches: string[]): void {
		if (!this.container) {
			return;
		}

		this.container.empty();
		this.container.style.display = 'block';

		const inputRect = input.getBoundingClientRect();
		this.container.style.top = `${inputRect.bottom + 4}px`;
		this.container.style.left = `${inputRect.left}px`;
		this.container.style.width = `${inputRect.width}px`;

		matches.forEach((tag: string, index: number) => {
			const suggestion: HTMLDivElement = this.container!.createDiv();
			suggestion.setAttribute('data-tag-index', index.toString());
			suggestion.style.padding = '8px 12px';
			suggestion.style.cursor = 'pointer';
			suggestion.style.background = 'var(--background-primary)';
			suggestion.textContent = tag;

			suggestion.addEventListener('mouseenter', () => {
				this.selectSuggestion(index);
			});

			suggestion.addEventListener('click', () => {
				this.onSuggestionSelected(tag);
			});
		});
	}

	selectSuggestion(index: number): void {
		if (!this.container) {
			return;
		}

		const previousSelected = this.container.querySelector('[data-selected="true"]');
		if (previousSelected) {
			previousSelected.setAttribute('data-selected', 'false');
			(previousSelected as HTMLDivElement).style.background = 'var(--background-primary)';
		}

		this.selectedIndex = index;
		const suggestion = this.container.querySelector(
			`[data-tag-index="${index}"]`
		) as HTMLDivElement;
		if (suggestion) {
			suggestion.setAttribute('data-selected', 'true');
			suggestion.style.background = 'var(--background-modifier-hover)';
			suggestion.scrollIntoView({ block: 'nearest' });
		}
	}

	selectCurrent(): boolean {
		if (this.selectedIndex >= 0 && this.selectedIndex < this.currentSuggestions.length) {
			const tag: string = this.currentSuggestions[this.selectedIndex];
			this.onSuggestionSelected(tag);
			return true;
		}
		return false;
	}

	navigateDown(): void {
		if (this.currentSuggestions.length > 0) {
			const nextIndex = this.selectedIndex + 1;
			if (nextIndex < this.currentSuggestions.length) {
				this.selectSuggestion(nextIndex);
			} else {
				this.selectSuggestion(0);
			}
		}
	}

	navigateUp(): void {
		if (this.currentSuggestions.length > 0) {
			const previousIndex = this.selectedIndex - 1;
			if (previousIndex >= 0) {
				this.selectSuggestion(previousIndex);
			} else {
				this.selectSuggestion(this.currentSuggestions.length - 1);
			}
		}
	}

	hide(): void {
		if (this.container) {
			this.container.style.display = 'none';
		}
	}

	isVisible(): boolean {
		return this.container?.style.display === 'block';
	}

	private onSuggestionSelected(tag: string): void {
		// Placeholder - will be connected to TagInput in orchestrator
		this.addTagCallback(tag);
	}

	private addTagCallback = (tag: string): void => {
		// Override in orchestrator
	};

	setOnTagSelected(callback: (tag: string) => void): void {
		this.addTagCallback = callback;
	}

	private getSelectedTags(): string[] {
		// Override in orchestrator
		return [];
	}

	setGetSelectedTags(callback: () => string[]): void {
		this.getSelectedTags = callback;
	}
}
