"use strict";

const TOPICS = {
  searching: {
    badge: "Searching",
    algorithms: [
      a(
        "linear",
        "Linear Search",
        "Search",
        "O(n)",
        "O(1)",
        "Scan left to right",
        "found 7",
        "Checks each item until the target appears or the array ends.",
        "for each item:\n  if item == target: return index",
        [
          "Scan from index 0",
          "Compare 4",
          "Compare 9",
          "Compare 1",
          "Compare 7",
          "Found target 7",
        ],
      ),
      a(
        "binary",
        "Binary Search",
        "Search",
        "O(log n)",
        "O(1)",
        "Halve sorted range",
        "index 6",
        "Narrows a sorted array by comparing with the middle element.",
        "while lo <= hi:\n  mid = (lo + hi) / 2\n  compare target with a[mid]",
        [
          "lo=0 hi=9",
          "mid=4 value=9 too low",
          "search right half",
          "mid=7 value=18 too high",
          "mid=6 value=13 found",
        ],
      ),
      a(
        "interpolation",
        "Interpolation Search",
        "Search",
        "Avg O(log log n)",
        "O(1)",
        "Estimate position",
        "near index 6",
        "Uses value distribution to estimate where the key should be.",
        "pos = lo + (x-a[lo])*(hi-lo)/(a[hi]-a[lo])",
        [
          "Estimate likely position",
          "Probe index 6",
          "Value is close",
          "Adjust narrow range",
          "Find target",
        ],
      ),
      a(
        "chaining",
        "Hash Table Chaining",
        "Hashing",
        "Avg O(1)",
        "O(n)",
        "Bucket chains",
        "collision stored",
        "Collisions become linked lists or buckets at each table slot.",
        "bucket = hash(key) mod m\nappend key to bucket",
        [
          "hash(18)=2",
          "slot 2 already has 10",
          "append 18 to chain",
          "lookup scans slot 2 chain",
        ],
      ),
      a(
        "open",
        "Open Addressing",
        "Hashing",
        "Avg O(1)",
        "O(1)",
        "Probe empty slots",
        "placed",
        "Stores all keys inside the table and probes until a free slot appears.",
        "i = 0\nwhile table[h(key,i)] occupied:\n  i++",
        [
          "hash key to slot 3",
          "slot occupied",
          "probe next candidate",
          "place key in free slot",
        ],
      ),
      a(
        "linearprobe",
        "Linear Probing",
        "Hashing",
        "Avg O(1)",
        "O(1)",
        "h+i",
        "cluster shown",
        "Resolves collisions by checking consecutive slots.",
        "slot = (hash(key) + i) mod m",
        ["slot 4 occupied", "try slot 5", "try slot 6", "insert at slot 6"],
      ),
      a(
        "quadratic",
        "Quadratic Probing",
        "Hashing",
        "Avg O(1)",
        "O(1)",
        "h+i^2",
        "less clustering",
        "Uses quadratic jumps to reduce primary clustering.",
        "slot = (hash(key) + i*i) mod m",
        ["slot 4 occupied", "try 5", "try 8", "insert at quadratic probe"],
      ),
      a(
        "doublehash",
        "Double Hashing",
        "Hashing",
        "Avg O(1)",
        "O(1)",
        "h1+i*h2",
        "spread probes",
        "Uses a second hash function as the probe stride.",
        "slot = (h1(key) + i*h2(key)) mod m",
        [
          "compute h1 and h2",
          "slot occupied",
          "jump by h2",
          "insert at open slot",
        ],
      ),
      a(
        "bloom",
        "Bloom Filter",
        "Hashing",
        "O(k)",
        "O(m)",
        "k hash bits",
        "maybe present",
        "Probabilistic membership structure with false positives but no false negatives.",
        "for each hash h:\n  set bit h(x)\nquery: all bits set means maybe",
        [
          "hash item to 3 bits",
          "set those bits",
          "query checks same bits",
          "all set: maybe present",
        ],
      ),
    ],
  },
  heaps: {
    badge: "Heap",
    algorithms: [
      a(
        "binaryheap",
        "Binary Min/Max Heap",
        "Heap",
        "O(1) peek",
        "O(n)",
        "Parent priority",
        "root min",
        "Maintains heap order in a compact array-backed tree.",
        "parent(i) <= child(i)",
        [
          "Array represents a complete tree",
          "Root has highest priority",
          "Children obey heap order",
        ],
      ),
      a(
        "insert",
        "Heap Insert",
        "Priority Queue",
        "O(log n)",
        "O(1)",
        "Bubble up",
        "inserted",
        "Adds a new key at the end and swaps upward until heap order returns.",
        "append key\nwhile key < parent:\n  swap with parent",
        [
          "Append 2 at next leaf",
          "Compare with parent 9",
          "Swap upward",
          "Stop below parent 1",
        ],
      ),
      a(
        "extract",
        "Extract Min/Max",
        "Priority Queue",
        "O(log n)",
        "O(1)",
        "Remove root",
        "min removed",
        "Removes the root, moves the last item to root, then heapifies downward.",
        "root = min\nmove last to root\nheapify down",
        [
          "Remove root 1",
          "Move last key to root",
          "Swap with smaller child",
          "Heap order restored",
        ],
      ),
      a(
        "decrease",
        "Decrease Key",
        "Priority Queue",
        "O(log n)",
        "O(1)",
        "Improve priority",
        "key raised",
        "Lowers a key value and bubbles it upward to its new priority position.",
        "key[i] = smaller\nbubble up from i",
        [
          "Decrease 12 to 3",
          "Compare with parent",
          "Swap upward",
          "New priority position reached",
        ],
      ),
      a(
        "heapify",
        "Heapify",
        "Heap Build",
        "O(n)",
        "O(1)",
        "Bottom-up repair",
        "heap built",
        "Builds a heap by repairing subtrees from the last parent back to the root.",
        "for i = lastParent downto 0:\n  siftDown(i)",
        [
          "Start at last parent",
          "Sift down local violation",
          "Move leftward",
          "Root repair completes heap",
        ],
      ),
      a(
        "binomial",
        "Binomial Heap",
        "Mergeable Heap",
        "O(log n)",
        "O(n)",
        "Merge trees by rank",
        "forest merged",
        "Maintains a forest of binomial trees that merge like binary addition.",
        "merge root lists\nlink equal-degree trees",
        [
          "Merge root lists",
          "Two B1 trees collide",
          "Link smaller root above",
          "Carry to next degree",
        ],
      ),
      a(
        "fibonacci",
        "Fibonacci Heap",
        "Amortized Heap",
        "Amortized O(1)",
        "O(n)",
        "Lazy consolidation",
        "decrease-key cheap",
        "Defers structural work so insert and decrease-key are very cheap amortized.",
        "decrease key\ncut node if heap order violated\nconsolidate on extract-min",
        [
          "Insert lazily into root list",
          "Decrease key cuts node",
          "Mark parent",
          "Extract-min consolidates roots",
        ],
      ),
    ],
  },
  strings: {
    badge: "String",
    algorithms: [
      a(
        "naive",
        "Naive String Matching",
        "Matching",
        "O(nm)",
        "O(1)",
        "Try every shift",
        "match found",
        "Aligns the pattern at each text position and compares characters directly.",
        "for shift in text:\n  compare pattern characters",
        [
          "Shift 0 mismatch",
          "Shift 1 mismatch",
          "Shift 2 partial match",
          "Shift 3 full match",
        ],
      ),
      a(
        "kmp",
        "Knuth-Morris-Pratt",
        "Matching",
        "O(n+m)",
        "O(m)",
        "Prefix table",
        "no backtrack",
        "Uses a prefix function to avoid rechecking text characters after mismatch.",
        "build pi table\non mismatch, jump pattern by pi",
        [
          "Build prefix table",
          "Match A B A",
          "Mismatch uses pi jump",
          "Continue without moving text backward",
        ],
      ),
      a(
        "rabin",
        "Rabin-Karp",
        "Hash Matching",
        "Expected O(n+m)",
        "O(1)",
        "Rolling hash",
        "hash hit",
        "Compares rolling hashes, then verifies exact characters on hash hits.",
        "hash pattern\nroll text hash\nverify if hashes match",
        [
          "Compute pattern hash",
          "Roll window hash",
          "Hash mismatch skip",
          "Hash match verify characters",
        ],
      ),
      a(
        "boyer",
        "Boyer-Moore",
        "Matching",
        "Sublinear often",
        "O(alphabet)",
        "Bad character shift",
        "large skip",
        "Scans pattern from right to left and jumps over impossible alignments.",
        "compare from pattern end\nshift by bad-character/good-suffix rule",
        [
          "Compare rightmost char",
          "Bad character mismatch",
          "Shift pattern several places",
          "Verify final alignment",
        ],
      ),
      a(
        "trie",
        "Trie",
        "Prefix Tree",
        "O(L)",
        "O(total chars)",
        "Character edges",
        "prefix found",
        "Stores strings by shared prefixes for fast lookup and prefix queries.",
        "for char in word:\n  follow or create child",
        ["Insert C", "Create A edge", "Share T prefix", "Mark word end"],
      ),
      a(
        "suffixtrie",
        "Suffix Trie",
        "Indexing",
        "O(n^2)",
        "O(n^2)",
        "All suffixes",
        "substring query",
        "Stores every suffix so substring queries become path walks.",
        "insert every suffix text[i..n]",
        [
          "Insert BANANA",
          "Insert ANANA",
          "Insert NANA",
          "Query ANA path exists",
        ],
      ),
      a(
        "suffixarray",
        "Suffix Array",
        "Indexing",
        "O(n log n)",
        "O(n)",
        "Sorted suffixes",
        "range located",
        "Sorts suffix starting positions to support binary search over substrings.",
        "sort suffixes\nbinary search pattern among suffixes",
        [
          "List suffixes",
          "Sort lexicographically",
          "Binary search pattern",
          "Return matching interval",
        ],
      ),
      a(
        "aho",
        "Aho-Corasick",
        "Multi-pattern",
        "O(n + matches)",
        "O(total chars)",
        "Automaton failures",
        "multiple hits",
        "Combines a trie with failure links to search many patterns at once.",
        "build trie\nbuild failure links\nscan text with automaton",
        [
          "Build pattern trie",
          "Add failure links",
          "Scan text char by char",
          "Emit all matched patterns",
        ],
      ),
    ],
  },
  divide: {
    badge: "D&C",
    algorithms: [
      a(
        "binary",
        "Binary Search",
        "Search",
        "O(log n)",
        "O(1)",
        "Split sorted range",
        "found",
        "A divide-and-conquer view of halving a sorted search interval.",
        "search(lo, hi):\n  mid = (lo+hi)/2\n  recurse left or right",
        [
          "Split full array",
          "Discard right half",
          "Split left half",
          "Base case contains target",
        ],
      ),
      a(
        "mergetree",
        "Merge Sort Recursion Tree",
        "Sorting",
        "O(n log n)",
        "O(n)",
        "Split then merge",
        "sorted",
        "Shows merge sort as a recursion tree of splits followed by ordered merges.",
        "split array in half\nsort halves\nmerge sorted halves",
        [
          "Split 8 items",
          "Split into size 2",
          "Base cases size 1",
          "Merge upward",
        ],
      ),
      a(
        "quickselect",
        "Quickselect",
        "Selection",
        "Avg O(n)",
        "O(1)",
        "Partition around pivot",
        "kth found",
        "Partitions like quicksort but recurses only into the side containing k.",
        "partition by pivot\nrecurse only where k lies",
        [
          "Pick pivot",
          "Partition lows/highs",
          "k lies left",
          "Recurse only left side",
        ],
      ),
      a(
        "closestpair",
        "Closest Pair of Points",
        "Geometry",
        "O(n log n)",
        "O(n)",
        "Split plane",
        "closest pair",
        "Splits points by x-coordinate and checks a narrow strip around the midpoint.",
        "solve left and right\ncheck strip within delta",
        [
          "Sort by x",
          "Solve left half",
          "Solve right half",
          "Check middle strip",
        ],
      ),
      a(
        "karatsuba",
        "Karatsuba Multiplication",
        "Arithmetic",
        "O(n^1.585)",
        "O(n)",
        "3 recursive products",
        "product combined",
        "Reduces four half-size multiplications to three by algebraic recombination.",
        "z0 = low products\nz2 = high products\nz1 = (a+b)(c+d)-z0-z2",
        [
          "Split numbers",
          "Compute z0",
          "Compute z2",
          "Compute cross term z1",
          "Combine by powers of base",
        ],
      ),
      a(
        "strassen",
        "Strassen Matrix Multiplication",
        "Matrix",
        "O(n^2.807)",
        "O(n^2)",
        "7 products",
        "matrix product",
        "Replaces eight block multiplications with seven clever combinations.",
        "partition matrices\ncompute M1..M7\ncombine quadrants",
        [
          "Split matrices into quadrants",
          "Compute seven products",
          "Combine C quadrants",
          "Return product matrix",
        ],
      ),
    ],
  },
  geometry: {
    badge: "Geometry",
    algorithms: [
      a(
        "graham",
        "Convex Hull: Graham Scan",
        "Hull",
        "O(n log n)",
        "O(n)",
        "Sort by angle",
        "hull found",
        "Sorts points around an anchor and uses orientation tests to keep only left turns.",
        "sort by polar angle\npush point\nwhile right turn: pop",
        [
          "Choose lowest point",
          "Sort by angle",
          "Push next point",
          "Pop right turn",
          "Hull complete",
        ],
      ),
      a(
        "jarvis",
        "Convex Hull: Jarvis March",
        "Hull",
        "O(nh)",
        "O(h)",
        "Gift wrapping",
        "hull wrapped",
        "Walks around the outside by repeatedly choosing the most counterclockwise point.",
        "start leftmost\nrepeat choose most CCW point",
        [
          "Start at leftmost",
          "Scan all candidates",
          "Choose outermost turn",
          "Wrap to start",
        ],
      ),
      a(
        "segments",
        "Line Segment Intersection",
        "Sweep/Predicate",
        "O(1) pair",
        "O(1)",
        "Orientation tests",
        "intersects",
        "Uses orientation predicates to decide whether two segments cross.",
        "check orientations o1,o2,o3,o4\nsegments cross if signs differ",
        [
          "Compute orientation 1",
          "Compute orientation 2",
          "Signs differ",
          "Segments intersect",
        ],
      ),
      a(
        "sweep",
        "Sweep Line Basics",
        "Sweep Line",
        "O((n+k)log n)",
        "O(n)",
        "Event order",
        "events handled",
        "Moves a vertical line across sorted events while maintaining active objects.",
        "sort events by x\nupdate active set\ncheck neighbors",
        [
          "Sort left/right endpoints",
          "Enter segment",
          "Check active neighbors",
          "Report crossing event",
        ],
      ),
      a(
        "closest",
        "Closest Pair",
        "Distance",
        "O(n log n)",
        "O(n)",
        "Strip check",
        "minimum pair",
        "Geometry version of divide-and-conquer closest pair with a bounded strip scan.",
        "split by x\nmin left/right\nscan y-sorted strip",
        [
          "Split points",
          "Compute left delta",
          "Compute right delta",
          "Compare strip neighbors",
        ],
      ),
      a(
        "voronoi",
        "Voronoi / Delaunay",
        "Spatial Partition",
        "Advanced",
        "O(n)",
        "Dual diagrams",
        "cells sketched",
        "Introduces Voronoi cells and their Delaunay triangulation dual relationship.",
        "construct regions nearest to each site\nconnect neighboring sites for Delaunay",
        [
          "Place sites",
          "Grow nearest-site cells",
          "Find shared cell borders",
          "Connect dual triangulation edges",
        ],
      ),
    ],
  },
};

