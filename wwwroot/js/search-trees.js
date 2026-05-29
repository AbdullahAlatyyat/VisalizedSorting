'use strict';

const TREE_DATA = {
    bst: {
        name: 'Binary Search Tree',
        category: 'Unbalanced',
        search: 'O(h)', insert: 'O(h)', delete: 'O(h)', space: 'O(n)',
        description: 'Stores smaller keys to the left and larger keys to the right. It is the baseline search tree that makes every later balancing idea easier to see.',
        pseudocode: 'search(x):\n  while node exists and node.key != x:\n    if x < node.key: node = node.left\n    else: node = node.right\n\ninsert(x):\n  follow the search path\n  attach x at the missing child\n\ndelete(x):\n  remove leaf or one-child node\n  otherwise replace with successor'
    },
    avl: {
        name: 'AVL Tree',
        category: 'Height-balanced',
        search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)',
        description: 'Keeps each node height-balanced with rotations so every balance factor remains between -1 and 1.',
        pseudocode: 'insert/delete(x):\n  perform BST operation\n  walk back toward the root\n  update heights\n  rotate when balance factor is outside [-1, 1]'
    },
    rb: {
        name: 'Red-Black Tree',
        category: 'Color-balanced',
        search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)',
        description: 'Uses node colors and local rotations to keep the root black, avoid red-red links, and bound tree height.',
        pseudocode: 'insert/delete(x):\n  perform BST operation\n  restore red-black properties\n  recolor or rotate around local violations\n  keep the root black'
    },
    splay: {
        name: 'Splay Tree',
        category: 'Self-adjusting',
        search: 'Amortized O(log n)', insert: 'Amortized O(log n)', delete: 'Amortized O(log n)', space: 'O(n)',
        description: 'Moves recently accessed keys toward the root using zig, zig-zig, and zig-zag rotations.',
        pseudocode: 'access(x):\n  search for x or last touched node\n  while node is not root:\n    perform zig, zig-zig, or zig-zag rotation'
    },
    treap: {
        name: 'Treap',
        category: 'Randomized',
        search: 'Expected O(log n)', insert: 'Expected O(log n)', delete: 'Expected O(log n)', space: 'O(n)',
        description: 'Combines BST ordering by key with heap ordering by deterministic demo priorities.',
        pseudocode: 'insert(x):\n  insert by BST key order\n  assign random priority\n  rotate upward while priority beats parent'
    },
    twoThree: {
        name: '2-3 Tree',
        category: 'Multiway',
        search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)',
        description: 'Stores one or two keys per node and keeps every leaf at the same depth. Splits are visible as multi-key nodes settle back into order.',
        pseudocode: 'insert(x):\n  descend to leaf\n  add key in sorted order\n  split overflowing 3-key nodes upward'
    },
    twoThreeFour: {
        name: '2-3-4 Tree',
        category: 'Multiway',
        search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)',
        description: 'A B-tree of minimum degree 2. Nodes may hold one, two, or three keys, matching red-black tree behavior from another angle.',
        pseudocode: 'insert(x):\n  split full nodes on the way down\n  insert into a non-full leaf\n\ndelete(x):\n  borrow or merge before descending when needed'
    },
    btree: {
        name: 'B-Tree',
        category: 'Disk-friendly',
        search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)',
        description: 'A broad multiway tree tuned for block storage. This visualizer uses minimum degree 3 so node splits are easy to inspect.',
        pseudocode: 'insert(x):\n  if root is full, split root\n  descend, splitting full children first\n  insert x into a non-full leaf'
    },
    bplus: {
        name: 'B+ Tree',
        category: 'Index tree',
        search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)',
        description: 'Keeps records in ordered leaves with separator keys above them for multiway search.',
        pseudocode: 'search(x):\n  descend through separator keys\n  scan the target leaf\n\ninsert/delete(x):\n  update leaf\n  split, borrow, or merge as needed'
    }
};

const DEFAULT_KEYS = [50, 25, 75, 12, 37, 62, 88, 31, 43, 57, 70];
const MULTIWAY_KEYS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];

