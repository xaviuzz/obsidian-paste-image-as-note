/**
 * Extends standard HTMLElement with Obsidian's DOM convenience methods
 * for testing purposes. This allows Testing Library tests to work with
 * components that use Obsidian's DOM API.
 */

interface ObsidianHTMLElement {
	createDiv(): HTMLDivElement;
	createEl(tagName: string, options?: { text?: string }): HTMLElement;
	createSpan(options?: { text?: string }): HTMLSpanElement;
	empty(): void;
}

interface CreateElementOptions {
	text?: string;
}

export function extendHTMLElementWithObsidian(element: HTMLElement): void {
	const obsidianElement = element as unknown as ObsidianHTMLElement;

	if (!('createDiv' in element)) {
		obsidianElement.createDiv = function (this: HTMLElement): HTMLDivElement {
			const div: HTMLDivElement = document.createElement('div');
			this.appendChild(div);
			extendHTMLElementWithObsidian(div);
			return div;
		};
	}

	if (!('createEl' in element)) {
		obsidianElement.createEl = function (
			this: HTMLElement,
			tagName: string,
			options?: CreateElementOptions
		): HTMLElement {
			const el: HTMLElement = document.createElement(tagName);
			if (options?.text) {
				el.textContent = options.text;
			}
			this.appendChild(el);
			extendHTMLElementWithObsidian(el);
			return el;
		};
	}

	if (!('createSpan' in element)) {
		obsidianElement.createSpan = function (
			this: HTMLElement,
			options?: CreateElementOptions
		): HTMLSpanElement {
			const span: HTMLSpanElement = document.createElement('span');
			if (options?.text) {
				span.textContent = options.text;
			}
			this.appendChild(span);
			extendHTMLElementWithObsidian(span);
			return span;
		};
	}

	if (!('empty' in element)) {
		obsidianElement.empty = function (this: HTMLElement): void {
			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}
		};
	}
}

/**
 * Helper to extend all children recursively
 */
export function extendAllElementsWithObsidian(element: HTMLElement): void {
	extendHTMLElementWithObsidian(element);
	Array.from(element.children).forEach((child) => {
		extendAllElementsWithObsidian(child as HTMLElement);
	});
}
