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

## Stage One Plan
Atomic implementation steps for basic paste image functionality are documented in `.claude/stage-one-plan.md`

# Implementation Methodology

## Execution Control
MUST implement changes one atomic step at a time with user approval between steps.
- Complete one discrete step fully before proceeding
- Wait for user direction after each step completion
- Use git to revert cleanly if scope exceeds request

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

## Comments Policy
NEVER add comments to code. User explicitly forbids all code comments.
- Remove existing comments when editing files
- Write self-documenting code without commentary
- Keep code clean and minimal

Example:
```typescript
❌ AVOID:
// This function handles image pasting
async function pasteImage() {
  // Implementation here
}

✅ USE:
async function pasteImage() {
}
```