function a(
  key,
  name,
  category,
  time,
  space,
  idea,
  result,
  description,
  pseudocode,
  messages,
) {
  return {
    key,
    name,
    category,
    time,
    space,
    idea,
    result,
    description,
    pseudocode,
    messages,
  };
}

const topicEl = document.getElementById("textbook-section");
const topicKey = topicEl ? topicEl.dataset.topic : "";
const topic = TOPICS[topicKey];

const refs = {
  grid: document.getElementById("topic-grid"),
  list: topicEl,
  viz: document.getElementById("topic-viz-section"),
  stage: document.getElementById("topic-stage"),
  back: document.getElementById("topic-back-btn"),
  title: document.getElementById("topic-title"),
  category: document.getElementById("topic-category"),
  active: document.getElementById("topic-stat-active"),
  steps: document.getElementById("topic-stat-steps"),
  status: document.getElementById("topic-stat-status"),
  speed: document.getElementById("topic-speed"),
  speedVal: document.getElementById("topic-speed-val"),
  size: document.getElementById("topic-size"),
  sizeVal: document.getElementById("topic-size-val"),
  play: document.getElementById("topic-play"),
  step: document.getElementById("topic-step"),
  reset: document.getElementById("topic-reset"),
  log: document.getElementById("topic-log"),
  pseudocode: document.getElementById("topic-pseudocode"),
  inputPanel: null,
};