const refs = {
    grid: document.getElementById('tree-grid'),
    listSection: document.getElementById('trees'),
    vizSection: document.getElementById('tree-viz-section'),
    back: document.getElementById('tree-back-btn'),
    title: document.getElementById('tree-title'),
    category: document.getElementById('tree-category'),
    stage: document.getElementById('tree-stage'),
    value: document.getElementById('tree-value'),
    nodes: document.getElementById('tree-stat-nodes'),
    steps: document.getElementById('tree-stat-steps'),
    status: document.getElementById('tree-stat-status'),
    log: document.getElementById('tree-log'),
    pseudocode: document.getElementById('tree-pseudocode'),
    speed: document.getElementById('tree-speed'),
    speedVal: document.getElementById('tree-speed-val'),
    size: document.getElementById('tree-size'),
    sizeVal: document.getElementById('tree-size-val'),
    play: document.getElementById('tree-play'),
    step: document.getElementById('tree-step'),
    reset: document.getElementById('tree-reset')
};

let currentTreeKey = null;
let model = null;
let steps = [];
let stepIndex = 0;
let timerId = null;
let playing = false;
let pendingCommit = null;

function treeSize() {
    return parseInt(refs.size.value, 10) || 11;
}
function sizedKeys(source, size, step = 7) {
    const keys = source.slice(0, size);
    let next = source[source.length - 1] + step;
    while (keys.length < size) {
        keys.push(next);
        next += step;
    }
    return keys;
}
function randomKeys(size, min = 5, max = 250) {
    const keys = new Set();
    while (keys.size < size && keys.size < max - min + 1) keys.add(Math.floor(Math.random() * (max - min + 1)) + min);
    return [...keys];
}

class BinaryModel {
    constructor(keys = []) {
        this.keys = [];
        keys.forEach(key => this.insertSilent(key));
    }

    insertSilent(key) {
        if (!Number.isFinite(key) || this.keys.includes(key)) return;
        this.keys.push(key);
        this.keys.sort((a, b) => a - b);
    }

    removeSilent(key) {
        this.keys = this.keys.filter(k => k !== key);
    }

    pathTo(key) {
        const root = this.build();
        const path = [];
        let node = root;
        while (node) {
            path.push(node.key);
            if (key === node.key) break;
            node = key < node.key ? node.left : node.right;
        }
        return path;
    }

    build(keys = this.keys) {
        let root = null;
        for (const key of keys) {
            root = insertNode(root, key);
        }
        return root;
    }

    snapshot(highlight = {}, message = 'Ready') {
        return { kind: 'binary', root: this.build(), count: this.keys.length, highlight, message };
    }

    insert(key) {
        const exists = this.keys.includes(key);
        const path = this.pathTo(key);
        const out = [this.snapshot({ visit: path }, `Search path for ${key}`)];
        if (!exists) this.insertSilent(key);
        out.push(this.snapshot({ change: [key] }, exists ? `${key} is already present` : `Inserted ${key}`));
        return out;
    }

    search(key) {
        const path = this.pathTo(key);
        const found = this.keys.includes(key);
        return [
            this.snapshot({ visit: path }, `Search path for ${key}`),
            this.snapshot(found ? { found: [key] } : { change: path.slice(-1) }, found ? `Found ${key}` : `${key} is not in the tree`)
        ];
    }

    delete(key) {
        const path = this.pathTo(key);
        const out = [this.snapshot({ visit: path }, `Search path for deleting ${key}`)];
        if (this.keys.includes(key)) {
            this.removeSilent(key);
            out.push(this.snapshot({ change: path }, `Deleted ${key}`));
        } else {
            out.push(this.snapshot({ change: path.slice(-1) }, `${key} was not found`));
        }
        return out;
    }

    ordered() { return [...this.keys]; }
    min() { return this.keys[0]; }
    max() { return this.keys[this.keys.length - 1]; }
    predecessor(key) { return [...this.keys].reverse().find(k => k < key); }
    successor(key) { return this.keys.find(k => k > key); }

