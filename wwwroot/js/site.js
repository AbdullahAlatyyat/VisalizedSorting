/* ═══════════════════════════════════════════════════════════════════════════
   VisualizedAlgorithms — UI Shell  (Phase 1)
   Sorting engine will be added in Phase 2 after UI approval.
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── ALGORITHM DATA ────────────────────────────────────────────────────────── */
const ALGORITHMS = {
    bubble: {
        name:     'Bubble Sort',
        category: 'Comparison',
        best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
        description:
            'Repeatedly steps through the list, compares adjacent elements, and swaps ' +
            'them if out of order. The largest unsorted element "bubbles up" to its ' +
            'correct position on each pass. Simple to implement and ideal for learning ' +
            'fundamental sorting concepts.',
        pseudocode:
`procedure bubbleSort(arr):
  n ← length(arr)
  repeat
    swapped ← false
    for i ← 1 to n - 1 do
      if arr[i - 1] > arr[i] then
        swap(arr[i - 1], arr[i])
        swapped ← true
    n ← n - 1
  until not swapped`
    },

    selection: {
        name:     'Selection Sort',
        category: 'Comparison',
        best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
        description:
            'Divides the array into sorted and unsorted regions. On each pass, finds ' +
            'the minimum element in the unsorted region and swaps it to the front. ' +
            'Performs at most O(n) swaps, making it efficient when write operations ' +
            'are expensive.',
        pseudocode:
`procedure selectionSort(arr):
  n ← length(arr)
  for i ← 0 to n - 1 do
    minIdx ← i
    for j ← i + 1 to n - 1 do
      if arr[j] < arr[minIdx] then
        minIdx ← j
    if minIdx ≠ i then
      swap(arr[i], arr[minIdx])`
    },

    insertion: {
        name:     'Insertion Sort',
        category: 'Comparison',
        best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
        description:
            'Builds a sorted array one element at a time by inserting each new element ' +
            'into its correct position within the already-sorted portion. Extremely ' +
            'efficient for nearly-sorted arrays and small datasets. Used as the ' +
            'base case in hybrid algorithms like Timsort.',
        pseudocode:
`procedure insertionSort(arr):
  for i ← 1 to length(arr) - 1 do
    key ← arr[i]
    j   ← i - 1
    while j ≥ 0 and arr[j] > key do
      arr[j + 1] ← arr[j]
      j ← j - 1
    arr[j + 1] ← key`
    },

    merge: {
        name:     'Merge Sort',
        category: 'Comparison',
        best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)',
        description:
            'A classic divide-and-conquer algorithm that recursively splits the array ' +
            'in half, sorts each half, then merges them in order. Guarantees O(n log n) ' +
            'in all cases and is highly parallelizable. Used in most standard library ' +
            'sort implementations (e.g., Python\'s Timsort, Java\'s Arrays.sort).',
        pseudocode:
`procedure mergeSort(arr):
  if length(arr) ≤ 1 then return arr
  mid   ← length(arr) / 2
  left  ← mergeSort(arr[0 .. mid])
  right ← mergeSort(arr[mid .. n])
  return merge(left, right)

procedure merge(left, right):
  result ← []
  while left and right not empty do
    if left[0] ≤ right[0] then
      append left[0] to result; pop left[0]
    else
      append right[0] to result; pop right[0]
  append remaining elements to result`
    },

    quick: {
        name:     'Quick Sort',
        category: 'Comparison',
        best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)',
        description:
            'Selects a pivot and partitions the array so elements less than the pivot ' +
            'go left and greater elements go right, then recursively sorts each partition. ' +
            'Despite the O(n²) worst case, its average performance and cache efficiency ' +
            'make it the fastest general-purpose sorting algorithm in practice.',
        pseudocode:
