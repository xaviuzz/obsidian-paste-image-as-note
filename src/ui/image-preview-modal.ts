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
	private cancelled: boolean = true;

	private readonly defaultPrefix = 'pasted-image-';

	constructor(app: App, imageBuffer: Buffer) {
		super(app);
		this.imageBuffer = imageBuffer;
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
			text: 'Tags (comma-separated):'
		});
		tagsLabel.style.display = 'block';
		tagsLabel.style.marginBottom = '5px';

		this.tagsInput = tagsContainer.createEl('input');
		this.tagsInput.type = 'text';
		this.tagsInput.placeholder = 'e.g., screenshot, work, project-x';
		this.tagsInput.style.width = '100%';
		this.tagsInput.style.padding = '8px';
		this.tagsInput.style.marginBottom = '10px';

		const hint: HTMLParagraphElement = contentEl.createEl('p', {
			text: 'Press Enter to create note'
		});
		hint.style.textAlign = 'center';
		hint.style.color = 'var(--text-muted)';

		this.scope.register([], 'Enter', () => {
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
		if (this.tagsInput && this.tagsInput.value.trim()) {
			return this.tagsInput.value
				.split(',')
				.map((tag: string): string => tag.trim())
				.filter((tag: string): boolean => tag.length > 0);
		}
		return [];
	}

	private generateDefaultName(): string {
		return `${this.defaultPrefix}${Date.now()}`;
	}
}