    traversal(type) {
        const root = this.build();
        const out = [];
        const visit = node => { if (node) out.push(node.key); };
        const inorder = node => { if (!node) return; inorder(node.left); visit(node); inorder(node.right); };
        const preorder = node => { if (!node) return; visit(node); preorder(node.left); preorder(node.right); };
        const postorder = node => { if (!node) return; postorder(node.left); postorder(node.right); visit(node); };
        const levelorder = node => {
            const queue = node ? [node] : [];
            while (queue.length) {
                const n = queue.shift();
                visit(n);
                if (n.left) queue.push(n.left);
                if (n.right) queue.push(n.right);
            }
        };
        ({ inorder, preorder, postorder, levelorder }[type] || inorder)(root);
        return out.map((key, i) => this.snapshot({ found: out.slice(0, i + 1), visit: [key] }, `${type}: ${out.slice(0, i + 1).join(', ')}`));
    }
}

class MultiwayModel {
    constructor(keys = [], maxKeys = 3) {
        this.keys = [];
        this.maxKeys = maxKeys;
        keys.forEach(key => this.insertSilent(key));
    }

    insertSilent(key) {
        if (!Number.isFinite(key) || this.keys.includes(key)) return;
        this.keys.push(key);
        this.keys.sort((a, b) => a - b);
    }

    removeSilent(key) {
        this.keys = this.keys.filter(k => k !== key);
    }

    levels() {
        const leaves = [];
        for (let i = 0; i < this.keys.length; i += this.maxKeys) {
            leaves.push({ id: `l${i}`, keys: this.keys.slice(i, i + this.maxKeys), children: [] });
        }
        if (leaves.length <= 1) return leaves.length ? [leaves] : [[]];
        const rootKeys = leaves.slice(1).map(leaf => leaf.keys[0]);
        return [[{ id: 'root', keys: rootKeys, children: leaves }], leaves];
    }

    snapshot(highlight = {}, message = 'Ready') {
        return { kind: 'multiway', levels: this.levels(), count: this.keys.length, highlight, message };
    }

    insert(key) {
        const exists = this.keys.includes(key);
        const out = [this.snapshot({ visit: [key] }, `Descend to the leaf for ${key}`)];
        if (!exists) this.insertSilent(key);
        out.push(this.snapshot({ change: [key] }, exists ? `${key} is already present` : `Inserted ${key}; split/promote if a node overflowed`));
        return out;
    }

    search(key) {
        const found = this.keys.includes(key);
        return [
            this.snapshot({ visit: [key] }, `Compare separators while searching for ${key}`),
            this.snapshot(found ? { found: [key] } : { change: [key] }, found ? `Found ${key} in a leaf` : `${key} is not in the tree`)
        ];
    }

    delete(key) {
        const out = [this.snapshot({ visit: [key] }, `Find the leaf for deleting ${key}`)];
        if (this.keys.includes(key)) {
            this.removeSilent(key);
            out.push(this.snapshot({ change: [key] }, `Deleted ${key}; borrow/merge if a node underflowed`));
        } else {
            out.push(this.snapshot({ change: [key] }, `${key} was not found`));
        }
        return out;
    }

    ordered() { return [...this.keys]; }
    min() { return this.keys[0]; }
    max() { return this.keys[this.keys.length - 1]; }
    predecessor(key) { return [...this.keys].reverse().find(k => k < key); }
    successor(key) { return this.keys.find(k => k > key); }
    traversal(type) {
        const keys = this.ordered();
        return keys.map((key, i) => this.snapshot({ found: keys.slice(0, i + 1), visit: [key] }, `${type}: ${keys.slice(0, i + 1).join(', ')}`));
    }
}

function insertNode(node, key) {
    if (!node) return { key, left: null, right: null };
    if (key < node.key) node.left = insertNode(node.left, key);
    if (key > node.key) node.right = insertNode(node.right, key);
    return node;
}

