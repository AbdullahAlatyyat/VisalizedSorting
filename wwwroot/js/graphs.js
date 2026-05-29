'use strict';

const GRAPH_ALGORITHMS = {
    bfs: {
        name: 'Breadth-first Search',
        category: 'Traversal',
        time: 'O(V + E)', space: 'O(V)', kind: 'Unweighted', use: 'Reachability',
        sample: 'unweighted',
        description: 'Explores a graph in layers using a queue. It is the standard way to find shortest paths in unweighted graphs.',
        pseudocode: 'enqueue(source)\nmark source visited\nwhile queue not empty:\n  u = dequeue()\n  for each neighbor v of u:\n    if v is unvisited:\n      mark v visited\n      parent[v] = u\n      enqueue(v)'
    },
    dfs: {
        name: 'Depth-first Search',
        category: 'Traversal',
        time: 'O(V + E)', space: 'O(V)', kind: 'Any graph', use: 'Structure',
        sample: 'unweighted',
        description: 'Explores as far as possible before backtracking. DFS powers cycle checks, topological sort, and component algorithms.',
        pseudocode: 'dfs(u):\n  mark u visited\n  for each neighbor v of u:\n    if v is unvisited:\n      parent[v] = u\n      dfs(v)'
    },
    topo: {
        name: 'Topological Sort',
        category: 'Ordering',
        time: 'O(V + E)', space: 'O(V)', kind: 'DAG', use: 'Prerequisites',
        sample: 'dag',
        description: 'Orders directed acyclic graph vertices so every dependency appears before the work that depends on it.',
        pseudocode: 'compute indegree for every vertex\nenqueue every indegree-0 vertex\nwhile queue not empty:\n  u = dequeue()\n  append u to order\n  for each outgoing edge u -> v:\n    decrement indegree[v]\n    if indegree[v] is 0: enqueue(v)'
    },
    dijkstra: {
        name: 'Dijkstra Shortest Path',
        category: 'Shortest path',
        time: 'O((V + E) log V)', space: 'O(V)', kind: 'Nonnegative weights', use: 'Routing',
        sample: 'weighted',
        description: 'Repeatedly settles the nearest unsettled vertex and relaxes outgoing edges. It requires nonnegative edge weights.',
        pseudocode: 'dist[source] = 0\nwhile unsettled vertices remain:\n  u = vertex with smallest dist\n  settle u\n  for each edge u -> v:\n    if dist[u] + w < dist[v]:\n      dist[v] = dist[u] + w\n      parent[v] = u'
    },
    bellman: {
        name: 'Bellman-Ford',
        category: 'Shortest path',
        time: 'O(VE)', space: 'O(V)', kind: 'Negative weights', use: 'Robust routing',
        sample: 'negative',
        description: 'Relaxes every edge repeatedly, which allows negative edges and exposes negative cycles.',
        pseudocode: 'dist[source] = 0\nrepeat V - 1 times:\n  for each edge u -> v:\n    relax(u, v)\ncheck one more pass for negative cycles'
    },
    floyd: {
        name: 'Floyd-Warshall',
        category: 'All-pairs path',
        time: 'O(V^3)', space: 'O(V^2)', kind: 'Weighted directed', use: 'All pairs',
        sample: 'matrix',
        description: 'Builds all-pairs shortest paths by allowing each vertex to become an intermediate waypoint.',
        pseudocode: 'for k from 1 to V:\n  for i from 1 to V:\n    for j from 1 to V:\n      if dist[i][k] + dist[k][j] < dist[i][j]:\n        dist[i][j] = dist[i][k] + dist[k][j]'
    },
    prim: {
        name: 'Prim MST',
        category: 'Spanning tree',
        time: 'O(E log V)', space: 'O(V)', kind: 'Weighted undirected', use: 'Networks',
        sample: 'weighted',
        description: 'Grows one tree by repeatedly choosing the cheapest edge that connects the current tree to a new vertex.',
        pseudocode: 'start with source in the tree\nwhile tree does not contain all vertices:\n  choose minimum edge leaving the tree\n  add that edge and vertex to the tree'
    },
    kruskal: {
        name: 'Kruskal MST',
        category: 'Spanning tree',
        time: 'O(E log E)', space: 'O(V)', kind: 'Weighted undirected', use: 'Networks',
        sample: 'weighted',
        description: 'Sorts edges by weight and accepts each edge that connects two different components.',
        pseudocode: 'sort edges by weight\nmake each vertex its own set\nfor each edge u-v in sorted order:\n  if find(u) != find(v):\n    union(u, v)\n    add edge to MST\n  else reject edge'
    },
    unionFind: {
        name: 'Union-Find / Disjoint Set',
        category: 'Connectivity',
        time: 'Almost O(1)', space: 'O(V)', kind: 'Set forest', use: 'Components',
        sample: 'weighted',
        description: 'Maintains dynamic components with find and union operations. Kruskal uses it to decide whether an edge creates a cycle.',
        pseudocode: 'makeSet(x)\nfind(x): return representative\nunion(a, b):\n  rootA = find(a)\n  rootB = find(b)\n  attach smaller-rank root below larger-rank root'
    },
    scc: {
        name: 'Strongly Connected Components',
        category: 'Components',
        time: 'O(V + E)', space: 'O(V)', kind: 'Directed', use: 'Mutual reachability',
        sample: 'scc',
        description: 'Groups directed vertices that can all reach each other. This visualization follows Kosaraju-style finish and collection passes.',
        pseudocode: 'run DFS and push vertices by finish time\nreverse every edge\nprocess vertices in decreasing finish time\n  each DFS tree is one strongly connected component'
    },
    astar: {
        name: 'A* Pathfinding',
        category: 'Heuristic path',
        time: 'Depends on heuristic', space: 'O(V)', kind: 'Weighted spatial', use: 'Pathfinding',
        sample: 'weighted',
        description: 'Chooses vertices by distance so far plus an admissible heuristic estimate. This demo uses h=0, so it remains exact and behaves like Dijkstra on the sample.',
        pseudocode: 'g[source] = 0\nf[source] = heuristic(source, target)\nwhile open set not empty:\n  u = node with smallest f\n  if u is target: reconstruct path\n  for each neighbor v:\n    if g[u] + w improves v:\n      parent[v] = u\n      update g[v] and f[v]'
    }
};

