// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clipboard } = require('electron');
import { ImageFormats } from './image-formats';


export class Command {
	execute(): void {
		if (this.hasClipboardImage()) {
			const imageBuffer = this.getClipboardImage();
			if (imageBuffer) {
				console.log('Image read from clipboard, size:', imageBuffer.length, 'bytes');
			} else {
				console.log('Failed to read image from clipboard');
			}
		} else {
			console.log('No image in clipboard');
		}
	}

	private hasClipboardImage(): boolean {
		const formats = clipboard.availableFormats();
		return ImageFormats.check(formats);
	}
	
	private getClipboardImage(): Buffer | null {
		try {
			const image = clipboard.readImage();
			if (image.isEmpty()) {
				return null;
			}
			return image.toPNG();
		} catch (error) {
			console.error('Error reading clipboard image:', error);
			return null;
		}
	}
}