let current = null;
let steps = [];
let stepIndex = 0;
let timerId = null;
let playing = false;
let inputMode = "random";
let manualOptions = null;

const INPUT_CONFIGS = {
  searching: {
    linear: fields([
      { name: "values", label: "Array", value: "4,9,1,7,11,13,18,21" },
      { name: "target", label: "Target", value: "7" },
    ]),
    binary: fields([
      {
        name: "values",
        label: "Sorted Array",
        value: "1,3,5,7,9,11,13,18,21,27",
      },
      { name: "target", label: "Target", value: "13" },
    ]),
    interpolation: fields([
      {
        name: "values",
        label: "Sorted Array",
        value: "2,5,8,11,14,17,20,23,26",
      },
      { name: "target", label: "Target", value: "20" },
    ]),
    chaining: fields([
      { name: "values", label: "Keys", value: "8,10,18,12" },
      { name: "tableSize", label: "Table Size", value: "5" },
    ]),
    open: hashFields(),
    linearprobe: hashFields(),
    quadratic: hashFields(),
    doublehash: fields([
      { name: "keyValue", label: "Key", value: "18" },
      { name: "h1", label: "h1", value: "4" },
      { name: "h2", label: "h2", value: "3" },
    ]),
    bloom: fields([{ name: "keyValue", label: "Query", value: "42" }]),
  },
  heaps: {
    binaryheap: heapFields(),
    insert: fields([
      { name: "heap", label: "Heap", value: "1,3,5,9,8,12,10" },
      { name: "keyValue", label: "Insert Key", value: "2" },
    ]),
    extract: heapFields(),
    decrease: fields([
      { name: "heap", label: "Heap", value: "1,3,5,9,8,12,10" },
      { name: "keyValue", label: "New Key", value: "0" },
    ]),
    heapify: heapFields("9,3,5,1,8,12,10"),
    binomial: heapFields(),
    fibonacci: fields([
      { name: "heap", label: "Heap", value: "1,3,5,9,8,12,10" },
      { name: "keyValue", label: "Decrease Key", value: "0" },
    ]),
  },
  strings: {
    naive: textPatternFields(),
    kmp: textPatternFields(),
    rabin: textPatternFields(),
    boyer: textPatternFields(),
    trie: fields([{ name: "words", label: "Words", value: "CAT,CAR,CART" }]),
    suffixtrie: fields([
      { name: "text", label: "Text", value: "BANANA" },
      { name: "pattern", label: "Query", value: "ANA" },
    ]),
    suffixarray: fields([
      { name: "text", label: "Text", value: "BANANA" },
      { name: "pattern", label: "Query", value: "ANA" },
    ]),
    aho: fields([
      { name: "text", label: "Text", value: "ushers" },
      { name: "words", label: "Patterns", value: "she,he,hers" },
    ]),
  },
  divide: {
    binary: fields([
      {
        name: "values",
        label: "Sorted Array",
        value: "1,3,5,7,9,11,13,18,21,27",
      },
      { name: "target", label: "Target", value: "13" },
    ]),
    mergetree: fields([
      { name: "values", label: "Array", value: "8,3,7,1,9,2" },
    ]),
    quickselect: fields([
      { name: "values", label: "Array", value: "8,3,7,1,9,2" },
      { name: "k", label: "k", value: "3" },
    ]),
    closestpair: pointFields("1:1,2:2,5:8,6:9"),
    karatsuba: fields([
      { name: "left", label: "Left", value: "1234" },
      { name: "right", label: "Right", value: "5678" },
    ]),
    strassen: fields([
      { name: "matrixA", label: "Matrix A", value: "1,2;3,4" },
      { name: "matrixB", label: "Matrix B", value: "5,6;7,8" },
    ]),
  },
  geometry: {
    graham: pointFields(),
    jarvis: pointFields(),
    segments: pointFields("0:0,4:4,0:4,4:0"),
    sweep: pointFields("0:0,4:4,0:4,4:0"),
    closest: pointFields("1:1,2:2,5:8,6:9"),
    voronoi: pointFields("0:0,4:0,2:3,6:4"),
  },
};