function renderGrid() {
    refs.grid.innerHTML = Object.entries(TREE_DATA).map(([key, tree]) => `
<div class="vs-algo-card" data-key="${key}" role="button" tabindex="0" aria-label="Visualize ${tree.name}">
    <div class="vs-algo-card-header">
        <span class="vs-algo-name">${tree.name}</span>
        <span class="vs-category-badge vs-badge-tree">${tree.category}</span>
    </div>
    <table class="vs-complexity-table" aria-label="Complexity of ${tree.name}">
        <tr><td>Search</td><td>${tree.search}</td></tr>
        <tr><td>Insert</td><td>${tree.insert}</td></tr>
        <tr><td>Delete</td><td>${tree.delete}</td></tr>
        <tr><td>Space</td><td>${tree.space}</td></tr>
    </table>
    <div class="vs-card-footer" aria-hidden="true">Visualize</div>
</div>`).join('');

    refs.grid.addEventListener('click', e => {
        const card = e.target.closest('.vs-algo-card');
        if (card) openTree(card.dataset.key);
    });
    refs.grid.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const card = e.target.closest('.vs-algo-card');
        if (!card) return;
        e.preventDefault();
        openTree(card.dataset.key);
    });
}

function openTree(key) {
    const tree = TREE_DATA[key];
    currentTreeKey = key;
    refs.title.textContent = tree.name;
    refs.category.textContent = tree.category;
    document.getElementById('tree-cp-search').textContent = tree.search;
    document.getElementById('tree-cp-insert').textContent = tree.insert;
    document.getElementById('tree-cp-delete').textContent = tree.delete;
    document.getElementById('tree-cp-space').textContent = tree.space;
    document.getElementById('tree-description').textContent = tree.description;
    refs.pseudocode.textContent = tree.pseudocode;
    model = createModel(key);
    setSteps([model.snapshot({}, 'Ready')]);
    refs.listSection.classList.add('vs-hidden');
    refs.vizSection.classList.remove('vs-hidden');
}

function createModel(key) {
    const size = treeSize();
    if (globalThis.AlgorithmCore) return globalThis.AlgorithmCore.trees.createSession(key, { size, randomize: true });
    if (['twoThree', 'twoThreeFour', 'btree', 'bplus'].includes(key)) {
        const maxKeys = key === 'btree' || key === 'bplus' ? 5 : 3;
        return new MultiwayModel(randomKeys(size), maxKeys);
    }
    return new BinaryModel(randomKeys(size));
}

function createModelFromKeys(key, keys) {
    if (globalThis.AlgorithmCore) return globalThis.AlgorithmCore.trees.createSession(key, [...keys]);
    if (['twoThree', 'twoThreeFour', 'btree', 'bplus'].includes(key)) {
        const maxKeys = key === 'btree' || key === 'bplus' ? 5 : 3;
        return new MultiwayModel([...keys], maxKeys);
    }
    return new BinaryModel([...keys]);
}

function modelKeys(source = model) {
    return source && Array.isArray(source.keys) ? [...source.keys] : [];
}

function keysAfter(type, key) {
    const keys = modelKeys();
    if (type === 'delete') return keys.filter(k => k !== key);
    if (type === 'search') {
        return currentTreeKey === 'splay' && keys.includes(key) ? keys.filter(k => k !== key).concat(key) : keys;
    }
    if (type === 'insert') {
        const withoutKey = keys.filter(k => k !== key);
        if (currentTreeKey === 'splay') return withoutKey.concat(key);
        return keys.includes(key) ? keys : keys.concat(key);
    }
    return keys;
}

function snapshotForKeys(keys, highlight = {}, message = 'Ready') {
    return createModelFromKeys(currentTreeKey, keys).snapshot(highlight, message);
}

function pathFromRoot(root, key) {
    const path = [];
    let node = root;
    while (node) {
        path.push(node.key);
        if (node.key === key) break;
        node = key < node.key ? node.left : node.right;
    }
    return path;
}

function searchPath(key) {
    const snap = model.snapshot();
    if (snap.kind === 'binary') return pathFromRoot(snap.root, key);
    return [key];
}

function minMaxPath(direction) {
    const snap = model.snapshot();
    if (snap.kind === 'multiway') return direction === 'min' ? [model.min()] : [model.max()];
    const path = [];
    let node = snap.root;
    while (node) {
        path.push(node.key);
        node = direction === 'min' ? node.left : node.right;
    }
    return path;
}

function queueSteps(nextSteps, commit = null) {
    pause();
    pendingCommit = commit;
    steps = nextSteps.length ? nextSteps : [model.snapshot({}, 'Ready')];
    stepIndex = 0;
    refs.steps.textContent = '0';
    renderSnapshot(steps[0]);
    renderLog(steps[0].message);
}

