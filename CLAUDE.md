We are going to build an obsidian-plugin call Paste image as note

in AGENTS.md there is information about building obsidian plugins

You must use VScode tools whenever posible as described in .claude/vscode.md

# Development Methodology

## Planning Approach
When user requests planning, MUST follow this workflow:
1. Research thoroughly using read-only tools
2. Present comprehensive plan via ExitPlanMode tool
3. Wait for user approval before any implementation
4. Break tasks into atomic, independently testable steps

Example:
```
❌ AVOID: "Implement image pasting feature"
✅ USE: "Add command registration" → "Detect clipboard image" → "Read image data" → etc.
```

## Plan Documentation
MUST persist all important plans in `.claude/` directory:
- Create dedicated `.md` files for each stage/plan
- Update CLAUDE.md with references to plan locations
- Use stage-based organization (stage-one, stage-two, etc.)

Example:
```
.claude/stage-one-plan.md  ← Detailed atomic steps
CLAUDE.md                  ← References: "Stage one plan in .claude/stage-one-plan.md"
```

# Implementation Plans

## Stage One Plan ✅ COMPLETED
Atomic implementation steps for basic paste image functionality are documented in `.claude/stage-one-plan.md`

**Status**: All 6 steps successfully implemented
- ✅ Step 1: Command registration
- ✅ Step 2: Clipboard image detection  
- ✅ Step 3: Clipboard image reading
- ✅ Step 4: Image file creation in vault
- ✅ Step 5: Note creation with embedded image
- ✅ Step 6: User notifications and error handling

**Result**: Fully functional "paste image as note" plugin with professional user experience.

## Stage Two Plan ✅ COMPLETED
Automatic paste detection with smart note linking functionality is documented in `.claude/stage-two-plan.md`

**Goal**: Detect image pastes automatically and create context-aware behavior
- When editing a note: Create image note + insert link at cursor
- When not editing: Create standalone image note (existing behavior)

**Status**: All 6 steps successfully implemented with service composition architecture
- ✅ Step 1: Paste event detection with proper event interception
- ✅ Step 2: Context detection for editing state
- ✅ Step 3: Active editor reference access
- ✅ Step 4: Note link insertion with ![[embed]] syntax
- ✅ Step 5: Smart dual behavior based on context
- ✅ Step 6: Service composition refactoring with EditorService

**Result**: Fully functional automatic paste detection with intelligent context-aware note linking and professional service architecture.

## Stage Three Plan ✅ COMPLETED
Folder configuration functionality is documented in `.claude/stage-three-plan.md`

**Goal**: Add user configuration for organizing images and notes into separate folders
- Image folder setting: Users can specify where pasted images are stored  
- Notes folder setting: Users can specify where image notes are created
- Settings panel: Simple UI for folder configuration

**Status**: All 6 steps successfully implemented
- ✅ Step 1: Settings interface and storage implementation
- ✅ Step 2: Settings tab UI with folder input fields
- ✅ Step 3: VaultService image folder configuration
- ✅ Step 4: VaultService notes folder configuration  
- ✅ Step 5: Settings integration with main plugin class
- ✅ Step 6: Folder configuration functionality testing

**Result**: Complete folder organization system with automatic folder creation, relative path handling, and professional settings integration.

# Implementation Methodology

## Execution Control
MUST implement changes one atomic step at a time with user approval between steps.
- Complete one discrete step fully before proceeding
- Wait for user direction after each step completion, even when following predefined plans
- Use git to revert cleanly if scope exceeds request
- Add console logging during implementation steps to verify functionality before proceeding

Example:
```
❌ AVOID: Implementing Steps 1-3 in sequence without stopping
✅ USE: Implement Step 1 → Stop → Wait for approval → Proceed to Step 2
```

## Boilerplate Challenge Policy  
Question necessity of all boilerplate code before implementing.
- Challenge every framework convention: "Is this needed for current goal?"
- Remove unused interfaces, methods, properties even if conventional
- Only implement what serves immediate stage requirements

Example:
```typescript
❌ AVOID: Keep empty Settings interface "for future use"
interface Settings {}
const DEFAULT_SETTINGS: Settings = {}

✅ USE: Remove if not needed for current stage
// No settings code at all
```

## Naming Convention
Remove semantic redundancy where project context makes meaning clear.
- Strip project-context prefixes from all identifiers
- Use minimal names that assume project scope
- Apply to files, classes, variables, and methods

Example:
```typescript
❌ AVOID: Redundant project context
paste-image-command.ts
class PasteImageCommand

✅ USE: Context-aware minimal naming  
command.ts
class Command
```

# Code Style and Preferences

## File Organization
MUST follow strict one class per file rule with only inner classes allowed as exceptions.
- Each file contains exactly one public class
- Inner classes are permitted within their parent class
- Extract utility classes to separate files immediately

Example:
```typescript
❌ AVOID: Multiple classes in one file
class ImageFormats { ... }
export class Command { ... }

✅ USE: Separate files
// image-formats.ts
export class ImageFormats { ... }

// command.ts  
import { ImageFormats } from './image-formats';
export class Command { ... }
```

