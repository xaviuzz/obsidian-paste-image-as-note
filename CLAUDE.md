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