`procedure quickSort(arr, lo, hi):
  if lo < hi then
    p ← partition(arr, lo, hi)
    quickSort(arr, lo, p - 1)
    quickSort(arr, p + 1, hi)

procedure partition(arr, lo, hi):
  pivot ← arr[hi]
  i     ← lo - 1
  for j ← lo to hi - 1 do
    if arr[j] ≤ pivot then
      i ← i + 1
      swap(arr[i], arr[j])
  swap(arr[i + 1], arr[hi])
  return i + 1`
    },

    heap: {
        name:     'Heap Sort',
        category: 'Comparison',
        best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)',
        description:
            'Uses a binary max-heap to sort in place. First builds a max-heap from the ' +
            'array, then repeatedly extracts the maximum element and places it at the end. ' +
            'Combines the guaranteed O(n log n) of Merge Sort with the O(1) extra space ' +
            'of in-place algorithms.',
        pseudocode:
`procedure heapSort(arr):
  n ← length(arr)
  for i ← n/2 - 1 down to 0 do
    heapify(arr, n, i)
  for i ← n - 1 down to 1 do
    swap(arr[0], arr[i])
    heapify(arr, i, 0)

procedure heapify(arr, n, root):
  largest ← root
  left    ← 2 * root + 1
  right   ← 2 * root + 2
  if left  < n and arr[left]  > arr[largest] then largest ← left
  if right < n and arr[right] > arr[largest] then largest ← right
  if largest ≠ root then
    swap(arr[root], arr[largest])
    heapify(arr, n, largest)`
    },

    shell: {
        name:     'Shell Sort',
        category: 'Comparison',
        best: 'O(n log n)', avg: 'O(n log² n)', worst: 'O(n²)', space: 'O(1)',
        description:
            'A generalization of Insertion Sort that allows the exchange of elements far ' +
            'apart. Sorts at decreasing gap intervals, finishing with a standard Insertion ' +
            'Sort pass on a nearly-sorted array. Significantly faster than Insertion Sort ' +
            'for medium-sized datasets.',
        pseudocode:
`procedure shellSort(arr):
  n   ← length(arr)
  gap ← n / 2
  while gap > 0 do
    for i ← gap to n - 1 do
      temp ← arr[i]
      j    ← i
      while j ≥ gap and arr[j - gap] > temp do
        arr[j] ← arr[j - gap]
        j      ← j - gap
      arr[j] ← temp
    gap ← gap / 2`
    },

    counting: {
        name:     'Counting Sort',
        category: 'Non-comparison',
        best: 'O(n + k)', avg: 'O(n + k)', worst: 'O(n + k)', space: 'O(n + k)',
        description:
            'Breaks the O(n log n) lower bound by never comparing elements. Counts ' +
            'occurrences of each value, computes prefix sums to determine final positions, ' +
            'then places each element at its sorted index. Runs in linear time when the ' +
            'value range k is proportional to n.',
        pseudocode:
`procedure countingSort(arr, k):
  count  ← array of zeros, size k + 1
  for each x in arr do
    count[x] ← count[x] + 1
  for i ← 1 to k do
    count[i] ← count[i] + count[i - 1]
  output ← array, size n
  for i ← n - 1 down to 0 do
    output[count[arr[i]] - 1] ← arr[i]
    count[arr[i]] ← count[arr[i]] - 1
  return output`
    },

    radix: {
        name:     'Radix Sort',
        category: 'Non-comparison',
        best: 'O(nk)', avg: 'O(nk)', worst: 'O(nk)', space: 'O(n + k)',
        description:
            'Sorts integers digit by digit from least significant to most significant ' +
            '(LSD Radix Sort), using a stable sub-sort at each digit position. Achieves ' +
            'linear time when the number of digits k is constant. Widely used for sorting ' +
            'large sets of integers or fixed-length strings.',
        pseudocode:
`procedure radixSort(arr):
  max ← maximum element in arr
  exp ← 1
  while max / exp > 0 do
    countingSortByDigit(arr, exp)
    exp ← exp × 10

procedure countingSortByDigit(arr, exp):
  output ← array, size n
  count  ← array of zeros, size 10
  for each x in arr do
    count[(x / exp) mod 10] ← count[...] + 1
  for i ← 1 to 9 do
    count[i] ← count[i] + count[i - 1]
  for i ← n - 1 down to 0 do
    place arr[i] using count; decrement count`
    }
};

