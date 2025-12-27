# Obsidian Plugin Guidelines Compliance Plan
## Plugin: Paste Image as Note

**Target**: Full compliance with [Obsidian Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)

**Current Status**: Mostly Compliant ⚠️ (3 critical issues, 2 recommended improvements)

**Estimated Effort**: 1-2 hours

---

## Phase 1: Critical Fixes (MUST DO)

### Step 1.1: Update manifest.json - Author Information
**Status**: Required for submission

**Current State**:
```json
{
  "author": "",
  "authorUrl": ""
}
```

**Action Required**:
1. Fill in the `author` field with your GitHub username or name
   - Example: `"author": "xaviuzz"`
2. Fill in the `authorUrl` field with a valid URL
   - Recommended: Your GitHub profile `https://github.com/xaviuzz`
   - Alternative: Personal website or social media profile

**File to modify**: `manifest.json` (lines 7-8)

**Why**: Obsidian requires attribution for all plugins. Users should know who created the plugin.

---

### Step 1.2: Update versions.json - Add Current Version
**Status**: Required for release compatibility

**Current State**:
```json
{
  "1.0.0": "0.15.0"
}
```

**Action Required**:
1. Add entry for version 1.1.0:
```json
{
  "1.0.0": "0.15.0",
  "1.1.0": "0.15.0"
}
```

**File to modify**: `versions.json` (line 2)

**Why**: Obsidian uses this file to determine which plugin version to download for different Obsidian versions. Missing entries prevent users with older Obsidian versions from finding compatible releases.

---

### Step 1.3: Replace README.md - Complete Documentation
**Status**: Critical - Current README is sample template, not plugin documentation

**Current State**: Generic Obsidian sample plugin template (not your plugin documentation)

**Action Required**: Replace entire README.md with actual plugin documentation

**New README.md Content Structure**:

```markdown
# Paste Image as Note

Paste images from your clipboard and automatically create beautifully organized notes with embedded images and customizable metadata.

## Features

- **Paste as Note**: Paste any image from clipboard to instantly create a new note with the image embedded
- **Automatic Organization**: Configure separate folders for images and notes
- **Preview Before Create**: Optional modal to preview image and customize name/tags before creation
- **Smart Tagging**: Add tags to image notes directly during creation
- **Context Menu**: Right-click any image file to create a note from it
- **Asset Property**: Optionally store image file path as YAML frontmatter property
- **TypeScript**: Fully typed codebase with comprehensive test coverage

## Installation

### From Obsidian Community Plugins
1. Open Settings → Community plugins → Browse
2. Search for "Paste Image as Note"
3. Click Install
4. Enable the plugin

### Manual Installation
1. Download `manifest.json`, `main.js`, and `styles.css` from the latest release
2. Create folder: `.obsidian/plugins/paste-image-as-note/`
3. Copy the files into that folder
4. Reload Obsidian and enable plugin in Settings

## Usage

### Basic Paste
1. Copy any image to clipboard
2. Press the command hotkey or use the command palette
3. A new note is created with the image embedded

### Paste While Editing
When you paste while editing a note:
- Image is created in configured folder
- Link is automatically inserted at cursor: `![[image-name]]`

### Preview Modal (Optional)
1. Enable "Show preview before creating note" in plugin settings
2. When you paste, a preview modal appears
3. **Customize**:
   - **Name**: Change the image/note filename
   - **Tags**: Add comma-separated tags (e.g., `screenshot, work, bug`)
4. Press **Enter** or click outside to create

### Create Note from Image File
1. Right-click any image in the file explorer
2. Select **Create image note**
3. A new note is created with the image embedded

## Settings

### Image Folder
Specify where pasted images are stored (relative to vault root)
- Example: `Assets/Images`
- Default: Vault root (empty)
- Folders are created automatically if they don't exist

### Image Notes Folder
Specify where image notes are created
- Example: `Assets/Notes`
- Default: Vault root (empty)
- Folders are created automatically if they don't exist

### Show Preview Before Creating Note
Toggle the optional preview modal on/off
- When enabled: Modal appears with image preview and customization options
- When disabled: Note created immediately with default settings
- Default: Off

### Include Asset Property
Store image file path in note frontmatter
- When enabled: Notes include `asset: [[image-filename]]` property
- When disabled: Only embedded image link `![[image-name]]`
- Default: Off

## Examples

### Simple Image Paste
Paste an image → Note created as `Untitled.md` with image embedded

### Organized with Folders
- Image folder: `Assets/Images`
- Notes folder: `Assets/Notes`
- Result: Images in Assets/Images, notes in Assets/Notes with relative link

### With Preview and Tags
1. Enable preview modal
2. Paste image
3. Customize name: "Screenshot-Bug-123"
4. Add tags: "bug, screenshot, urgent"
5. Press Enter
6. Note created with tags in frontmatter

```yaml
---
tags: [bug, screenshot, urgent]
---

