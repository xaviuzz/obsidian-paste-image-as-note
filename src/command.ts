// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clipboard } = require('electron');
import { ImageFormats } from './image-formats';

interface NativeImage {
	isEmpty(): boolean;
	toPNG(): Buffer;
}


export class Command {
	execute(): void {
		if (this.hasClipboardImage()) {
			const imageBuffer: Buffer = this.getClipboardImage();
			console.log('Image read from clipboard, size:', imageBuffer.length, 'bytes');
		} else {
			console.log('No image in clipboard');
		}
	}

	private hasClipboardImage(): boolean {
		const formats: string[] = clipboard.availableFormats();
		return ImageFormats.check(formats);
	}
	
	private getClipboardImage(): Buffer {
		const image: NativeImage = clipboard.readImage();
		if (image.isEmpty()) {
			throw new Error('Clipboard image is empty');
		}
		return image.toPNG();
	}
}