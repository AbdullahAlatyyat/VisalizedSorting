# Graph Report - VisalizedSorting  (2026-05-29)

## Corpus Check
- 18 files · ~28,925 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 444 nodes · 625 edges · 24 communities (19 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `338e9b08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `BinaryModel` - 16 edges
2. `MultiwayModel` - 15 edges
3. `HomeController` - 14 edges
4. `/graphify` - 14 edges
5. `What You Must Do When Invoked` - 14 edges
6. `step()` - 13 edges
7. `edgeId()` - 10 edges
8. `nodeIds()` - 10 edges
9. `setSteps()` - 9 edges
10. `runAstar()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Sorting Bars Favicon` --conceptually_related_to--> `Client-Side Visualization Design`  [INFERRED]
  wwwroot/favicon.svg → CLAUDE.md
- `Project Architecture Guidance` --references--> `HomeController`  [EXTRACTED]
  CLAUDE.md → Controllers/HomeController.cs
- `Client-Side Visualization Design` --references--> `Sorting Generator Step Protocol`  [EXTRACTED]
  CLAUDE.md → wwwroot/js/site.js
- `Project Architecture Guidance` --references--> `Sorting Engine IIFE`  [EXTRACTED]
  CLAUDE.md → wwwroot/js/site.js
- `Client-Side Visualization Design` --references--> `Sorting Generator Functions`  [EXTRACTED]
  CLAUDE.md → wwwroot/js/site.js

## Hyperedges (group relationships)
- **Client-Side Algorithm Visualizers** — site_sorting_visualizer_flow, search_trees_tree_interaction_flow, graphs_visualization_flow, dynamic_programming_visualization_flow, greedy_visualization_flow, textbook_sections_topic_visualization_flow, algorithm_core_facade [INFERRED 0.86]
- **Algorithm Catalog to Runner Pattern** — site_sorting_algorithm_catalog, site_sort_generators, dynamic_programming_dp_catalog, greedy_algorithm_catalog, graphs_graph_algorithm_catalog, search_trees_tree_catalog, textbook_sections_topic_catalog [INFERRED 0.84]
- **AlgorithmCore Test Contracts** — algorithm_core_tests_contract_suite, algorithm_core_run_sort, algorithm_core_dynamic_programming_runners, algorithm_core_greedy_runners, algorithm_core_graph_runners, algorithm_core_tree_sessions, algorithm_core_topic_runners [EXTRACTED 1.00]

## Communities (24 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (24): advance(), BinaryModel, createModel(), DEFAULT_KEYS, delay(), insertNode(), keyValue(), MULTIWAY_KEYS (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (36): advance(), ALGO_RUNNERS, buildSteps(), cloneGraph(), delay(), edgeId(), fillSelectors(), GRAPH_ALGORITHMS (+28 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (32): AlgorithmCore, buildBinary(), buildMultiway(), dp, dsu(), edgeKey(), flipColors(), graphFrom() (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (27): ALGO_GENERATORS, algoGrid, ALGORITHMS, algosSection, aux, backBtn, barsContainer, btnPlay (+19 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (29): Dynamic Programming Runners, AlgorithmCore Facade, Graph Algorithm Runners, Canonical Graph Samples, Greedy Runners, runSort, AlgorithmCore Contract Test Suite, Graph Expected Results (+21 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (24): advance(), buildSteps(), delay(), DP_ALGORITHMS, emptyRows(), makeTable(), openDp(), pause() (+16 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (20): advance(), buildSteps(), delay(), GREEDY_ALGORITHMS, openGreedy(), pause(), play(), refs (+12 more)

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (14): advance(), buildSteps(), delay(), makeItems(), openAlgorithm(), pause(), play(), refs (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (17): Logging Configuration, Docker Buildx Publish Command, Client-Side Visualization Design, Project Architecture Guidance, Sorting Bars Favicon, Algorithm Page Actions, HomeController, Index Action (+9 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (15): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, applicationUrl, commandName (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (11): AlgorithmCore, assert, cycleGraph, expected, keys, result, sample, session (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (5): AllowedHosts, Logging, LogLevel, Default, Microsoft.AspNetCore

### Community 13 - "Community 13"
Cohesion: 0.50
Nodes (5): Graphify Project Policy, Graphify Hook Check, Claude Bash Permission, Structural and Semantic Extraction, Graphify Workflow

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (3): ErrorViewModel, Error Action, Production Error Pipeline

### Community 19 - "Community 19"
Cohesion: 0.06
Nodes (34): code:block1 (/graphify                                             # full), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash (if [ ! -f graphify-out/.graphify_extract.json ]; then), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c ") (+26 more)

### Community 20 - "Community 20"
Cohesion: 0.07
Nodes (30): code:bash (mkdir -p graphify-out), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash (# Detect the correct Python interpreter (handles pipx, venv,), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c ") (+22 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (13): code:block10 (You are a graphify extraction subagent. Read the files liste), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:block8 (spawn_agent(agent_type="worker", message="Your task is to pe) (+5 more)

### Community 22 - "Community 22"
Cohesion: 0.20
Nodes (8): Adding a new algorithm, Architecture, code:bash (dotnet build VisualizedAlgorithms.sln              # Build t), code:bash (# See build.txt for the exact docker buildx command used), Commands, Data flow, Key files, Planned work (todos)

## Knowledge Gaps
- **148 isolated node(s):** `Default`, `Microsoft.AspNetCore`, `AllowedHosts`, `$schema`, `commandName` (+143 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `Community 20` to `Community 19`, `Community 21`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `runGraph()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `weight()` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `Default`, `Microsoft.AspNetCore`, `AllowedHosts` to the rest of the system?**
  _148 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06428571428571428 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12435897435897436 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09672830725462304 - nodes in this community are weakly interconnected._