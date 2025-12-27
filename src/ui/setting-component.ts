import PasteImagePlugin from '../main';

export abstract class SettingComponent {
	protected plugin: PasteImagePlugin;
	protected containerEl: HTMLElement;

	constructor(plugin: PasteImagePlugin, containerEl: HTMLElement) {
		this.plugin = plugin;
		this.containerEl = containerEl;
	}

	abstract render(): void | Promise<void>;
}