## Service Composition Architecture
MUST use service composition pattern to separate behavioral concerns into focused classes.
- Extract distinct behaviors (clipboard, vault, notifications) into dedicated service classes
- Use dependency injection in main orchestrator classes
- Each service owns single responsibility and related methods
- Services should encapsulate their internal messages and error handling

Example:
```typescript
❌ AVOID: Monolithic class with mixed concerns
export class Command {
  execute() {
    if (clipboard.hasImage()) {
      const buffer = clipboard.readImage();
      vault.saveImage(buffer);
      new Notice('Success message');
    }
  }
}

✅ USE: Service composition with dependency injection
export class Command {
  constructor(
    private clipboardService: ClipboardService,
    private vaultService: VaultService, 
    private notificationService: NotificationService
  ) {}
  
  execute() {
    if (this.clipboardService.hasImage()) {
      const buffer = this.clipboardService.readImage();
      this.vaultService.saveImage(buffer);
      this.notificationService.success();
    }
  }
}
```

## Code Organization
Extract complex inline logic into dedicated utility classes for maintainability and reusability.
- Replace complex conditionals with descriptive method calls
- Create utility classes for repeated logic patterns
- Use semantic naming that describes the operation

Example:
```typescript
❌ AVOID: Complex inline conditions
return formats.some(format => 
  format.includes('image/') || 
  format.includes('image') ||
  format === 'public.png' ||
  format === 'public.jpeg'
);

✅ USE: Extracted utility method
return ImageFormats.check(formats);
```

## Command Class Encapsulation
MUST expose minimal public API with only constructor and execute() methods public.
- All helper methods should be private to hide implementation details
- Command classes orchestrate services and should not expose internal operations
- Follow object-oriented encapsulation principles

Example:
```typescript
❌ AVOID: Public helper methods
export class Command {
  execute() { ... }
  isNoteBeingEdited(): boolean { ... } // Should be private
  insertNoteLinkAtCursor(): void { ... } // Should be private
}

✅ USE: Proper encapsulation
export class Command {
  constructor(...) { ... }
  execute(): void { ... }
  
  private isNoteBeingEdited(): boolean { ... }
  private insertNoteLinkAtCursor(): void { ... }
}
```

## Service Composition Maintenance
MUST clean up dependencies when refactoring functionality into services.
- Remove unused dependencies from classes when functionality moves to dedicated services
- Update main.ts dependency injection when adding new services
- Maintain clean service composition with proper separation of concerns

Example:
```typescript
❌ AVOID: Unused dependencies after refactoring
export class Command {
  constructor(
    private app: App, // Unused after moving to EditorService
    private editorService: EditorService
  ) {}
}

✅ USE: Clean dependencies after refactoring
export class Command {
  constructor(
    private editorService: EditorService
  ) {}
}

// Update main.ts accordingly
const editorService = new EditorService(this.app);
this.command = new Command(editorService);
```

## TypeScript Typing Requirements
MUST use comprehensive TypeScript type declarations for ALL variables, parameters, and properties.
- Add explicit type declarations for every variable, not just function signatures
- Include types for callback parameters and return types
- Never rely on type inference for variables when explicit typing improves clarity

Example:
```typescript
❌ AVOID: Missing variable type declarations
const imageBuffer = this.getClipboardImage();
const formats = clipboard.availableFormats();
return formats.some((format) => format.includes('image/'));

✅ USE: Comprehensive type declarations
const imageBuffer: Buffer | null = this.getClipboardImage();
const formats: string[] = clipboard.availableFormats();
return formats.some((format: string): boolean => format.includes('image/'));
```

## Local Interface Pattern
When external type declarations are unavailable, create minimal local interfaces defining only used methods.
- Define interfaces with minimal required method signatures
- Place interfaces at top of file after imports
- Use descriptive interface names that match the external type concept

Example:
```typescript
❌ AVOID: Using any type for external dependencies
const image: any = clipboard.readImage();

✅ USE: Minimal local interface
interface NativeImage {
  isEmpty(): boolean;
  toPNG(): Buffer;
}
const image: NativeImage = clipboard.readImage();
```

## Obsidian Plugin Context Handling  
Handle Obsidian plugin context constraints where direct imports may fail.
- Use require() for Electron modules that can't be directly imported
- Combine require() with local interface typing for type safety
- Maintain TypeScript benefits while working within plugin limitations

Example:
```typescript
❌ AVOID: Direct imports that fail in Obsidian context
import { clipboard } from 'electron';

✅ USE: require() with local typing
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clipboard } = require('electron');
interface NativeImage {
  isEmpty(): boolean;
  toPNG(): Buffer;
}
```

## Return Type Policy
MUST avoid union types and multiple return points - prefer single concrete return types with error throwing.
- Never use union types like `Buffer | null` or `T | undefined`
- Exactly one return statement per function
- Throw errors for failure cases instead of returning null
- Eliminate early returns and multiple return paths

