'use strict';

const DP_ALGORITHMS = {
    fib: {
        name: 'Fibonacci Memoization vs Tabulation',
        category: '1D DP',
        time: 'O(n)', space: 'O(n)', example: 'n = 8', answer: '21',
        description: 'Shows Fibonacci as overlapping subproblems: memoization stores recursive results, while tabulation fills the same states from the bottom up.',
        pseudocode: 'dp[0] = 0\ndp[1] = 1\nfor i from 2 to n:\n  dp[i] = dp[i - 1] + dp[i - 2]'
    },
    coin: {
        name: 'Coin Change',
        category: '1D DP',
        time: 'O(amount * coins)', space: 'O(amount)', example: 'coins 1,2,5; amount 11', answer: '3',
        description: 'Finds the minimum number of coins for each amount by reusing smaller optimal amounts.',
        pseudocode: 'dp[0] = 0\nfor amount from 1 to target:\n  for coin in coins:\n    if coin <= amount:\n      dp[amount] = min(dp[amount], dp[amount - coin] + 1)'
    },
    knapsack: {
        name: '0/1 Knapsack',
        category: '2D DP',
        time: 'O(nW)', space: 'O(nW)', example: 'capacity 7', answer: '9',
        description: 'Chooses whether to skip or take each item. Each cell asks: best value using the first i items and capacity w.',
        pseudocode: 'for item i:\n  for capacity w:\n    skip = dp[i - 1][w]\n    take = value[i] + dp[i - 1][w - weight[i]]\n    dp[i][w] = max(skip, take)'
    },
    lcs: {
        name: 'Longest Common Subsequence',
        category: '2D DP',
        time: 'O(mn)', space: 'O(mn)', example: 'ABCBDAB vs BDCABA', answer: '4',
        description: 'Compares prefixes of two strings. Matching characters extend a subsequence; mismatches inherit the best neighboring prefix.',
        pseudocode: 'if x[i] == y[j]:\n  dp[i][j] = dp[i - 1][j - 1] + 1\nelse:\n  dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])'
    },
    edit: {
        name: 'Edit Distance',
        category: '2D DP',
        time: 'O(mn)', space: 'O(mn)', example: 'kitten -> sitting', answer: '3',
        description: 'Computes the cheapest sequence of insertions, deletions, and substitutions to transform one string into another.',
        pseudocode: 'if a[i] == b[j]: cost = 0\nelse: cost = 1\ndp[i][j] = min(\n  dp[i - 1][j] + 1,\n  dp[i][j - 1] + 1,\n  dp[i - 1][j - 1] + cost)'
    },
    matrix: {
        name: 'Matrix Chain Multiplication',
        category: 'Interval DP',
        time: 'O(n^3)', space: 'O(n^2)', example: '10x30, 30x5, 5x60', answer: '4500',
        description: 'Finds the cheapest parenthesization by splitting every interval at every possible midpoint.',
        pseudocode: 'for chain length from 2 to n:\n  for i from 1 to n - length + 1:\n    j = i + length - 1\n    dp[i][j] = min over k:\n      dp[i][k] + dp[k + 1][j] + p[i-1]p[k]p[j]'
    },
    lis: {
        name: 'Longest Increasing Subsequence',
        category: '1D DP',
        time: 'O(n^2)', space: 'O(n)', example: '10,9,2,5,3,7,101,18', answer: '4',
        description: 'Tracks the best increasing subsequence ending at each index by looking back at all smaller previous values.',
        pseudocode: 'for i from 0 to n - 1:\n  dp[i] = 1\n  for j from 0 to i - 1:\n    if arr[j] < arr[i]:\n      dp[i] = max(dp[i], dp[j] + 1)'
    }
};

const refs = {
    grid: document.getElementById('dp-grid'),
    list: document.getElementById('dynamic-programming'),
    viz: document.getElementById('dp-viz-section'),
    stage: document.getElementById('dp-stage'),
    back: document.getElementById('dp-back-btn'),
    title: document.getElementById('dp-title'),
    category: document.getElementById('dp-category'),
    cells: document.getElementById('dp-stat-cells'),
    steps: document.getElementById('dp-stat-steps'),
    status: document.getElementById('dp-stat-status'),
    speed: document.getElementById('dp-speed'),
    speedVal: document.getElementById('dp-speed-val'),
    size: document.getElementById('dp-size'),
    sizeVal: document.getElementById('dp-size-val'),
    play: document.getElementById('dp-play'),
    step: document.getElementById('dp-step'),
    reset: document.getElementById('dp-reset'),
    log: document.getElementById('dp-log'),
    pseudocode: document.getElementById('dp-pseudocode')
};