const GRAPH_SAMPLES = {
    unweighted: {
        directed: false,
        nodes: [
            n('A', 110, 90), n('B', 260, 70), n('C', 250, 210), n('D', 430, 100),
            n('E', 445, 250), n('F', 610, 170), n('G', 700, 300), n('H', 90, 300)
        ],
        edges: [e('A','B'), e('A','C'), e('A','H'), e('B','D'), e('C','D'), e('C','E'), e('D','F'), e('E','F'), e('E','G'), e('H','C')]
    },
    weighted: {
        directed: false,
        nodes: [
            n('A', 95, 210), n('B', 225, 100), n('C', 245, 315), n('D', 410, 170),
            n('E', 535, 300), n('F', 680, 135), n('G', 710, 330)
        ],
        edges: [e('A','B',4), e('A','C',2), e('B','C',1), e('B','D',5), e('C','D',8), e('C','E',10), e('D','E',2), e('D','F',6), e('E','F',3), e('E','G',5), e('F','G',1)]
    },
    dag: {
        directed: true,
        nodes: [n('A', 95, 90), n('B', 250, 70), n('C', 250, 220), n('D', 420, 110), n('E', 520, 250), n('F', 680, 170)],
        edges: [e('A','B'), e('A','C'), e('B','D'), e('C','D'), e('C','E'), e('D','F'), e('E','F')]
    },
    negative: {
        directed: true,
        nodes: [n('A', 100, 200), n('B', 260, 90), n('C', 270, 300), n('D', 470, 170), n('E', 640, 250)],
        edges: [e('A','B',6), e('A','C',7), e('B','C',8), e('B','D',5), e('B','E',-4), e('C','D',-3), e('C','E',9), e('D','B',-2), e('E','D',7)]
    },
    matrix: {
        directed: true,
        nodes: [n('A', 120, 120), n('B', 330, 80), n('C', 560, 170), n('D', 360, 320)],
        edges: [e('A','B',3), e('A','D',7), e('B','A',8), e('B','C',2), e('C','A',5), e('C','D',1), e('D','A',2)]
    },
    scc: {
        directed: true,
        nodes: [n('A', 120, 120), n('B', 290, 90), n('C', 430, 180), n('D', 250, 300), n('E', 590, 90), n('F', 700, 250)],
        edges: [e('A','B'), e('B','C'), e('C','A'), e('B','D'), e('D','C'), e('C','E'), e('E','F'), e('F','E')]
    }
};