function topicItemCount() {
  return parseInt(refs.size.value, 10) || 8;
}

function fields(items) {
  return { fields: items };
}
function hashFields() {
  return fields([{ name: "keyValue", label: "Key", value: "18" }]);
}
function heapFields(value = "1,3,5,9,8,12,10") {
  return fields([{ name: "heap", label: "Heap", value }]);
}
function textPatternFields() {
  return fields([
    { name: "text", label: "Text", value: "ABABACABA" },
    { name: "pattern", label: "Pattern", value: "ABA" },
  ]);
}
function pointFields(value = "0:0,4:0,4:3,0:3,2:1") {
  return fields([{ name: "points", label: "Points x:y", value }]);
}

function numbersFrom(value) {
  const parts = value
    .split(/[,\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) throw new Error("Enter at least one number.");
  const numbers = parts.map(Number);
  if (numbers.some((number) => !Number.isFinite(number)))
    throw new Error("Use numbers separated by commas.");
  return numbers;
}

function numberFrom(value, label, min = -Infinity, max = Infinity) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max)
    throw new Error(`${label} is not valid.`);
  return number;
}

function wordsFrom(value) {
  const words = value
    .split(/[,\s]+/)
    .map((word) => word.trim())
    .filter(Boolean);
  if (!words.length) throw new Error("Enter at least one word.");
  return words;
}