let currentKey = null;
let steps = [];
let stepIndex = 0;
let timerId = null;
let playing = false;

function problemSize() {
    return parseInt(refs.size.value, 10) || 8;
}

function renderGrid() {
    refs.grid.innerHTML = Object.entries(DP_ALGORITHMS).map(([key, algo]) => `
<div class="vs-algo-card" data-key="${key}" role="button" tabindex="0" aria-label="Visualize ${algo.name}">
    <div class="vs-algo-card-header">
        <span class="vs-algo-name">${algo.name}</span>
        <span class="vs-category-badge vs-badge-dp">${algo.category}</span>
    </div>
    <table class="vs-complexity-table" aria-label="Complexity of ${algo.name}">
        <tr><td>Time</td><td>${algo.time}</td></tr>
        <tr><td>Space</td><td>${algo.space}</td></tr>
        <tr><td>Example</td><td>${algo.example}</td></tr>
        <tr><td>Answer</td><td>${algo.answer}</td></tr>
    </table>
    <div class="vs-card-footer" aria-hidden="true">Visualize</div>
</div>`).join('');

    refs.grid.addEventListener('click', event => {
        const card = event.target.closest('.vs-algo-card');
        if (card) openDp(card.dataset.key);
    });
    refs.grid.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const card = event.target.closest('.vs-algo-card');
        if (!card) return;
        event.preventDefault();
        openDp(card.dataset.key);
    });
}

function openDp(key) {
    currentKey = key;
    const algo = DP_ALGORITHMS[key];
    refs.title.textContent = algo.name;
    refs.category.textContent = algo.category;
    document.getElementById('dp-cp-time').textContent = algo.time;
    document.getElementById('dp-cp-space').textContent = algo.space;
    document.getElementById('dp-cp-example').textContent = algo.example;
    document.getElementById('dp-cp-answer').textContent = algo.answer;
    document.getElementById('dp-description').textContent = algo.description;
    refs.pseudocode.textContent = algo.pseudocode;
    refs.list.classList.add('vs-hidden');
    refs.viz.classList.remove('vs-hidden');
    buildSteps();
}

function buildSteps() {
    pause();
    refs.log.innerHTML = '';
    steps = (RUNNERS[currentKey] || runFib)(problemSize());
    stepIndex = 0;
    renderStep(steps[0]);
}

function makeTable(rows, rowLabels, colLabels, caption, active = [], done = []) {
    return { rows: rows.map(r => [...r]), rowLabels, colLabels, caption, active, done };
}
function cloneRows(rows) { return rows.map(row => [...row]); }
function emptyRows(r, c, fill = '') { return Array.from({ length: r }, () => Array(c).fill(fill)); }
function tableStep(message, table) { return { message, table }; }
function keyOf(r, c) { return `${r}:${c}`; }

function renderStep(item) {
    refs.status.textContent = item.message;
    refs.steps.textContent = stepIndex;
    refs.cells.textContent = item.table.done.length;
    renderTable(item.table);
    renderLog(item.message);
}

function renderTable(table) {
    const rows = table.rows;
    const rowLabels = table.rowLabels || rows.map((_, i) => String(i));
    const colLabels = table.colLabels || (rows[0] || []).map((_, i) => String(i));
    const active = new Set(table.active.map(([r, c]) => keyOf(r, c)));
    const done = new Set(table.done.map(([r, c]) => keyOf(r, c)));
    const cols = colLabels.length + 1;
    const cells = ['<div class="vs-dp-cell vs-dp-cell-label"></div>'];
    colLabels.forEach(label => cells.push(`<div class="vs-dp-cell vs-dp-cell-label">${label}</div>`));
    rows.forEach((row, r) => {
        cells.push(`<div class="vs-dp-cell vs-dp-cell-label">${rowLabels[r] ?? r}</div>`);
        row.forEach((value, c) => {
            const cls = active.has(keyOf(r, c)) ? 'vs-dp-cell-write'
                : done.has(keyOf(r, c)) ? 'vs-dp-cell-done'
                : '';
            cells.push(`<div class="vs-dp-cell ${cls}">${value}</div>`);
        });
    });
    refs.stage.innerHTML = `<div class="vs-dp-table" style="grid-template-columns: repeat(${cols}, minmax(54px, max-content));">${cells.join('')}</div><p class="vs-dp-caption">${table.caption}</p>`;
}

function renderLog(message) {
    const li = document.createElement('li');
    li.textContent = message;
    refs.log.prepend(li);
    while (refs.log.children.length > 8) refs.log.lastChild.remove();
}

