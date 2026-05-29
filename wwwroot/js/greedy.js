'use strict';

const GREEDY_ALGORITHMS = {
    activity: {
        name: 'Activity Selection',
        category: 'Scheduling',
        time: 'O(n log n)', space: 'O(n)', rule: 'Earliest finish', result: '4 activities',
        description: 'Sorts activities by finish time and keeps the next compatible activity. This is the classic exchange-argument greedy proof.',
        pseudocode: 'sort activities by finish time\nlastFinish = -infinity\nfor activity in sorted order:\n  if activity.start >= lastFinish:\n    choose activity\n    lastFinish = activity.finish\n  else reject activity'
    },
    huffman: {
        name: 'Huffman Coding',
        category: 'Compression',
        time: 'O(n log n)', space: 'O(n)', rule: 'Merge two smallest', result: 'Prefix code',
        description: 'Repeatedly merges the two least frequent symbols. The merge tree gives shorter codes to more frequent symbols.',
        pseudocode: 'make a min-priority queue of symbols\nwhile queue has more than one node:\n  a = extractMin()\n  b = extractMin()\n  insert node(a.freq + b.freq, a, b)'
    },
    fractional: {
        name: 'Fractional Knapsack',
        category: 'Packing',
        time: 'O(n log n)', space: 'O(n)', rule: 'Highest value/weight', result: '240 value',
        description: 'Sorts items by value density and takes as much as possible of each. Fractions make the greedy choice optimal.',
        pseudocode: 'sort items by value / weight descending\nfor item in sorted order:\n  if item fits, take all of it\n  else take the remaining fraction and stop'
    },
    interval: {
        name: 'Interval Scheduling',
        category: 'Scheduling',
        time: 'O(n log n)', space: 'O(n)', rule: 'Earliest finish', result: '4 intervals',
        description: 'Chooses the maximum number of non-overlapping intervals using the same earliest-finish principle as activity selection.',
        pseudocode: 'sort intervals by end time\nfor interval in sorted order:\n  if interval starts after the last chosen end:\n    choose interval\n  else reject interval'
    },
    jobs: {
        name: 'Job Sequencing',
        category: 'Deadlines',
        time: 'O(n log n + nd)', space: 'O(d)', rule: 'Highest profit first', result: '142 profit',
        description: 'Sorts jobs by profit and places each job in the latest open slot before its deadline.',
        pseudocode: 'sort jobs by profit descending\nfor job in jobs:\n  for slot from deadline down to 1:\n    if slot is empty:\n      schedule job there\n      break'
    },
    setcover: {
        name: 'Set Cover Approximation',
        category: 'Approximation',
        time: 'O(mn)', space: 'O(n)', rule: 'Most uncovered elements', result: '3 sets',
        description: 'Repeatedly chooses the set that covers the largest number of still-uncovered elements. It is a practical approximation for an NP-hard problem.',
        pseudocode: 'uncovered = universe\nwhile uncovered is not empty:\n  choose set covering the most uncovered elements\n  add it to solution\n  remove its elements from uncovered'
    }
};

const refs = {
    grid: document.getElementById('greedy-grid'),
    list: document.getElementById('greedy'),
    viz: document.getElementById('greedy-viz-section'),
    stage: document.getElementById('greedy-stage'),
    back: document.getElementById('greedy-back-btn'),
    title: document.getElementById('greedy-title'),
    category: document.getElementById('greedy-category'),
    chosen: document.getElementById('greedy-stat-chosen'),
    steps: document.getElementById('greedy-stat-steps'),
    status: document.getElementById('greedy-stat-status'),
    speed: document.getElementById('greedy-speed'),
    speedVal: document.getElementById('greedy-speed-val'),
    size: document.getElementById('greedy-size'),
    sizeVal: document.getElementById('greedy-size-val'),
    play: document.getElementById('greedy-play'),
    step: document.getElementById('greedy-step'),
    reset: document.getElementById('greedy-reset'),
    log: document.getElementById('greedy-log'),
    pseudocode: document.getElementById('greedy-pseudocode')
};

let currentKey = null;
let steps = [];
let stepIndex = 0;
let timerId = null;
let playing = false;