function pointsFrom(value, minCount = 2) {
  const points = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [x, y] = part.split(":").map(Number);
      if (!Number.isFinite(x) || !Number.isFinite(y))
        throw new Error("Use points like 0:0,4:3.");
      return { x, y };
    });
  if (points.length < minCount)
    throw new Error(`Enter at least ${minCount} points.`);
  return points;
}

function matrixFrom(value) {
  const rows = value.split(";").map((row) => row.split(",").map(Number));
  if (
    rows.length !== 2 ||
    rows.some(
      (row) =>
        row.length !== 2 || row.some((number) => !Number.isFinite(number)),
    )
  )
    throw new Error("Use a 2x2 matrix like 1,2;3,4.");
  return rows;
}

function ensureInputPanel() {
  if (refs.inputPanel) return;
  refs.inputPanel = document.createElement("div");
  refs.inputPanel.className = "vs-input-panel";
  const controls = refs.viz.querySelector(".vs-controls");
  controls.parentNode.insertBefore(refs.inputPanel, controls);
}

function renderInputPanel() {
  ensureInputPanel();
  const config = INPUT_CONFIGS[topicKey][current.key];
  refs.inputPanel.innerHTML = `
        <div class="vs-input-grid">
            ${config.fields
              .map(
                (field) => `
                <label class="vs-input-label">
                    <span>${field.label}</span>
                    <input class="vs-manual-input" data-input="${field.name}" value="${field.value}" />
                </label>
            `,
              )
              .join("")}
        </div>
        <div class="vs-input-actions">
            <button class="vs-ctrl-btn vs-ctrl-btn-primary" data-input-action="apply" type="button">Apply</button>
            <button class="vs-ctrl-btn" data-input-action="random" type="button">Random</button>
            <button class="vs-ctrl-btn" data-input-action="sample" type="button">Sample</button>
        </div>
        <p class="vs-input-error" role="alert" aria-live="polite"></p>
    `;
}

