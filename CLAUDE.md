# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
dotnet build VisualizedAlgorithms.sln              # Build the project
dotnet run --project VisualizedAlgorithms.csproj   # Run the dev server (default: https://localhost:5001)
dotnet build VisualizedAlgorithms.sln -c Release   # Release build
dotnet publish VisualizedAlgorithms.csproj         # Publish for production
```

Docker build (ARM64):
```bash
# See build.txt for the exact docker buildx command used
```

## Architecture

**VisualizedAlgorithms** is an ASP.NET Core 10.0 MVC app for visualizing sorting algorithms. The backend is minimal — a single `HomeController` that serves static pages. All sorting logic and visualization runs entirely client-side in JavaScript.

### Key files

- [wwwroot/js/site.js](wwwroot/js/site.js) — The entire visualization engine (~860 lines). Contains:
  - 9 sorting algorithm **generator functions** (`bubbleSortGen`, `selectionSortGen`, etc.)
  - The **Engine** IIFE: manages playback state, drives the generator step-by-step, and mutates the DOM
  - Each generator yields step objects: `{ type: 'compare' | 'swap' | 'write' | 'sorted', i, j, indices, height }`
  - Controls wiring: play/pause/step/reset, speed slider (1–10x), size slider (10–100 bars)

- [wwwroot/css/site.css](wwwroot/css/site.css) — Custom dark design system (~600 lines). Bar states are driven by CSS classes: `.vs-state-compare` (yellow), `.vs-state-swap` (red), `.vs-state-sorted` (green).

- [Views/Home/Index.cshtml](Views/Home/Index.cshtml) — Single view containing the full UI: hero section, algorithm grid (9 cards with complexity tables), and the visualizer panel (bar canvas, controls, stats, info panel).

- [Controllers/HomeController.cs](Controllers/HomeController.cs) — Trivial MVC controller; no API endpoints.

### Data flow

1. User clicks an algorithm card → `openVisualizer(key)` sets up the visualizer panel and calls `Engine.reset(key, size)`
2. `Engine.reset()` builds the bar array and instantiates the chosen generator
3. Play → `Engine.play()` calls `_scheduleNext()` on an interval; each tick pulls the next generator step
4. `_applyStep()` mutates bar DOM elements (swap heights, toggle state classes, update comparison/swap counters)
5. No network requests; the backend never participates in a visualization

### Adding a new algorithm

1. Write a generator function in `site.js` following the existing step-object protocol
2. Register it in the `ALGORITHMS` map (name, complexities, description, pseudocode)
3. Add a card to the algorithm grid in `Index.cshtml`

## Planned work (todos)

- Add binary search tree and other search algorithm visualizations