const refs = {
    grid: document.getElementById('graph-grid'),
    list: document.getElementById('graphs'),
    viz: document.getElementById('graph-viz-section'),
    stage: document.getElementById('graph-stage'),
    back: document.getElementById('graph-back-btn'),
    title: document.getElementById('graph-title'),
    category: document.getElementById('graph-category'),
    source: document.getElementById('graph-source'),
    target: document.getElementById('graph-target'),
    visited: document.getElementById('graph-stat-visited'),
    steps: document.getElementById('graph-stat-steps'),
    status: document.getElementById('graph-stat-status'),
    speed: document.getElementById('graph-speed'),
    speedVal: document.getElementById('graph-speed-val'),
    size: document.getElementById('graph-size'),
    sizeVal: document.getElementById('graph-size-val'),
    play: document.getElementById('graph-play'),
    step: document.getElementById('graph-step'),
    reset: document.getElementById('graph-reset'),
    log: document.getElementById('graph-log'),
    pseudocode: document.getElementById('graph-pseudocode')
};

let currentKey = null;
let currentGraph = null;
let currentSample = null;
let steps = [];
let stepIndex = 0;
let timerId = null;
let playing = false;

function n(id, x, y) { return { id, x, y }; }
function e(from, to, weight) { return { from, to, weight }; }
function edgeId(edge, graph = currentGraph) {
    return graph && graph.directed ? `${edge.from}->${edge.to}` : [edge.from, edge.to].sort().join('-');
}
function cloneGraph(graph) {
    return {
        directed: graph.directed,
        nodes: graph.nodes.map(node => ({ ...node })),
        edges: graph.edges.map(edge => ({ ...edge }))
    };
}
function graphSize() {
    return parseInt(refs.size.value, 10) || 8;
}
function nodeLabel(index) {
    return String.fromCharCode(65 + index);
}
function generatedNode(index, total) {
    const angle = (Math.PI * 2 * index) / total;
    return n(nodeLabel(index), Math.round(410 + Math.cos(angle) * 300), Math.round(205 + Math.sin(angle) * 145));
}
function hasEdge(edges, from, to, directed) {
    return edges.some(edge => directed
        ? edge.from === from && edge.to === to
        : (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from));
}
function resizeGraphSample(sample, size) {
    const nextSize = Math.max(4, Math.min(12, size));
    const nodes = [];
    for (let i = 0; i < nextSize; i++) {
        const id = nodeLabel(i);
        const existing = sample.nodes.find(node => node.id === id);
        nodes.push(existing ? { ...existing } : generatedNode(i, nextSize));
    }
    const ids = new Set(nodes.map(node => node.id));
    const edges = sample.edges
        .filter(edge => ids.has(edge.from) && ids.has(edge.to))
        .map(edge => ({ ...edge }));
    for (let i = 0; i < nextSize - 1; i++) {
        const from = nodeLabel(i);
        const to = nodeLabel(i + 1);
        if (!hasEdge(edges, from, to, sample.directed)) edges.push(e(from, to, sample.edges.some(edge => edge.weight !== undefined) ? (i * 3) % 9 + 1 : undefined));
    }
    if (!sample.directed) {
        for (let i = 0; i < nextSize - 2; i += 2) {
            const from = nodeLabel(i);
            const to = nodeLabel(i + 2);
            if (!hasEdge(edges, from, to, false)) edges.push(e(from, to, sample.edges.some(edge => edge.weight !== undefined) ? (i * 5) % 8 + 2 : undefined));
        }
    }
    return { directed: sample.directed, nodes, edges };
}
function nodeIds(graph) { return graph.nodes.map(node => node.id); }
function neighbors(graph, id) {
    const out = [];
    for (const edge of graph.edges) {
        if (edge.from === id) out.push({ id: edge.to, edge });
        else if (!graph.directed && edge.to === id) out.push({ id: edge.from, edge });
    }
    return out;
}
function weight(edge) { return edge.weight ?? 1; }
function step(message, state = {}) {
    return { message, state: { visited: [], frontier: [], path: [], current: null, edgeFrontier: [], edgePath: [], edgeRejected: [], ...state } };
}

