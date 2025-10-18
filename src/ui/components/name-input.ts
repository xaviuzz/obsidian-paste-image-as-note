export class NameInput {
	private readonly defaultPrefix = 'pasted-image-';
	private input: HTMLInputElement | null = null;

	render(container: HTMLElement): HTMLInputElement {
		const nameContainer: HTMLDivElement = container.createDiv();
		nameContainer.style.marginTop = '20px';

		const nameLabel: HTMLLabelElement = nameContainer.createEl('label', {
			text: 'Name:',
		});
		nameLabel.style.display = 'block';
		nameLabel.style.marginBottom = '5px';

		this.input = nameContainer.createEl('input');
		this.input.type = 'text';
		this.input.value = this.generateDefaultName();
		this.input.style.width = '100%';
		this.input.style.padding = '8px';
		this.input.style.marginBottom = '10px';

		return this.input;
	}

	getValue(): string {
		if (this.input && this.input.value.trim()) {
			return this.input.value.trim().replace(/ /g, '_');
		}
		return this.generateDefaultName();
	}

	private generateDefaultName(): string {
		return `${this.defaultPrefix}${Date.now()}`;
	}

	getInput(): HTMLInputElement | null {
		return this.input;
	}
}
