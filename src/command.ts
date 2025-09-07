// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clipboard } = require('electron');
import { ImageFormats } from './image-formats';


export class Command {
	execute(): void {
		if (this.hasClipboardImage()) {
			console.log('Image detected in clipboard');
		} else {
			console.log('No image in clipboard');
		}
	}

	private hasClipboardImage(): boolean {
		const formats = clipboard.availableFormats();
		return ImageFormats.check(formats);
	}
}