![[Screenshot-Bug-123]]
```

## Keyboard Shortcuts

- **Command palette**: Open with `Ctrl+P` (or `Cmd+P` on Mac), type "Paste image as note"
- **Quick paste**: Assign hotkey in Settings → Hotkeys → Search "Paste image"

## Limitations

- **Desktop only**: Electron clipboard access requires desktop version of Obsidian
- **Image types**: Supports PNG, JPG, GIF, WebP, BMP, and other clipboard-capable formats
- **Size**: No hard limit, but large images may impact vault performance

## Troubleshooting

### Image not pasting
- Ensure image is in clipboard (not just a file)
- Check that plugin is enabled in Settings → Community plugins
- Restart Obsidian

### Files not appearing in configured folders
- Verify folder paths are correct (relative to vault root)
- Check folder permissions
- Ensure folders exist (plugin creates them, but verify manually if issues)

### Tags not appearing
- Enable "Include Asset Property" in settings (if desired)
- Ensure tags are comma-separated in preview modal
- Check note frontmatter: `tags: [tag1, tag2]`

## Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/xaviuzz/obsidian-paste-image-as-note).

## License

ISC License - See LICENSE file for details.

## Author

Created with ❤️ for the Obsidian community.
```

**File to modify**: `README.md` (replace entire file)

**Why**: Obsidian requires a README that:
- Describes what the plugin does
- Explains how to use it
- Documents all settings
- Provides examples
- Current template is for developers, not users

---

## Phase 2: Recommended Improvements (SHOULD DO)

### Step 2.1: Add Funding URL to manifest.json (Optional)
**Status**: Recommended - Enables monetization if desired

**Action Required** (Choose one):

**Option A: Single funding URL**
```json
{
  "fundingUrl": "https://buymeacoffee.com/xaviuzz"
}
```

**Option B: Multiple funding options**
```json
{
  "fundingUrl": {
    "Buy Me a Coffee": "https://buymeacoffee.com/xaviuzz",
    "GitHub Sponsor": "https://github.com/sponsors/xaviuzz"
  }
}
```

**Popular funding platforms**:
- Buy Me a Coffee: https://buymeacoffee.com
- GitHub Sponsors: https://github.com/sponsors
- Patreon: https://www.patreon.com
- Ko-fi: https://ko-fi.com

**File to modify**: `manifest.json` (add new field)

**Why**: Lets community support your plugin financially. Users can sponsor your work directly.

---

### Step 2.2: Document Platform Limitations (Optional)
**Status**: Recommended - Clarify desktop-only requirement

**Current manifest.json**:
```json
{
  "isDesktopOnly": false
}
```

**Consideration**: The plugin uses Electron clipboard API, which only works on desktop. Options:

**Option A: Mark as desktop-only**
```json
{
  "isDesktopOnly": true
}
```
Then update README with: "Desktop only - requires Obsidian desktop application"

**Option B: Keep as false and add note to README**
Add to README Limitations section: "Clipboard image pasting only works on desktop Obsidian due to Electron API requirements"

**Recommendation**: Option A is clearer and prevents users from installing on mobile only to find limited functionality.

---

## Phase 3: Release Preparation (BEFORE SUBMISSION)

### Step 3.1: Create GitHub Release
**Status**: Required before submitting to obsidian-releases