function runFib(size = 8) {
    if (globalThis.AlgorithmCore) {
        const core = globalThis.AlgorithmCore.dp.run('fib', { size });
        const labels = [...Array(core.steps[0].state.memo.length).keys()];
        return core.steps.map(step => {
            const rows = [step.state.memo.map(v => v ?? ''), step.state.tab.map(v => v ?? '')];
            const done = [];
            rows.forEach((row, r) => row.forEach((value, c) => { if (value !== '') done.push([r, c]); }));
            const active = step.state.active.flatMap(i => [[0, i], [1, i]]);
            return tableStep(step.message, makeTable(rows, ['memo', 'tab'], labels, 'Memoization caches recursive calls; tabulation fills states bottom-up.', active, done));
        });
    }
    const n = size;
    const rows = [Array(n + 1).fill(''), Array(n + 1).fill('')];
    const done = [];
    const out = [tableStep('Compare memoized states with bottom-up table states', makeTable(rows, ['memo', 'tab'], [...Array(n + 1).keys()], `Fibonacci states F(0) through F(${n}).`, [], done))];
    rows[0][0] = rows[1][0] = 0;
    rows[0][1] = rows[1][1] = 1;
    done.push([0,0], [0,1], [1,0], [1,1]);
    out.push(tableStep('Base cases: F(0)=0 and F(1)=1', makeTable(rows, ['memo', 'tab'], [...Array(n + 1).keys()], 'Both approaches store the same base states.', [[0,0],[0,1],[1,0],[1,1]], [...done])));
    for (let i = 2; i <= n; i++) {
        rows[0][i] = rows[0][i - 1] + rows[0][i - 2];
        rows[1][i] = rows[1][i - 1] + rows[1][i - 2];
        done.push([0,i], [1,i]);
        out.push(tableStep(`Fill F(${i}) = F(${i - 1}) + F(${i - 2}) = ${rows[1][i]}`, makeTable(rows, ['memo', 'tab'], [...Array(n + 1).keys()], 'Memoization and tabulation converge to the same cached values.', [[0,i],[1,i]], [...done])));
    }
    return out;
}

function runCoin(size = 8) {
    const coins = [1, 2, 5], amount = size + 3;
    const dp = Array(amount + 1).fill('∞');
    const done = [];
    const out = [];
    dp[0] = 0;
    done.push([0,0]);
    out.push(tableStep('dp[0] = 0 because zero coins make amount 0', makeTable([dp], ['min coins'], [...Array(amount + 1).keys()], `Coins: ${coins.join(', ')}`, [[0,0]], [...done])));
    for (let a = 1; a <= amount; a++) {
        let best = Infinity;
        for (const coin of coins) {
            if (coin <= a && dp[a - coin] !== '∞') best = Math.min(best, dp[a - coin] + 1);
        }
        dp[a] = best === Infinity ? '∞' : best;
        done.push([0,a]);
        out.push(tableStep(`Best for amount ${a} is ${dp[a]}`, makeTable([dp], ['min coins'], [...Array(amount + 1).keys()], 'Each amount reuses earlier optimal amounts.', [[0,a]], [...done])));
    }
    return out;
}

function runKnapsack(size = 8) {
    const baseItems = [{ w: 1, v: 1 }, { w: 3, v: 4 }, { w: 4, v: 5 }, { w: 5, v: 7 }, { w: 2, v: 3 }, { w: 6, v: 9 }, { w: 7, v: 10 }];
    const itemCount = Math.max(3, Math.min(baseItems.length, Math.round(size / 2)));
    const items = baseItems.slice(0, itemCount);
    const cap = Math.max(4, size - 1);
    const rows = emptyRows(items.length + 1, cap + 1, 0);
    const done = [];
    const rowLabels = ['0 items', ...items.map((_, i) => `i${i + 1}`)];
    const out = [tableStep('Initialize row 0: no items means value 0', makeTable(rows, rowLabels, [...Array(cap + 1).keys()], `Items: ${items.map(i => `(w${i.w},v${i.v})`).join(', ')}.`, [], done))];
    for (let i = 1; i <= items.length; i++) {
        for (let w = 0; w <= cap; w++) {
            const item = items[i - 1];
            const skip = rows[i - 1][w];
            const take = item.w <= w ? item.v + rows[i - 1][w - item.w] : -Infinity;
            rows[i][w] = Math.max(skip, take);
            done.push([i,w]);
            out.push(tableStep(`Item ${i}, capacity ${w}: max(skip ${skip}, take ${take === -Infinity ? 'n/a' : take}) = ${rows[i][w]}`, makeTable(rows, rowLabels, [...Array(cap + 1).keys()], 'Rows are item prefixes; columns are capacities.', [[i,w]], [...done])));
        }
    }
    return out;
}

