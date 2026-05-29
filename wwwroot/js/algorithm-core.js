(function (global) {
    'use strict';

    const clone = value => JSON.parse(JSON.stringify(value));
    const range = n => Array.from({ length: n }, (_, i) => i);
    const sorted = arr => [...arr].sort((a, b) => a - b);
    const edgeKey = (edge, directed = false) => directed ? `${edge.from}->${edge.to}` : [edge.from, edge.to].sort().join('-');

    function sortingStep(message, array, active = [], sortedIndices = [], metrics = {}) {
        return { message, state: { array: [...array], active: [...active], sorted: [...sortedIndices] }, metrics: { ...metrics } };
    }

    function runSort(key, input) {
        const arr = [...input];
        const steps = [sortingStep('Start', arr)];
        const metrics = { comparisons: 0, writes: 0, swaps: 0 };
        const markAll = () => steps.push(sortingStep('Sorted', arr, [], range(arr.length), metrics));
        const compare = (i, j, message = `Compare ${i} and ${j}`) => {
            metrics.comparisons++;
            steps.push(sortingStep(message, arr, [i, j], [], metrics));
        };
        const swap = (i, j) => {
            if (i === j) return;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            metrics.swaps++;
            metrics.writes += 2;
            steps.push(sortingStep(`Swap ${i} and ${j}`, arr, [i, j], [], metrics));
        };
        const write = (i, value) => {
            arr[i] = value;
            metrics.writes++;
            steps.push(sortingStep(`Write ${value} at ${i}`, arr, [i], [], metrics));
        };

        if (key === 'bubble') {
            for (let end = arr.length - 1; end > 0; end--) {
                let changed = false;
                for (let i = 0; i < end; i++) {
                    compare(i, i + 1);
                    if (arr[i] > arr[i + 1]) {
                        swap(i, i + 1);
                        changed = true;
                    }
                }
                steps.push(sortingStep(`Index ${end} fixed`, arr, [], range(arr.length).filter(i => i >= end), metrics));
                if (!changed) break;
            }
            markAll();
        } else if (key === 'selection') {
            for (let i = 0; i < arr.length - 1; i++) {
                let min = i;
                for (let j = i + 1; j < arr.length; j++) {
                    compare(min, j);
                    if (arr[j] < arr[min]) min = j;
                }
                swap(i, min);
                steps.push(sortingStep(`Index ${i} fixed`, arr, [], range(i + 1), metrics));
            }
            markAll();
        } else if (key === 'insertion') {
            for (let i = 1; i < arr.length; i++) {
                const value = arr[i];
                let j = i - 1;
                while (j >= 0) {
                    compare(j, j + 1);
                    if (arr[j] <= value) break;
                    arr[j + 1] = arr[j];
                    metrics.writes++;
                    steps.push(sortingStep(`Shift ${arr[j]} right`, arr, [j, j + 1], range(i), metrics));
                    j--;
                }
                arr[j + 1] = value;
                metrics.writes++;
                steps.push(sortingStep(`Insert ${value}`, arr, [j + 1], range(i + 1), metrics));
            }
            markAll();
        } else if (key === 'merge') {
            const aux = [...arr];
            for (let width = 1; width < arr.length; width *= 2) {
                for (let lo = 0; lo < arr.length; lo += width * 2) {
                    const mid = Math.min(lo + width, arr.length);
                    const hi = Math.min(lo + width * 2, arr.length);
                    let i = lo, j = mid, k = lo;
                    while (i < mid && j < hi) {
                        compare(i, j);
                        aux[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
                    }
                    while (i < mid) aux[k++] = arr[i++];
                    while (j < hi) aux[k++] = arr[j++];
                    for (let x = lo; x < hi; x++) if (arr[x] !== aux[x]) write(x, aux[x]);
                }
            }
            markAll();
        } else if (key === 'quick') {
            const qs = (lo, hi) => {
                if (lo >= hi) return;
                const pivot = arr[hi];
                let p = lo;
                for (let j = lo; j < hi; j++) {
                    compare(j, hi, `Compare ${arr[j]} with pivot ${pivot}`);
                    if (arr[j] <= pivot) swap(p++, j);
                }
                swap(p, hi);
                steps.push(sortingStep(`Pivot fixed at ${p}`, arr, [], [p], metrics));
                qs(lo, p - 1);
                qs(p + 1, hi);
            };
            qs(0, arr.length - 1);
            markAll();
        } else if (key === 'heap') {
            const sift = (size, root) => {
                while (true) {
                    let largest = root;
                    const left = root * 2 + 1;
                    const right = root * 2 + 2;
                    if (left < size) {
                        compare(left, largest);
                        if (arr[left] > arr[largest]) largest = left;
                    }
                    if (right < size) {
                        compare(right, largest);
                        if (arr[right] > arr[largest]) largest = right;
                    }
                    if (largest === root) return;
                    swap(root, largest);
                    root = largest;
                }
            };
            for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) sift(arr.length, i);
            for (let end = arr.length - 1; end > 0; end--) {
                swap(0, end);
                steps.push(sortingStep(`Extract max to ${end}`, arr, [], range(arr.length).filter(i => i >= end), metrics));
                sift(end, 0);
            }
            markAll();
        } else if (key === 'shell') {
            let gap = 1;
            while (gap < Math.floor(arr.length / 3)) gap = gap * 3 + 1;
            while (gap >= 1) {
                for (let i = gap; i < arr.length; i++) {
                    const value = arr[i];
                    let j = i;
                    while (j >= gap) {
                        compare(j - gap, j);
                        if (arr[j - gap] <= value) break;
                        arr[j] = arr[j - gap];
                        metrics.writes++;
                        steps.push(sortingStep(`Gap ${gap}: shift`, arr, [j - gap, j], [], metrics));
                        j -= gap;
                    }
                    arr[j] = value;
                    metrics.writes++;
                    steps.push(sortingStep(`Gap ${gap}: place ${value}`, arr, [j], [], metrics));
                }
                gap = Math.floor(gap / 3);
            }
            markAll();
        } else if (key === 'counting') {
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            const count = Array(max - min + 1).fill(0);
            arr.forEach(v => count[v - min]++);
            for (let i = 1; i < count.length; i++) count[i] += count[i - 1];
            const output = Array(arr.length);
            for (let i = arr.length - 1; i >= 0; i--) {
                const pos = --count[arr[i] - min];
                output[pos] = arr[i];
                metrics.writes++;
                steps.push(sortingStep(`Place ${arr[i]} at ${pos}`, arr, [i], [], metrics));
            }
            output.forEach((v, i) => write(i, v));
            markAll();
        } else if (key === 'radix') {
            const max = Math.max(...arr);
            for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
                const count = Array(10).fill(0);
                arr.forEach(v => count[Math.floor(v / exp) % 10]++);
                for (let i = 1; i < 10; i++) count[i] += count[i - 1];
                const output = Array(arr.length);
                for (let i = arr.length - 1; i >= 0; i--) {
                    const digit = Math.floor(arr[i] / exp) % 10;
                    output[--count[digit]] = arr[i];
                    metrics.writes++;
                    steps.push(sortingStep(`Digit ${exp}: bucket ${digit}`, arr, [i], [], metrics));
                }
                output.forEach((v, i) => write(i, v));
            }
            markAll();
        } else {
            throw new Error(`Unknown sorting algorithm: ${key}`);
        }

        return { key, steps, final: [...arr], metrics: { ...metrics } };
    }

    const dp = {
        fib() {
            const n = 8;
            const memo = Array(n + 1).fill(null);
            const tab = Array(n + 1).fill(null);
            const steps = [];
            function fibMemo(k) {
                if (memo[k] !== null) {
                    steps.push({ message: `Reuse memo F(${k}) = ${memo[k]}`, state: { memo: [...memo], tab: [...tab], active: [k] } });
                    return memo[k];
                }
                if (k <= 1) memo[k] = k;
                else memo[k] = fibMemo(k - 1) + fibMemo(k - 2);
                steps.push({ message: `Memoize F(${k}) = ${memo[k]}`, state: { memo: [...memo], tab: [...tab], active: [k] } });
                return memo[k];
            }
            fibMemo(n);
            tab[0] = 0; tab[1] = 1;
            steps.push({ message: 'Tabulation base cases F(0), F(1)', state: { memo: [...memo], tab: [...tab], active: [0, 1] } });
            for (let i = 2; i <= n; i++) {
                tab[i] = tab[i - 1] + tab[i - 2];
                steps.push({ message: `Tabulate F(${i}) = ${tab[i]}`, state: { memo: [...memo], tab: [...tab], active: [i] } });
            }
            return { answer: tab[n], steps };
        },
        coin() {
            const coins = [1, 2, 5], amount = 11;
            const table = Array(amount + 1).fill(Infinity);
            table[0] = 0;
            for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a) table[a] = Math.min(table[a], table[a - c] + 1);
            return { answer: table[amount], table, coins };
        },
        knapsack() {
            const items = [{ w: 1, v: 1 }, { w: 3, v: 4 }, { w: 4, v: 5 }, { w: 5, v: 7 }];
            const cap = 7;
            const table = Array.from({ length: items.length + 1 }, () => Array(cap + 1).fill(0));
            for (let i = 1; i <= items.length; i++) for (let w = 0; w <= cap; w++) {
                const item = items[i - 1];
                table[i][w] = Math.max(table[i - 1][w], item.w <= w ? item.v + table[i - 1][w - item.w] : -Infinity);
            }
            return { answer: table[items.length][cap], table, items, cap };
        },
        lcs() {
            const x = 'ABCBDAB', y = 'BDCABA';
            const table = Array.from({ length: x.length + 1 }, () => Array(y.length + 1).fill(0));
            for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) table[i][j] = x[i - 1] === y[j - 1] ? table[i - 1][j - 1] + 1 : Math.max(table[i - 1][j], table[i][j - 1]);
            return { answer: table[x.length][y.length], table, x, y };
        },
        edit() {
            const a = 'kitten', b = 'sitting';
            const table = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
            for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) table[i][j] = Math.min(table[i - 1][j] + 1, table[i][j - 1] + 1, table[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
            return { answer: table[a.length][b.length], table, a, b };
        },
        matrix() {
            const p = [10, 30, 5, 60], n = p.length - 1;
            const table = Array.from({ length: n }, () => Array(n).fill(0));
            for (let len = 2; len <= n; len++) for (let i = 0; i <= n - len; i++) {
                const j = i + len - 1;
                table[i][j] = Infinity;
                for (let k = i; k < j; k++) table[i][j] = Math.min(table[i][j], table[i][k] + table[k + 1][j] + p[i] * p[k + 1] * p[j + 1]);
            }
            return { answer: table[0][n - 1], table, dimensions: p };
        },
        lis() {
            const input = [10, 9, 2, 5, 3, 7, 101, 18];
            const table = Array(input.length).fill(1);
            for (let i = 0; i < input.length; i++) for (let j = 0; j < i; j++) if (input[j] < input[i]) table[i] = Math.max(table[i], table[j] + 1);
            return { answer: Math.max(...table), table, input };
        }
    };

    function runDp(key) {
        if (!dp[key]) throw new Error(`Unknown DP algorithm: ${key}`);
        return dp[key]();
    }

    function item(id, label, meta, state = '') { return { id, label, meta, state }; }
    function snapshot(message, items, caption = '', metrics = {}) { return { message, items: items.map(x => ({ ...x })), caption, metrics: { ...metrics } }; }

    function runGreedy(key) {
        if (key === 'activity') {
            const acts = [
                { id: 'A1', s: 1, f: 4 }, { id: 'A2', s: 3, f: 5 }, { id: 'A3', s: 0, f: 6 },
                { id: 'A4', s: 5, f: 7 }, { id: 'A5', s: 3, f: 9 }, { id: 'A6', s: 5, f: 9 },
                { id: 'A7', s: 6, f: 10 }, { id: 'A8', s: 8, f: 11 }, { id: 'A9', s: 8, f: 12 }, { id: 'A10', s: 12, f: 14 }
            ].sort((a, b) => a.f - b.f);
            const states = acts.map(a => item(a.id, a.id, `${a.s} -> ${a.f}`));
            const chosen = [];
            const steps = [snapshot('Sort by finish time', states)];
            let last = -Infinity;
            for (const a of acts) {
                const cur = states.find(x => x.id === a.id);
                cur.state = 'consider';
                steps.push(snapshot(`Consider ${a.id}`, states));
                if (a.s >= last) {
                    cur.state = 'chosen';
                    chosen.push(a.id);
                    last = a.f;
                } else cur.state = 'reject';
                steps.push(snapshot(cur.state === 'chosen' ? `Choose ${a.id}` : `Reject ${a.id}`, states));
            }
            return { steps, answer: chosen, value: chosen.length };
        }
        if (key === 'interval') {
            const intervals = [{ id: 'I1', s: 0, f: 3 }, { id: 'I2', s: 1, f: 2 }, { id: 'I3', s: 3, f: 4 }, { id: 'I4', s: 2, f: 5 }, { id: 'I5', s: 5, f: 7 }, { id: 'I6', s: 6, f: 9 }, { id: 'I7', s: 8, f: 10 }].sort((a, b) => a.f - b.f);
            const chosen = [];
            let end = -Infinity;
            intervals.forEach(x => { if (x.s >= end) { chosen.push(x.id); end = x.f; } });
            return { answer: chosen, value: chosen.length };
        }
        if (key === 'fractional') {
            const items = [{ id: 'A', w: 10, v: 60 }, { id: 'B', w: 20, v: 100 }, { id: 'C', w: 30, v: 120 }, { id: 'D', w: 15, v: 45 }].sort((a, b) => b.v / b.w - a.v / a.w);
            let remaining = 50, value = 0;
            const taken = [];
            for (const x of items) {
                if (remaining <= 0) break;
                const amount = Math.min(1, remaining / x.w);
                value += x.v * amount;
                remaining -= x.w * amount;
                taken.push({ id: x.id, fraction: amount });
            }
            return { answer: taken, value };
        }
        if (key === 'jobs') {
            const jobs = [{ id: 'J1', d: 2, p: 100 }, { id: 'J2', d: 1, p: 19 }, { id: 'J3', d: 2, p: 27 }, { id: 'J4', d: 1, p: 25 }, { id: 'J5', d: 3, p: 15 }].sort((a, b) => b.p - a.p);
            const slots = Array(Math.max(...jobs.map(j => j.d))).fill(null);
            for (const job of jobs) for (let s = Math.min(job.d, slots.length) - 1; s >= 0; s--) if (!slots[s]) { slots[s] = job; break; }
            return { answer: slots.map(j => j && j.id).filter(Boolean), value: slots.reduce((sum, j) => sum + (j ? j.p : 0), 0) };
        }
        if (key === 'setcover') {
            const universe = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
            const sets = [{ id: 'S1', covers: ['A', 'B', 'C'] }, { id: 'S2', covers: ['A', 'D'] }, { id: 'S3', covers: ['B', 'E', 'F'] }, { id: 'S4', covers: ['C', 'G'] }, { id: 'S5', covers: ['D', 'E', 'G'] }];
            const chosen = [], uncovered = new Set(universe);
            while (uncovered.size) {
                const best = sets.filter(s => !chosen.includes(s.id)).sort((a, b) => b.covers.filter(x => uncovered.has(x)).length - a.covers.filter(x => uncovered.has(x)).length)[0];
                chosen.push(best.id);
                best.covers.forEach(x => uncovered.delete(x));
            }
            return { answer: chosen, value: chosen.length };
        }
        if (key === 'huffman') {
            let nodes = [{ id: 'A', freq: 45 }, { id: 'B', freq: 13 }, { id: 'C', freq: 12 }, { id: 'D', freq: 16 }, { id: 'E', freq: 9 }, { id: 'F', freq: 5 }];
            const merges = [];
            let count = 1;
            while (nodes.length > 1) {
                nodes = nodes.sort((a, b) => a.freq - b.freq);
                const a = nodes.shift(), b = nodes.shift();
                const node = { id: `N${count++}`, freq: a.freq + b.freq, left: a, right: b };
                merges.push([a.id, b.id, node.freq]);
                nodes.push(node);
            }
            return { answer: nodes[0], merges, value: nodes[0].freq };
        }
        throw new Error(`Unknown greedy algorithm: ${key}`);
    }

    const graphSamples = {
        unweighted: { directed: false, nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], edges: [['A','B'], ['A','C'], ['A','H'], ['B','D'], ['C','D'], ['C','E'], ['D','F'], ['E','F'], ['E','G'], ['H','C']] },
        weighted: { directed: false, nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], edges: [['A','B',4], ['A','C',2], ['B','C',1], ['B','D',5], ['C','D',8], ['C','E',10], ['D','E',2], ['D','F',6], ['E','F',3], ['E','G',5], ['F','G',1]] },
        dag: { directed: true, nodes: ['A', 'B', 'C', 'D', 'E', 'F'], edges: [['A','B'], ['A','C'], ['B','D'], ['C','D'], ['C','E'], ['D','F'], ['E','F']] },
        negative: { directed: true, nodes: ['A', 'B', 'C', 'D', 'E'], edges: [['A','B',6], ['A','C',7], ['B','C',8], ['B','D',5], ['B','E',-4], ['C','D',-3], ['C','E',9], ['D','B',-2], ['E','D',7]] },
        negativeCycle: { directed: true, nodes: ['A', 'B', 'C'], edges: [['A','B',1], ['B','C',-2], ['C','A',-2]] },
        scc: { directed: true, nodes: ['A', 'B', 'C', 'D', 'E', 'F'], edges: [['A','B'], ['B','C'], ['C','A'], ['B','D'], ['D','C'], ['C','E'], ['E','F'], ['F','E']] }
    };
    function graphFrom(sample) { return { directed: sample.directed, nodes: sample.nodes.map(id => ({ id })), edges: sample.edges.map(e => ({ from: e[0], to: e[1], weight: e[2] })) }; }
    function graphNeighbors(graph, id) {
        const out = [];
        for (const e of graph.edges) {
            if (e.from === id) out.push({ id: e.to, edge: e });
            else if (!graph.directed && e.to === id) out.push({ id: e.from, edge: e });
        }
        return out;
    }
    function dsu(ids) {
        const parent = Object.fromEntries(ids.map(id => [id, id]));
        const rank = Object.fromEntries(ids.map(id => [id, 0]));
        const find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
        const union = (a, b) => {
            let ra = find(a), rb = find(b);
            if (ra === rb) return false;
            if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
            parent[rb] = ra;
            if (rank[ra] === rank[rb]) rank[ra]++;
            return true;
        };
        return { parent, rank, find, union };
    }
    function reconstruct(prev, source, target, graph) {
        const path = [];
        const edgePath = [];
        let cur = target;
        while (cur && cur !== source) {
            path.push(cur);
            const p = prev[cur];
            if (!p) break;
            edgePath.push(edgeKey({ from: p, to: cur }, graph.directed));
            cur = p;
        }
        if (cur === source) path.push(source);
        return { path: path.reverse(), edgePath: edgePath.reverse() };
    }
    function runGraph(key, source = 'A', target = 'G', customGraph = null) {
        const sampleName = key === 'topo' ? 'dag' : key === 'bellman' ? 'negative' : key === 'scc' ? 'scc' : key === 'bfs' || key === 'dfs' ? 'unweighted' : 'weighted';
        const graph = customGraph || graphFrom(graphSamples[sampleName]);
        const ids = graph.nodes.map(n => n.id);
        const weight = e => e.weight ?? 1;
        if (key === 'bfs') {
            const seen = new Set([source]), queue = [source], prev = {};
            while (queue.length) {
                const u = queue.shift();
                if (u === target) break;
                for (const nb of graphNeighbors(graph, u)) if (!seen.has(nb.id)) { seen.add(nb.id); prev[nb.id] = u; queue.push(nb.id); }
            }
            return { visited: [...seen], ...reconstruct(prev, source, target, graph) };
        }
        if (key === 'dfs') {
            const seen = new Set(), order = [];
            const dfs = u => { seen.add(u); order.push(u); graphNeighbors(graph, u).forEach(nb => { if (!seen.has(nb.id)) dfs(nb.id); }); };
            dfs(source);
            return { visited: order };
        }
        if (key === 'topo') {
            const indeg = Object.fromEntries(ids.map(id => [id, 0]));
            graph.edges.forEach(e => indeg[e.to]++);
            const queue = ids.filter(id => indeg[id] === 0), order = [];
            while (queue.length) {
                const u = queue.shift();
                order.push(u);
                graphNeighbors(graph, u).forEach(nb => { indeg[nb.id]--; if (indeg[nb.id] === 0) queue.push(nb.id); });
            }
            return { order, hasCycle: order.length !== ids.length };
        }
        if (key === 'dijkstra' || key === 'astar') {
            const dist = Object.fromEntries(ids.map(id => [id, Infinity]));
            const prev = {};
            const done = new Set();
            dist[source] = 0;
            while (done.size < ids.length) {
                const u = ids.filter(id => !done.has(id)).sort((a, b) => dist[a] - dist[b])[0];
                if (!u || dist[u] === Infinity) break;
                done.add(u);
                if (u === target) break;
                for (const nb of graphNeighbors(graph, u)) if (!done.has(nb.id) && dist[u] + weight(nb.edge) < dist[nb.id]) { dist[nb.id] = dist[u] + weight(nb.edge); prev[nb.id] = u; }
            }
            return { distances: dist, visited: [...done], ...reconstruct(prev, source, target, graph) };
        }
        if (key === 'bellman') {
            const dist = Object.fromEntries(ids.map(id => [id, Infinity]));
            const prev = {};
            dist[source] = 0;
            for (let i = 1; i < ids.length; i++) for (const e of graph.edges) if (dist[e.from] !== Infinity && dist[e.from] + weight(e) < dist[e.to]) { dist[e.to] = dist[e.from] + weight(e); prev[e.to] = e.from; }
            const negativeCycle = graph.edges.some(e => dist[e.from] !== Infinity && dist[e.from] + weight(e) < dist[e.to]);
            return { distances: dist, negativeCycle, ...reconstruct(prev, source, target, graph) };
        }
        if (key === 'floyd') {
            const dist = Object.fromEntries(ids.map(i => [i, Object.fromEntries(ids.map(j => [j, i === j ? 0 : Infinity]))]));
            graph.edges.forEach(e => { dist[e.from][e.to] = weight(e); if (!graph.directed) dist[e.to][e.from] = weight(e); });
            for (const k of ids) for (const i of ids) for (const j of ids) if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
            return { distances: dist };
        }
        if (key === 'prim') {
            const tree = new Set([source]), edges = [], total = 0;
            let sum = total;
            while (tree.size < ids.length) {
                const best = graph.edges.filter(e => tree.has(e.from) !== tree.has(e.to)).sort((a, b) => weight(a) - weight(b))[0];
                if (!best) break;
                tree.add(tree.has(best.from) ? best.to : best.from);
                edges.push(edgeKey(best));
                sum += weight(best);
            }
            return { edges, total: sum, visited: [...tree] };
        }
        if (key === 'kruskal' || key === 'unionFind') {
            const sets = dsu(ids), edges = [], rejected = [];
            for (const e of (key === 'kruskal' ? [...graph.edges].sort((a, b) => weight(a) - weight(b)) : graph.edges)) {
                if (sets.union(e.from, e.to)) edges.push(edgeKey(e));
                else rejected.push(edgeKey(e));
            }
            return { edges, rejected, parent: sets.parent, total: graph.edges.filter(e => edges.includes(edgeKey(e))).reduce((s, e) => s + weight(e), 0) };
        }
        if (key === 'scc') {
            const seen = new Set(), order = [];
            const dfs1 = u => { seen.add(u); graphNeighbors(graph, u).forEach(nb => { if (!seen.has(nb.id)) dfs1(nb.id); }); order.push(u); };
            ids.forEach(id => { if (!seen.has(id)) dfs1(id); });
            const rev = { directed: true, nodes: graph.nodes, edges: graph.edges.map(e => ({ from: e.to, to: e.from, weight: e.weight })) };
            seen.clear();
            const components = [];
            while (order.length) {
                const start = order.pop();
                if (seen.has(start)) continue;
                const group = [];
                const dfs2 = u => { seen.add(u); group.push(u); graphNeighbors(rev, u).forEach(nb => { if (!seen.has(nb.id)) dfs2(nb.id); }); };
                dfs2(start);
                components.push(group.sort());
            }
            return { components };
        }
        throw new Error(`Unknown graph algorithm: ${key}`);
    }

    function hashPriority(key) { return ((key * 2654435761) >>> 0) / 4294967296; }
    function insertBst(node, key) {
        if (!node) return { key, left: null, right: null };
        if (key < node.key) node.left = insertBst(node.left, key);
        else if (key > node.key) node.right = insertBst(node.right, key);
        return node;
    }
    function height(node) { return node ? node.height || 1 : 0; }
    function rotateRight(y) { const x = y.left; y.left = x.right; x.right = y; y.height = Math.max(height(y.left), height(y.right)) + 1; x.height = Math.max(height(x.left), height(x.right)) + 1; return x; }
    function rotateLeft(x) { const y = x.right; x.right = y.left; y.left = x; x.height = Math.max(height(x.left), height(x.right)) + 1; y.height = Math.max(height(y.left), height(y.right)) + 1; return y; }
    function insertAvl(node, key) {
        if (!node) return { key, left: null, right: null, height: 1 };
        if (key < node.key) node.left = insertAvl(node.left, key);
        else if (key > node.key) node.right = insertAvl(node.right, key);
        else return node;
        node.height = Math.max(height(node.left), height(node.right)) + 1;
        const bal = height(node.left) - height(node.right);
        if (bal > 1 && key < node.left.key) return rotateRight(node);
        if (bal < -1 && key > node.right.key) return rotateLeft(node);
        if (bal > 1 && key > node.left.key) { node.left = rotateLeft(node.left); return rotateRight(node); }
        if (bal < -1 && key < node.right.key) { node.right = rotateRight(node.right); return rotateLeft(node); }
        return node;
    }
    const RED = true, BLACK = false;
    function isRed(n) { return !!(n && n.color === RED); }
    function rbRotateLeft(h) { const x = h.right; h.right = x.left; x.left = h; x.color = h.color; h.color = RED; return x; }
    function rbRotateRight(h) { const x = h.left; h.left = x.right; x.right = h; x.color = h.color; h.color = RED; return x; }
    function flipColors(h) { h.color = RED; h.left.color = BLACK; h.right.color = BLACK; }
    function insertRb(h, key) {
        if (!h) return { key, color: RED, left: null, right: null };
        if (key < h.key) h.left = insertRb(h.left, key);
        else if (key > h.key) h.right = insertRb(h.right, key);
        if (isRed(h.right) && !isRed(h.left)) h = rbRotateLeft(h);
        if (isRed(h.left) && isRed(h.left.left)) h = rbRotateRight(h);
        if (isRed(h.left) && isRed(h.right)) flipColors(h);
        return h;
    }
    function insertTreap(node, key) {
        if (!node) return { key, priority: hashPriority(key), left: null, right: null };
        if (key < node.key) { node.left = insertTreap(node.left, key); if (node.left.priority < node.priority) node = rotateRight(node); }
        else if (key > node.key) { node.right = insertTreap(node.right, key); if (node.right.priority < node.priority) node = rotateLeft(node); }
        return node;
    }
    function splay(root, key) {
        if (!root || root.key === key) return root;
        if (key < root.key) {
            if (!root.left) return root;
            if (key < root.left.key) { root.left.left = splay(root.left.left, key); root = rotateRight(root); }
            else if (key > root.left.key) { root.left.right = splay(root.left.right, key); if (root.left.right) root.left = rotateLeft(root.left); }
            return root.left ? rotateRight(root) : root;
        }
        if (!root.right) return root;
        if (key > root.right.key) { root.right.right = splay(root.right.right, key); root = rotateLeft(root); }
        else if (key < root.right.key) { root.right.left = splay(root.right.left, key); if (root.right.left) root.right = rotateRight(root.right); }
        return root.right ? rotateLeft(root) : root;
    }
    function removeKey(keys, key) { return keys.filter(k => k !== key); }
    function buildBinary(kind, keys) {
        let root = null;
        for (const key of keys) {
            if (kind === 'avl') root = insertAvl(root, key);
            else if (kind === 'rb') { root = insertRb(root, key); root.color = BLACK; }
            else if (kind === 'treap') root = insertTreap(root, key);
            else root = insertBst(root, key);
        }
        if (kind === 'splay' && keys.length) root = splay(root, keys[keys.length - 1]);
        return root;
    }
    function buildMultiway(kind, keys) {
        const maxKeys = kind === 'twoThree' ? 2 : kind === 'twoThreeFour' ? 3 : 5;
        const maxChildren = maxKeys + 1;
        const leaves = [];
        const ordered = sorted(keys);
        for (let i = 0; i < ordered.length; i += maxKeys) leaves.push({ keys: ordered.slice(i, i + maxKeys), children: [] });
        if (leaves.length <= 1) return leaves.length ? [leaves] : [[]];
        let level = leaves;
        const levels = [leaves];
        while (level.length > 1) {
            const parents = [];
            for (let i = 0; i < level.length; i += maxChildren) {
                const children = level.slice(i, i + maxChildren);
                parents.push({ keys: children.slice(1).map(child => child.keys[0]), children });
            }
            levels.unshift(parents);
            level = parents;
        }
        return levels;
    }
    function createTreeSession(kind, initialKeys = [50, 25, 75, 12, 37, 62, 88, 31, 43, 57, 70]) {
        const multi = ['twoThree', 'twoThreeFour', 'btree', 'bplus'].includes(kind);
        const keys = multi ? [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110] : [...initialKeys];
        const session = {
            keys,
            snapshot(highlight = {}, message = 'Ready') {
                return multi
                    ? { kind: 'multiway', levels: buildMultiway(kind, session.keys), count: session.keys.length, highlight, message }
                    : { kind: 'binary', root: buildBinary(kind, session.keys), count: session.keys.length, highlight, message };
            },
            insert(key) { if (!session.keys.includes(key)) session.keys.push(key); if (kind === 'splay') session.keys = removeKey(session.keys, key).concat(key); return [session.snapshot({ change: [key] }, `Inserted ${key}`)]; },
            delete(key) { session.keys = removeKey(session.keys, key); return [session.snapshot({ change: [key] }, `Deleted ${key}`)]; },
            search(key) { if (kind === 'splay' && session.keys.includes(key)) session.keys = removeKey(session.keys, key).concat(key); return [session.snapshot(session.keys.includes(key) ? { found: [key] } : { visit: [key] }, session.keys.includes(key) ? `Found ${key}` : `${key} is not in the tree`)]; },
            ordered() { return sorted(session.keys); },
            min() { return session.ordered()[0]; },
            max() { return session.ordered()[session.keys.length - 1]; },
            predecessor(key) { return session.ordered().reverse().find(k => k < key); },
            successor(key) { return session.ordered().find(k => k > key); },
            traversal(type) {
                if (!multi) {
                    const root = buildBinary(kind, session.keys);
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
                    return out.map((key, i) => session.snapshot({ found: out.slice(0, i + 1), visit: [key] }, `${type}: ${out.slice(0, i + 1).join(', ')}`));
                }
                const ordered = session.ordered();
                return ordered.map((key, i) => session.snapshot({ found: ordered.slice(0, i + 1), visit: [key] }, `${type}: ${ordered.slice(0, i + 1).join(', ')}`));
            }
        };
        return session;
    }
    function treeInvariants(kind, snapshot) {
        const vals = [];
        const walk = n => { if (!n) return; walk(n.left); vals.push(n.key); walk(n.right); };
        if (snapshot.kind === 'binary') walk(snapshot.root);
        else snapshot.levels.at(-1).forEach(n => vals.push(...n.keys));
        return { ordered: vals.every((v, i) => i === 0 || vals[i - 1] < v), keys: vals };
    }

    function runTopic(topic, key) {
        const done = (message, items, result) => ({ steps: [snapshot(message, items, result)], answer: result });
        if (topic === 'searching') {
            const arr = key === 'binary' ? [1, 3, 5, 7, 9, 11, 13, 18, 21, 27] : [4, 9, 1, 7, 11, 13, 18, 21];
            if (key === 'linear') {
                const found = arr.indexOf(7);
                return done(`Linear search found 7 at index ${found}`, arr.map((v, i) => item(i, `${i}:${v}`, i <= found ? 'checked' : 'unseen', i === found ? 'chosen' : '')), found);
            }
            if (key === 'binary') {
                let lo = 0, hi = arr.length - 1, found = -1;
                while (lo <= hi) {
                    const mid = Math.floor((lo + hi) / 2);
                    if (arr[mid] === 13) { found = mid; break; }
                    if (arr[mid] < 13) lo = mid + 1; else hi = mid - 1;
                }
                return done(`Binary search found 13 at index ${found}`, arr.map((v, i) => item(i, `${i}:${v}`, i === found ? 'target' : 'sorted', i === found ? 'chosen' : '')), found);
            }
            if (key === 'interpolation') {
                const uniform = [2, 5, 8, 11, 14, 17, 20, 23, 26];
                const target = 20;
                const pos = Math.floor((target - uniform[0]) * (uniform.length - 1) / (uniform.at(-1) - uniform[0]));
                return done(`Interpolation probe lands at index ${pos}`, uniform.map((v, i) => item(i, `${i}:${v}`, 'uniform', i === pos ? 'chosen' : '')), pos);
            }
            if (key === 'chaining') {
                const buckets = [[8], [], [10, 18], [], [12]];
                return done('Hash table chaining stores collision 18 in bucket 2', buckets.map((b, i) => item(i, `slot ${i}`, `[${b.join(', ')}]`, i === 2 ? 'chosen' : '')), true);
            }
            if (key === 'open' || key === 'linearprobe') return done('Linear probing places 18 in the first open slot after its hash', [item(4, 'slot 4', 'occupied'), item(5, 'slot 5', 'occupied'), item(6, 'slot 6', 'insert 18', 'chosen')], 6);
            if (key === 'quadratic') return done('Quadratic probing checks h+1^2 then h+2^2 before insertion', [item(4, 'slot 4', 'occupied'), item(5, 'slot 5', 'occupied'), item(8, 'slot 8', 'insert 18', 'chosen')], 8);
            if (key === 'doublehash') return done('Double hashing uses the second hash as the stride', [item('h1', 'h1=4', 'first slot'), item('h2', 'h2=3', 'stride'), item(7, 'slot 7', 'insert', 'chosen')], 7);
            if (key === 'bloom') return done('Bloom query is maybe-present only when every hashed bit is set', [item(1, 'bit 1', 'set', 'chosen'), item(4, 'bit 4', 'set', 'chosen'), item(6, 'bit 6', 'set', 'chosen')], 'maybe present');
        }
        if (topic === 'heaps') {
            const heap = [1, 3, 5, 9, 8, 12, 10];
            if (key === 'insert') return done('Insert 2 at the end, then bubble it above 3', [item(0, '1', 'root'), item(1, '2', 'new parent', 'chosen'), item(3, '3', 'bubbled down')], [1, 2, 5, 3, 8, 12, 10, 9]);
            if (key === 'extract') return done('Extract-min removes 1 and sifts 10 down to restore heap order', [item(0, '3', 'new root', 'chosen'), item(1, '8', 'child'), item(2, '5', 'child')], [3, 8, 5, 9, 10, 12]);
            if (key === 'decrease') return done('Decrease 12 to 2 and bubble it to the root path', [item(0, '1', 'root'), item(2, '2', 'decreased key', 'chosen'), item(5, '5', 'swapped down')], [1, 3, 2, 9, 8, 5, 10]);
            if (key === 'heapify') return done('Bottom-up heapify turns an unsorted array into a valid min-heap', heap.map((v, i) => item(i, String(v), i === 0 ? 'minimum root' : 'heap order', i === 0 ? 'chosen' : '')), heap);
            if (key === 'binomial') return done('Binomial heap merge links equal-degree trees like binary addition', [item('B0', 'B0', 'single root'), item('B1', 'B1', 'linked tree', 'chosen'), item('B2', 'B2', 'carry result')], true);
            if (key === 'fibonacci') return done('Fibonacci heap decrease-key cuts the improved node into the root list', [item('cut', 'cut node', 'heap violation repaired', 'chosen'), item('mark', 'mark parent', 'cascading-cut bookkeeping')], true);
            if (key === 'binaryheap') return done('Binary heap sample satisfies parent priority before child priority', heap.map((v, i) => item(i, String(v), i === 0 ? 'root min' : `parent ${Math.floor((i - 1) / 2)}`, i === 0 ? 'chosen' : '')), true);
        }
        if (topic === 'strings') {
            const text = 'ABABACABA', pattern = 'ABA';
            const matches = [];
            for (let i = 0; i <= text.length - pattern.length; i++) if (text.slice(i, i + pattern.length) === pattern) matches.push(i);
            if (['naive', 'kmp', 'rabin', 'boyer'].includes(key)) return done(`${key} finds pattern ABA at shifts ${matches.join(', ')}`, matches.map(i => item(i, `shift ${i}`, text.slice(i, i + pattern.length), 'chosen')), matches);
            if (key === 'trie') return done('Trie stores CAT, CAR, and DOG with CA shared', [item('C', 'C', 'shared prefix', 'chosen'), item('A', 'A', 'shared prefix'), item('T/R', 'T/R', 'word endings')], true);
            if (key === 'suffixtrie') return done('Suffix trie for BANANA answers substring ANA by walking A-N-A', [item('A', 'A', 'edge', 'chosen'), item('N', 'N', 'edge', 'chosen'), item('A2', 'A', 'edge', 'chosen')], true);
            if (key === 'suffixarray') return done('Suffix array for BANANA sorts suffix starts lexicographically', [5, 3, 1, 0, 4, 2].map(i => item(i, String(i), 'suffix start', i === 1 ? 'chosen' : '')), [5, 3, 1, 0, 4, 2]);
            if (key === 'aho') return done('Aho-Corasick emits all dictionary matches while scanning one pass', [item('he', 'he', 'match'), item('she', 'she', 'match', 'chosen'), item('hers', 'hers', 'match')], ['she', 'he', 'hers']);
        }
        if (topic === 'divide') {
            if (key === 'binary') return done('Divide-and-conquer binary search finds 13 at index 6', [item('left', 'discard left/right by midpoint', 'halving'), item('hit', 'index 6', 'found', 'chosen')], 6);
            if (key === 'mergetree') return done('Merge sort recursion tree combines sorted halves into final order', sorted([8, 3, 7, 1, 9, 2]).map(v => item(v, String(v), 'sorted', 'chosen')), [1, 2, 3, 7, 8, 9]);
            if (key === 'quickselect') return done('Quickselect partitions until the 4th-smallest value is isolated', [item('pivot', 'pivot 5', 'partition'), item('k', 'value 5', 'kth', 'chosen')], 5);
            if (key === 'closestpair') return done('Closest-pair split checks the strip after left/right recursion', [item('p1', '(1,1)', 'point', 'chosen'), item('p2', '(2,2)', 'point', 'chosen')], Math.sqrt(2));
            if (key === 'karatsuba') return done('Karatsuba combines z2, z1, and z0 into the product', [item('z0', 'z0', 'low product'), item('z1', 'z1', 'cross term'), item('product', '7006652', '1234*5678', 'chosen')], 7006652);
            if (key === 'strassen') return done('Strassen computes a 2x2 product with seven block products', [item('C11', '19', 'cell', 'chosen'), item('C12', '22', 'cell'), item('C21', '43', 'cell'), item('C22', '50', 'cell')], [[19, 22], [43, 50]]);
        }
        if (topic === 'geometry') {
            if (key === 'graham' || key === 'jarvis') return done(`${key} finds the outer hull of the sample points`, [item('A', '(0,0)', 'hull', 'chosen'), item('B', '(4,0)', 'hull', 'chosen'), item('C', '(4,3)', 'hull', 'chosen'), item('D', '(0,3)', 'hull', 'chosen')], ['A', 'B', 'C', 'D']);
            if (key === 'segments') return done('Opposite orientation signs show the two segments intersect', [item('o1', 'ccw', 'orientation'), item('o2', 'cw', 'orientation'), item('x', 'intersection', 'true', 'chosen')], true);
            if (key === 'sweep') return done('Sweep line handles events in x-order and checks active neighbors', [item('enter', 'enter segment', 'event'), item('cross', 'crossing', 'reported', 'chosen'), item('leave', 'leave segment', 'event')], true);
            if (key === 'closest') return done('Closest-pair strip comparison finds distance sqrt(2)', [item('p1', '(1,1)', 'point', 'chosen'), item('p2', '(2,2)', 'point', 'chosen')], Math.sqrt(2));
            if (key === 'voronoi') return done('Voronoi cells connect neighboring sites in the Delaunay dual', [item('cell', 'nearest-site cell', 'Voronoi'), item('edge', 'dual edge', 'Delaunay', 'chosen')], true);
        }
        throw new Error(`Unknown topic: ${topic}/${key}`);
    }

    const AlgorithmCore = {
        sorting: { run: runSort },
        dp: { run: runDp },
        greedy: { run: runGreedy },
        graphs: { samples: graphSamples, graphFrom, run: runGraph },
        trees: { createSession: createTreeSession, invariants: treeInvariants },
        topics: { run: runTopic },
        util: { clone, sorted, edgeKey }
    };

    global.AlgorithmCore = AlgorithmCore;
    if (typeof module !== 'undefined' && module.exports) module.exports = AlgorithmCore;
})(typeof globalThis !== 'undefined' ? globalThis : window);
