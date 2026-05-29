# Graph Report - .  (2026-05-29)

## Corpus Check
- Corpus is ~28,925 words - fits in a single context window. You may not need a graph.

## Summary
- 354 nodes · 538 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Search Tree Structures|Search Tree Structures]]
- [[_COMMUNITY_Graph Traversal Algorithms|Graph Traversal Algorithms]]
- [[_COMMUNITY_Algorithm Core Utilities|Algorithm Core Utilities]]
- [[_COMMUNITY_Sorting Visualizer UI|Sorting Visualizer UI]]
- [[_COMMUNITY_Algorithm Catalog Concepts|Algorithm Catalog Concepts]]
- [[_COMMUNITY_Dynamic Programming UI|Dynamic Programming UI]]
- [[_COMMUNITY_Greedy Algorithm UI|Greedy Algorithm UI]]
- [[_COMMUNITY_Textbook Section UI|Textbook Section UI]]
- [[_COMMUNITY_MVC App Architecture|MVC App Architecture]]
- [[_COMMUNITY_Launch Profiles|Launch Profiles]]
- [[_COMMUNITY_Core Algorithm Tests|Core Algorithm Tests]]
- [[_COMMUNITY_Home Controller Routes|Home Controller Routes]]
- [[_COMMUNITY_App Settings Logging|App Settings Logging]]
- [[_COMMUNITY_Graphify Workflow Policy|Graphify Workflow Policy]]
- [[_COMMUNITY_Claude Permissions|Claude Permissions]]
- [[_COMMUNITY_Codex Hooks|Codex Hooks]]
- [[_COMMUNITY_Error Handling Flow|Error Handling Flow]]
- [[_COMMUNITY_Error Model|Error Model]]

## God Nodes (most connected - your core abstractions)
1. `BinaryModel` - 16 edges
2. `MultiwayModel` - 15 edges
3. `HomeController` - 14 edges
4. `step()` - 13 edges
5. `edgeId()` - 10 edges
6. `nodeIds()` - 10 edges
7. `setSteps()` - 9 edges
8. `runAstar()` - 8 edges
9. `makeTable()` - 8 edges
10. `tableStep()` - 8 edges

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

## Communities (19 total, 4 thin omitted)

### Community 0 - "Search Tree Structures"
Cohesion: 0.06
Nodes (24): advance(), BinaryModel, createModel(), DEFAULT_KEYS, delay(), insertNode(), keyValue(), MULTIWAY_KEYS (+16 more)

### Community 1 - "Graph Traversal Algorithms"
Cohesion: 0.12
Nodes (36): advance(), ALGO_RUNNERS, buildSteps(), cloneGraph(), delay(), edgeId(), fillSelectors(), GRAPH_ALGORITHMS (+28 more)

### Community 2 - "Algorithm Core Utilities"
Cohesion: 0.10
Nodes (32): AlgorithmCore, buildBinary(), buildMultiway(), dp, dsu(), edgeKey(), flipColors(), graphFrom() (+24 more)

### Community 3 - "Sorting Visualizer UI"
Cohesion: 0.06
Nodes (27): ALGO_GENERATORS, algoGrid, ALGORITHMS, algosSection, aux, backBtn, barsContainer, btnPlay (+19 more)

### Community 4 - "Algorithm Catalog Concepts"
Cohesion: 0.09
Nodes (29): Dynamic Programming Runners, AlgorithmCore Facade, Graph Algorithm Runners, Canonical Graph Samples, Greedy Runners, runSort, AlgorithmCore Contract Test Suite, Graph Expected Results (+21 more)

### Community 5 - "Dynamic Programming UI"
Cohesion: 0.15
Nodes (24): advance(), buildSteps(), delay(), DP_ALGORITHMS, emptyRows(), makeTable(), openDp(), pause() (+16 more)

### Community 6 - "Greedy Algorithm UI"
Cohesion: 0.14
Nodes (20): advance(), buildSteps(), delay(), GREEDY_ALGORITHMS, openGreedy(), pause(), play(), refs (+12 more)

### Community 7 - "Textbook Section UI"
Cohesion: 0.18
Nodes (14): advance(), buildSteps(), delay(), makeItems(), openAlgorithm(), pause(), play(), refs (+6 more)

### Community 8 - "MVC App Architecture"
Cohesion: 0.14
Nodes (17): Logging Configuration, Docker Buildx Publish Command, Client-Side Visualization Design, Project Architecture Guidance, Sorting Bars Favicon, Algorithm Page Actions, HomeController, Index Action (+9 more)

### Community 9 - "Launch Profiles"
Cohesion: 0.13
Nodes (15): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, applicationUrl, commandName (+7 more)

### Community 10 - "Core Algorithm Tests"
Cohesion: 0.12
Nodes (11): AlgorithmCore, assert, cycleGraph, expected, keys, result, sample, session (+3 more)

### Community 12 - "App Settings Logging"
Cohesion: 0.33
Nodes (5): AllowedHosts, Logging, LogLevel, Default, Microsoft.AspNetCore

### Community 13 - "Graphify Workflow Policy"
Cohesion: 0.50
Nodes (5): Graphify Project Policy, Graphify Hook Check, Claude Bash Permission, Structural and Semantic Extraction, Graphify Workflow

### Community 16 - "Error Handling Flow"
Cohesion: 0.67
Nodes (3): ErrorViewModel, Error Action, Production Error Pipeline

## Knowledge Gaps
- **92 isolated node(s):** `Default`, `Microsoft.AspNetCore`, `AllowedHosts`, `$schema`, `commandName` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `runGraph()` connect `Algorithm Core Utilities` to `Graph Traversal Algorithms`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `weight()` connect `Graph Traversal Algorithms` to `Algorithm Core Utilities`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `Default`, `Microsoft.AspNetCore`, `AllowedHosts` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Search Tree Structures` be split into smaller, more focused modules?**
  _Cohesion score 0.06428571428571428 - nodes in this community are weakly interconnected._
- **Should `Graph Traversal Algorithms` be split into smaller, more focused modules?**
  _Cohesion score 0.12435897435897436 - nodes in this community are weakly interconnected._
- **Should `Algorithm Core Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.09672830725462304 - nodes in this community are weakly interconnected._
- **Should `Sorting Visualizer UI` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._