function renderGrid() {
    refs.grid.innerHTML = Object.entries(GRAPH_ALGORITHMS).map(([key, algo]) => `
<div class="vs-algo-card" data-key="${key}" role="button" tabindex="0" aria-label="Visualize ${algo.name}">
    <div class="vs-algo-card-header">
        <span class="vs-algo-name">${algo.name}</span>
        <span class="vs-category-badge vs-badge-graph">${algo.category}</span>
    </div>
    <table class="vs-complexity-table" aria-label="Complexity of ${algo.name}">
        <tr><td>Time</td><td>${algo.time}</td></tr>
        <tr><td>Space</td><td>${algo.space}</td></tr>
        <tr><td>Graph</td><td>${algo.kind}</td></tr>
        <tr><td>Use Case</td><td>${algo.use}</td></tr>
    </table>
    <div class="vs-card-footer" aria-hidden="true">Visualize</div>
</div>`).join('');

    refs.grid.addEventListener('click', event => {
        const card = event.target.closest('.vs-algo-card');
        if (card) openGraph(card.dataset.key);
    });
    refs.grid.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const card = event.target.closest('.vs-algo-card');
        if (!card) return;
        event.preventDefault();
        openGraph(card.dataset.key);
    });
}

function openGraph(key) {
    currentKey = key;
    const algo = GRAPH_ALGORITHMS[key];
    currentSample = GRAPH_SAMPLES[algo.sample];
    currentGraph = resizeGraphSample(currentSample, graphSize());
    refs.title.textContent = algo.name;
    refs.category.textContent = algo.category;
    document.getElementById('graph-cp-time').textContent = algo.time;
    document.getElementById('graph-cp-space').textContent = algo.space;
    document.getElementById('graph-cp-kind').textContent = algo.kind;
    document.getElementById('graph-cp-use').textContent = algo.use;
    document.getElementById('graph-description').textContent = algo.description;
    refs.pseudocode.textContent = algo.pseudocode;
    fillSelectors(currentGraph);
    refs.list.classList.add('vs-hidden');
    refs.viz.classList.remove('vs-hidden');
    buildSteps();
}

function fillSelectors(graph) {
    const ids = nodeIds(graph);
    refs.source.innerHTML = ids.map(id => `<option value="${id}">${id}</option>`).join('');
    refs.target.innerHTML = ids.map(id => `<option value="${id}">${id}</option>`).join('');
    refs.source.value = ids[0];
    refs.target.value = ids[ids.length - 1];
}

function buildSteps() {
    pause();
    refs.log.innerHTML = '';
    const source = refs.source.value;
    const target = refs.target.value;
    steps = (ALGO_RUNNERS[currentKey] || runBfs)(currentGraph, source, target);
    if (!steps.length) steps = [step('Ready')];
    stepIndex = 0;
    renderStep(steps[0]);
}
function rebuildGraph() {
    if (!currentSample) return;
    const previousSource = refs.source.value;
    const previousTarget = refs.target.value;
    currentGraph = resizeGraphSample(currentSample, graphSize());
    fillSelectors(currentGraph);
    const ids = nodeIds(currentGraph);
    refs.source.value = ids.includes(previousSource) ? previousSource : ids[0];
    refs.target.value = ids.includes(previousTarget) ? previousTarget : ids[ids.length - 1];
    buildSteps();
}

function renderStep(item) {
    refs.status.textContent = item.message;
    refs.steps.textContent = stepIndex;
    refs.visited.textContent = new Set([...(item.state.visited || []), ...(item.state.path || [])]).size;
    renderGraph(item.state);
    renderLog(item.message);
}

