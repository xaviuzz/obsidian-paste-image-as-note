export class App {}
export class Editor {}
export class MarkdownView {}
export class Plugin {}
export class PluginSettingTab {}
export class Setting {}
export class Notice {}
export class Modal {
	app: App;
	scope = {
		register: () => {}
	};
	contentEl = {
		empty: () => {},
		createEl: () => ({
			style: {}
		})
	};

	constructor(app: App) {
		this.app = app;
	}

	open(): void {}
	close(): void {}
	onOpen(): void {}
	onClose(): void {}
}
