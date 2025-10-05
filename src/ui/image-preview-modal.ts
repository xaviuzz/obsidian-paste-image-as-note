import { App, Modal } from 'obsidian';

export class ImagePreviewModal extends Modal {
	private imageBuffer: Buffer;
	private resolvePromise: (() => void) | null = null;

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
		);
		const blob: Blob = new Blob([arrayBuffer], { type: 'image/png' });
		const imageUrl: string = URL.createObjectURL(blob);
		
		const img: HTMLImageElement = contentEl.createEl('img');
		img.src = imageUrl;
		img.style.maxWidth = '100%';
		img.style.maxHeight = '500px';
		img.style.display = 'block';
		img.style.margin = '20px auto';
		
		const hint: HTMLParagraphElement = contentEl.createEl('p', { 
			text: 'Press Enter or click outside to create note' 
		});
		hint.style.textAlign = 'center';
		hint.style.color = 'var(--text-muted)';
		
		this.scope.register([], 'Enter', () => {
			this.close();
			return false;
		});
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
		if (this.resolvePromise) {
			this.resolvePromise();
		}
	}

	waitForClose(): Promise<void> {
		return new Promise((resolve) => {
			this.resolvePromise = resolve;
		});
	}
}