function renderLog(message) {
    const li = document.createElement('li');
    li.textContent = message;
    refs.log.prepend(li);
    while (refs.log.children.length > 8) refs.log.lastChild.remove();
}

function renderGraph(state) {
    const nodeMap = new Map(currentGraph.nodes.map(node => [node.id, node]));
    const marker = currentGraph.directed
        ? '<defs><marker id="graph-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L8,3 z" fill="#2e2e55"></path></marker></defs>'
        : '';
    const edgeLines = currentGraph.edges.map(edge => {
        const a = nodeMap.get(edge.from);
        const b = nodeMap.get(edge.to);
        const id = edgeId(edge, currentGraph);
        const cls = state.edgeRejected.includes(id) ? 'vs-graph-edge-rejected'
            : state.edgePath.includes(id) ? 'vs-graph-edge-path'
            : state.edgeFrontier.includes(id) ? 'vs-graph-edge-frontier'
            : '';
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const markerEnd = currentGraph.directed ? ' marker-end="url(#graph-arrow)"' : '';
        const label = edge.weight === undefined ? '' : edge.weight;
        return `<line class="vs-graph-edge ${cls}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"${markerEnd}></line>
            <text class="vs-graph-weight" x="${mx}" y="${my - 8}">${label}</text>`;
    }).join('');

    const nodes = currentGraph.nodes.map(node => {
        const cls = state.path.includes(node.id) ? 'vs-graph-node-path'
            : state.current === node.id ? 'vs-graph-node-current'
            : state.frontier.includes(node.id) ? 'vs-graph-node-frontier'
            : state.visited.includes(node.id) ? 'vs-graph-node-visited'
            : '';
        return `<g class="vs-graph-node ${cls}" transform="translate(${node.x} ${node.y})"><circle r="25"></circle><text>${node.id}</text></g>`;
    }).join('');

    refs.stage.innerHTML = `<svg viewBox="0 0 820 420" width="100%" height="430">${marker}${edgeLines}${nodes}</svg>`;
}

function reconstruct(prev, source, target, graph) {
    const path = [];
    const edgePath = [];
    let cur = target;
    while (cur && cur !== source) {
        path.push(cur);
        const p = prev[cur];
        if (!p) break;
        edgePath.push(edgeId({ from: p, to: cur }, graph));
        cur = p;
    }
    if (cur === source) path.push(source);
    return { path: path.reverse(), edgePath };
}

function runBfs(graph, source, target) {
    const seen = new Set([source]);
    const q = [source];
    const prev = {};
    const out = [step(`Start BFS at ${source}`, { frontier: [source] })];
    while (q.length) {
        const u = q.shift();
        out.push(step(`Visit ${u}; queue: ${q.join(', ') || 'empty'}`, { current: u, visited: [...seen], frontier: q }));
        if (u === target) break;
        for (const nb of neighbors(graph, u)) {
            if (seen.has(nb.id)) continue;
            seen.add(nb.id);
            prev[nb.id] = u;
            q.push(nb.id);
            out.push(step(`Discover ${nb.id} from ${u}`, { current: u, visited: [...seen], frontier: q, edgeFrontier: [edgeId(nb.edge, graph)] }));
        }
    }
    const path = reconstruct(prev, source, target, graph);
    out.push(step(path.path.includes(target) ? `Shortest unweighted path: ${path.path.join(' -> ')}` : `${target} is unreachable`, { visited: [...seen], path: path.path, edgePath: path.edgePath }));
    return out;
}

function runDfs(graph, source) {
    const seen = new Set();
    const out = [step(`Start DFS at ${source}`, { frontier: [source] })];
    function dfs(u) {
        seen.add(u);
        out.push(step(`Enter ${u}`, { current: u, visited: [...seen] }));
        for (const nb of neighbors(graph, u)) {
            if (!seen.has(nb.id)) {
                out.push(step(`Tree edge ${u} -> ${nb.id}`, { current: u, visited: [...seen], edgeFrontier: [edgeId(nb.edge, graph)] }));
                dfs(nb.id);
            }
        }
        out.push(step(`Finish ${u}`, { current: u, visited: [...seen] }));
    }
    dfs(source);
    return out;
}