function inputValue(name) {
  return refs.inputPanel.querySelector(`[data-input="${name}"]`).value.trim();
}

function setInputError(message) {
  refs.inputPanel.querySelector(".vs-input-error").textContent = message || "";
}

function requireSorted(values) {
  const isSorted = globalThis.AlgorithmCore
    ? globalThis.AlgorithmCore.util.isSortedAscending(values)
    : values.every((value, index) => index === 0 || values[index - 1] <= value);
  if (!isSorted)
    throw new Error("This algorithm needs the array sorted ascending.");
}

function collectManualOptions() {
  if (topicKey === "searching") return collectSearchOptions();
  if (topicKey === "heaps") return collectHeapOptions();
  if (topicKey === "strings") return collectStringOptions();
  if (topicKey === "divide") return collectDivideOptions();
  if (topicKey === "geometry") return collectGeometryOptions();
  return {};
}

function collectSearchOptions() {
  if (["linear", "binary", "interpolation"].includes(current.key)) {
    const values = numbersFrom(inputValue("values"));
    if (current.key !== "linear") requireSorted(values);
    return { values, target: numberFrom(inputValue("target"), "Target") };
  }
  if (current.key === "chaining")
    return {
      values: numbersFrom(inputValue("values")),
      tableSize: numberFrom(inputValue("tableSize"), "Table size", 2, 31),
    };
  const options = { keyValue: numberFrom(inputValue("keyValue"), "Key") };
  if (current.key === "doublehash") {
    options.h1 = numberFrom(inputValue("h1"), "h1", 0, 99);
    options.h2 = numberFrom(inputValue("h2"), "h2", 1, 99);
  }
  return options;
}

function collectHeapOptions() {
  const options = { heap: numbersFrom(inputValue("heap")) };
  if (["insert", "decrease", "fibonacci"].includes(current.key))
    options.keyValue = numberFrom(inputValue("keyValue"), "Key");
  return options;
}

function collectStringOptions() {
  if (
    ["naive", "kmp", "rabin", "boyer", "suffixtrie", "suffixarray"].includes(
      current.key,
    )
  ) {
    const text = inputValue("text");
    const pattern = inputValue("pattern");
    if (!text || !pattern) throw new Error("Text and pattern are required.");
    if (pattern.length > text.length)
      throw new Error("Pattern cannot be longer than text.");
    return { text, pattern };
  }
  if (current.key === "trie") return { words: wordsFrom(inputValue("words")) };
  if (current.key === "aho")
    return { text: inputValue("text"), words: wordsFrom(inputValue("words")) };
  return {};
}

