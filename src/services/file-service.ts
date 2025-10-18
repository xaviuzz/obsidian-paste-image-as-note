import { TFile } from 'obsidian';

export class FileService {
	private readonly imageExtensions: string[] = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];

	isImage(file: TFile): boolean {
		const extension: string = this.getExtension(file.path);
		return this.imageExtensions.includes(extension);
	}

	private getExtension(path: string): string {
		const lastDot: number = path.lastIndexOf('.');
		if (lastDot === -1) {
			return '';
		}
		return path.substring(lastDot).toLowerCase();
	}
}