/* ─── DOM REFS ────────────────────────────────────────────────────────────────── */
const algoGrid          = document.getElementById('algo-grid');
const vizSection        = document.getElementById('viz-section');
const algosSection      = document.getElementById('algorithms');
const backBtn           = document.getElementById('back-btn');
const barsContainer     = document.getElementById('bars-container');
const speedSlider       = document.getElementById('speed-slider');
const sizeSlider        = document.getElementById('size-slider');
const speedVal          = document.getElementById('speed-val');
const sizeVal           = document.getElementById('size-val');
const btnReset          = document.getElementById('btn-reset');
const btnPlay           = document.getElementById('btn-play');
const btnStep           = document.getElementById('btn-step');

let currentAlgoKey = null;

/* ─── HERO BARS ───────────────────────────────────────────────────────────────── */
function renderHeroBars() {
    const container = document.getElementById('hero-bars');
    if (!container) return;

    // Tells the story of Bubble Sort midway through:
    // Left = sorted (green), middle = active comparison (yellow), right = unsorted (default)
    const bars = [
        { h: 10, type: 'sorted',  dur: 3.2, delay: 0.0,  to: 0.90 },
        { h: 16, type: 'sorted',  dur: 3.5, delay: 0.2,  to: 0.88 },
        { h: 23, type: 'sorted',  dur: 3.1, delay: 0.4,  to: 0.92 },
        { h: 32, type: 'sorted',  dur: 3.4, delay: 0.1,  to: 0.86 },
        { h: 41, type: 'sorted',  dur: 3.6, delay: 0.3,  to: 0.90 },
        { h: 50, type: 'sorted',  dur: 3.3, delay: 0.5,  to: 0.88 },
        { h: 58, type: 'sorted',  dur: 3.2, delay: 0.2,  to: 0.92 },
        { h: 76, type: 'compare', dur: 1.0, delay: 0.0,  to: 0.60 },
        { h: 62, type: 'compare', dur: 1.0, delay: 0.12, to: 0.60 },
        { h: 88, type: 'default', dur: 2.0, delay: 0.35, to: 0.40 },
        { h: 44, type: 'default', dur: 1.7, delay: 0.10, to: 0.50 },
        { h: 72, type: 'default', dur: 2.3, delay: 0.55, to: 0.35 },
        { h: 55, type: 'default', dur: 1.9, delay: 0.25, to: 0.45 },
        { h: 94, type: 'default', dur: 2.1, delay: 0.40, to: 0.30 },
        { h: 34, type: 'default', dur: 1.6, delay: 0.15, to: 0.55 },
        { h: 80, type: 'default', dur: 2.4, delay: 0.60, to: 0.38 },
        { h: 48, type: 'default', dur: 1.8, delay: 0.30, to: 0.48 },
        { h: 90, type: 'default', dur: 2.2, delay: 0.45, to: 0.32 },
    ];

    container.innerHTML = bars.map(b =>
        `<div class="vs-hero-bar vs-bar-${b.type}" ` +
        `style="height:${b.h}%;--dur:${b.dur}s;--delay:${b.delay}s;--to:${b.to}"></div>`
    ).join('');
}

/* ─── ALGORITHM GRID ──────────────────────────────────────────────────────────── */
function renderAlgoGrid() {
    algoGrid.innerHTML = Object.entries(ALGORITHMS).map(([key, algo]) => {
        const badgeClass = algo.category === 'Comparison'
            ? 'vs-badge-comparison'
            : 'vs-badge-noncomparison';
        return `
<div class="vs-algo-card" data-key="${key}" role="button" tabindex="0"
     aria-label="Visualize ${algo.name}">
    <div class="vs-algo-card-header">
        <span class="vs-algo-name">${algo.name}</span>
        <span class="vs-category-badge ${badgeClass}">${algo.category}</span>
    </div>
    <table class="vs-complexity-table" aria-label="Complexity of ${algo.name}">
        <tr><td>Best Case</td><td>${algo.best}</td></tr>
        <tr><td>Average</td><td>${algo.avg}</td></tr>
        <tr><td>Worst Case</td><td>${algo.worst}</td></tr>
        <tr><td>Space</td><td>${algo.space}</td></tr>
    </table>
    <div class="vs-card-footer" aria-hidden="true">
        Visualize
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9"
                  stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</div>`;
    }).join('');

    algoGrid.addEventListener('click', e => {
        const card = e.target.closest('.vs-algo-card');
        if (card) openVisualizer(card.dataset.key);
    });

    algoGrid.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            const card = e.target.closest('.vs-algo-card');
            if (card) { e.preventDefault(); openVisualizer(card.dataset.key); }
        }
    });
}

