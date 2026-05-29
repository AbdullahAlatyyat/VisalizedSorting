const test = require('node:test');
const assert = require('node:assert/strict');
const AlgorithmCore = require('../wwwroot/js/algorithm-core.js');

const sortingKeys = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'shell', 'counting', 'radix'];
const sample = [42, 7, 13, 7, 99, 1, 64, 18, 42, 5];

function inorder(node, out = []) {
    if (!node) return out;
    inorder(node.left, out);
    out.push(node.key);
    inorder(node.right, out);
    return out;
}

function avlBalanced(node) {
    if (!node) return { ok: true, height: 0 };
    const left = avlBalanced(node.left);
    const right = avlBalanced(node.right);
    return {
        ok: left.ok && right.ok && Math.abs(left.height - right.height) <= 1,
        height: Math.max(left.height, right.height) + 1
    };
}

function rbCheck(root) {
    assert.equal(root.color, false);
    function walk(node) {
        if (!node) return { ok: true, blackHeight: 1 };
        if (node.color === true) {
            assert.notEqual(node.left && node.left.color, true);
            assert.notEqual(node.right && node.right.color, true);
        }
        const left = walk(node.left);
        const right = walk(node.right);
        assert.equal(left.blackHeight, right.blackHeight);
        return { ok: left.ok && right.ok, blackHeight: left.blackHeight + (node.color === false ? 1 : 0) };
    }
    return walk(root).ok;
}

function treapCheck(node) {
    if (!node) return true;
    if (node.left) assert.ok(node.priority <= node.left.priority);
    if (node.right) assert.ok(node.priority <= node.right.priority);
    return treapCheck(node.left) && treapCheck(node.right);
}