function collectDivideOptions() {
  if (current.key === "binary") {
    const values = numbersFrom(inputValue("values"));
    requireSorted(values);
    return { values, target: numberFrom(inputValue("target"), "Target") };
  }
  if (current.key === "mergetree")
    return { values: numbersFrom(inputValue("values")) };
  if (current.key === "quickselect") {
    const values = numbersFrom(inputValue("values"));
    return { values, k: numberFrom(inputValue("k"), "k", 1, values.length) };
  }
  if (current.key === "closestpair")
    return { points: pointsFrom(inputValue("points"), 2) };
  if (current.key === "karatsuba")
    return {
      left: numberFrom(inputValue("left"), "Left"),
      right: numberFrom(inputValue("right"), "Right"),
    };
  if (current.key === "strassen")
    return {
      matrixA: matrixFrom(inputValue("matrixA")),
      matrixB: matrixFrom(inputValue("matrixB")),
    };
  return {};
}

function collectGeometryOptions() {
  const minPoints =
    current.key === "segments" || current.key === "sweep"
      ? 4
      : current.key === "closest"
        ? 2
        : 3;
  return { points: pointsFrom(inputValue("points"), minPoints) };
}

function runOptions() {
  if (inputMode === "manual") return manualOptions || {};
  return { size: topicItemCount(), randomize: inputMode === "random" };
}

function renderGrid() {
  if (!topic) return;
  refs.grid.innerHTML = topic.algorithms
    .map(
      (algo) => `
<div class="vs-algo-card" data-key="${algo.key}" role="button" tabindex="0" aria-label="Visualize ${algo.name}">
    <div class="vs-algo-card-header">
        <span class="vs-algo-name">${algo.name}</span>
        <span class="vs-category-badge vs-badge-topic">${algo.category}</span>
    </div>
    <table class="vs-complexity-table" aria-label="Complexity of ${algo.name}">
        <tr><td>Time</td><td>${algo.time}</td></tr>
        <tr><td>Space</td><td>${algo.space}</td></tr>
        <tr><td>Idea</td><td>${algo.idea}</td></tr>
        <tr><td>Result</td><td>${algo.result}</td></tr>
    </table>
    <div class="vs-card-footer" aria-hidden="true">Visualize</div>
</div>`,
    )
    .join("");
  refs.grid.addEventListener("click", (event) => {
    const card = event.target.closest(".vs-algo-card");
    if (card) openAlgorithm(card.dataset.key);
  });
  refs.grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".vs-algo-card");
    if (!card) return;
    event.preventDefault();
    openAlgorithm(card.dataset.key);
  });
}

function openAlgorithm(key) {
  current = topic.algorithms.find((algo) => algo.key === key);
  refs.title.textContent = current.name;
  refs.category.textContent = current.category;
  document.getElementById("topic-cp-time").textContent = current.time;
  document.getElementById("topic-cp-space").textContent = current.space;
  document.getElementById("topic-cp-idea").textContent = current.idea;
  document.getElementById("topic-cp-result").textContent = current.result;
  document.getElementById("topic-description").textContent =
    current.description;
  refs.pseudocode.textContent = current.pseudocode;
  inputMode = "random";
  manualOptions = null;
  renderInputPanel();
  setInputError("");
  refs.list.classList.add("vs-hidden");
  refs.viz.classList.remove("vs-hidden");
  buildSteps();
}

function buildSteps() {
  pause();
  refs.log.innerHTML = "";
  if (globalThis.AlgorithmCore) {
    const result = globalThis.AlgorithmCore.topics.run(
      topicKey,
      current.key,
      runOptions(),
    );
    steps = result.steps.map((step) => ({
      message: step.message,
      caption: step.caption || current.idea,
      items: step.items.map((item, i) => ({
        label: item.label,
        meta: item.meta,
        state:
          item.state === "chosen"
            ? "good"
            : item.state === "reject"
              ? "bad"
              : item.state || (i === 0 ? "active" : ""),
      })),
    }));
    steps.push({
      message: `${current.name} walkthrough complete`,
      items: steps[steps.length - 1].items.map((item) => ({
        ...item,
        state: item.state === "bad" ? "bad" : "good",
      })),
      caption: String(result.answer),
    });
    steps = [queuedStep(steps[0]), ...steps];
    document.getElementById("topic-cp-result").textContent = formatAnswer(
      result.answer,
    );
    stepIndex = 0;
    renderStep(steps[0]);
    return;
  }
  const base = makeItems(current, topicItemCount());
  steps = current.messages.map((message, index) => {
    const items = base.map((item, i) => {
      const next = { ...item, state: i < index ? "good" : "" };
      if (i === index) next.state = "active";
      if (message.toLowerCase().includes("reject") && i === index)
        next.state = "bad";
      return next;
    });
    return { message, items, caption: current.idea };
  });
  steps.push({
    message: `${current.name} walkthrough complete`,
    items: base.map((item) => ({ ...item, state: "good" })),
    caption: current.result,
  });
  steps = [queuedStep(steps[0]), ...steps];
  stepIndex = 0;
  renderStep(steps[0]);
}