/* ─── OPEN / CLOSE VISUALIZER ────────────────────────────────────────────────── */
function openVisualizer(key) {
    const algo = ALGORITHMS[key];
    if (!algo) return;
    currentAlgoKey = key;

    // Populate header
    document.getElementById('viz-title').textContent = algo.name;
    const badge = document.getElementById('viz-category');
    badge.textContent = algo.category;
    badge.className   = 'vs-category-badge ' +
        (algo.category === 'Comparison' ? 'vs-badge-comparison' : 'vs-badge-noncomparison');

    // Populate complexity cards
    document.getElementById('cp-best').textContent  = algo.best;
    document.getElementById('cp-avg').textContent   = algo.avg;
    document.getElementById('cp-worst').textContent = algo.worst;
    document.getElementById('cp-space').textContent = algo.space;

    // Populate text
    document.getElementById('algo-description').textContent = algo.description;
    document.getElementById('pseudocode').textContent       = algo.pseudocode;

    // Reset size slider to default
    sizeSlider.value = 30;
    sizeVal.textContent = '30';

    // Init engine (generates random bars + creates algorithm generator)
    Engine.reset(key, 30);

    // Transition: hide grid, show visualizer — keep scroll position
    algosSection.classList.add('vs-hidden');
    vizSection.classList.remove('vs-hidden');
}

function closeVisualizer(options = {}) {
    const { scrollToGrid = false } = options;

    Engine.pause();
    vizSection.classList.add('vs-hidden');
    algosSection.classList.remove('vs-hidden');
    currentAlgoKey = null;

    if (scrollToGrid) {
        requestAnimationFrame(() => {
            const nav = document.getElementById('vs-nav');
            const navOffset = nav ? nav.offsetHeight : 0;
            const gridTop = algoGrid.getBoundingClientRect().top + window.scrollY;
            const targetTop = Math.max(0, gridTop - navOffset - 24);
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        });
    }
}

/* ─── BARS ────────────────────────────────────────────────────────────────────── */
function renderBars(count) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const bar = document.createElement('div');
        bar.className = 'vs-bar';
        bar.style.height = (Math.floor(Math.random() * 86) + 8) + '%';
        fragment.appendChild(bar);
    }
    barsContainer.innerHTML = '';
    barsContainer.appendChild(fragment);
}

/* ─── STATS ───────────────────────────────────────────────────────────────────── */
function resetStats() {
    document.getElementById('stat-comparisons').textContent = '0';
    document.getElementById('stat-swaps').textContent       = '0';
    document.getElementById('stat-status').textContent      = 'Ready';
}

/* ─── ALGORITHM GENERATORS ─────────────────────────────────────────────────────
   Each generator yields step objects consumed by the Engine:
     { type: 'compare', i, j }        — highlight bars i,j yellow
     { type: 'swap',    i, j }        — swap bar heights, highlight red
     { type: 'sorted',  indices: [] } — permanently mark bars green
   The generator mutates its own copy of the array in lock-step with the DOM.
   ─────────────────────────────────────────────────────────────────────────── */

function* bubbleSortGen(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            yield { type: 'compare', i: j, j: j + 1 };
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                yield { type: 'swap', i: j, j: j + 1 };
                swapped = true;
            }
        }
        yield { type: 'sorted', indices: [n - 1 - i] };
        if (!swapped) {
            const rest = Array.from({ length: n - 1 - i }, (_, k) => k);
            if (rest.length) yield { type: 'sorted', indices: rest };
            return;
        }
    }
    yield { type: 'sorted', indices: [0] };
}

function* selectionSortGen(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            yield { type: 'compare', i: minIdx, j };
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            yield { type: 'swap', i, j: minIdx };
        }
        yield { type: 'sorted', indices: [i] };
    }
    yield { type: 'sorted', indices: [n - 1] };
}

