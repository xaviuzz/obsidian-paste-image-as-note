import { App, Modal } from 'obsidian';

export interface ModalResult {
	name: string;
	tags: string[];
	cancelled?: boolean;
}

export class ImagePreviewModal extends Modal {
	private imageBuffer: Buffer;
	private resolvePromise: ((result: ModalResult) => void) | null = null;
	private nameInput: HTMLInputElement | null = null;
	private tagsInput: HTMLInputElement | null = null;
	private tagsChipContainer: HTMLDivElement | null = null;
	private tagSuggestionsContainer: HTMLDivElement | null = null;
	private selectedTags: string[] = [];
	private cancelled: boolean = true;
	private allVaultTags: string[] = [];

	private readonly defaultPrefix = 'pasted-image-';

	constructor(app: App, imageBuffer: Buffer) {
		super(app);
		this.imageBuffer = imageBuffer;
		this.loadVaultTags();
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.empty();
		
		contentEl.createEl('h2', { text: 'Image Preview' });
		
		const arrayBuffer: ArrayBuffer = this.imageBuffer.buffer.slice(
			this.imageBuffer.byteOffset,
			this.imageBuffer.byteOffset + this.imageBuffer.byteLength
		) as ArrayBuffer;
		const blob: Blob = new Blob([arrayBuffer], { type: 'image/png' });
		const imageUrl: string = URL.createObjectURL(blob);
		
		const img: HTMLImageElement = contentEl.createEl('img');
		img.src = imageUrl;
		img.style.maxWidth = '100%';
		img.style.maxHeight = '400px';
		img.style.display = 'block';
		img.style.margin = '20px auto';
		
		const nameContainer: HTMLDivElement = contentEl.createDiv();
		nameContainer.style.marginTop = '20px';
		
		const nameLabel: HTMLLabelElement = nameContainer.createEl('label', { 
			text: 'Name:' 
		});
		nameLabel.style.display = 'block';
		nameLabel.style.marginBottom = '5px';
		
		this.nameInput = nameContainer.createEl('input');
		this.nameInput.type = 'text';
		this.nameInput.value = this.generateDefaultName();
		this.nameInput.style.width = '100%';
		this.nameInput.style.padding = '8px';
		this.nameInput.style.marginBottom = '10px';

		const tagsContainer: HTMLDivElement = contentEl.createDiv();
		tagsContainer.style.marginTop = '10px';

		const tagsLabel: HTMLLabelElement = tagsContainer.createEl('label', {
			text: 'Tags:'
		});
		tagsLabel.style.display = 'block';
		tagsLabel.style.marginBottom = '5px';

		this.tagsChipContainer = tagsContainer.createDiv();
		this.tagsChipContainer.style.display = 'flex';
		this.tagsChipContainer.style.flexWrap = 'wrap';
		this.tagsChipContainer.style.gap = '6px';
		this.tagsChipContainer.style.marginBottom = '8px';
		this.tagsChipContainer.style.minHeight = '32px';
		this.tagsChipContainer.style.padding = '4px';
		this.tagsChipContainer.style.border = '1px solid var(--background-modifier-border)';
		this.tagsChipContainer.style.borderRadius = '4px';
		this.tagsChipContainer.style.background = 'var(--background-primary)';

		const tagInputWrapper: HTMLDivElement = tagsContainer.createDiv();
		tagInputWrapper.style.position = 'relative';

		this.tagsInput = tagInputWrapper.createEl('input');
		this.tagsInput.type = 'text';
		this.tagsInput.placeholder = 'Type to search tags...';
		this.tagsInput.style.width = '100%';
		this.tagsInput.style.padding = '8px';
		this.tagsInput.style.marginBottom = '10px';

		this.tagSuggestionsContainer = tagInputWrapper.createDiv();
		this.tagSuggestionsContainer.style.display = 'none';

		this.tagsInput.addEventListener('input', () => {
			this.updateTagSuggestions();
		});

		const hint: HTMLParagraphElement = contentEl.createEl('p', {
			text: 'Press Enter in name field to create note'
		});
		hint.style.textAlign = 'center';
		hint.style.color = 'var(--text-muted)';

		this.scope.register([], 'Enter', () => {
			if (document.activeElement === this.tagsInput) {
				if (this.tagsInput && this.tagsInput.value.trim()) {
					this.addTag(this.tagsInput.value.trim());
					this.tagsInput.value = '';
					this.hideSuggestions();
				}
				return false;
			}

			this.submit();
			return false;
		});

		this.nameInput.focus();
		this.nameInput.select();
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
		if (this.resolvePromise) {
			const result: ModalResult = this.getResult();
			this.resolvePromise(result);
		}
	}

