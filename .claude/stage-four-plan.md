# Stage Four Plan: Optional Image Preview Modal (Feature-Driven Increments)

## Overview
Build optional modal UI incrementally, where each step delivers a complete, usable feature. Start minimal and add capabilities one at a time.

## Philosophy
Each step is a **complete, working feature** that users could actually use. No half-implemented functionality.

---

## Step 1: Basic Image Preview Modal (View Only)
**Deliverable:** Modal that shows clipboard image and closes with Enter key

**What works after this step:**
- Setting toggle: "Show preview before creating note" (default: off)
- When enabled: Modal opens showing image preview
- Press Enter or click outside → modal closes, note created with defaults
- When disabled: Existing behavior (no modal)

**User value:** See what you're pasting before committing

---

## Step 2: Editable Image Name
**Deliverable:** Preview modal now allows renaming the image file

**What's NEW after this step:**
- Text input field in modal pre-filled with default name (e.g., "pasted-image-1234567890")
- User can edit name before pressing Enter
- Enter key uses edited name for both image file and note title
- Empty name falls back to default

**User value:** Control image/note naming instead of timestamps

---

## Step 3: Add Tags to Image Note
**Deliverable:** Preview modal includes tag input that adds frontmatter to notes

**What's NEW after this step:**
- Second text input field for tags (comma-separated, e.g., "screenshot, work, project-x")
- Enter key creates note with YAML frontmatter containing tags
- Empty tags input = no frontmatter (backward compatible)
- Tags appear in note's frontmatter: `tags: [screenshot, work, project-x]`

**User value:** Organize image notes with searchable tags immediately upon creation

---

## Technical Summary

### Step 1 Implementation
- Add `showPreviewModal: boolean` to Settings (default: false)
- Create `PreviewModalToggleSetting` UI component
- Create `ImagePreviewModal` class with image display + Enter handler
- Update `Command.executeImagePaste()` to conditionally show modal
- Modal closes → existing `createNote()` flow runs unchanged

### Step 2 Implementation
- Add name input field to existing modal
- Pre-populate with generated default name
- Pass edited name to `VaultService.createNote()`
- Update `VaultService.saveImage()` to accept custom filename
- Update `VaultService.createNote()` to accept custom note name

### Step 3 Implementation
- Add tags input field to existing modal
- Parse comma-separated tags on submit
- Update `VaultService.createNote()` to accept tags array
- Generate YAML frontmatter when tags present
- Prepend frontmatter to note content

---

## Success Criteria Per Step

**After Step 1:** Users can enable preview, see their image, press Enter to create note
**After Step 2:** Users can rename images/notes from the preview modal
**After Step 3:** Users can tag image notes directly during creation

---

## Why This Approach?

✅ Each step ships a complete, usable feature
✅ Users get value after every step
✅ Can stop at any step and have working product
✅ Easy to test each feature in isolation
✅ Backward compatible at every step (modal defaults to off)
