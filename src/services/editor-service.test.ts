import { describe, it, expect, beforeEach } from 'vitest';
import { EditorService } from './editor-service';

describe('EditorService', () => {
	let app: FakeApp;
	let service: EditorService;

	beforeEach(() => {
		app = new FakeApp();
		service = new EditorService(app as any);
	});

	describe('editing state detection', () => {
		it('returns false when no active view', () => {
			app.workspace.activeView = null;

			const result: boolean = service.isEditing();

			expect(result).toBe(false);
		});

		it('returns false when active view is not in source mode', () => {
			app.workspace.activeView = new FakeMarkdownView('preview');

			const result: boolean = service.isEditing();

			expect(result).toBe(false);
		});

		it('returns true when active view exists and in source mode', () => {
			app.workspace.activeView = new FakeMarkdownView('source');

			const result: boolean = service.isEditing();

			expect(result).toBe(true);
		});
	});

	describe('text insertion behavior', () => {
		it('inserts text at cursor position', () => {
			const view: FakeMarkdownView = new FakeMarkdownView('source');
			view.editor.cursorPosition = { line: 5, ch: 10 };
			app.workspace.activeView = view;

			service.insertAtCursor('test text');

			expect(view.editor.insertedText).toBe('test text');
			expect(view.editor.insertedAt).toEqual({ line: 5, ch: 10 });
		});

		it('throws error when no active editor available', () => {
			app.workspace.activeView = null;

			expect(() => service.insertAtCursor('test')).toThrow('No active editor available');
		});

		it('throws error when view not in source mode', () => {
			app.workspace.activeView = new FakeMarkdownView('preview');

			expect(() => service.insertAtCursor('test')).toThrow('No active editor available');
		});
	});
});

interface CursorPosition {
	line: number;
	ch: number;
}

class FakeEditor {
	cursorPosition: CursorPosition = { line: 0, ch: 0 };
	insertedText: string = '';
	insertedAt: CursorPosition | null = null;

	getCursor(): CursorPosition {
		return this.cursorPosition;
	}

	replaceRange(text: string, position: CursorPosition): void {
		this.insertedText = text;
		this.insertedAt = position;
	}
}

class FakeMarkdownView {
	editor: FakeEditor;
	private mode: string;

	constructor(mode: string) {
		this.mode = mode;
		this.editor = new FakeEditor();
	}

	getMode(): string {
		return this.mode;
	}
}

class FakeWorkspace {
	activeView: FakeMarkdownView | null = null;

	getActiveViewOfType(viewType: any): FakeMarkdownView | null {
		return this.activeView;
	}
}

class FakeApp {
	workspace: FakeWorkspace;

	constructor() {
		this.workspace = new FakeWorkspace();
	}
}