**Action Required**:
1. Go to GitHub repository: https://github.com/xaviuzz/obsidian-paste-image-as-note
2. Click "Releases" → "Create a new release"
3. **Tag version**: `1.1.0` (EXACTLY this, no 'v' prefix)
4. **Release title**: "v1.1.0" or "Release 1.1.0"
5. **Description**: Document changes in version 1.1.0
   ```
   - Feature: Image preview modal with customization
   - Feature: Add tags to image notes during creation
   - Enhancement: Include asset property option
   - Improvement: Enhanced folder configuration
   ```
6. **Attachments**: Upload as binary files:
   - `manifest.json`
   - `main.js`
   - `styles.css`
7. Click "Publish release"

**Why**: Obsidian plugin system requires releases with these exact artifacts.

---

### Step 3.2: Verify Build Artifacts
**Status**: Verification step

**Action Required**:
1. Run `npm run build` to ensure clean build
2. Verify these files exist and are updated:
   - `main.js` (compiled plugin code)
   - `manifest.json` (updated with your changes)
   - `styles.css` (even if empty)

**Why**: Release upload requires these exact files. Missing or outdated files break plugin installation.

---

## Phase 4: Submit to Community Plugin Registry

### Step 4.1: Submit Pull Request to obsidian-releases
**Status**: Final step

**Action Required**:
1. Go to https://github.com/obsidianmd/obsidian-releases
2. Check `community-plugins.json` for similar plugins (ensure yours is unique)
3. Fork the repository
4. Edit `community-plugins.json` and add your plugin in alphabetical order:
   ```json
   {
     "id": "paste-image-as-note",
     "name": "Paste Image as Note",
     "author": "xaviuzz",
     "description": "Paste images from clipboard and create new notes with the image content",
     "repo": "xaviuzz/obsidian-paste-image-as-note"
   }
   ```
5. Create pull request with title: `Add plugin: Paste Image as Note`
6. Obsidian team reviews (typically 3-7 days)
7. Once approved, plugin appears in community plugins list

**Why**: This registers the plugin in Obsidian's official plugin browser.

---

## Verification Checklist

Before proceeding with each phase, verify:

### Phase 1 Checklist
- [ ] `manifest.json` has non-empty `author` field
- [ ] `manifest.json` has non-empty `authorUrl` field
- [ ] `versions.json` includes entry `"1.1.0": "0.15.0"`
- [ ] `README.md` describes actual plugin (not sample template)
- [ ] README has clear usage instructions
- [ ] README documents all settings
- [ ] README includes examples or troubleshooting

### Phase 2 Checklist (Optional)
- [ ] `fundingUrl` added if monetization desired
- [ ] Platform limitations documented
- [ ] Decided on desktop-only flag

### Phase 3 Checklist
- [ ] `npm run build` succeeds without errors
- [ ] `main.js` exists and is recent
- [ ] GitHub release created with tag `1.1.0`
- [ ] All three files uploaded to release
- [ ] Release is published (not draft)

### Phase 4 Checklist
- [ ] Plugin repo is public on GitHub
- [ ] All critical issues (Phase 1) resolved
- [ ] PR submitted to obsidian-releases
- [ ] PR passes all checks

---

## Estimated Timeline

| Phase | Task | Effort | Time |
|-------|------|--------|------|
| 1.1 | Update manifest author | 2 min | 2 min |
| 1.2 | Update versions.json | 1 min | 1 min |
| 1.3 | Write README | 30 min | 30 min |
| 2.1 | Add funding URL | 5 min | 5 min |
| 2.2 | Platform documentation | 5 min | 5 min |
| 3.1 | Create GitHub release | 10 min | 10 min |
| 3.2 | Verify build | 5 min | 5 min |
| 4.1 | Submit PR | 10 min | 10 min |
| **Total** | | | **1.3 hours** |

---

## Notes

- **No code changes required** for compliance - all issues are metadata/documentation
- **Phases 1 & 3 are blocking** - Must complete before submission
- **Phase 2 is optional** - Recommended but not required
- **Phase 4 is after release** - Submit once GitHub release is live
- **Current code quality is excellent** - No refactoring needed

---

## References

- [Obsidian Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [Submission Requirements](https://docs.obsidian.md/Plugins/Releasing/Submission+requirements+for+plugins)
- [obsidian-releases Repository](https://github.com/obsidianmd/obsidian-releases)
- [Sample Plugin Releases](https://github.com/obsidianmd/obsidian-sample-plugin/releases)
