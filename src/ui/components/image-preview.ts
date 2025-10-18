export class ImagePreview {
	private readonly maxWidth = '100%';
	private readonly maxHeight = '400px';
	private readonly imageMargin = '20px auto';

	render(container: HTMLElement, imageBuffer: Buffer): void {
		const arrayBuffer: ArrayBuffer = imageBuffer.buffer.slice(
			imageBuffer.byteOffset,
			imageBuffer.byteOffset + imageBuffer.byteLength
		) as ArrayBuffer;
		const blob: Blob = new Blob([arrayBuffer], { type: 'image/png' });
		const imageUrl: string = URL.createObjectURL(blob);

		const img: HTMLImageElement = container.createEl('img');
		img.src = imageUrl;
		img.style.maxWidth = this.maxWidth;
		img.style.maxHeight = this.maxHeight;
		img.style.display = 'block';
		img.style.margin = this.imageMargin;
	}
}