function runTopo(graph) {
    const indeg = Object.fromEntries(nodeIds(graph).map(id => [id, 0]));
    graph.edges.forEach(edge => indeg[edge.to]++);
    const q = Object.keys(indeg).filter(id => indeg[id] === 0);
    const order = [];
    const out = [step(`Initial indegree-0 queue: ${q.join(', ')}`, { frontier: q })];
    while (q.length) {
        const u = q.shift();
        order.push(u);
        out.push(step(`Output ${u}`, { current: u, visited: [...order], frontier: q }));
        for (const nb of neighbors(graph, u)) {
            indeg[nb.id]--;
            if (indeg[nb.id] === 0) q.push(nb.id);
            out.push(step(`Remove edge ${u} -> ${nb.id}; indegree(${nb.id}) = ${indeg[nb.id]}`, { current: u, visited: [...order], frontier: q, edgeFrontier: [edgeId(nb.edge, graph)] }));
        }
    }
    out.push(step(order.length === graph.nodes.length ? `Topological order: ${order.join(', ')}` : 'Cycle detected; no topological order', { path: order }));
    return out;
}

function runDijkstra(graph, source, target) {
    const ids = nodeIds(graph);
    const dist = Object.fromEntries(ids.map(id => [id, Infinity]));
    const prev = {};
    const settled = new Set();
    dist[source] = 0;
    const out = [step(`Set dist(${source}) = 0`, { frontier: [source] })];
    while (settled.size < ids.length) {
        const u = ids.filter(id => !settled.has(id)).sort((a, b) => dist[a] - dist[b])[0];
        if (!u || dist[u] === Infinity) break;
        settled.add(u);
        out.push(step(`Settle ${u} with distance ${dist[u]}`, { current: u, visited: [...settled] }));
        if (u === target) break;
        for (const nb of neighbors(graph, u)) {
            if (settled.has(nb.id)) continue;
            const nd = dist[u] + weight(nb.edge);
            if (nd < dist[nb.id]) {
                dist[nb.id] = nd;
                prev[nb.id] = u;
                out.push(step(`Relax ${u} -> ${nb.id}; dist = ${nd}`, { current: u, visited: [...settled], frontier: [nb.id], edgeFrontier: [edgeId(nb.edge, graph)] }));
            }
        }
    }
    const path = reconstruct(prev, source, target, graph);
    out.push(step(path.path.includes(target) ? `Shortest path cost ${dist[target]}: ${path.path.join(' -> ')}` : `${target} is unreachable`, { visited: [...settled], path: path.path, edgePath: path.edgePath }));
    return out;
}

function runBellman(graph, source, target) {
    const ids = nodeIds(graph);
    const dist = Object.fromEntries(ids.map(id => [id, Infinity]));
    const prev = {};
    const out = [step(`Set dist(${source}) = 0`, { frontier: [source] })];
    dist[source] = 0;
    for (let pass = 1; pass < ids.length; pass++) {
        let changed = false;
        for (const edge of graph.edges) {
            if (dist[edge.from] !== Infinity && dist[edge.from] + weight(edge) < dist[edge.to]) {
                dist[edge.to] = dist[edge.from] + weight(edge);
                prev[edge.to] = edge.from;
                changed = true;
                out.push(step(`Pass ${pass}: relax ${edge.from} -> ${edge.to}; dist = ${dist[edge.to]}`, { current: edge.from, frontier: [edge.to], edgeFrontier: [edgeId(edge, graph)] }));
            }
        }
        if (!changed) break;
    }
    const negativeCycle = graph.edges.some(edge => dist[edge.from] !== Infinity && dist[edge.from] + weight(edge) < dist[edge.to]);
    const path = reconstruct(prev, source, target, graph);
    out.push(step(negativeCycle ? 'Negative cycle reachable from source' : `Bellman-Ford result for ${target}: ${dist[target]}`, { path: negativeCycle ? [] : path.path, edgePath: negativeCycle ? [] : path.edgePath }));
    return out;
}

