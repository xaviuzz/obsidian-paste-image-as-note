# Stage Two Plan: Automatic Paste Detection with Smart Note Linking

## Overview
Implement automatic image paste detection that creates image notes and intelligently links them based on editing context.

## Current State
- Stage One completed: Manual command-based image pasting works perfectly
- Plugin creates image files and notes with embedded images
- Professional user notifications and error handling in place
- All basic functionality tested and working

## Requirements
1. **Automatic Detection**: Detect Ctrl+V/Cmd+V paste events when clipboard contains images
2. **Context-Aware Behavior**: 
   - If editing a note: Create image note + insert `[[Note Title]]` link at cursor position
   - If not editing: Create image note only (existing Stage One behavior)
3. **Seamless Integration**: No manual command needed - works automatically on paste

## Atomic Implementation Steps

### Step 1: Add Paste Event Detection
**Goal:** Register global paste event listener to intercept image pastes
- Add paste event listener in `main.ts` onload method
- Use `this.registerDomEvent()` for proper cleanup
- Listen for 'paste' events on document
- Check if clipboard contains image before intercepting
- **Test:** Console logging when image paste is detected

### Step 2: Implement Context Detection
**Goal:** Determine if user is currently editing a note
- Add method `isNoteBeingEdited(): boolean` to Command class
- Use `this.app.workspace.getActiveViewOfType(MarkdownView)` to get active editor
- Check if editor exists and is in edit mode
- Return boolean indicating edit state
- **Test:** Method correctly identifies when user is editing vs not editing

### Step 3: Get Active Editor Reference
**Goal:** Access current editor for cursor insertion
- Add method `getCurrentEditor(): Editor | null` to Command class  
- Get active MarkdownView and extract editor
- Handle case where no editor is active
- Return Editor instance or null
- **Test:** Method returns valid editor when editing, null otherwise

### Step 4: Create Note Link Insertion Method
**Goal:** Insert note link at cursor position in active editor
- Add method `insertNoteLinkAtCursor(noteTitle: string): void` to Command class
- Use `editor.replaceSelection()` to insert `[[${noteTitle}]]` at cursor
- Handle cursor positioning after insertion
- Use proper Obsidian link syntax for note references
- **Test:** Link correctly inserted at cursor position in active note

### Step 5: Refactor Execute Method for Dual Behavior
**Goal:** Smart execution based on editing context
- Modify `execute()` method to check editing context
- Branch logic: 
  - If editing: create image note + insert link at cursor
  - If not editing: create standalone image note (existing behavior)
- Maintain single return policy and error handling
- Update user notifications to reflect context
- **Test:** Correct behavior in both editing and non-editing contexts

### Step 6: Wire Paste Event to Smart Execution
**Goal:** Connect paste detection to context-aware execution
- Update paste event handler to call modified `execute()` method
- Prevent default paste behavior only for images
- Allow normal text paste to work unchanged
- Handle edge cases: read-only files, non-markdown files
- **Test:** Automatic paste detection works with smart context behavior

## Technical Considerations
- Use Obsidian's `MarkdownView` and `Editor` APIs for note integration
- Maintain comprehensive TypeScript typing for all new methods
- Follow single return policy and readable code practices
- Handle edge cases gracefully with appropriate user feedback
- Use `[[Note Title]]` syntax for internal Obsidian note links

## Success Criteria
After Step 6: 
- User can paste images automatically without manual command
- When editing a note: creates image note and inserts link at cursor
- When not editing: creates standalone image note (Stage One behavior)
- Professional user notifications for all scenarios
- Existing manual command continues to work as fallback

## Future Considerations (Stage Three+)
- Settings for image folder organization
- Custom note templates
- Image format options
- Hotkey customization
- Mobile compatibility