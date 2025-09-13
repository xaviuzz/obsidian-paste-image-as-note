// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clipboard } = require('electron');
import { ImageFormats } from '../image-formats';

interface NativeImage {
	isEmpty(): boolean;
	toPNG(): Buffer;
}

export class ClipboardService {
	hasNoImage(): boolean {
		const formats: string[] = clipboard.availableFormats();
		return !ImageFormats.check(formats);
	}

	readImage(): Buffer {
		const image: NativeImage = clipboard.readImage();
		if (image.isEmpty()) {
			throw new Error('Clipboard image is empty');
		}
		return image.toPNG();
	}
}