function runLcs(size = 8) {
    const x = 'ABCBDABXYZPQ'.slice(0, Math.min(size, 12));
    const y = 'BDCABAZYXPQ'.slice(0, Math.min(Math.max(4, size - 1), 11));
    const rows = emptyRows(x.length + 1, y.length + 1, 0);
    const done = [];
    const out = [tableStep('Initialize empty-prefix row and column to 0', makeTable(rows, ['-', ...x], ['-', ...y], 'dp[i][j] is LCS length for prefixes x[0..i) and y[0..j).', [], done))];
    for (let i = 1; i <= x.length; i++) {
        for (let j = 1; j <= y.length; j++) {
            rows[i][j] = x[i - 1] === y[j - 1] ? rows[i - 1][j - 1] + 1 : Math.max(rows[i - 1][j], rows[i][j - 1]);
            done.push([i,j]);
            out.push(tableStep(`${x[i - 1]} vs ${y[j - 1]} -> dp[${i}][${j}] = ${rows[i][j]}`, makeTable(rows, ['-', ...x], ['-', ...y], 'Matches extend diagonally; mismatches copy the best neighbor.', [[i,j]], [...done])));
        }
    }
    return out;
}

function runEdit(size = 8) {
    const a = 'kittenfold'.slice(0, Math.min(size, 10));
    const b = 'sittingpad'.slice(0, Math.min(Math.max(4, size + 1), 10));
    const rows = emptyRows(a.length + 1, b.length + 1, 0);
    const done = [];
    for (let i = 0; i <= a.length; i++) rows[i][0] = i;
    for (let j = 0; j <= b.length; j++) rows[0][j] = j;
    const out = [tableStep('Initialize insertion/deletion cost against empty prefixes', makeTable(rows, ['-', ...a], ['-', ...b], 'Cells store edit distance between prefixes.', [], done))];
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
            done.push([i,j]);
            out.push(tableStep(`${a[i - 1]} -> ${b[j - 1]} costs ${cost}; cell = ${rows[i][j]}`, makeTable(rows, ['-', ...a], ['-', ...b], 'Choose delete, insert, or substitute/match.', [[i,j]], [...done])));
        }
    }
    return out;
}

function runMatrix(size = 8) {
    const p = [10, 30, 5, 60, 12, 24, 8, 16].slice(0, Math.max(4, Math.min(8, Math.round(size / 2))));
    const n = p.length - 1;
    const rows = emptyRows(n, n, '');
    const done = [];
    for (let i = 0; i < n; i++) {
        rows[i][i] = 0;
        done.push([i,i]);
    }
    const labels = [...Array(n).keys()].map(i => `A${i + 1}`);
    const out = [tableStep('Single matrix intervals cost 0', makeTable(rows, labels, labels, `Dimensions: ${p.join(' x ')}.`, [[0,0]], [...done]))];
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            let best = Infinity;
            for (let k = i; k < j; k++) {
                best = Math.min(best, rows[i][k] + rows[k + 1][j] + p[i] * p[k + 1] * p[j + 1]);
            }
            rows[i][j] = best;
            done.push([i,j]);
            out.push(tableStep(`Best cost for A${i + 1}..A${j + 1} is ${best}`, makeTable(rows, labels, labels, 'Upper triangle stores interval costs.', [[i,j]], [...done])));
        }
    }
    return out;
}

function runLis(size = 8) {
    const base = [10, 9, 2, 5, 3, 7, 101, 18, 22, 6, 31, 4, 45, 11];
    const arr = base.slice(0, size);
    const dp = Array(arr.length).fill('');
    const done = [];
    const out = [tableStep('Each position starts as a subsequence of length 1', makeTable([arr, dp], ['value', 'LIS'], arr.map((_, i) => i), 'dp[i] is best increasing subsequence ending at i.', [], done))];
    for (let i = 0; i < arr.length; i++) {
        dp[i] = 1;
        for (let j = 0; j < i; j++) {
            if (arr[j] < arr[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
        }
        done.push([1,i]);
        out.push(tableStep(`Best subsequence ending at ${arr[i]} has length ${dp[i]}`, makeTable([arr, dp], ['value', 'LIS'], arr.map((_, k) => k), 'Look left for smaller values and extend the best one.', [[0,i],[1,i]], [...done])));
    }
    return out;
}

const RUNNERS = { fib: runFib, coin: runCoin, knapsack: runKnapsack, lcs: runLcs, edit: runEdit, matrix: runMatrix, lis: runLis };

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
    if (currentKey) buildSteps();
});

renderGrid();