function* insertionSortGen(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        let j = i;
        while (j > 0) {
            yield { type: 'compare', i: j - 1, j };
            if (arr[j - 1] > arr[j]) {
                [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
                yield { type: 'swap', i: j - 1, j };
                j--;
            } else {
                break;
            }
        }
    }
    yield { type: 'sorted', indices: Array.from({ length: n }, (_, k) => k) };
}

function* mergeSortGen(arr) {
    // Iterative bottom-up merge sort so the generator stays flat
    const n    = arr.length;
    const aux  = arr.slice();

    for (let width = 1; width < n; width *= 2) {
        for (let lo = 0; lo < n; lo += 2 * width) {
            const mid = Math.min(lo + width, n);
            const hi  = Math.min(lo + 2 * width, n);
            // Merge arr[lo..mid) and arr[mid..hi)
            let i = lo, j = mid, k = lo;
            while (i < mid && j < hi) {
                yield { type: 'compare', i, j };
                if (arr[i] <= arr[j]) {
                    aux[k++] = arr[i++];
                } else {
                    aux[k++] = arr[j++];
                }
            }
            while (i < mid) aux[k++] = arr[i++];
            while (j < hi)  aux[k++] = arr[j++];
            // Write back and signal each changed position
            for (let x = lo; x < hi; x++) {
                if (arr[x] !== aux[x]) {
                    arr[x] = aux[x];
                    yield { type: 'write', i: x, height: aux[x] };
                }
            }
        }
    }
    yield { type: 'sorted', indices: Array.from({ length: n }, (_, k) => k) };
}

function* quickSortGen(arr) {
    const stack = [[0, arr.length - 1]];
    const sorted = new Set();

    while (stack.length) {
        const [lo, hi] = stack.pop();
        if (lo >= hi) {
            if (lo === hi) sorted.add(lo);
            continue;
        }
        // Lomuto partition
        const pivot = arr[hi];
        let   pi    = lo;
        for (let j = lo; j < hi; j++) {
            yield { type: 'compare', i: j, j: hi };
            if (arr[j] <= pivot) {
                if (pi !== j) {
                    [arr[pi], arr[j]] = [arr[j], arr[pi]];
                    yield { type: 'swap', i: pi, j };
                }
                pi++;
            }
        }
        if (pi !== hi) {
            [arr[pi], arr[hi]] = [arr[hi], arr[pi]];
            yield { type: 'swap', i: pi, j: hi };
        }
        yield { type: 'sorted', indices: [pi] };
        sorted.add(pi);
        stack.push([lo, pi - 1]);
        stack.push([pi + 1, hi]);
    }
    // Mark any stragglers (single-element partitions)
    const unsorted = Array.from({ length: arr.length }, (_, k) => k).filter(k => !sorted.has(k));
    if (unsorted.length) yield { type: 'sorted', indices: unsorted };
}

function* heapSortGen(arr) {
    const n = arr.length;

    function* heapify(size, root) {
        let largest = root;
        const l = 2 * root + 1;
        const r = 2 * root + 2;
        if (l < size) {
            yield { type: 'compare', i: l, j: largest };
            if (arr[l] > arr[largest]) largest = l;
        }
        if (r < size) {
            yield { type: 'compare', i: r, j: largest };
            if (arr[r] > arr[largest]) largest = r;
        }
        if (largest !== root) {
            [arr[root], arr[largest]] = [arr[largest], arr[root]];
            yield { type: 'swap', i: root, j: largest };
            yield* heapify(size, largest);
        }
    }

    // Build max-heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(n, i);

    // Extract
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield { type: 'swap', i: 0, j: i };
        yield { type: 'sorted', indices: [i] };
        yield* heapify(i, 0);
    }
    yield { type: 'sorted', indices: [0] };
}

function* shellSortGen(arr) {
    const n = arr.length;
    // Knuth gap sequence
    let gap = 1;
    while (gap < Math.floor(n / 3)) gap = gap * 3 + 1;

    while (gap >= 1) {
        for (let i = gap; i < n; i++) {
            let j = i;
            while (j >= gap) {
                yield { type: 'compare', i: j - gap, j };
                if (arr[j - gap] > arr[j]) {
                    [arr[j - gap], arr[j]] = [arr[j], arr[j - gap]];
                    yield { type: 'swap', i: j - gap, j };
                    j -= gap;
                } else {
                    break;
                }
            }
        }
        gap = Math.floor(gap / 3);
    }
    yield { type: 'sorted', indices: Array.from({ length: n }, (_, k) => k) };
}

