# CLAUDE.md — Frontend Rules

## NEVER WRITE OR EXPOSE ANY KEYS! IMPORTANT!

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference URL is provided: use Playwright MCP to navigate to it and take a screenshot for visual reference.
- If a reference image is provided directly: use it as-is.
- If no reference is provided: design from scratch with high craft (see guardrails below).
- Match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy (no "Lorem ipsum")).

## UI Review
- Use Playwright MCP to preview and review UI changes.
- Always navigate to `http://localhost:3000` (start the dev server first if not running).
- After every UI change, take a screenshot via Playwright MCP to visually verify the result.
- Do not use file:/// URLs — always use localhost.
- When reviewing, check: spacing/padding, font size/weight, colors (exact hex), alignment, border-radius, shadows, image sizing.
- After building, screenshot your output via Playwright MCP, compare against reference, fix mismatches, re-screenshot. Do only two comparison round and if there is visible differences state this into your feedback.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- use lucide-react for all icons
- use shadcn/ui and shadcn mcp server for all components
- Use tailwindcss v4 for all styling
- Do not use inline styles
- Prefer CSS variables for colors/tokens (defined in globals.css)