function seeded(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

test('all sorting runners sort the sample', () => {
    const expected = [...sample].sort((a, b) => a - b);
    for (const key of sortingKeys) {
        const result = AlgorithmCore.sorting.run(key, sample);
        assert.deepEqual(result.final, expected, key);
        assert.ok(result.steps.length > 0, `${key} emits steps`);
    }
});

test('dynamic programming answers match displayed examples', () => {
    assert.equal(AlgorithmCore.dp.run('fib').answer, 21);
    assert.equal(AlgorithmCore.dp.run('coin').answer, 3);
    assert.equal(AlgorithmCore.dp.run('knapsack').answer, 9);
    assert.equal(AlgorithmCore.dp.run('lcs').answer, 4);
    assert.equal(AlgorithmCore.dp.run('edit').answer, 3);
    assert.equal(AlgorithmCore.dp.run('matrix').answer, 4500);
    assert.equal(AlgorithmCore.dp.run('lis').answer, 4);
});

test('greedy answers match card claims', () => {
    assert.equal(AlgorithmCore.greedy.run('activity').value, 4);
    assert.equal(AlgorithmCore.greedy.run('interval').value, 4);
    assert.equal(AlgorithmCore.greedy.run('fractional').value, 240);
    assert.equal(AlgorithmCore.greedy.run('jobs').value, 142);
    assert.equal(AlgorithmCore.greedy.run('setcover').value, 3);
    assert.equal(AlgorithmCore.greedy.run('huffman').value, 100);
});

test('graph algorithms produce valid canonical results', () => {
    assert.deepEqual(AlgorithmCore.graphs.run('bfs', 'A', 'G').path, ['A', 'C', 'E', 'G']);
    assert.equal(AlgorithmCore.graphs.run('dijkstra', 'A', 'G').distances.G, 14);
    assert.equal(AlgorithmCore.graphs.run('astar', 'A', 'G').distances.G, 14);
    assert.deepEqual(AlgorithmCore.graphs.run('topo').order, ['A', 'B', 'C', 'D', 'E', 'F']);
    assert.equal(AlgorithmCore.graphs.run('bellman', 'A', 'E').distances.E, -2);
    const cycleGraph = AlgorithmCore.graphs.graphFrom(AlgorithmCore.graphs.samples.negativeCycle);
    assert.equal(AlgorithmCore.graphs.run('bellman', 'A', 'C', cycleGraph).negativeCycle, true);
    assert.equal(AlgorithmCore.graphs.run('prim', 'A').total, 14);
    assert.equal(AlgorithmCore.graphs.run('kruskal').total, 14);
    assert.deepEqual(AlgorithmCore.graphs.run('scc').components, [['A', 'B', 'C', 'D'], ['E', 'F']]);
});

test('tree sessions preserve expected invariants', () => {
    for (const key of ['bst', 'avl', 'rb', 'splay', 'treap']) {
        const session = AlgorithmCore.trees.createSession(key);
        session.insert(42);
        session.delete(25);
        const snap = session.snapshot();
        assert.deepEqual(inorder(snap.root), AlgorithmCore.util.sorted(session.keys), key);
        if (key === 'avl') assert.equal(avlBalanced(snap.root).ok, true);
        if (key === 'rb') assert.equal(rbCheck(snap.root), true);
        if (key === 'treap') assert.equal(treapCheck(snap.root), true);
    }

    for (const key of ['twoThree', 'twoThreeFour', 'btree', 'bplus']) {
        const session = AlgorithmCore.trees.createSession(key);
        session.insert(120);
        const snap = session.snapshot();
        const maxKeys = key === 'twoThree' ? 2 : key === 'twoThreeFour' ? 3 : 5;
        for (const node of snap.levels.flat()) assert.ok(node.keys.length <= maxKeys, key);
        assert.deepEqual(AlgorithmCore.trees.invariants(key, snap).keys, AlgorithmCore.util.sorted(session.keys));
    }
});

test('textbook topic runners exist for every card key', () => {
    const keys = {
        searching: ['linear', 'binary', 'interpolation', 'chaining', 'open', 'linearprobe', 'quadratic', 'doublehash', 'bloom'],
        heaps: ['binaryheap', 'insert', 'extract', 'decrease', 'heapify', 'binomial', 'fibonacci'],
        strings: ['naive', 'kmp', 'rabin', 'boyer', 'trie', 'suffixtrie', 'suffixarray', 'aho'],
        divide: ['binary', 'mergetree', 'quickselect', 'closestpair', 'karatsuba', 'strassen'],
        geometry: ['graham', 'jarvis', 'segments', 'sweep', 'closest', 'voronoi']
    };
    for (const [topic, topicKeys] of Object.entries(keys)) {
        for (const key of topicKeys) {
            const result = AlgorithmCore.topics.run(topic, key);
            assert.ok(result.steps.length >= 1, `${topic}/${key}`);
        }
    }
});

test('optional visualizer sizing is deterministic and backward compatible', () => {
    const fib = AlgorithmCore.dp.run('fib', { size: 12 });
    assert.equal(fib.steps[0].state.memo.length, 13);

    const lis = AlgorithmCore.dp.run('lis', { size: 12 });
    assert.equal(lis.input.length, 12);

    const activity = AlgorithmCore.greedy.run('activity', { size: 6 });
    assert.equal(activity.steps[0].items.length, 6);

    const graph = AlgorithmCore.graphs.graphFrom(AlgorithmCore.graphs.samples.weighted, { size: 12 });
    assert.equal(graph.nodes.length, 12);
    assert.ok(AlgorithmCore.graphs.run('dijkstra', 'A', 'L', graph).distances.L < Infinity);

    const tree = AlgorithmCore.trees.createSession('bst', { size: 13 });
    assert.equal(tree.snapshot().count, 13);

    const topic = AlgorithmCore.topics.run('searching', 'linear', { size: 12 });
    assert.equal(topic.steps[0].items.length, 12);
});

test('randomized visualizer data stays valid and differs from canonical samples', () => {
    const coin = AlgorithmCore.dp.run('coin', { size: 8, randomize: true, rng: seeded(1) });
    assert.notDeepEqual(coin.coins, [1, 2, 5]);
    assert.equal(coin.coins[0], 1);
    assert.equal(Number.isFinite(coin.answer), true);

    const lis = AlgorithmCore.dp.run('lis', { size: 10, randomize: true, rng: seeded(2) });
    assert.equal(lis.input.length, 10);
    assert.notDeepEqual(lis.input, [10, 9, 2, 5, 3, 7, 101, 18, 22, 6]);

    const huffman = AlgorithmCore.greedy.run('huffman', { size: 6, randomize: true, rng: seeded(3) });
    assert.equal(huffman.value, huffman.merges.at(-1)[2]);
    assert.notEqual(huffman.value, 100);

    const tree = AlgorithmCore.trees.createSession('avl', { size: 12, randomize: true, rng: seeded(4) });
    const treeSnap = tree.snapshot();
    assert.equal(treeSnap.count, 12);
    assert.deepEqual(inorder(treeSnap.root), AlgorithmCore.util.sorted(tree.keys));
    assert.equal(avlBalanced(treeSnap.root).ok, true);
    assert.notDeepEqual(tree.keys, [50, 25, 75, 12, 37, 62, 88, 31, 43, 57, 70, 77]);

    const graph = AlgorithmCore.graphs.graphFrom(AlgorithmCore.graphs.samples.weighted, { size: 9, randomize: true, rng: seeded(5) });
    assert.equal(graph.nodes.length, 9);
    assert.ok(graph.edges.every(edge => edge.weight > 0));
    assert.ok(AlgorithmCore.graphs.run('dijkstra', 'A', 'I', graph).distances.I < Infinity);

    const negativeGraph = AlgorithmCore.graphs.graphFrom(AlgorithmCore.graphs.samples.negative, { size: 7, randomize: true, rng: seeded(7) });
    assert.equal(AlgorithmCore.graphs.run('bellman', 'A', 'G', negativeGraph).negativeCycle, false);

    const topic = AlgorithmCore.topics.run('searching', 'binary', { size: 9, randomize: true, rng: seeded(6) });
    const values = topic.steps[0].items.map(item => Number(item.label.split(':')[1]));
    assert.deepEqual(values, AlgorithmCore.util.sorted(values));
    assert.ok(topic.answer >= 0 && topic.answer < values.length);
});
