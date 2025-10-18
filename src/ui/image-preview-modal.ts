import { App, Modal } from 'obsidian';
import { ImagePreview } from './components/image-preview';
import { NameInput } from './components/name-input';
import { TagInput } from './components/tag-input';
import { TagProvider } from '../services/tag-provider';

export interface ModalResult {
	name: string;
	tags: string[];
	cancelled?: boolean;
}

export class ImagePreviewModal extends Modal {
	private imageBuffer: Buffer;
	private resolvePromise: ((result: ModalResult) => void) | null = null;
	private cancelled: boolean = true;

	private imagePreview: ImagePreview;
	private nameInput: NameInput;
	private tagInput: TagInput;
	private tagProvider: TagProvider;

	constructor(app: App, imageBuffer: Buffer) {
		super(app);
		this.imageBuffer = imageBuffer;
		this.tagProvider = new TagProvider(app);
		this.imagePreview = new ImagePreview();
		this.nameInput = new NameInput();
		this.tagInput = new TagInput(this.tagProvider);
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: 'Image Preview' });

		this.imagePreview.render(contentEl, this.imageBuffer);

		const nameInputElement = this.nameInput.render(contentEl);
		const tagInputElement = this.tagInput.render(contentEl);
		const suggestionsElement = this.tagInput.getSuggestions();

		const hint: HTMLParagraphElement = contentEl.createEl('p', {
			text: 'Press Enter in name field to create note',
		});
		hint.style.textAlign = 'center';
		hint.style.color = 'var(--text-muted)';

		this.scope.register([], 'Enter', () => {
			if (document.activeElement === tagInputElement) {
				if (suggestionsElement.isVisible() && suggestionsElement.selectCurrent()) {
					tagInputElement.value = '';
				} else if (tagInputElement.value.trim()) {
					this.tagInput.addTag(tagInputElement.value.trim());
					tagInputElement.value = '';
					suggestionsElement.hide();
				}
				return false;
			}

			this.submit();
			return false;
		});

		this.scope.register([], 'ArrowDown', () => {
			if (document.activeElement === tagInputElement) {
				suggestionsElement.navigateDown();
				return false;
			}
			return true;
		});

		this.scope.register([], 'ArrowUp', () => {
			if (document.activeElement === tagInputElement) {
				suggestionsElement.navigateUp();
				return false;
			}
			return true;
		});

		nameInputElement.focus();
		nameInputElement.select();
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

		const name: string = this.nameInput.getValue();
		const tags: string[] = this.tagInput.getSelectedTags();
		return { name, tags, cancelled: false };
	}
}
