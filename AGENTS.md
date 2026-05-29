## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Responsive design

For all site, UI, CSS, layout, and interaction changes:
- Design and implement mobile-first: start with narrow viewport behavior, then add responsive enhancements for tablet and desktop.
- Verify pages work on both mobile and desktop widths before finishing.
- Avoid horizontal scrolling, overlapping content, clipped controls, or layouts that only work at desktop size.

## Git workflow

After completing any user-requested file change:
- Run the relevant validation command(s) for the change when practical.
- Stage only the files changed for the request.
- Create a concise git commit describing the completed change.
- Push the commit to the current branch's upstream remote.
- Do not force-push, reset, or revert unrelated user work.