const GREEDY_DEFAULT_SIZES = {
    activity: 10,
    interval: 7,
    fractional: 4,
    jobs: 5,
    setcover: 5,
    huffman: 6
};

function itemCount() {
    return parseInt(refs.size.value, 10) || GREEDY_DEFAULT_SIZES[currentKey] || 8;
}

function renderGrid() {
    refs.grid.innerHTML = Object.entries(GREEDY_ALGORITHMS).map(([key, algo]) => `
<div class="vs-algo-card" data-key="${key}" role="button" tabindex="0" aria-label="Visualize ${algo.name}">
    <div class="vs-algo-card-header">
        <span class="vs-algo-name">${algo.name}</span>
        <span class="vs-category-badge vs-badge-greedy">${algo.category}</span>
    </div>
    <table class="vs-complexity-table" aria-label="Complexity of ${algo.name}">
        <tr><td>Time</td><td>${algo.time}</td></tr>
        <tr><td>Space</td><td>${algo.space}</td></tr>
        <tr><td>Rule</td><td>${algo.rule}</td></tr>
        <tr><td>Result</td><td>${algo.result}</td></tr>
    </table>
    <div class="vs-card-footer" aria-hidden="true">Visualize</div>
</div>`).join('');

    refs.grid.addEventListener('click', event => {
        const card = event.target.closest('.vs-algo-card');
        if (card) openGreedy(card.dataset.key);
    });
    refs.grid.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const card = event.target.closest('.vs-algo-card');
        if (!card) return;
        event.preventDefault();
        openGreedy(card.dataset.key);
    });
}

function openGreedy(key) {
    currentKey = key;
    const algo = GREEDY_ALGORITHMS[key];
    refs.title.textContent = algo.name;
    refs.category.textContent = algo.category;
    document.getElementById('greedy-cp-time').textContent = algo.time;
    document.getElementById('greedy-cp-space').textContent = algo.space;
    document.getElementById('greedy-cp-rule').textContent = algo.rule;
    document.getElementById('greedy-cp-result').textContent = algo.result;
    document.getElementById('greedy-description').textContent = algo.description;
    refs.pseudocode.textContent = algo.pseudocode;
    refs.size.value = GREEDY_DEFAULT_SIZES[key] || 8;
    refs.sizeVal.textContent = refs.size.value;
    refs.list.classList.add('vs-hidden');
    refs.viz.classList.remove('vs-hidden');
    buildSteps();
}

function buildSteps() {
    pause();
    refs.log.innerHTML = '';
    const result = (RUNNERS[currentKey] || runActivity)(itemCount(), { randomize: true });
    const resultSteps = Array.isArray(result) ? result : result.steps;
    steps = [queuedStep(resultSteps[0]), ...resultSteps];
    updateResult(result);
    stepIndex = 0;
    renderStep(steps[0]);
}

function queuedStep(firstStep) {
    return snapshot('Queued. Press Play to start.', firstStep.items.map(item => ({ ...item, state: '' })), firstStep.caption);
}

function snapshot(message, items, caption = '') {
    return { message, items: items.map(item => ({ ...item })), caption };
}