function runFloyd(graph) {
    const ids = nodeIds(graph);
    const dist = {};
    ids.forEach(i => {
        dist[i] = {};
        ids.forEach(j => dist[i][j] = i === j ? 0 : Infinity);
    });
    graph.edges.forEach(edge => dist[edge.from][edge.to] = weight(edge));
    const out = [step('Initialize all-pairs distance matrix')];
    for (const k of ids) {
        for (const i of ids) {
            for (const j of ids) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    out.push(step(`Use ${k}: improve ${i} -> ${j} to ${dist[i][j]}`, { current: k, frontier: [i, j] }));
                }
            }
        }
    }
    out.push(step('All-pairs shortest paths are complete', { path: ids }));
    return out;
}

function runPrim(graph, source) {
    const tree = new Set([source]);
    const edgePath = [];
    const out = [step(`Start Prim at ${source}`, { visited: [...tree] })];
    while (tree.size < graph.nodes.length) {
        const candidates = graph.edges.filter(edge => tree.has(edge.from) !== tree.has(edge.to));
        candidates.sort((a, b) => weight(a) - weight(b));
        const best = candidates[0];
        if (!best) break;
        const next = tree.has(best.from) ? best.to : best.from;
        tree.add(next);
        edgePath.push(edgeId(best, graph));
        out.push(step(`Choose edge ${best.from}-${best.to} weight ${weight(best)}`, { current: next, visited: [...tree], edgePath: [...edgePath] }));
    }
    out.push(step('Minimum spanning tree complete', { visited: [...tree], edgePath }));
    return out;
}

function makeDsu(ids) {
    const parent = Object.fromEntries(ids.map(id => [id, id]));
    const rank = Object.fromEntries(ids.map(id => [id, 0]));
    function find(x) {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    }
    function union(a, b) {
        let ra = find(a), rb = find(b);
        if (ra === rb) return false;
        if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
        parent[rb] = ra;
        if (rank[ra] === rank[rb]) rank[ra]++;
        return true;
    }
    return { find, union };
}

function runKruskal(graph) {
    const dsu = makeDsu(nodeIds(graph));
    const chosen = [];
    const rejected = [];
    const out = [step('Sort edges by weight')];
    for (const edge of [...graph.edges].sort((a, b) => weight(a) - weight(b))) {
        if (dsu.union(edge.from, edge.to)) {
            chosen.push(edgeId(edge, graph));
            out.push(step(`Accept ${edge.from}-${edge.to}`, { edgePath: [...chosen] }));
        } else {
            rejected.push(edgeId(edge, graph));
            out.push(step(`Reject ${edge.from}-${edge.to}; it forms a cycle`, { edgePath: [...chosen], edgeRejected: [...rejected] }));
        }
    }
    out.push(step('Kruskal MST complete', { edgePath: chosen, edgeRejected: rejected }));
    return out;
}

function runUnionFind(graph) {
    const dsu = makeDsu(nodeIds(graph));
    const chosen = [];
    const rejected = [];
    const out = [step('Make every vertex its own set')];
    for (const edge of graph.edges) {
        if (dsu.union(edge.from, edge.to)) {
            chosen.push(edgeId(edge, graph));
            out.push(step(`union(${edge.from}, ${edge.to}) merges two sets`, { current: edge.from, frontier: [edge.to], edgePath: [...chosen] }));
        } else {
            rejected.push(edgeId(edge, graph));
            out.push(step(`find(${edge.from}) equals find(${edge.to}); skip`, { current: edge.from, frontier: [edge.to], edgePath: [...chosen], edgeRejected: [...rejected] }));
        }
    }
    return out;
}

