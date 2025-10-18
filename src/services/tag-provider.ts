import { App } from 'obsidian';

export interface TagSource {
	loadTags(): string[];
	getTags(): string[];
}

export class TagProvider implements TagSource {
	private cachedTags: string[] = [];

	constructor(private app: App) {
		this.loadTags();
	}

	loadTags(): string[] {
		const metadataCache = this.app.metadataCache;
		const allTags: Set<string> = new Set();

		const files = this.app.vault.getMarkdownFiles();

		files.forEach((file) => {
			const cache = metadataCache.getFileCache(file);
			if (cache?.tags) {
				cache.tags.forEach((tagRef) => {
					const tag: string = tagRef.tag.replace('#', '');
					allTags.add(tag);
				});
			}
			if (cache?.frontmatter?.tags) {
				const frontmatterTags = cache.frontmatter.tags;
				if (Array.isArray(frontmatterTags)) {
					frontmatterTags.forEach((tag: string) => allTags.add(tag));
				}
			}
		});

		this.cachedTags = Array.from(allTags).sort();
		return this.cachedTags;
	}

	getTags(): string[] {
		return this.cachedTags;
	}
}