function item(id, label, meta, state = '') {
    return { id, label, meta, state };
}
function resultOf(steps, result) { return { steps, result }; }
function updateResult(result) {
    if (!result || Array.isArray(result)) return;
    document.getElementById('greedy-cp-result').textContent = result.result;
}
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle(items) {
    const next = [...items];
    for (let i = next.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
}

function renderStep(step) {
    refs.status.textContent = step.message;
    refs.steps.textContent = stepIndex;
    refs.chosen.textContent = step.items.filter(i => i.state === 'chosen').length;
    refs.stage.innerHTML = `<div class="vs-greedy-list">${step.items.map(renderItem).join('')}</div><p class="vs-greedy-caption">${step.caption}</p>`;
    renderLog(step.message);
}

function renderItem(it) {
    const cls = it.state ? `vs-greedy-item-${it.state}` : '';
    return `<div class="vs-greedy-item ${cls}">
        <span class="vs-greedy-item-title">${it.label}</span>
        <span class="vs-greedy-item-meta">${it.meta}</span>
    </div>`;
}

function renderLog(message) {
    const li = document.createElement('li');
    li.textContent = message;
    refs.log.prepend(li);
    while (refs.log.children.length > 8) refs.log.lastChild.remove();
}

function runActivity(size = 10, options = {}) {
    const base = options.randomize ? Array.from({ length: size }, (_, i) => {
        const s = randInt(0, size + 4);
        return { id: `A${i + 1}`, s, f: s + randInt(1, 5) };
    }) : [
        { id: 'A1', s: 1, f: 4 }, { id: 'A2', s: 3, f: 5 }, { id: 'A3', s: 0, f: 6 },
        { id: 'A4', s: 5, f: 7 }, { id: 'A5', s: 3, f: 9 }, { id: 'A6', s: 5, f: 9 },
        { id: 'A7', s: 6, f: 10 }, { id: 'A8', s: 8, f: 11 }, { id: 'A9', s: 8, f: 12 },
        { id: 'A10', s: 12, f: 14 }
    ];
    for (let i = base.length + 1; i <= size; i++) base.push({ id: `A${i}`, s: i + 2, f: i + 5 });
    const acts = base.slice(0, size).sort((a, b) => a.f - b.f);
    const states = acts.map(a => item(a.id, a.id, `${a.s} -> ${a.f}`));
    const out = [snapshot('Sort by finish time', states, 'Greedy rule: pick the compatible activity that finishes earliest.')];
    let last = -Infinity;
    for (const a of acts) {
        const cur = states.find(x => x.id === a.id);
        cur.state = 'consider';
        out.push(snapshot(`Consider ${a.id}`, states, `Last finish time is ${last === -Infinity ? 'none' : last}.`));
        if (a.s >= last) {
            cur.state = 'chosen';
            last = a.f;
            out.push(snapshot(`Choose ${a.id}; update last finish to ${last}`, states, 'Chosen activities stay green.'));
        } else {
            cur.state = 'reject';
            out.push(snapshot(`Reject ${a.id}; it overlaps the current schedule`, states, 'Rejected candidates conflict with the latest chosen activity.'));
        }
    }
    return resultOf(out, `${states.filter(x => x.state === 'chosen').length} activities`);
}

function runInterval(size = 7, options = {}) {
    const base = options.randomize ? Array.from({ length: size }, (_, i) => {
        const s = randInt(0, size + 5);
        return { id: `I${i + 1}`, s, f: s + randInt(1, 5) };
    }) : [
        { id: 'I1', s: 0, f: 3 }, { id: 'I2', s: 1, f: 2 }, { id: 'I3', s: 3, f: 4 },
        { id: 'I4', s: 2, f: 5 }, { id: 'I5', s: 5, f: 7 }, { id: 'I6', s: 6, f: 9 },
        { id: 'I7', s: 8, f: 10 }
    ];
    for (let i = base.length + 1; i <= size; i++) base.push({ id: `I${i}`, s: i + 1, f: i + 4 });
    const intervals = base.slice(0, size).sort((a, b) => a.f - b.f);
    const states = intervals.map(x => item(x.id, x.id, `[${x.s}, ${x.f})`));
    const out = [snapshot('Sort intervals by end time', states, 'This maximizes the number of non-overlapping intervals.')];
    let end = -Infinity;
    for (const x of intervals) {
        const cur = states.find(i => i.id === x.id);
        cur.state = 'consider';
        out.push(snapshot(`Consider ${x.id}`, states, `Current schedule ends at ${end === -Infinity ? 'none' : end}.`));
        if (x.s >= end) {
            cur.state = 'chosen';
            end = x.f;
            out.push(snapshot(`Choose ${x.id}`, states, 'Earliest finish leaves the most room for future intervals.'));
        } else {
            cur.state = 'reject';
            out.push(snapshot(`Reject ${x.id}; it overlaps`, states, 'Overlapping intervals cannot both be scheduled.'));
        }
    }
    return resultOf(out, `${states.filter(x => x.state === 'chosen').length} intervals`);
}

function runFractional(size = 4, options = {}) {
    const capacity = options.randomize ? randInt(Math.max(25, size * 5), Math.max(45, size * 12)) : Math.max(35, size * 10 + 10);
    const base = options.randomize ? Array.from({ length: size }, (_, i) => ({ id: String.fromCharCode(65 + i), w: randInt(5, 35), v: randInt(20, 140) })) : [
        { id: 'A', w: 10, v: 60 }, { id: 'B', w: 20, v: 100 }, { id: 'C', w: 30, v: 120 }, { id: 'D', w: 15, v: 45 }
    ];
    for (let i = base.length; i < size; i++) base.push({ id: String.fromCharCode(65 + i), w: 8 + i * 2, v: 30 + i * 17 });
    const items = base.slice(0, size).sort((a, b) => (b.v / b.w) - (a.v / a.w));
    const states = items.map(x => item(x.id, `Item ${x.id}`, `w=${x.w}, v=${x.v}, ratio=${(x.v / x.w).toFixed(1)}`));
    const out = [snapshot('Sort by value density', states, `Capacity starts at ${capacity}.`)]; 
    let remaining = capacity;
    let value = 0;
    for (const x of items) {
        const cur = states.find(i => i.id === x.id);
        cur.state = 'consider';
        out.push(snapshot(`Consider item ${x.id}`, states, `Remaining capacity: ${remaining}. Total value: ${value}.`));
        if (x.w <= remaining) {
            remaining -= x.w;
            value += x.v;
            cur.state = 'chosen';
            cur.meta += ' | take all';
            out.push(snapshot(`Take all of ${x.id}`, states, `Remaining capacity: ${remaining}. Total value: ${value}.`));
        } else if (remaining > 0) {
            const fraction = remaining / x.w;
            value += x.v * fraction;
            cur.state = 'chosen';
            cur.meta += ` | take ${(fraction * 100).toFixed(0)}%`;
            remaining = 0;
            out.push(snapshot(`Take a fraction of ${x.id}`, states, `Knapsack is full. Total value: ${value}.`));
        } else {
            cur.state = 'reject';
            out.push(snapshot(`Reject ${x.id}; no capacity remains`, states, `Final value: ${value}.`));
        }
    }
    return resultOf(out, `${value.toFixed(1)} value`);
}

function runJobs(size = 5, options = {}) {
    const base = options.randomize ? Array.from({ length: size }, (_, i) => ({ id: `J${i + 1}`, d: randInt(1, Math.max(2, Math.min(7, size))), p: randInt(10, 150) })) : [
        { id: 'J1', d: 2, p: 100 }, { id: 'J2', d: 1, p: 19 }, { id: 'J3', d: 2, p: 27 },
        { id: 'J4', d: 1, p: 25 }, { id: 'J5', d: 3, p: 15 }
    ];
    for (let i = base.length + 1; i <= size; i++) base.push({ id: `J${i}`, d: 1 + (i % 5), p: 20 + i * 9 });
    const jobs = base.slice(0, size).sort((a, b) => b.p - a.p);
    const states = jobs.map(j => item(j.id, j.id, `deadline=${j.d}, profit=${j.p}`));
    const slots = Array(Math.max(...jobs.map(j => j.d))).fill(null);
    const out = [snapshot('Sort jobs by profit descending', states, 'Place each job in the latest open slot before its deadline.')];
    for (const j of jobs) {
        const cur = states.find(i => i.id === j.id);
        cur.state = 'consider';
        out.push(snapshot(`Consider ${j.id}`, states, `Slots: ${slots.map(x => x || '-').join(' | ')}`));
        let placed = false;
        for (let s = Math.min(j.d, slots.length) - 1; s >= 0; s--) {
            if (!slots[s]) {
                slots[s] = j.id;
                placed = true;
                break;
            }
        }
        cur.state = placed ? 'chosen' : 'reject';
        out.push(snapshot(placed ? `Schedule ${j.id}` : `Reject ${j.id}; no slot before deadline`, states, `Slots: ${slots.map(x => x || '-').join(' | ')}`));
    }
    return resultOf(out, `${slots.reduce((sum, id) => sum + (jobs.find(job => job.id === id)?.p || 0), 0)} profit`);
}

function runSetcover(size = 5, options = {}) {
    const universeItems = 'ABCDEFG'.split('');
    const universe = new Set(universeItems);
    const base = options.randomize ? Array.from({ length: size }, (_, i) => ({ id: `S${i + 1}`, covers: shuffle(universeItems).slice(0, randInt(2, 4)).sort() })) : [
        { id: 'S1', covers: ['A', 'B', 'C'] }, { id: 'S2', covers: ['A', 'D'] }, { id: 'S3', covers: ['B', 'E', 'F'] },
        { id: 'S4', covers: ['C', 'G'] }, { id: 'S5', covers: ['D', 'E', 'G'] }
    ];
    if (options.randomize) universeItems.forEach((symbol, index) => {
        const bucket = base[index % base.length].covers;
        if (!bucket.includes(symbol)) bucket.push(symbol);
        bucket.sort();
    });
    for (let i = base.length + 1; i <= size; i++) base.push({ id: `S${i}`, covers: universeItems.filter((_, index) => (index + i) % 3 === 0).slice(0, 4) });
    const sets = base.slice(0, size);
    const states = sets.map(s => item(s.id, s.id, `{${s.covers.join(', ')}}`));
    const uncovered = new Set(universe);
    const out = [snapshot('Start with every element uncovered', states, `Uncovered: ${[...uncovered].join(', ')}`)];
    while (uncovered.size) {
        const best = sets
            .filter(s => states.find(i => i.id === s.id).state !== 'chosen')
            .sort((a, b) => b.covers.filter(x => uncovered.has(x)).length - a.covers.filter(x => uncovered.has(x)).length)[0];
        const cur = states.find(i => i.id === best.id);
        cur.state = 'consider';
        out.push(snapshot(`Choose set with most uncovered elements: ${best.id}`, states, `It covers ${best.covers.filter(x => uncovered.has(x)).join(', ') || 'nothing new'}.`));
        cur.state = 'chosen';
        best.covers.forEach(x => uncovered.delete(x));
        out.push(snapshot(`Add ${best.id} to cover`, states, `Remaining uncovered: ${[...uncovered].join(', ') || 'none'}.`));
    }
    return resultOf(out, `${states.filter(x => x.state === 'chosen').length} sets`);
}

function runHuffman(size = 6, options = {}) {
    const base = options.randomize ? Array.from({ length: size }, (_, i) => ({ id: String.fromCharCode(65 + i), freq: randInt(3, 60) })) : [
        { id: 'A', freq: 45 }, { id: 'B', freq: 13 }, { id: 'C', freq: 12 }, { id: 'D', freq: 16 }, { id: 'E', freq: 9 }, { id: 'F', freq: 5 }
    ];
    for (let i = base.length; i < size; i++) base.push({ id: String.fromCharCode(65 + i), freq: 7 + i * 4 });
    let nodes = base.slice(0, size);
    const out = [snapshot('Start with one leaf per symbol', nodes.map(x => item(x.id, x.id, `freq=${x.freq}`)), 'Always merge the two smallest frequencies.')];
    let count = 1;
    while (nodes.length > 1) {
        nodes = nodes.sort((a, b) => a.freq - b.freq);
        const a = nodes.shift();
        const b = nodes.shift();
        const currentItems = [...nodes, a, b].map(x => item(x.id, x.id, `freq=${x.freq}`, x.id === a.id || x.id === b.id ? 'consider' : ''));
        out.push(snapshot(`Extract ${a.id} and ${b.id}`, currentItems, 'These get the deepest available sibling positions in the code tree.'));
        const merged = { id: `N${count++}`, freq: a.freq + b.freq };
        nodes.push(merged);
        out.push(snapshot(`Merge into ${merged.id} with frequency ${merged.freq}`, nodes.map(x => item(x.id, x.id, `freq=${x.freq}`, x.id === merged.id ? 'chosen' : '')), 'The merged node goes back into the min-priority queue.'));
    }
    return resultOf(out, `total ${nodes[0].freq}`);
}

const RUNNERS = {
    activity: runActivity,
    huffman: runHuffman,
    fractional: runFractional,
    interval: runInterval,
    jobs: runJobs,
    setcover: runSetcover
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
    if (currentKey) buildSteps();
});

renderGrid();
