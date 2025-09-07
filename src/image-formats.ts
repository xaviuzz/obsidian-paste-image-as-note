export class ImageFormats {
	static check(formats: string[]): boolean {
		return formats.some((format: string): boolean => 
			format.includes('image/') || 
			format.includes('image') ||
			format === 'public.png' ||
			format === 'public.jpeg'
		);
	}
}