# twinline

Checks that a Figma design system and its coded components are twins.

**Status: pre-alpha.** This repository holds the design and a first read-only snippet. There is nothing to install yet.

## What it checks

1. **Tokens = Figma variables (exact).** A W3C DTCG token file against the Figma variables: names, values per mode,
   and aliases. Missing, extra or different values fail.
2. **Components, measured (exact).** For every component and state, Figma's numbers against the computed styles of
   the matching Storybook story: size, padding, gap, radius, stroke, the variable behind each fill and text colour,
   and the text style. Also:
   - every fill, stroke, text and spacing in a component must be bound to a variable or style;
   - every state the code knows must exist as a variant.
3. **Pictures (with tolerance).** Each Figma variant is exported and set beside a screenshot of its story, with a
   diff image. Figma and browsers render text differently, so this layer flags large differences and never proves a match.
4. **Board lint (Figma only).** Layers that stick out of their parent on documentation pages: overlapping state
   grids, clipped specimen text, cut-off previews.

Layers 1, 2 and 4 give a plain pass or fail. Layer 3 gives a warning and pictures to look at.

## Works on any Figma plan

Figma's Variables REST API is available only on Enterprise plans. twinline therefore reads Figma through the
**Plugin API**, either from a small plugin or from an AI agent's Figma connection, into a **snapshot**:
`figma-snapshot.json` plus PNG exports, stamped with the file version. The snapshot is committed to the
repository. CI compares the code with the snapshot and fails when the snapshot is out of date. Live REST reads for
Enterprise files can come later as an extra source.

## Inputs and outputs

- **Inputs:**
  - a DTCG token file;
  - a Storybook, built or running;
  - a Figma snapshot;
  - a mapping. By default Figma variant properties equal the component's props and states
    (`variant=primary, size=lg, state=hover`); a small map file covers names that differ.
- **Outputs:**
  - `parity-report.json`, with a stable schema for CI and agents;
  - `review.html`, which shows per component the variant grid, each check's result and the pictures side by side.
- **Ways to run:** command line, an agent skill (Claude Code, Codex), and a CI recipe.

## Try the board lint today

[`snippets/board-lint.js`](snippets/board-lint.js) is read-only Plugin API code. Run it in a plugin runner, or
through an agent's Figma connection. It returns, page by page, every layer that sticks out of its parent, with the
side and the size in pixels. On its first real file it found a state grid whose 200 px cells held 237 px buttons.

## Related work, and how twinline differs

| Tool | What it does | What twinline adds |
|---|---|---|
| Storybook Connect (Chromatic) | Links a Figma variant to a live story | An automatic verdict, not a link |
| Chromatic visual tests | Compares stories with their own accepted past | Compares code with the design |
| Figma Code Connect | Maps components to code snippets (paid plans) | Checks values; does not depend on it |
| Design Lint and similar plugins | Finds unbound values inside Figma | Also compares with code |
| Tokens Studio, Style Dictionary | Sync tokens between Figma and code | Reports drift when a sync was skipped |
| [design-parity](https://github.com/yschimke/design-parity) | Checks Android (Jetpack Compose) changes against Figma and other design references | Web first: Storybook, DTCG, Plugin-API snapshots that work on Professional plans, board lint |

## Roadmap

- **v0.1:**
  - layers 1, 2 and 4;
  - the snapshot writer, the command line, and the JSON and HTML reports;
  - tested on a real design system and on a public sample.
- **v0.2:**
  - layer 3, by wrapping an existing image-diff library;
  - the agent skill and the CI recipe;
  - an optional REST source for Enterprise files.

## Principles

- Brand-neutral and vendor-neutral: no design system, agency or product is built in.
- Never asks for, stores or prints access tokens. Credentials come from the environment and stay out of reports.
- A test tool only: no design-to-code generation, and no token sync.

## Licence

[Apache-2.0](LICENSE). See [NOTICE](NOTICE).