function setSteps(nextSteps) {
    queueSteps(nextSteps);
}

function renderSnapshot(snapshot) {
    refs.nodes.textContent = snapshot.count;
    refs.status.textContent = snapshot.message;
    if (snapshot.kind === 'multiway') renderMultiway(snapshot);
    else renderBinary(snapshot);
}

function renderBinary(snapshot) {
    const nodes = [];
    const edges = [];
    let order = 0;
    function walk(node, depth, parent = null) {
        if (!node) return;
        walk(node.left, depth + 1, node);
        const x = 70 + order * 72;
        const y = 52 + depth * 82;
        node._x = x;
        node._y = y;
        order++;
        nodes.push(node);
        if (parent) edges.push([parent, node]);
        walk(node.right, depth + 1, node);
    }
    walk(snapshot.root, 0);
    const width = Math.max(760, 140 + nodes.length * 72);
    const height = Math.max(360, 120 + Math.max(0, ...nodes.map(n => n._y)));
    refs.stage.innerHTML = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}">
        ${edges.map(([a, b]) => `<line class="vs-tree-edge" x1="${a._x}" y1="${a._y}" x2="${b._x}" y2="${b._y}"></line>`).join('')}
        ${nodes.map(node => {
            const state = nodeState(node.key, snapshot.highlight);
            return `<g class="vs-tree-node ${state}" transform="translate(${node._x} ${node._y})"><circle r="24"></circle><text>${node.key}</text></g>`;
        }).join('')}
    </svg>`;
}

function renderMultiway(snapshot) {
    const width = 880;
    const height = Math.max(360, 120 + snapshot.levels.length * 110);
    const parts = [];
    snapshot.levels.forEach((level, depth) => {
        const gap = width / (level.length + 1);
        level.forEach((node, i) => {
            node._x = gap * (i + 1);
            node._y = 70 + depth * 120;
        });
    });
    const all = snapshot.levels.flat();
    all.forEach(node => {
        if (!node.children) return;
        node.children.forEach(child => {
            parts.push(`<line class="vs-tree-edge" x1="${node._x}" y1="${node._y + 24}" x2="${child._x}" y2="${child._y - 24}"></line>`);
        });
    });
    for (const node of all) {
        const keyText = node.keys.join(' | ');
        const state = node.keys.some(k => snapshot.highlight.found && snapshot.highlight.found.includes(k)) ? 'vs-tree-node-found'
            : node.keys.some(k => snapshot.highlight.change && snapshot.highlight.change.includes(k)) ? 'vs-tree-node-change'
            : node.keys.some(k => snapshot.highlight.visit && snapshot.highlight.visit.includes(k)) ? 'vs-tree-node-visit'
            : '';
        const w = Math.max(66, 26 * node.keys.length + 22);
        parts.push(`<g class="vs-tree-node ${state}" transform="translate(${node._x} ${node._y})"><rect x="${-w / 2}" y="-24" width="${w}" height="48" rx="8"></rect><text>${keyText}</text></g>`);
    }
    refs.stage.innerHTML = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}">${parts.join('')}</svg>`;
}

function nodeState(key, highlight) {
    if (highlight.found && highlight.found.includes(key)) return 'vs-tree-node-found';
    if (highlight.change && highlight.change.includes(key)) return 'vs-tree-node-change';
    if (highlight.visit && highlight.visit.includes(key)) return 'vs-tree-node-visit';
    return '';
}

function renderLog(message) {
    const item = document.createElement('li');
    item.textContent = message;
    refs.log.prepend(item);
    while (refs.log.children.length > 8) refs.log.lastChild.remove();
}

function keyValue() {
    const n = parseInt(refs.value.value, 10);
    return Number.isFinite(n) ? n : 0;
}

