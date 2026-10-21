# twinline: instructions for coding agents

- Read README.md first: four check layers, the snapshot route, and the inputs and outputs.
- Keep it brand-neutral. No design system, agency, product or private file may be named in code, fixtures or tests.
  Fixtures are synthetic or come from public sample systems.
- Never ask for, read, print or store access tokens. A Figma token comes from the environment and never reaches a
  report, a log or a commit.
- Every check ships with a failing fixture that proves it bites, and a passing one.
- Unit tests make no network calls. Live Figma or Storybook runs are separate, opt-in integration tests.
- A test tool only: no design-to-code generation and no token sync.
