# Stage One Plan: Paste Image as Note - Atomic Steps

## Overview
Implementation plan for basic "paste image as note" functionality in 6 atomic, testable steps.

## Current State
- Basic plugin boilerplate exists in `main.ts`
- Empty settings interface and default settings  
- No paste functionality implemented yet
- All build tooling is configured

## Atomic Implementation Steps

### Step 1: Add Basic Command Registration
**Goal:** Register a command that appears in Obsidian's command palette
- Modify `main.ts` onload method
- Add `this.addCommand()` call with:
  - id: `"paste-image-as-note"`
  - name: `"Paste image as note"`
  - callback: empty function (just console.log for now)
- **Test:** Command appears in command palette when triggered

### Step 2: Implement Clipboard Image Detection
**Goal:** Function to check if clipboard contains image data
- Add method `hasClipboardImage(): boolean`
- Use Electron's clipboard API: `require('electron').clipboard`
- Check `clipboard.availableFormats()` for image formats
- Return true if image formats found
- **Test:** Function returns correct boolean based on clipboard content

### Step 3: Add Clipboard Image Reading  
**Goal:** Extract actual image data from clipboard
- Add method `getClipboardImage(): Buffer | null`
- Use `clipboard.readImage()` to get NativeImage
- Convert to Buffer using `.toPNG()` or `.toJPEG()`
- Handle errors and return null if no image
- **Test:** Function returns valid image buffer when image in clipboard

### Step 4: Create Image File in Vault
**Goal:** Save image buffer as file in the vault
- Add method `saveImageToVault(imageBuffer: Buffer): string`
- Generate unique filename using timestamp: `pasted-image-${Date.now()}.png`
- Use Obsidian API `this.app.vault.createBinary()` to save
- Save to vault root (can be configurable later)
- Return the filename for linking
- **Test:** Image file appears in vault with correct content

### Step 5: Create New Note with Image Embed
**Goal:** Generate new note that displays the pasted image
- Add method `createNoteWithImage(imagePath: string): void`
- Generate note filename: `Image Note ${Date.now()}.md`
- Create note content with markdown image syntax: `![](imagePath)`
- Use `this.app.vault.create()` to create note
- **Test:** New note created with embedded image that displays correctly

### Step 6: Wire Command Callback
**Goal:** Connect all pieces together with error handling
- Update command callback to orchestrate all steps:
  1. Check `hasClipboardImage()`
  2. If true: get image, save to vault, create note
  3. If false: show notice "No image in clipboard"
- Add success/error notifications using `new Notice()`
- **Test:** Full workflow works end-to-end from command palette

## Success Criteria
After Step 6: User can copy image to clipboard, run "Paste image as note" command, and get a new note with the embedded image.

## Next Stages (Future)
- Settings for image folder, filename templates
- Image optimization and format options  
- Custom note templates
- Hotkey support
- Mobile compatibility