	waitForClose(): Promise<ModalResult> {
		return new Promise((resolve) => {
			this.resolvePromise = resolve;
		});
	}

	private submit(): void {
		this.cancelled = false;
		this.close();
	}

	private getResult(): ModalResult {
		if (this.cancelled) {
			return { name: '', tags: [], cancelled: true };
		}

		const name: string = this.getSubmittedName();
		const tags: string[] = this.getSubmittedTags();
		return { name, tags, cancelled: false };
	}

	private getSubmittedName(): string {
		if (this.nameInput && this.nameInput.value.trim()) {
			return this.nameInput.value.trim().replace(/ /g, '_');
		}
		return this.generateDefaultName();
	}

	private getSubmittedTags(): string[] {
		return this.selectedTags;
	}

	private generateDefaultName(): string {
		return `${this.defaultPrefix}${Date.now()}`;
	}

	private loadVaultTags(): void {
		const metadataCache = this.app.metadataCache;
		const allTags: Set<string> = new Set();

		const files = this.app.vault.getMarkdownFiles();

		files.forEach((file) => {
			const cache = metadataCache.getFileCache(file);
			if (cache?.tags) {
				cache.tags.forEach((tagRef) => {
					const tag: string = tagRef.tag.replace('#', '');
					allTags.add(tag);
				});
			}
			if (cache?.frontmatter?.tags) {
				const frontmatterTags = cache.frontmatter.tags;
				if (Array.isArray(frontmatterTags)) {
					frontmatterTags.forEach((tag: string) => allTags.add(tag));
				}
			}
		});

		this.allVaultTags = Array.from(allTags).sort();
	}

	private addTag(tag: string): void {
		if (tag && !this.selectedTags.includes(tag)) {
			this.selectedTags.push(tag);
			this.renderTagChips();
		}
	}

	private removeTag(tag: string): void {
		this.selectedTags = this.selectedTags.filter((t: string): boolean => t !== tag);
		this.renderTagChips();
	}

	private renderTagChips(): void {
		if (!this.tagsChipContainer) {
			return;
		}

		this.tagsChipContainer.empty();

		this.selectedTags.forEach((tag: string) => {
			const chip: HTMLDivElement = this.tagsChipContainer!.createDiv();
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
				this.removeTag(tag);
			});
		});
	}

	private updateTagSuggestions(): void {
		if (!this.tagsInput || !this.tagSuggestionsContainer) {
			return;
		}

		const query: string = this.tagsInput.value.toLowerCase().trim();

		if (!query) {
			this.hideSuggestions();
			return;
		}

		const matches: string[] = this.allVaultTags
			.filter((tag: string): boolean =>
				tag.toLowerCase().includes(query) && !this.selectedTags.includes(tag)
			)
			.slice(0, 10);

		if (matches.length === 0) {
			this.hideSuggestions();
			return;
		}

		this.tagSuggestionsContainer.empty();
		this.tagSuggestionsContainer.style.display = 'block';
		this.tagSuggestionsContainer.style.position = 'absolute';
		this.tagSuggestionsContainer.style.top = '0px';
		this.tagSuggestionsContainer.style.left = '0';
		this.tagSuggestionsContainer.style.right = '0';
		this.tagSuggestionsContainer.style.background = 'var(--background-primary)';
		this.tagSuggestionsContainer.style.border = '1px solid var(--background-modifier-border)';
		this.tagSuggestionsContainer.style.borderRadius = '4px';
		this.tagSuggestionsContainer.style.maxHeight = '200px';
		this.tagSuggestionsContainer.style.overflowY = 'auto';
		this.tagSuggestionsContainer.style.zIndex = '1000';
		this.tagSuggestionsContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

		matches.forEach((tag: string) => {
			const suggestion: HTMLDivElement = this.tagSuggestionsContainer!.createDiv();
			suggestion.style.padding = '8px 12px';
			suggestion.style.cursor = 'pointer';
			suggestion.textContent = tag;

			suggestion.addEventListener('mouseenter', () => {
				suggestion.style.background = 'var(--background-modifier-hover)';
			});

			suggestion.addEventListener('mouseleave', () => {
				suggestion.style.background = '';
			});

			suggestion.addEventListener('click', () => {
				this.addTag(tag);
				if (this.tagsInput) {
					this.tagsInput.value = '';
				}
				this.hideSuggestions();
			});
		});
	}

	private hideSuggestions(): void {
		if (this.tagSuggestionsContainer) {
			this.tagSuggestionsContainer.style.display = 'none';
		}
	}
}