function* countingSortGen(arr) {
    // Heights are integers 8–93; use exact value counting for a correct stable sort.
    const n   = arr.length;
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min + 1;

    const count = new Array(range).fill(0);
    for (const v of arr) count[Math.round(v - min)]++;

    // Prefix sums
    for (let i = 1; i < range; i++) count[i] += count[i - 1];

    const output = new Array(n);
    // Highlight comparisons as we place elements
    for (let i = n - 1; i >= 0; i--) {
        const pos = --count[Math.round(arr[i] - min)];
        output[pos] = arr[i];
        yield { type: 'compare', i, j: Math.min(n - 1, pos) };
    }

    // Write back
    for (let i = 0; i < n; i++) {
        if (arr[i] !== output[i]) {
            yield { type: 'write', i, height: output[i] };
            arr[i] = output[i];
        }
    }
    yield { type: 'sorted', indices: Array.from({ length: n }, (_, k) => k) };
}

function* radixSortGen(arr) {
    const n   = arr.length;
    const max = Math.max(...arr);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        const count  = new Array(10).fill(0);

        for (const v of arr) count[Math.floor(v / exp) % 10]++;
        for (let i = 1; i < 10; i++) count[i] += count[i - 1];

        const output = new Array(n);
        for (let i = n - 1; i >= 0; i--) {
            const digit = Math.floor(arr[i] / exp) % 10;
            const pos   = --count[digit];
            output[pos] = arr[i];
            yield { type: 'compare', i, j: Math.min(n - 1, pos) };
        }
        for (let i = 0; i < n; i++) {
            if (arr[i] !== output[i]) {
                yield { type: 'write', i, height: output[i] };
                arr[i] = output[i];
            }
        }
    }
    yield { type: 'sorted', indices: Array.from({ length: n }, (_, k) => k) };
}

const ALGO_GENERATORS = {
    bubble:    bubbleSortGen,
    selection: selectionSortGen,
    insertion: insertionSortGen,
    merge:     mergeSortGen,
    quick:     quickSortGen,
    heap:      heapSortGen,
    shell:     shellSortGen,
    counting:  countingSortGen,
    radix:     radixSortGen,
};

/* ─── SORT ENGINE ────────────────────────────────────────────────────────────────
   Consumes generator steps and mirrors them in the DOM.
   ─────────────────────────────────────────────────────────────────────────── */

