# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
dotnet run                                  # Run the site locally (ASP.NET Core, net10.0)
dotnet build                                # Build
node --test test/algorithm-core.test.js    # Run the JS test suite (pass the file path; `node --test test/` fails)
node --test --test-name-pattern="<name>" test/algorithm-core.test.js   # Run a single test
npx prettier . --write                      # Format (run after code changes, before graphify update)
graphify update .                           # Refresh the knowledge graph after code changes (AST-only, no API cost)
./deploy.sh                                 # Build linux/arm64 Docker image, push, rolling-restart on k3s
```

There is no package.json; tests use Node's built-in `node:test` runner against the CommonJS export of `algorithm-core.js`.

## Architecture

ASP.NET Core MVC app (`VisualizedAlgorithms`, net10.0) that visualizes algorithms in the browser. The C# side is intentionally thin; nearly all logic is client-side JavaScript.

- **Server**: a single `Controllers/HomeController.cs` with one attribute-routed action per topic page (`/Sorting`, `/Trees`, `/Graphs`, `/DynamicProgramming`, `/Greedy`, `/SearchingHashing`, `/Heaps`, `/Strings`, `/DivideConquer`, `/Geometry`), each returning a static Razor view from `Views/Home/`. No models beyond `ErrorViewModel`, no services, no database.
- **Algorithm engine**: `wwwroot/js/algorithm-core.js` is the single source of truth for algorithm logic. It is a UMD-style module (attaches `AlgorithmCore` to `window` in the browser, exports via `module.exports` for Node tests) exposing `sorting`, `dp`, `greedy`, `graphs`, `trees`, `topics`, and `util`. Algorithm runners return step/frame data that the page scripts render — keep algorithm logic here, not in page scripts, so it stays testable in Node.
- **Page scripts** (`wwwroot/js/`): each topic view loads one renderer via its `Scripts` section — `site.js` (Sorting), `graphs.js`, `dynamic-programming.js`, `greedy.js`, `search-trees.js` (Trees), and `textbook-sections.js` (shared by Heaps, Strings, DivideConquer, Geometry, SearchingHashing). `_Layout.cshtml` loads `algorithm-core.js` and `site-shell.js` globally.
- **Tests**: `test/algorithm-core.test.js` exercises `AlgorithmCore` directly (sorting correctness, tree invariants like AVL balance, etc.). New algorithm behavior added to `algorithm-core.js` should get coverage here.
- **Deployment**: multi-stage `Dockerfile` (SDK build on `$BUILDPLATFORM`, aspnet 10.0 runtime, port 8080/8081) pushed as `aalatyyat/visualizedsorting:latest` and rolled out to a k3s cluster by `deploy.sh`.

## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty `graphify-out/` files are expected after hooks or incremental updates and are not a reason to skip graphify. Only skip it if the task is about stale/incorrect graph output or the user says not to use it.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain don't surface enough context.
- After modifying code, run `npx prettier . --write` and then `graphify update .` to keep the graph current.

## Responsive design

For all UI, CSS, layout, and interaction changes:

- Design and implement mobile-first: start with narrow viewport behavior, then add responsive enhancements for tablet and desktop.
- Verify pages work on both mobile and desktop widths before finishing.
- Avoid horizontal scrolling, overlapping content, clipped controls, or desktop-only layouts.

## Git workflow

After completing any user-requested file change:

- Run the relevant validation command(s) for the change when practical (`node --test test/algorithm-core.test.js` for algorithm changes, `dotnet build` for C#/Razor changes).
- Stage only the files changed for the request.
- Create a concise git commit describing the completed change.
- Push the commit to the current branch's upstream remote.
- Do not force-push, reset, or revert unrelated user work.