function queuedStep(firstStep) {
  return {
    message: "Queued. Press Play to start.",
    items: firstStep.items.map((item) => ({ ...item, state: "" })),
    caption: firstStep.caption,
  };
}

function formatAnswer(answer) {
  if (Array.isArray(answer))
    return answer
      .map((item) =>
        Array.isArray(item) ? `[${item.join(", ")}]` : String(item),
      )
      .join(", ");
  if (answer && typeof answer === "object") return JSON.stringify(answer);
  return String(answer);
}

function makeItems(algo, size = 8) {
  const labels = {
    searching: ["0:4", "1:9", "2:1", "3:7", "4:11", "5:13", "6:18", "7:21"],
    heaps: [
      "root",
      "parent",
      "left child",
      "right child",
      "leaf",
      "swap path",
      "root list",
    ],
    strings: [
      "text window",
      "pattern",
      "prefix/hash",
      "mismatch",
      "shift",
      "match",
      "output",
    ],
    divide: [
      "problem",
      "left half",
      "right half",
      "base case",
      "combine",
      "answer",
    ],
    geometry: [
      "point A",
      "point B",
      "edge",
      "turn test",
      "candidate",
      "active set",
      "result",
    ],
  }[topicKey] || ["candidate"];
  const expanded = [...labels];
  while (expanded.length < size)
    expanded.push(`${algo.category.toLowerCase()} ${expanded.length + 1}`);
  return expanded.slice(0, size).map((label, i) => ({
    label,
    meta: `${algo.name.split(" ")[0]} step ${i + 1}`,
    state: "",
  }));
}

function renderStep(step) {
  refs.status.textContent = step.message;
  refs.steps.textContent = stepIndex;
  refs.active.textContent = step.items.filter(
    (item) => item.state === "good",
  ).length;
  refs.stage.innerHTML = `<div class="vs-topic-list">${step.items.map(renderItem).join("")}</div><p class="vs-topic-caption">${step.caption}</p>`;
  renderLog(step.message);
}

function renderItem(item) {
  const cls = item.state ? `vs-topic-item-${item.state}` : "";
  return `<div class="vs-topic-item ${cls}"><span class="vs-topic-title">${item.label}</span><span class="vs-topic-meta">${item.meta}</span></div>`;
}

function renderLog(message) {
  const li = document.createElement("li");
  li.textContent = message;
  refs.log.prepend(li);
  while (refs.log.children.length > 8) refs.log.lastChild.remove();
}

function delay() {
  const s = parseInt(refs.speed.value, 10);
  return Math.max(35, Math.round(650 / (s * s * 0.16 + 0.35)));
}
function syncPlay() {
  refs.play.textContent = playing ? "Pause" : "Play";
}
function pause() {
  playing = false;
  clearInterval(timerId);
  timerId = null;
  syncPlay();
}
function advance() {
  if (stepIndex >= steps.length - 1) {
    pause();
    refs.status.textContent = "Done";
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

if (topic) {
  refs.back.addEventListener("click", () => {
    pause();
    refs.viz.classList.add("vs-hidden");
    refs.list.classList.remove("vs-hidden");
  });
  refs.reset.addEventListener("click", buildSteps);
  refs.play.addEventListener("click", () => (playing ? pause() : play()));
  refs.step.addEventListener("click", () => {
    pause();
    advance();
  });
  refs.speed.addEventListener("input", () => {
    refs.speedVal.textContent = refs.speed.value;
    if (playing) {
      pause();
      play();
    }
  });
  refs.size.addEventListener("input", () => {
    refs.sizeVal.textContent = refs.size.value;
    if (current && inputMode !== "manual") buildSteps();
  });
  refs.viz.addEventListener("click", (event) => {
    const action = event.target.closest("[data-input-action]")?.dataset
      .inputAction;
    if (!action || !current) return;
    if (action === "apply") {
      try {
        manualOptions = collectManualOptions();
        inputMode = "manual";
        setInputError("");
        buildSteps();
      } catch (error) {
        pause();
        setInputError(error.message);
      }
    } else {
      inputMode = action;
      manualOptions = null;
      setInputError("");
      buildSteps();
    }
  });
  renderGrid();
}
