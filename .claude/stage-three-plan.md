# Stage Three Plan: Image and Notes Folder Configuration

## Overview
Add user configuration for organizing images and notes into separate folders, keeping the plugin simple and focused.

## Goals Completed ✅
1. **Image Folder Setting**: Users can specify where pasted images are stored
2. **Image Notes Folder Setting**: Users can specify where image notes are created  
3. **Settings Panel**: Simple UI for folder configuration

## Implementation Results

### Settings Interface and Storage ✅
- Created `Settings` interface with `imageFolder` and `imageNotesFolder` properties
- Implemented settings loading/saving using Obsidian's plugin data API
- Added default empty settings (vault root behavior)

### Settings Tab UI ✅
- Created `SettingsTab` class extending Obsidian's `PluginSettingTab`
- Added two text input fields for folder paths with placeholder examples
- Integrated with main plugin class using `addSettingTab()`

### VaultService Updates ✅
- Modified `saveImage()` to use `settings.imageFolder` with automatic folder creation
- Updated `createNote()` to use `settings.imageNotesFolder` with relative path handling
- Added helper methods for path construction and folder management:
  - `getImagePath()`: Constructs full image path with folder prefix
  - `getNotePath()`: Constructs full note path with folder prefix  
  - `getRelativeImagePath()`: Handles relative linking between different folder structures
  - `ensureFolderExists()`: Auto-creates folders if they don't exist

### Integration Complete ✅
- Updated main plugin to pass settings to VaultService constructor
- Settings loaded before service initialization
- Backward compatibility maintained (empty settings = vault root)

## Technical Implementation Details

### Path Handling Logic
- **Same folder or both empty**: Direct filename reference
- **Notes in subfolder, images in root**: `../filename` reference  
- **Images in subfolder, notes in root**: Direct path reference
- **Different folders**: `../folder/filename` reference

### Folder Management  
- Auto-creation of specified folders if they don't exist
- Uses Obsidian's `app.vault.createFolder()` API
- Existence check prevents duplicate folder creation

### Settings Storage
- Persisted using Obsidian's plugin data system
- Object.assign pattern for default value merging
- Automatic saving on settings changes

## Success Criteria Met ✅
- Settings tab appears in Obsidian preferences with two folder configuration fields
- Images save to configured image folder (or vault root if empty) 
- Notes save to configured notes folder (or vault root if empty)
- Image links work correctly regardless of folder configuration
- Folders auto-created if they don't exist
- No compilation errors, clean build process

## User Experience
- Simple, focused settings panel
- Placeholder text guides users on folder naming
- Real-time settings saving (no apply button needed)  
- Maintains existing behavior when settings are empty
- Professional integration with Obsidian's settings system

## Architecture Maintained
- Service composition pattern preserved
- Clean separation of concerns between settings, UI, and business logic
- Type safety maintained throughout with comprehensive TypeScript typing
- Single responsibility principle for each class and method