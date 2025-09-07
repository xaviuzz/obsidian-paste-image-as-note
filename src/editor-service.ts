import { App, Editor, MarkdownView } from 'obsidian';

export class EditorService {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	isEditing(): boolean {
		const activeView: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView);
		const isEditing: boolean = activeView !== null && activeView.getMode() === 'source';

		return isEditing;
	}

	getActiveEditor(): Editor {
		const activeView: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView === null || activeView.getMode() !== 'source') {

			throw new Error('No active editor available');
		}
		const editor: Editor = activeView.editor;

		return editor;
	}

	insertAtCursor(text: string): void {
		const editor: Editor = this.getActiveEditor();
		const cursor = editor.getCursor();
		editor.replaceRange(text, cursor);

	}
}