function runOperation(type) {
    if (!model) return;
    refs.log.innerHTML = '';
    const key = keyValue();
    const keys = modelKeys();
    const nextKeys = keysAfter(type, key);
    const found = keys.includes(key);
    const path = searchPath(key);
    const opName = type[0].toUpperCase() + type.slice(1);
    const opSteps = [
        model.snapshot({}, `${opName} ${key} queued. Press Play to start.`),
        model.snapshot({ visit: path }, type === 'delete' ? `Search path for deleting ${key}` : `Search path for ${key}`)
    ];

    const advanced = ['avl', 'rb', 'splay', 'treap'].includes(currentTreeKey);
    if (advanced && type !== 'search' && found !== (type === 'insert')) {
        opSteps.push(snapshotForKeys(nextKeys, { change: [key] }, `${TREE_DATA[currentTreeKey].name} rebalance checkpoint`));
    }

    const finalHighlight = type === 'search' && found ? { found: [key] } : { change: found || type === 'insert' ? [key] : path.slice(-1) };
    const finalMessage = {
        insert: found ? `${key} is already present` : `Inserted ${key}`,
        delete: found ? `Deleted ${key}` : `${key} was not found`,
        search: found ? `Found ${key}` : `${key} is not in the tree`
    }[type];
    opSteps.push(snapshotForKeys(nextKeys, finalHighlight, finalMessage));

    queueSteps(opSteps, () => model[type](key));
}

function runQuery(label, value) {
    if (!model) return;
    refs.log.innerHTML = '';
    const probe = label === 'Min' ? minMaxPath('min')
        : label === 'Max' ? minMaxPath('max')
        : searchPath(keyValue());
    const msg = value === undefined ? `${label} does not exist` : `${label}: ${value}`;
    setSteps([
        model.snapshot({}, `${label} queued. Press Play to start.`),
        model.snapshot({ visit: probe.filter(v => v !== undefined) }, `Trace ${label.toLowerCase()} path`),
        model.snapshot(value === undefined ? { change: probe.slice(-1) } : { found: [value] }, msg)
    ]);
}

function runTraversal(type) {
    refs.log.innerHTML = '';
    setSteps([
        model.snapshot({}, `${type} traversal queued. Press Play to start.`),
        ...model.traversal(type)
    ]);
}

function delay() {
    const s = parseInt(refs.speed.value, 10);
    return Math.max(30, Math.round(650 / (s * s * 0.16 + 0.35)));
}

function syncPlay() {
    refs.play.textContent = playing ? 'Pause' : 'Play';
}

function advance() {
    if (stepIndex >= steps.length - 1) {
        pause();
        refs.status.textContent = 'Done';
        return;
    }
    stepIndex++;
    refs.steps.textContent = stepIndex;
    renderSnapshot(steps[stepIndex]);
    renderLog(steps[stepIndex].message);
    if (stepIndex === steps.length - 1 && pendingCommit) {
        pendingCommit();
        pendingCommit = null;
    }
}

function play() {
    if (playing) return;
    playing = true;
    syncPlay();
    timerId = setInterval(advance, delay());
}

function pause() {
    playing = false;
    clearInterval(timerId);
    timerId = null;
    syncPlay();
}

document.getElementById('tree-insert').addEventListener('click', () => runOperation('insert'));
document.getElementById('tree-search').addEventListener('click', () => runOperation('search'));
document.getElementById('tree-delete').addEventListener('click', () => runOperation('delete'));
document.getElementById('tree-min').addEventListener('click', () => runQuery('Min', model.min()));
document.getElementById('tree-max').addEventListener('click', () => runQuery('Max', model.max()));
document.getElementById('tree-prev').addEventListener('click', () => runQuery('Predecessor', model.predecessor(keyValue())));
document.getElementById('tree-next').addEventListener('click', () => runQuery('Successor', model.successor(keyValue())));
document.querySelectorAll('[data-tree-traversal]').forEach(btn => btn.addEventListener('click', () => runTraversal(btn.dataset.treeTraversal)));
refs.reset.addEventListener('click', () => {
    model = createModel(currentTreeKey);
    refs.log.innerHTML = '';
    setSteps([model.snapshot({}, 'Reset')]);
});
refs.size.addEventListener('input', () => {
    refs.sizeVal.textContent = refs.size.value;
    if (!currentTreeKey) return;
    model = createModel(currentTreeKey);
    refs.log.innerHTML = '';
    setSteps([model.snapshot({}, 'Ready')]);
});
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
refs.back.addEventListener('click', () => {
    pause();
    refs.vizSection.classList.add('vs-hidden');
    refs.listSection.classList.remove('vs-hidden');
});

renderGrid();