const Engine = (() => {
    const PLAY_SVG  = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 3.5L13 8L5 12.5V3.5Z" fill="currentColor"/></svg>`;
    const PAUSE_SVG = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="4" y="3" width="3" height="10" rx="1" fill="currentColor"/><rect x="9" y="3" width="3" height="10" rx="1" fill="currentColor"/></svg>`;

    let _gen         = null;
    let _timerId     = null;
    let _playing     = false;
    let _done        = false;
    let _barEls      = [];
    let _comparisons = 0;
    let _swaps       = 0;

    // Speed 1 → ~550 ms/step, speed 10 → ~5 ms/step (exponential feel)
    function _delay() {
        const s = parseInt(speedSlider.value, 10);
        return Math.max(5, Math.round(550 / (s * s * 0.18 + 0.2)));
    }

    function _setStatus(txt) {
        document.getElementById('stat-status').textContent = txt;
    }
    function _updateCounters() {
        document.getElementById('stat-comparisons').textContent = _comparisons;
        document.getElementById('stat-swaps').textContent = _swaps;
    }
    function _syncPlayBtn() {
        btnPlay.innerHTML = _playing
            ? PAUSE_SVG + ' Pause'
            : PLAY_SVG  + ' Play';
    }
    function _clearTransientStates() {
        _barEls.forEach(b => {
            if (!b.dataset.sorted)
                b.classList.remove('vs-state-compare', 'vs-state-swap');
        });
    }

    function _applyStep(result) {
        if (result.done) {
            // Generator exhausted — ensure every bar is marked sorted
            _barEls.forEach(b => {
                b.classList.remove('vs-state-compare', 'vs-state-swap');
                b.classList.add('vs-state-sorted');
                b.dataset.sorted = '1';
            });
            _setStatus('Sorted!');
            _done    = true;
            _playing = false;
            _syncPlayBtn();
            return;
        }

        _clearTransientStates();
        const { type, i, j, indices, height } = result.value;

        if (type === 'compare') {
            _comparisons++;
            _updateCounters();
            _barEls[i].classList.add('vs-state-compare');
            _barEls[j].classList.add('vs-state-compare');

        } else if (type === 'swap') {
            _swaps++;
            _updateCounters();
            const tmpH = _barEls[i].style.height;
            _barEls[i].style.height = _barEls[j].style.height;
            _barEls[j].style.height = tmpH;
            _barEls[i].classList.add('vs-state-swap');
            _barEls[j].classList.add('vs-state-swap');

        } else if (type === 'write') {
            _swaps++;
            _updateCounters();
            _barEls[i].style.height = height + '%';
            _barEls[i].classList.add('vs-state-swap');

        } else if (type === 'sorted') {
            for (const idx of (indices || [])) {
                const el = _barEls[idx];
                if (!el) continue;
                el.classList.remove('vs-state-compare', 'vs-state-swap');
                el.classList.add('vs-state-sorted');
                el.dataset.sorted = '1';
            }
        }
    }

    function _scheduleNext() {
        if (!_playing || _done) return;
        _timerId = setTimeout(() => {
            if (!_playing || _done) return;
            _applyStep(_gen.next());
            _scheduleNext();
        }, _delay());
    }

    /* ── Public API ── */

    function reset(algoKey, size) {
        _playing = false;
        clearTimeout(_timerId);
        _timerId = null;

        renderBars(size);
        _barEls = Array.from(barsContainer.querySelectorAll('.vs-bar'));
        _barEls.forEach(b => {
            b.classList.remove('vs-state-compare', 'vs-state-swap', 'vs-state-sorted');
            delete b.dataset.sorted;
        });

        const arr   = _barEls.map(b => parseFloat(b.style.height));
        const genFn = ALGO_GENERATORS[algoKey];
        if (genFn) {
            _gen  = genFn([...arr]);
            _done = false;
        } else {
            _gen  = null;
            _done = true;
            _setStatus('Coming soon');
            _syncPlayBtn();
            return;
        }

        _comparisons = 0;
        _swaps       = 0;
        _updateCounters();
        _setStatus('Ready');
        _syncPlayBtn();
    }

    function play() {
        if (_done || !_gen) return;
        _playing = true;
        _syncPlayBtn();
        _setStatus('Sorting…');
        _scheduleNext();
    }

    function pause() {
        if (!_playing) return;
        _playing = false;
        clearTimeout(_timerId);
        _timerId = null;
        _syncPlayBtn();
        _setStatus('Paused');
    }

    function step() {
        if (_done || !_gen) return;
        if (_playing) pause();
        _applyStep(_gen.next());
        if (!_done) _setStatus('Paused');
    }

    function isPlaying() { return _playing; }
    function isDone()    { return _done; }

    return { reset, play, pause, step, isPlaying, isDone };
})();

/* ─── CONTROL EVENT LISTENERS ────────────────────────────────────────────────── */
speedSlider.addEventListener('input', () => {
    speedVal.textContent = speedSlider.value;
});

sizeSlider.addEventListener('input', () => {
    sizeVal.textContent = sizeSlider.value;
    if (currentAlgoKey) Engine.reset(currentAlgoKey, parseInt(sizeSlider.value, 10));
});

btnReset.addEventListener('click', () => {
    if (currentAlgoKey) Engine.reset(currentAlgoKey, parseInt(sizeSlider.value, 10));
});

btnPlay.addEventListener('click', () => {
    if (!currentAlgoKey) return;
    Engine.isPlaying() ? Engine.pause() : Engine.play();
});

btnStep.addEventListener('click', () => {
    if (!currentAlgoKey) return;
    Engine.step();
});

backBtn.addEventListener('click', () => closeVisualizer({ scrollToGrid: true }));

/* ─── INIT ────────────────────────────────────────────────────────────────────── */
renderHeroBars();
renderAlgoGrid();
