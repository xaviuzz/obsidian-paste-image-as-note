import { App, Editor, MarkdownView } from 'obsidian';

export class EditorService {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	isEditing(): boolean {
		const activeView: MarkdownView | null = this.getActiveView();
		const hasActiveView: boolean = activeView !== null;
		const editing: boolean = hasActiveView && this.inSourceMode(activeView);
		
		return editing;
	}

	private getActiveView(): MarkdownView | null {
		return this.app.workspace.getActiveViewOfType(MarkdownView);
	}

	private inSourceMode(activeView: MarkdownView | null) {
		return activeView!.getMode() === 'source';
	}

	private getActiveEditor(): Editor {
		if (!this.isEditing()) {
			throw new Error('No active editor available');
		}
		const editor: Editor = this.getActiveView()!.editor;

		return editor;
	}

	insertAtCursor(text: string): void {
		const editor: Editor = this.getActiveEditor();
		const cursor = editor.getCursor();
		editor.replaceRange(text, cursor);

	}
}