Example:
```typescript
❌ AVOID: Union types and multiple returns
private getImage(): Buffer | null {
  try {
    const image = clipboard.readImage();
    if (image.isEmpty()) {
      return null;
    }
    return image.toPNG();
  } catch (error) {
    return null;
  }
}

✅ USE: Single concrete return with error throwing
private getImage(): Buffer {
  const image = clipboard.readImage();
  if (image.isEmpty()) {
    throw new Error('Clipboard image is empty');
  }
  return image.toPNG();
}
```

## Error Handling Policy
MUST eliminate error speculation - let errors propagate naturally instead of catching and guessing.
- Remove try-catch blocks that speculate about failure reasons
- Let errors bubble up to appropriate handlers
- Avoid logging errors at low levels - let callers decide
- Never return null/undefined to indicate errors
- Services should throw errors instead of returning nullable types to eliminate redundant error checking

Example:
```typescript
❌ AVOID: Error speculation and catching
try {
  const result = riskyOperation();
  return result;
} catch (error) {
  console.error('Error occurred:', error);
  return null;
}

✅ USE: Natural error propagation
const result = riskyOperation();
return result;
```

## Code Readability Requirements
MUST prioritize legibility over compactness when code becomes difficult to read.
- Introduce explaining variables to break down complex expressions
- Avoid cleverness in favor of clear, obvious code
- Choose readability over compact solutions
- Break complex operations into understandable steps

Example:
```typescript
❌ AVOID: Complex one-liner
this.app.vault.createBinary(filename, imageBuffer.buffer.slice(imageBuffer.byteOffset, imageBuffer.byteOffset + imageBuffer.byteLength) as ArrayBuffer);

✅ USE: Explaining variables for clarity
const startOffset = imageBuffer.byteOffset;
const endOffset = imageBuffer.byteOffset + imageBuffer.byteLength;
const arrayBuffer = imageBuffer.buffer.slice(startOffset, endOffset) as ArrayBuffer;
this.app.vault.createBinary(filename, arrayBuffer);
```

## Control Flow Preferences
MUST use guard clauses and positive logic for cleaner control flow.
- Prefer guard clauses with early returns over nested if-else structures
- Invert predicates to express conditions in positive terms when possible
- Use explicit if-else statements over ternary operators for complex logic

Example:
```typescript
❌ AVOID: Nested if-else structure
execute(): void {
  if (!this.hasImage()) {
    this.notifyError();
  } else {
    this.processImage();
  }
}

✅ USE: Guard clause with positive logic
execute(): void {
  if (this.hasNoImage()) {
    this.notifyError();
    return;
  }
  
  this.processImage();
}
```

## Private Method Aliases Pattern
MUST create private method aliases for collaborator functions to build fluent internal APIs.
- Create private methods that alias service collaborator methods
- Move error handling and type conversion into alias methods
- Use aliases to hide service collaboration details from main execution flow
- Aliases should handle parameter transformation and error processing

Example:
```typescript
❌ AVOID: Direct service calls with inline error handling
execute(): void {
  try {
    const buffer = this.clipboardService.readImage();
    this.vaultService.saveImage(buffer);
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error('Unknown error');
    this.notificationService.error(errorObj);
  }
}

✅ USE: Private aliases with encapsulated error handling
execute(): void {
  try {
    const buffer = this.readImage();
    this.saveImage(buffer);
  } catch (error: unknown) {
    this.notifyError(error);
  }
}

private readImage(): Buffer {
  return this.clipboardService.readImage();
}

private notifyError(error: unknown): void {
  if (error instanceof Error) {
    this.notificationService.error(error);
  } else {
    this.notificationService.error(new Error('Unknown error'));
  }
}
```

## Comments Policy
NEVER add comments to code. User explicitly forbids all code comments.
- Remove existing comments when editing files
- Write self-documenting code without commentary
- Keep code clean and minimal
- Remove all console.log statements from production code for professional, clean codebase

Example:
```typescript
❌ AVOID:
// This function handles image pasting
async function pasteImage() {
}
```

## Obsidian Event Handling Policy
MUST use proper event interception techniques to avoid conflicts with Obsidian's native behaviors.
- Use capture phase with `{ capture: true }` option in `registerDomEvent()` to intercept events before Obsidian processes them
- Call both `preventDefault()` and `stopPropagation()` to completely block default behavior
- Test for duplicate behaviors when overriding native Obsidian functionality

Example:
```typescript
❌ AVOID: Incomplete event blocking that allows native handlers to run
this.registerDomEvent(document, 'paste', (event: ClipboardEvent) => {
  event.preventDefault(); // Only prevents default, doesn't stop propagation
  this.handlePaste();
});

✅ USE: Complete event interception with capture phase
this.registerDomEvent(document, 'paste', (event: ClipboardEvent) => {
  event.preventDefault();
  event.stopPropagation();
  this.handlePaste();
}, { capture: true });
```


# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.