function runScc(graph) {
    const seen = new Set();
    const order = [];
    const out = [step('First DFS pass: collect finish order')];
    function dfs1(u) {
        seen.add(u);
        out.push(step(`Visit ${u} in first pass`, { current: u, visited: [...seen] }));
        for (const nb of neighbors(graph, u)) if (!seen.has(nb.id)) dfs1(nb.id);
        order.push(u);
        out.push(step(`Push ${u} by finish time`, { current: u, path: [...order] }));
    }
    nodeIds(graph).forEach(id => { if (!seen.has(id)) dfs1(id); });
    const rev = cloneGraph(graph);
    rev.edges = rev.edges.map(edge => ({ from: edge.to, to: edge.from, weight: edge.weight }));
    seen.clear();
    let component = 0;
    while (order.length) {
        const start = order.pop();
        if (seen.has(start)) continue;
        component++;
        const group = [];
        function dfs2(u) {
            seen.add(u);
            group.push(u);
            for (const nb of neighbors(rev, u)) if (!seen.has(nb.id)) dfs2(nb.id);
        }
        dfs2(start);
        out.push(step(`Component ${component}: ${group.join(', ')}`, { path: group }));
    }
    return out;
}

function heuristic(graph, a, b) {
    return 0;
}

function runAstar(graph, source, target) {
    const open = new Set([source]);
    const closed = new Set();
    const g = Object.fromEntries(nodeIds(graph).map(id => [id, Infinity]));
    const f = Object.fromEntries(nodeIds(graph).map(id => [id, Infinity]));
    const prev = {};
    g[source] = 0;
    f[source] = heuristic(graph, source, target);
    const out = [step(`Start A* at ${source}; target ${target}`, { frontier: [source] })];
    while (open.size) {
        const u = [...open].sort((a, b) => f[a] - f[b])[0];
        open.delete(u);
        closed.add(u);
        out.push(step(`Expand ${u}; f = ${f[u].toFixed(2)}`, { current: u, visited: [...closed], frontier: [...open] }));
        if (u === target) break;
        for (const nb of neighbors(graph, u)) {
            const tentative = g[u] + weight(nb.edge);
            if (tentative < g[nb.id]) {
                prev[nb.id] = u;
                g[nb.id] = tentative;
                f[nb.id] = tentative + heuristic(graph, nb.id, target);
                open.add(nb.id);
                out.push(step(`Improve ${nb.id}; g = ${g[nb.id]}, f = ${f[nb.id].toFixed(2)}`, { current: u, visited: [...closed], frontier: [...open], edgeFrontier: [edgeId(nb.edge, graph)] }));
            }
        }
    }
    const path = reconstruct(prev, source, target, graph);
    out.push(step(path.path.includes(target) ? `A* path: ${path.path.join(' -> ')}` : `${target} is unreachable`, { visited: [...closed], path: path.path, edgePath: path.edgePath }));
    return out;
}

const ALGO_RUNNERS = {
    bfs: runBfs,
    dfs: runDfs,
    topo: runTopo,
    dijkstra: runDijkstra,
    bellman: runBellman,
    floyd: runFloyd,
    prim: runPrim,
    kruskal: runKruskal,
    unionFind: runUnionFind,
    scc: runScc,
    astar: runAstar
};

function delay() {
    const s = parseInt(refs.speed.value, 10);
    return Math.max(35, Math.round(650 / (s * s * 0.16 + 0.35)));
}
function syncPlay() { refs.play.textContent = playing ? 'Pause' : 'Play'; }
function pause() {
    playing = false;
    clearInterval(timerId);
    timerId = null;
    syncPlay();
}
function advance() {
    if (stepIndex >= steps.length - 1) {
        pause();
        refs.status.textContent = 'Done';
        return;
    }
    stepIndex++;
    renderStep(steps[stepIndex]);
}
function play() {
    if (playing) return;
    playing = true;
    syncPlay();
    timerId = setInterval(advance, delay());
}

refs.back.addEventListener('click', () => {
    pause();
    refs.viz.classList.add('vs-hidden');
    refs.list.classList.remove('vs-hidden');
});
refs.reset.addEventListener('click', buildSteps);
refs.play.addEventListener('click', () => playing ? pause() : play());
refs.step.addEventListener('click', () => {
    pause();
    advance();
});
refs.speed.addEventListener('input', () => {
    refs.speedVal.textContent = refs.speed.value;
    if (playing) {
        pause();
        play();
    }
});
refs.size.addEventListener('input', () => {
    refs.sizeVal.textContent = refs.size.value;
    rebuildGraph();
});
refs.source.addEventListener('change', buildSteps);
refs.target.addEventListener('change', buildSteps);

renderGrid();
