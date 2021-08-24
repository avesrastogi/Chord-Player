// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/@tonaljs/core/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coordToInterval = coordToInterval;
exports.coordToNote = coordToNote;
exports.decode = decode;
exports.deprecate = deprecate;
exports.distance = distance;
exports.encode = encode;
exports.interval = interval;
exports.isNamed = isNamed;
exports.isPitch = isPitch;
exports.note = note;
exports.tokenizeInterval = tokenizeInterval;
exports.tokenizeNote = tokenizeNote;
exports.transpose = transpose;
exports.stepToLetter = exports.fillStr = exports.altToAcc = exports.accToAlt = void 0;

/**
 * Fill a string with a repeated character
 *
 * @param character
 * @param repetition
 */
const fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);

exports.fillStr = fillStr;

function deprecate(original, alternative, fn) {
  return function (...args) {
    // tslint:disable-next-line
    console.warn(`${original} is deprecated. Use ${alternative}.`);
    return fn.apply(this, args);
  };
}

function isNamed(src) {
  return src !== null && typeof src === "object" && typeof src.name === "string" ? true : false;
}

function isPitch(pitch) {
  return pitch !== null && typeof pitch === "object" && typeof pitch.step === "number" && typeof pitch.alt === "number" ? true : false;
} // The number of fifths of [C, D, E, F, G, A, B]


const FIFTHS = [0, 2, 4, -1, 1, 3, 5]; // The number of octaves it span each step

const STEPS_TO_OCTS = FIFTHS.map(fifths => Math.floor(fifths * 7 / 12));

function encode(pitch) {
  const {
    step,
    alt,
    oct,
    dir = 1
  } = pitch;
  const f = FIFTHS[step] + 7 * alt;

  if (oct === undefined) {
    return [dir * f];
  }

  const o = oct - STEPS_TO_OCTS[step] - 4 * alt;
  return [dir * f, dir * o];
} // We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ["F", "C", "G", "D", "A", "E", "B"] we have:


const FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];

function decode(coord) {
  const [f, o, dir] = coord;
  const step = FIFTHS_TO_STEPS[unaltered(f)];
  const alt = Math.floor((f + 1) / 7);

  if (o === undefined) {
    return {
      step,
      alt,
      dir
    };
  }

  const oct = o + 4 * alt + STEPS_TO_OCTS[step];
  return {
    step,
    alt,
    oct,
    dir
  };
} // Return the number of fifths as if it were unaltered


function unaltered(f) {
  const i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
}

const NoNote = {
  empty: true,
  name: "",
  pc: "",
  acc: ""
};
const cache = new Map();

const stepToLetter = step => "CDEFGAB".charAt(step);

exports.stepToLetter = stepToLetter;

const altToAcc = alt => alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);

exports.altToAcc = altToAcc;

const accToAlt = acc => acc[0] === "b" ? -acc.length : acc.length;
/**
 * Given a note literal (a note name or a note object), returns the Note object
 * @example
 * note('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
 */


exports.accToAlt = accToAlt;

function note(src) {
  const cached = cache.get(src);

  if (cached) {
    return cached;
  }

  const value = typeof src === "string" ? parse(src) : isPitch(src) ? note(pitchName(src)) : isNamed(src) ? note(src.name) : NoNote;
  cache.set(src, value);
  return value;
}

const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
/**
 * @private
 */

function tokenizeNote(str) {
  const m = REGEX.exec(str);
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}
/**
 * @private
 */


function coordToNote(noteCoord) {
  return note(decode(noteCoord));
}

const mod = (n, m) => (n % m + m) % m;

const SEMI = [0, 2, 4, 5, 7, 9, 11];

function parse(noteName) {
  const tokens = tokenizeNote(noteName);

  if (tokens[0] === "" || tokens[3] !== "") {
    return NoNote;
  }

  const letter = tokens[0];
  const acc = tokens[1];
  const octStr = tokens[2];
  const step = (letter.charCodeAt(0) + 3) % 7;
  const alt = accToAlt(acc);
  const oct = octStr.length ? +octStr : undefined;
  const coord = encode({
    step,
    alt,
    oct
  });
  const name = letter + acc + octStr;
  const pc = letter + acc;
  const chroma = (SEMI[step] + alt + 120) % 12;
  const height = oct === undefined ? mod(SEMI[step] + alt, 12) - 12 * 99 : SEMI[step] + alt + 12 * (oct + 1);
  const midi = height >= 0 && height <= 127 ? height : null;
  const freq = oct === undefined ? null : Math.pow(2, (height - 69) / 12) * 440;
  return {
    empty: false,
    acc,
    alt,
    chroma,
    coord,
    freq,
    height,
    letter,
    midi,
    name,
    oct,
    pc,
    step
  };
}

function pitchName(props) {
  const {
    step,
    alt,
    oct
  } = props;
  const letter = stepToLetter(step);

  if (!letter) {
    return "";
  }

  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
}

const NoInterval = {
  empty: true,
  name: "",
  acc: ""
}; // shorthand tonal notation (with quality after number)

const INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})"; // standard shorthand notation (with quality before number)

const INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
const REGEX$1 = new RegExp("^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$");
/**
 * @private
 */

function tokenizeInterval(str) {
  const m = REGEX$1.exec(`${str}`);

  if (m === null) {
    return ["", ""];
  }

  return m[1] ? [m[1], m[2]] : [m[4], m[3]];
}

const cache$1 = {};
/**
 * Get interval properties. It returns an object with:
 *
 * - name: the interval name
 * - num: the interval number
 * - type: 'perfectable' or 'majorable'
 * - q: the interval quality (d, m, M, A)
 * - dir: interval direction (1 ascending, -1 descending)
 * - simple: the simplified number
 * - semitones: the size in semitones
 * - chroma: the interval chroma
 *
 * @param {string} interval - the interval name
 * @return {Object} the interval properties
 *
 * @example
 * import { interval } from '@tonaljs/core'
 * interval('P5').semitones // => 7
 * interval('m3').type // => 'majorable'
 */

function interval(src) {
  return typeof src === "string" ? cache$1[src] || (cache$1[src] = parse$1(src)) : isPitch(src) ? interval(pitchName$1(src)) : isNamed(src) ? interval(src.name) : NoInterval;
}

const SIZES = [0, 2, 4, 5, 7, 9, 11];
const TYPES = "PMMPPMM";

function parse$1(str) {
  const tokens = tokenizeInterval(str);

  if (tokens[0] === "") {
    return NoInterval;
  }

  const num = +tokens[0];
  const q = tokens[1];
  const step = (Math.abs(num) - 1) % 7;
  const t = TYPES[step];

  if (t === "M" && q === "P") {
    return NoInterval;
  }

  const type = t === "M" ? "majorable" : "perfectable";
  const name = "" + num + q;
  const dir = num < 0 ? -1 : 1;
  const simple = num === 8 || num === -8 ? num : dir * (step + 1);
  const alt = qToAlt(type, q);
  const oct = Math.floor((Math.abs(num) - 1) / 7);
  const semitones = dir * (SIZES[step] + alt + 12 * oct);
  const chroma = (dir * (SIZES[step] + alt) % 12 + 12) % 12;
  const coord = encode({
    step,
    alt,
    oct,
    dir
  });
  return {
    empty: false,
    name,
    num,
    q,
    step,
    alt,
    dir,
    type,
    simple,
    semitones,
    chroma,
    coord,
    oct
  };
}
/**
 * @private
 */


function coordToInterval(coord) {
  const [f, o = 0] = coord;
  const isDescending = f * 7 + o * 12 < 0;
  const ivl = isDescending ? [-f, -o, -1] : [f, o, 1];
  return interval(decode(ivl));
}

function qToAlt(type, q) {
  return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
} // return the interval name of a pitch


function pitchName$1(props) {
  const {
    step,
    alt,
    oct = 0,
    dir
  } = props;

  if (!dir) {
    return "";
  }

  const num = step + 1 + 7 * oct;
  const d = dir < 0 ? "-" : "";
  const type = TYPES[step] === "M" ? "majorable" : "perfectable";
  const name = d + num + altToQ(type, alt);
  return name;
}

function altToQ(type, alt) {
  if (alt === 0) {
    return type === "majorable" ? "M" : "P";
  } else if (alt === -1 && type === "majorable") {
    return "m";
  } else if (alt > 0) {
    return fillStr("A", alt);
  } else {
    return fillStr("d", type === "perfectable" ? alt : alt + 1);
  }
}
/**
 * Transpose a note by an interval.
 *
 * @param {string} note - the note or note name
 * @param {string} interval - the interval or interval name
 * @return {string} the transposed note name or empty string if not valid notes
 * @example
 * import { tranpose } from "@tonaljs/core"
 * transpose("d3", "3M") // => "F#3"
 * transpose("D", "3M") // => "F#"
 * ["C", "D", "E", "F", "G"].map(pc => transpose(pc, "M3)) // => ["E", "F#", "G#", "A", "B"]
 */


function transpose(noteName, intervalName) {
  const note$1 = note(noteName);
  const interval$1 = interval(intervalName);

  if (note$1.empty || interval$1.empty) {
    return "";
  }

  const noteCoord = note$1.coord;
  const intervalCoord = interval$1.coord;
  const tr = noteCoord.length === 1 ? [noteCoord[0] + intervalCoord[0]] : [noteCoord[0] + intervalCoord[0], noteCoord[1] + intervalCoord[1]];
  return coordToNote(tr).name;
}
/**
 * Find the interval distance between two notes or coord classes.
 *
 * To find distance between coord classes, both notes must be coord classes and
 * the interval is always ascending
 *
 * @param {Note|string} from - the note or note name to calculate distance from
 * @param {Note|string} to - the note or note name to calculate distance to
 * @return {string} the interval name or empty string if not valid notes
 *
 */


function distance(fromNote, toNote) {
  const from = note(fromNote);
  const to = note(toNote);

  if (from.empty || to.empty) {
    return "";
  }

  const fcoord = from.coord;
  const tcoord = to.coord;
  const fifths = tcoord[0] - fcoord[0];
  const octs = fcoord.length === 2 && tcoord.length === 2 ? tcoord[1] - fcoord[1] : -Math.floor(fifths * 7 / 12);
  return coordToInterval([fifths, octs]).name;
}
},{}],"../node_modules/@tonaljs/abc-notation/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abcToScientificNotation = abcToScientificNotation;
exports.distance = distance;
exports.scientificToAbcNotation = scientificToAbcNotation;
exports.tokenize = tokenize;
exports.transpose = transpose;
exports.default = void 0;

var _core = require("@tonaljs/core");

const fillStr = (character, times) => Array(times + 1).join(character);

const REGEX = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;

function tokenize(str) {
  const m = REGEX.exec(str);

  if (!m) {
    return ["", "", ""];
  }

  return [m[1], m[2], m[3]];
}
/**
 * Convert a (string) note in ABC notation into a (string) note in scientific notation
 *
 * @example
 * abcToScientificNotation("c") // => "C5"
 */


function abcToScientificNotation(str) {
  const [acc, letter, oct] = tokenize(str);

  if (letter === "") {
    return "";
  }

  let o = 4;

  for (let i = 0; i < oct.length; i++) {
    o += oct.charAt(i) === "," ? -1 : 1;
  }

  const a = acc[0] === "_" ? acc.replace(/_/g, "b") : acc[0] === "^" ? acc.replace(/\^/g, "#") : "";
  return letter.charCodeAt(0) > 96 ? letter.toUpperCase() + a + (o + 1) : letter + a + o;
}
/**
 * Convert a (string) note in scientific notation into a (string) note in ABC notation
 *
 * @example
 * scientificToAbcNotation("C#4") // => "^C"
 */


function scientificToAbcNotation(str) {
  const n = (0, _core.note)(str);

  if (n.empty || !n.oct) {
    return "";
  }

  const {
    letter,
    acc,
    oct
  } = n;
  const a = acc[0] === "b" ? acc.replace(/b/g, "_") : acc.replace(/#/g, "^");
  const l = oct > 4 ? letter.toLowerCase() : letter;
  const o = oct === 5 ? "" : oct > 4 ? fillStr("'", oct - 5) : fillStr(",", 4 - oct);
  return a + l + o;
}

function transpose(note, interval) {
  return scientificToAbcNotation((0, _core.transpose)(abcToScientificNotation(note), interval));
}

function distance(from, to) {
  return (0, _core.distance)(abcToScientificNotation(from), abcToScientificNotation(to));
}

var index = {
  abcToScientificNotation,
  scientificToAbcNotation,
  tokenize,
  transpose,
  distance
};
var _default = index;
exports.default = _default;
},{"@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js"}],"../node_modules/@tonaljs/array/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compact = compact;
exports.permutations = permutations;
exports.range = range;
exports.rotate = rotate;
exports.shuffle = shuffle;
exports.sortedNoteNames = sortedNoteNames;
exports.sortedUniqNoteNames = sortedUniqNoteNames;

var _core = require("@tonaljs/core");

// ascending range
function ascR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = n + b);

  return a;
} // descending range


function descR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = b - n);

  return a;
}
/**
 * Creates a numeric range
 *
 * @param {number} from
 * @param {number} to
 * @return {Array<number>}
 *
 * @example
 * range(-2, 2) // => [-2, -1, 0, 1, 2]
 * range(2, -2) // => [2, 1, 0, -1, -2]
 */


function range(from, to) {
  return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
}
/**
 * Rotates a list a number of times. It"s completly agnostic about the
 * contents of the list.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array} array
 * @return {Array} the rotated array
 *
 * @example
 * rotate(1, [1, 2, 3]) // => [2, 3, 1]
 */


function rotate(times, arr) {
  const len = arr.length;
  const n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}
/**
 * Return a copy of the array with the null values removed
 * @function
 * @param {Array} array
 * @return {Array}
 *
 * @example
 * compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
 */


function compact(arr) {
  return arr.filter(n => n === 0 || n);
}
/**
 * Sort an array of notes in ascending order. Pitch classes are listed
 * before notes. Any string that is not a note is removed.
 *
 * @param {string[]} notes
 * @return {string[]} sorted array of notes
 *
 * @example
 * sortedNoteNames(['c2', 'c5', 'c1', 'c0', 'c6', 'c'])
 * // => ['C', 'C0', 'C1', 'C2', 'C5', 'C6']
 * sortedNoteNames(['c', 'F', 'G', 'a', 'b', 'h', 'J'])
 * // => ['C', 'F', 'G', 'A', 'B']
 */


function sortedNoteNames(notes) {
  const valid = notes.map(n => (0, _core.note)(n)).filter(n => !n.empty);
  return valid.sort((a, b) => a.height - b.height).map(n => n.name);
}
/**
 * Get sorted notes with duplicates removed. Pitch classes are listed
 * before notes.
 *
 * @function
 * @param {string[]} array
 * @return {string[]} unique sorted notes
 *
 * @example
 * Array.sortedUniqNoteNames(['a', 'b', 'c2', '1p', 'p2', 'c2', 'b', 'c', 'c3' ])
 * // => [ 'C', 'A', 'B', 'C2', 'C3' ]
 */


function sortedUniqNoteNames(arr) {
  return sortedNoteNames(arr).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}
/**
 * Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array} array
 * @return {Array} the array shuffled
 *
 * @example
 * shuffle(["C", "D", "E", "F"]) // => [...]
 */


function shuffle(arr, rnd = Math.random) {
  let i;
  let t;
  let m = arr.length;

  while (m) {
    i = Math.floor(rnd() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}
/**
 * Get all permutations of an array
 *
 * @param {Array} array - the array
 * @return {Array<Array>} an array with all the permutations
 * @example
 * permutations(["a", "b", "c"])) // =>
 * [
 *   ["a", "b", "c"],
 *   ["b", "a", "c"],
 *   ["b", "c", "a"],
 *   ["a", "c", "b"],
 *   ["c", "a", "b"],
 *   ["c", "b", "a"]
 * ]
 */


function permutations(arr) {
  if (arr.length === 0) {
    return [[]];
  }

  return permutations(arr.slice(1)).reduce((acc, perm) => {
    return acc.concat(arr.map((e, pos) => {
      const newPerm = perm.slice();
      newPerm.splice(pos, 0, arr[0]);
      return newPerm;
    }));
  }, []);
}
},{"@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js"}],"../node_modules/@tonaljs/collection/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compact = compact;
exports.permutations = permutations;
exports.range = range;
exports.rotate = rotate;
exports.shuffle = shuffle;
exports.default = void 0;

// ascending range
function ascR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = n + b);

  return a;
} // descending range


function descR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = b - n);

  return a;
}
/**
 * Creates a numeric range
 *
 * @param {number} from
 * @param {number} to
 * @return {Array<number>}
 *
 * @example
 * range(-2, 2) // => [-2, -1, 0, 1, 2]
 * range(2, -2) // => [2, 1, 0, -1, -2]
 */


function range(from, to) {
  return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
}
/**
 * Rotates a list a number of times. It"s completly agnostic about the
 * contents of the list.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array} collection
 * @return {Array} the rotated collection
 *
 * @example
 * rotate(1, [1, 2, 3]) // => [2, 3, 1]
 */


function rotate(times, arr) {
  const len = arr.length;
  const n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}
/**
 * Return a copy of the collection with the null values removed
 * @function
 * @param {Array} collection
 * @return {Array}
 *
 * @example
 * compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
 */


function compact(arr) {
  return arr.filter(n => n === 0 || n);
}
/**
 * Randomizes the order of the specified collection in-place, using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array} collection
 * @return {Array} the collection shuffled
 *
 * @example
 * shuffle(["C", "D", "E", "F"]) // => [...]
 */


function shuffle(arr, rnd = Math.random) {
  let i;
  let t;
  let m = arr.length;

  while (m) {
    i = Math.floor(rnd() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}
/**
 * Get all permutations of an collection
 *
 * @param {Array} collection - the collection
 * @return {Array<Array>} an collection with all the permutations
 * @example
 * permutations(["a", "b", "c"])) // =>
 * [
 *   ["a", "b", "c"],
 *   ["b", "a", "c"],
 *   ["b", "c", "a"],
 *   ["a", "c", "b"],
 *   ["c", "a", "b"],
 *   ["c", "b", "a"]
 * ]
 */


function permutations(arr) {
  if (arr.length === 0) {
    return [[]];
  }

  return permutations(arr.slice(1)).reduce((acc, perm) => {
    return acc.concat(arr.map((e, pos) => {
      const newPerm = perm.slice();
      newPerm.splice(pos, 0, arr[0]);
      return newPerm;
    }));
  }, []);
}

var index = {
  compact,
  permutations,
  range,
  rotate,
  shuffle
};
var _default = index;
exports.default = _default;
},{}],"../node_modules/@tonaljs/pcset/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chromaToIntervals = chromaToIntervals;
exports.chromas = chromas;
exports.filter = filter;
exports.get = get;
exports.isEqual = isEqual;
exports.isNoteIncludedIn = isNoteIncludedIn;
exports.isSubsetOf = isSubsetOf;
exports.isSupersetOf = isSupersetOf;
exports.modes = modes;
exports.pcset = exports.includes = exports.EmptyPcset = exports.default = void 0;

var _collection = require("@tonaljs/collection");

var _core = require("@tonaljs/core");

const EmptyPcset = {
  empty: true,
  name: "",
  setNum: 0,
  chroma: "000000000000",
  normalized: "000000000000",
  intervals: []
}; // UTILITIES

exports.EmptyPcset = EmptyPcset;

const setNumToChroma = num => Number(num).toString(2);

const chromaToNumber = chroma => parseInt(chroma, 2);

const REGEX = /^[01]{12}$/;

function isChroma(set) {
  return REGEX.test(set);
}

const isPcsetNum = set => typeof set === "number" && set >= 0 && set <= 4095;

const isPcset = set => set && isChroma(set.chroma);

const cache = {
  [EmptyPcset.chroma]: EmptyPcset
};
/**
 * Get the pitch class set of a collection of notes or set number or chroma
 */

function get(src) {
  const chroma = isChroma(src) ? src : isPcsetNum(src) ? setNumToChroma(src) : Array.isArray(src) ? listToChroma(src) : isPcset(src) ? src.chroma : EmptyPcset.chroma;
  return cache[chroma] = cache[chroma] || chromaToPcset(chroma);
}
/**
 * Use Pcset.properties
 * @function
 * @deprecated
 */


const pcset = (0, _core.deprecate)("Pcset.pcset", "Pcset.get", get);
/**
 * Get pitch class set chroma
 * @function
 * @example
 * Pcset.chroma(["c", "d", "e"]); //=> "101010000000"
 */

exports.pcset = pcset;

const chroma = set => get(set).chroma;
/**
 * Get intervals (from C) of a set
 * @function
 * @example
 * Pcset.intervals(["c", "d", "e"]); //=>
 */


const intervals = set => get(set).intervals;
/**
 * Get pitch class set number
 * @function
 * @example
 * Pcset.num(["c", "d", "e"]); //=> 2192
 */


const num = set => get(set).setNum;

const IVLS = ["1P", "2m", "2M", "3m", "3M", "4P", "5d", "5P", "6m", "6M", "7m", "7M"];
/**
 * @private
 * Get the intervals of a pcset *starting from C*
 * @param {Set} set - the pitch class set
 * @return {IntervalName[]} an array of interval names or an empty array
 * if not a valid pitch class set
 */

function chromaToIntervals(chroma) {
  const intervals = [];

  for (let i = 0; i < 12; i++) {
    // tslint:disable-next-line:curly
    if (chroma.charAt(i) === "1") intervals.push(IVLS[i]);
  }

  return intervals;
}
/**
 * Get a list of all possible pitch class sets (all possible chromas) *having
 * C as root*. There are 2048 different chromas. If you want them with another
 * note you have to transpose it
 *
 * @see http://allthescales.org/
 * @return {Array<PcsetChroma>} an array of possible chromas from '10000000000' to '11111111111'
 */


function chromas() {
  return (0, _collection.range)(2048, 4095).map(setNumToChroma);
}
/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with "0"
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {Array|string} set - the list of notes or pitchChr of the set
 * @param {boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with "0"
 * @return {Array<string>} an array with all the modes of the chroma
 *
 * @example
 * Pcset.modes(["C", "D", "E"]).map(Pcset.intervals)
 */


function modes(set, normalize = true) {
  const pcs = get(set);
  const binary = pcs.chroma.split("");
  return (0, _collection.compact)(binary.map((_, i) => {
    const r = (0, _collection.rotate)(i, binary);
    return normalize && r[0] === "0" ? null : r.join("");
  }));
}
/**
 * Test if two pitch class sets are numentical
 *
 * @param {Array|string} set1 - one of the pitch class sets
 * @param {Array|string} set2 - the other pitch class set
 * @return {boolean} true if they are equal
 * @example
 * Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
 */


function isEqual(s1, s2) {
  return get(s1).setNum === get(s2).setNum;
}
/**
 * Create a function that test if a collection of notes is a
 * subset of a given set
 *
 * The function is curryfied.
 *
 * @param {PcsetChroma|NoteName[]} set - the superset to test against (chroma or
 * list of notes)
 * @return{function(PcsetChroma|NoteNames[]): boolean} a function accepting a set
 * to test against (chroma or list of notes)
 * @example
 * const inCMajor = Pcset.isSubsetOf(["C", "E", "G"])
 * inCMajor(["e6", "c4"]) // => true
 * inCMajor(["e6", "c4", "d3"]) // => false
 */


function isSubsetOf(set) {
  const s = get(set).setNum;
  return notes => {
    const o = get(notes).setNum; // tslint:disable-next-line: no-bitwise

    return s && s !== o && (o & s) === o;
  };
}
/**
 * Create a function that test if a collection of notes is a
 * superset of a given set (it contains all notes and at least one more)
 *
 * @param {Set} set - an array of notes or a chroma set string to test against
 * @return {(subset: Set): boolean} a function that given a set
 * returns true if is a subset of the first one
 * @example
 * const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
 * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
 * extendsCMajor(["c6", "e4", "g3"]) // => false
 */


function isSupersetOf(set) {
  const s = get(set).setNum;
  return notes => {
    const o = get(notes).setNum; // tslint:disable-next-line: no-bitwise

    return s && s !== o && (o | s) === o;
  };
}
/**
 * Test if a given pitch class set includes a note
 *
 * @param {Array<string>} set - the base set to test against
 * @param {string} note - the note to test
 * @return {boolean} true if the note is included in the pcset
 *
 * Can be partially applied
 *
 * @example
 * const isNoteInCMajor = isNoteIncludedIn(['C', 'E', 'G'])
 * isNoteInCMajor('C4') // => true
 * isNoteInCMajor('C#4') // => false
 */


function isNoteIncludedIn(set) {
  const s = get(set);
  return noteName => {
    const n = (0, _core.note)(noteName);
    return s && !n.empty && s.chroma.charAt(n.chroma) === "1";
  };
}
/** @deprecated use: isNoteIncludedIn */


const includes = isNoteIncludedIn;
/**
 * Filter a list with a pitch class set
 *
 * @param {Array|string} set - the pitch class set notes
 * @param {Array|string} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * Pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
 * Pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
 */

exports.includes = includes;

function filter(set) {
  const isIncluded = isNoteIncludedIn(set);
  return notes => {
    return notes.filter(isIncluded);
  };
}

var index = {
  get,
  chroma,
  num,
  intervals,
  chromas,
  isSupersetOf,
  isSubsetOf,
  isNoteIncludedIn,
  isEqual,
  filter,
  modes,
  // deprecated
  pcset
}; //// PRIVATE ////

function chromaRotations(chroma) {
  const binary = chroma.split("");
  return binary.map((_, i) => (0, _collection.rotate)(i, binary).join(""));
}

function chromaToPcset(chroma) {
  const setNum = chromaToNumber(chroma);
  const normalizedNum = chromaRotations(chroma).map(chromaToNumber).filter(n => n >= 2048).sort()[0];
  const normalized = setNumToChroma(normalizedNum);
  const intervals = chromaToIntervals(chroma);
  return {
    empty: false,
    name: "",
    setNum,
    chroma,
    normalized,
    intervals
  };
}

function listToChroma(set) {
  if (set.length === 0) {
    return EmptyPcset.chroma;
  }

  let pitch;
  const binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // tslint:disable-next-line:prefer-for-of

  for (let i = 0; i < set.length; i++) {
    pitch = (0, _core.note)(set[i]); // tslint:disable-next-line: curly

    if (pitch.empty) pitch = (0, _core.interval)(set[i]); // tslint:disable-next-line: curly

    if (!pitch.empty) binary[pitch.chroma] = 1;
  }

  return binary.join("");
}

var _default = index;
exports.default = _default;
},{"@tonaljs/collection":"../node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js"}],"../node_modules/@tonaljs/chord-type/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.addAlias = addAlias;
exports.all = all;
exports.get = get;
exports.keys = keys;
exports.names = names;
exports.removeAll = removeAll;
exports.symbols = symbols;
exports.entries = exports.chordType = exports.default = void 0;

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

/**
 * @private
 * Chord List
 * Source: https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
 * Format: ["intervals", "full name", "abrv1 abrv2"]
 */
const CHORDS = [// ==Major==
["1P 3M 5P", "major", "M ^ "], ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"], ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"], ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"], ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"], ["1P 3M 5P 6M 9M", "sixth/ninth", "6/9 69 M69"], ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"], ["1P 3M 5P 7M 11A", "major seventh sharp eleventh", "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"], // ==Minor==
// '''Normal'''
["1P 3m 5P", "minor", "m min -"], ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"], ["1P 3m 5P 7M", "minor/major seventh", "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7"], ["1P 3m 5P 6M", "minor sixth", "m6 -6"], ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"], ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"], ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"], ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"], // '''Diminished'''
["1P 3m 5d", "diminished", "dim ° o"], ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"], ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"], // ==Dominant/Seventh==
// '''Normal'''
["1P 3M 5P 7m", "dominant seventh", "7 dom"], ["1P 3M 5P 7m 9M", "dominant ninth", "9"], ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"], ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"], // '''Altered'''
["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"], ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"], ["1P 3M 7m 9m", "altered", "alt7"], // '''Suspended'''
["1P 4P 5P", "suspended fourth", "sus4 sus"], ["1P 2M 5P", "suspended second", "sus2"], ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"], ["1P 5P 7m 9M 11P", "eleventh", "11"], ["1P 4P 5P 7m 9m", "suspended fourth flat ninth", "b9sus phryg 7b9sus 7b9sus4"], // ==Other==
["1P 5P", "fifth", "5"], ["1P 3M 5A", "augmented", "aug + +5 ^#5"], ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"], ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"], ["1P 3M 5P 7M 9M 11A", "major sharp eleventh (lydian)", "maj9#11 Δ9#11 ^9#11"], // ==Legacy==
["1P 2M 4P 5P", "", "sus24 sus4add9"], ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"], ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"], ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"], ["1P 3M 5A 7m 9M", "", "9#5 9+"], ["1P 3M 5A 7m 9M 11A", "", "9#5#11"], ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"], ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"], ["1P 3M 5A 9A", "", "+add#9"], ["1P 3M 5A 9M", "", "M#5add9 +add9"], ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"], ["1P 3M 5P 6M 7M 9M", "", "M7add13"], ["1P 3M 5P 6M 9M 11A", "", "69#11"], ["1P 3m 5P 6M 9M", "", "m69 -69"], ["1P 3M 5P 6m 7m", "", "7b6"], ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"], ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"], ["1P 3M 5P 7M 9m", "", "M7b9"], ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"], ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"], ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"], ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"], ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"], ["1P 3M 5P 7m 9A 13M", "", "13#9"], ["1P 3M 5P 7m 9A 13m", "", "7#9b13"], ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"], ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"], ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"], ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"], ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"], ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"], ["1P 3M 5P 7m 9m 13M", "", "13b9"], ["1P 3M 5P 7m 9m 13m", "", "7b9b13"], ["1P 3M 5P 7m 9m 9A", "", "7b9#9"], ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"], ["1P 3M 5P 9m", "", "Maddb9"], ["1P 3M 5d", "", "Mb5"], ["1P 3M 5d 6M 7m 9M", "", "13b5"], ["1P 3M 5d 7M", "", "M7b5"], ["1P 3M 5d 7M 9M", "", "M9b5"], ["1P 3M 5d 7m", "", "7b5"], ["1P 3M 5d 7m 9M", "", "9b5"], ["1P 3M 7m", "", "7no5"], ["1P 3M 7m 13m", "", "7b13"], ["1P 3M 7m 9M", "", "9no5"], ["1P 3M 7m 9M 13M", "", "13no5"], ["1P 3M 7m 9M 13m", "", "9b13"], ["1P 3m 4P 5P", "", "madd4"], ["1P 3m 5P 6m 7M", "", "mMaj7b6"], ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"], ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"], ["1P 3m 5P 9M", "", "madd9"], ["1P 3m 5d 6M 7M", "", "o7M7"], ["1P 3m 5d 7M", "", "oM7"], ["1P 3m 6m 7M", "", "mb6M7"], ["1P 3m 6m 7m", "", "m7#5"], ["1P 3m 6m 7m 9M", "", "m9#5"], ["1P 3m 6m 7m 9M 11P", "", "m11A"], ["1P 3m 6m 9m", "", "mb6b9"], ["1P 2M 3m 5d 7m", "", "m9b5"], ["1P 4P 5A 7M", "", "M7#5sus4"], ["1P 4P 5A 7M 9M", "", "M9#5sus4"], ["1P 4P 5A 7m", "", "7#5sus4"], ["1P 4P 5P 7M", "", "M7sus4"], ["1P 4P 5P 7M 9M", "", "M9sus4"], ["1P 4P 5P 7m 9M", "", "9sus4 9sus"], ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"], ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"], ["1P 4P 7m 10m", "", "4 quartal"], ["1P 5P 7m 9m 11P", "", "11b9"]];
const NoChordType = { ..._pcset.EmptyPcset,
  name: "",
  quality: "Unknown",
  intervals: [],
  aliases: []
};
let dictionary = [];
let index = {};
/**
 * Given a chord name or chroma, return the chord properties
 * @param {string} source - chord name or pitch class set chroma
 * @example
 * import { get } from 'tonaljs/chord-type'
 * get('major') // => { name: 'major', ... }
 */

function get(type) {
  return index[type] || NoChordType;
}

const chordType = (0, _core.deprecate)("ChordType.chordType", "ChordType.get", get);
/**
 * Get all chord (long) names
 */

exports.chordType = chordType;

function names() {
  return dictionary.map(chord => chord.name).filter(x => x);
}
/**
 * Get all chord symbols
 */


function symbols() {
  return dictionary.map(chord => chord.aliases[0]).filter(x => x);
}
/**
 * Keys used to reference chord types
 */


function keys() {
  return Object.keys(index);
}
/**
 * Return a list of all chord types
 */


function all() {
  return dictionary.slice();
}

const entries = (0, _core.deprecate)("ChordType.entries", "ChordType.all", all);
/**
 * Clear the dictionary
 */

exports.entries = entries;

function removeAll() {
  dictionary = [];
  index = {};
}
/**
 * Add a chord to the dictionary.
 * @param intervals
 * @param aliases
 * @param [fullName]
 */


function add(intervals, aliases, fullName) {
  const quality = getQuality(intervals);
  const chord = { ...(0, _pcset.get)(intervals),
    name: fullName || "",
    quality,
    intervals,
    aliases
  };
  dictionary.push(chord);

  if (chord.name) {
    index[chord.name] = chord;
  }

  index[chord.setNum] = chord;
  index[chord.chroma] = chord;
  chord.aliases.forEach(alias => addAlias(chord, alias));
}

function addAlias(chord, alias) {
  index[alias] = chord;
}

function getQuality(intervals) {
  const has = interval => intervals.indexOf(interval) !== -1;

  return has("5A") ? "Augmented" : has("3M") ? "Major" : has("5d") ? "Diminished" : has("3m") ? "Minor" : "Unknown";
}

CHORDS.forEach(([ivls, fullName, names]) => add(ivls.split(" "), names.split(" "), fullName));
dictionary.sort((a, b) => a.setNum - b.setNum);
var index$1 = {
  names,
  symbols,
  get,
  all,
  add,
  removeAll,
  keys,
  // deprecated
  entries,
  chordType
};
var _default = index$1;
exports.default = _default;
},{"@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"../node_modules/@tonaljs/pcset/dist/index.es.js"}],"../node_modules/@tonaljs/chord-detect/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detect = detect;
exports.default = void 0;

var _chordType = require("@tonaljs/chord-type");

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

const namedSet = notes => {
  const pcToName = notes.reduce((record, n) => {
    const chroma = (0, _core.note)(n).chroma;

    if (chroma !== undefined) {
      record[chroma] = record[chroma] || (0, _core.note)(n).name;
    }

    return record;
  }, {});
  return chroma => pcToName[chroma];
};

function detect(source) {
  const notes = source.map(n => (0, _core.note)(n).pc).filter(x => x);

  if (_core.note.length === 0) {
    return [];
  }

  const found = findExactMatches(notes, 1);
  return found.filter(chord => chord.weight).sort((a, b) => b.weight - a.weight).map(chord => chord.name);
}

function findExactMatches(notes, weight) {
  const tonic = notes[0];
  const tonicChroma = (0, _core.note)(tonic).chroma;
  const noteName = namedSet(notes); // we need to test all chormas to get the correct baseNote

  const allModes = (0, _pcset.modes)(notes, false);
  const found = [];
  allModes.forEach((mode, index) => {
    // some chords could have the same chroma but different interval spelling
    const chordTypes = (0, _chordType.all)().filter(chordType => chordType.chroma === mode);
    chordTypes.forEach(chordType => {
      const chordName = chordType.aliases[0];
      const baseNote = noteName(index);
      const isInversion = index !== tonicChroma;

      if (isInversion) {
        found.push({
          weight: 0.5 * weight,
          name: `${baseNote}${chordName}/${tonic}`
        });
      } else {
        found.push({
          weight: 1 * weight,
          name: `${baseNote}${chordName}`
        });
      }
    });
  });
  return found;
}

var index = {
  detect
};
var _default = index;
exports.default = _default;
},{"@tonaljs/chord-type":"../node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"../node_modules/@tonaljs/pcset/dist/index.es.js"}],"../node_modules/@tonaljs/scale-type/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.addAlias = addAlias;
exports.all = all;
exports.get = get;
exports.keys = keys;
exports.names = names;
exports.removeAll = removeAll;
exports.scaleType = exports.entries = exports.NoScaleType = exports.default = void 0;

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

// SCALES
// Format: ["intervals", "name", "alias1", "alias2", ...]
const SCALES = [// 5-note scales
["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"], ["1P 3M 4P 5P 7M", "ionian pentatonic"], ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"], ["1P 2M 4P 5P 6M", "ritusen"], ["1P 2M 4P 5P 7m", "egyptian"], ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"], ["1P 3m 4P 5P 6m", "vietnamese 1"], ["1P 2m 3m 5P 6m", "pelog"], ["1P 2m 4P 5P 6m", "kumoijoshi"], ["1P 2M 3m 5P 6m", "hirajoshi"], ["1P 2m 4P 5d 7m", "iwato"], ["1P 2m 4P 5P 7m", "in-sen"], ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"], ["1P 3m 4P 6m 7m", "malkos raga"], ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"], ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"], ["1P 3m 4P 5P 6M", "minor six pentatonic"], ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"], ["1P 2M 3M 5P 6m", "flat six pentatonic"], ["1P 2m 3M 5P 6M", "scriabin"], ["1P 3M 5d 6m 7m", "whole tone pentatonic"], ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"], ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"], ["1P 3m 4P 5P 7M", "minor #7M pentatonic"], ["1P 3m 4d 5d 7m", "super locrian pentatonic"], // 6-note scales
["1P 2M 3m 4P 5P 7M", "minor hexatonic"], ["1P 2A 3M 5P 5A 7M", "augmented"], ["1P 2M 3m 3M 5P 6M", "major blues"], ["1P 2M 4P 5P 6M 7m", "piongio"], ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"], ["1P 2M 3M 4A 6M 7m", "prometheus"], ["1P 2m 3M 5d 6m 7m", "mystery #1"], ["1P 2m 3M 4P 5A 6M", "six tone symmetric"], ["1P 2M 3M 4A 5A 7m", "whole tone", "messiaen's mode #1"], ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"], ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"], // 7-note scales
["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"], ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"], ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"], ["1P 2m 3m 4d 5d 6m 7m", "altered", "super locrian", "diminished whole tone", "pomeroy"], ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"], ["1P 2M 3M 4P 5P 6m 7m", "mixolydian b6", "melodic minor fifth mode", "hindu"], ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"], ["1P 2M 3M 4A 5P 6M 7M", "lydian"], ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"], ["1P 2m 3m 4P 5P 6M 7m", "dorian b2", "phrygian #6", "melodic minor second mode"], ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"], ["1P 2m 3m 4P 5d 6m 7m", "locrian"], ["1P 2m 3m 4d 5d 6m 7d", "ultralocrian", "superlocrian bb7", "·superlocrian diminished"], ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"], ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"], ["1P 2M 3m 5d 5P 6M 7m", "romanian minor"], ["1P 2M 3m 4A 5P 6M 7m", "dorian #4"], ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"], ["1P 2m 3m 4P 5P 6m 7m", "phrygian"], ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"], ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"], ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"], ["1P 2m 3m 4P 5P 6m 7M", "balinese"], ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"], ["1P 2M 3m 4P 5P 6m 7m", "aeolian", "minor"], ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"], ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"], ["1P 2M 3m 4P 5P 6M 7m", "dorian"], ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"], ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"], ["1P 2m 3M 4P 5d 6M 7m", "oriental"], ["1P 2m 3m 3M 4A 5P 7m", "flamenco"], ["1P 2m 3m 4A 5P 6m 7M", "todi raga"], ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"], ["1P 2m 3M 4P 5d 6m 7M", "persian"], ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"], ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"], ["1P 2M 3M 4P 5A 6M 7M", "major augmented", "major #5", "ionian augmented", "ionian #5"], ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"], // 8-note scales
["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"], ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"], ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"], ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"], ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"], ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"], ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"], ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"], ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"], ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"], ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"], ["1P 2m 3m 3M 4A 5P 6M 7m", "half-whole diminished", "dominant diminished", "messiaen's mode #2"], ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"], ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"], // 9-note scales
["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"], ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"], // 10-note scales
["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"], // 12-note scales
["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]];
const NoScaleType = { ..._pcset.EmptyPcset,
  intervals: [],
  aliases: []
};
exports.NoScaleType = NoScaleType;
let dictionary = [];
let index = {};

function names() {
  return dictionary.map(scale => scale.name);
}
/**
 * Given a scale name or chroma, return the scale properties
 *
 * @param {string} type - scale name or pitch class set chroma
 * @example
 * import { get } from 'tonaljs/scale-type'
 * get('major') // => { name: 'major', ... }
 */


function get(type) {
  return index[type] || NoScaleType;
}

const scaleType = (0, _core.deprecate)("ScaleDictionary.scaleType", "ScaleType.get", get);
/**
 * Return a list of all scale types
 */

exports.scaleType = scaleType;

function all() {
  return dictionary.slice();
}

const entries = (0, _core.deprecate)("ScaleDictionary.entries", "ScaleType.all", all);
/**
 * Keys used to reference scale types
 */

exports.entries = entries;

function keys() {
  return Object.keys(index);
}
/**
 * Clear the dictionary
 */


function removeAll() {
  dictionary = [];
  index = {};
}
/**
 * Add a scale into dictionary
 * @param intervals
 * @param name
 * @param aliases
 */


function add(intervals, name, aliases = []) {
  const scale = { ...(0, _pcset.get)(intervals),
    name,
    intervals,
    aliases
  };
  dictionary.push(scale);
  index[scale.name] = scale;
  index[scale.setNum] = scale;
  index[scale.chroma] = scale;
  scale.aliases.forEach(alias => addAlias(scale, alias));
  return scale;
}

function addAlias(scale, alias) {
  index[alias] = scale;
}

SCALES.forEach(([ivls, name, ...aliases]) => add(ivls.split(" "), name, aliases));
var index$1 = {
  names,
  get,
  all,
  add,
  removeAll,
  keys,
  // deprecated
  entries,
  scaleType
};
var _default = index$1;
exports.default = _default;
},{"@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"../node_modules/@tonaljs/pcset/dist/index.es.js"}],"../node_modules/@tonaljs/chord/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chordScales = chordScales;
exports.extended = extended;
exports.get = get;
exports.getChord = getChord;
exports.reduced = reduced;
exports.tokenize = tokenize;
exports.transpose = transpose;
Object.defineProperty(exports, "detect", {
  enumerable: true,
  get: function () {
    return _chordDetect.detect;
  }
});
exports.chord = exports.default = void 0;

var _chordDetect = require("@tonaljs/chord-detect");

var _chordType = require("@tonaljs/chord-type");

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

var _scaleType = require("@tonaljs/scale-type");

const NoChord = {
  empty: true,
  name: "",
  symbol: "",
  root: "",
  rootDegree: 0,
  type: "",
  tonic: null,
  setNum: NaN,
  quality: "Unknown",
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
}; // 6, 64, 7, 9, 11 and 13 are consider part of the chord
// (see https://github.com/danigb/tonal/issues/55)

const NUM_TYPES = /^(6|64|7|9|11|13)$/;
/**
 * Tokenize a chord name. It returns an array with the tonic and chord type
 * If not tonic is found, all the name is considered the chord name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @function
 * @param {string} name - the chord name
 * @return {Array} an array with [tonic, type]
 * @example
 * tokenize("Cmaj7") // => [ "C", "maj7" ]
 * tokenize("C7") // => [ "C", "7" ]
 * tokenize("mMaj7") // => [ null, "mMaj7" ]
 * tokenize("Cnonsense") // => [ null, "nonsense" ]
 */

function tokenize(name) {
  const [letter, acc, oct, type] = (0, _core.tokenizeNote)(name);

  if (letter === "") {
    return ["", name];
  } // aug is augmented (see https://github.com/danigb/tonal/issues/55)


  if (letter === "A" && type === "ug") {
    return ["", "aug"];
  } // see: https://github.com/tonaljs/tonal/issues/70


  if (!type && (oct === "4" || oct === "5")) {
    return [letter + acc, oct];
  }

  if (NUM_TYPES.test(oct)) {
    return [letter + acc, oct + type];
  } else {
    return [letter + acc + oct, type];
  }
}
/**
 * Get a Chord from a chord name.
 */


function get(src) {
  if (src === "") {
    return NoChord;
  }

  if (Array.isArray(src) && src.length === 2) {
    return getChord(src[1], src[0]);
  } else {
    const [tonic, type] = tokenize(src);
    const chord = getChord(type, tonic);
    return chord.empty ? getChord(src) : chord;
  }
}
/**
 * Get chord properties
 *
 * @param typeName - the chord type name
 * @param [tonic] - Optional tonic
 * @param [root]  - Optional root (requires a tonic)
 */


function getChord(typeName, optionalTonic, optionalRoot) {
  const type = (0, _chordType.get)(typeName);
  const tonic = (0, _core.note)(optionalTonic || "");
  const root = (0, _core.note)(optionalRoot || "");

  if (type.empty || optionalTonic && tonic.empty || optionalRoot && root.empty) {
    return NoChord;
  }

  const rootInterval = (0, _core.distance)(tonic.pc, root.pc);
  const rootDegree = type.intervals.indexOf(rootInterval) + 1;

  if (!root.empty && !rootDegree) {
    return NoChord;
  }

  const intervals = Array.from(type.intervals);

  for (let i = 1; i < rootDegree; i++) {
    const num = intervals[0][0];
    const quality = intervals[0][1];
    const newNum = parseInt(num, 10) + 7;
    intervals.push(`${newNum}${quality}`);
    intervals.shift();
  }

  const notes = tonic.empty ? [] : intervals.map(i => (0, _core.transpose)(tonic, i));
  typeName = type.aliases.indexOf(typeName) !== -1 ? typeName : type.aliases[0];
  const symbol = `${tonic.empty ? "" : tonic.pc}${typeName}${root.empty || rootDegree <= 1 ? "" : "/" + root.pc}`;
  const name = `${optionalTonic ? tonic.pc + " " : ""}${type.name}${rootDegree > 1 && optionalRoot ? " over " + root.pc : ""}`;
  return { ...type,
    name,
    symbol,
    type: type.name,
    root: root.name,
    intervals,
    rootDegree,
    tonic: tonic.name,
    notes
  };
}

const chord = (0, _core.deprecate)("Chord.chord", "Chord.get", get);
/**
 * Transpose a chord name
 *
 * @param {string} chordName - the chord name
 * @return {string} the transposed chord
 *
 * @example
 * transpose('Dm7', 'P4') // => 'Gm7
 */

exports.chord = chord;

function transpose(chordName, interval) {
  const [tonic, type] = tokenize(chordName);

  if (!tonic) {
    return chordName;
  }

  return (0, _core.transpose)(tonic, interval) + type;
}
/**
 * Get all scales where the given chord fits
 *
 * @example
 * chordScales('C7b9')
 * // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
 */


function chordScales(name) {
  const s = get(name);
  const isChordIncluded = (0, _pcset.isSupersetOf)(s.chroma);
  return (0, _scaleType.all)().filter(scale => isChordIncluded(scale.chroma)).map(scale => scale.name);
}
/**
 * Get all chords names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @example
 * extended("CMaj7")
 * // => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
 */


function extended(chordName) {
  const s = get(chordName);
  const isSuperset = (0, _pcset.isSupersetOf)(s.chroma);
  return (0, _chordType.all)().filter(chord => isSuperset(chord.chroma)).map(chord => s.tonic + chord.aliases[0]);
}
/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @example
 */


function reduced(chordName) {
  const s = get(chordName);
  const isSubset = (0, _pcset.isSubsetOf)(s.chroma);
  return (0, _chordType.all)().filter(chord => isSubset(chord.chroma)).map(chord => s.tonic + chord.aliases[0]);
}

var index = {
  getChord,
  get,
  detect: _chordDetect.detect,
  chordScales,
  extended,
  reduced,
  tokenize,
  transpose,
  // deprecate
  chord
};
var _default = index;
exports.default = _default;
},{"@tonaljs/chord-detect":"../node_modules/@tonaljs/chord-detect/dist/index.es.js","@tonaljs/chord-type":"../node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"../node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/scale-type":"../node_modules/@tonaljs/scale-type/dist/index.es.js"}],"../node_modules/@tonaljs/duration-value/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.names = names;
exports.shorthands = shorthands;
exports.value = exports.fraction = exports.default = void 0;
// source: https://en.wikipedia.org/wiki/Note_value
const DATA = [[0.125, "dl", ["large", "duplex longa", "maxima", "octuple", "octuple whole"]], [0.25, "l", ["long", "longa"]], [0.5, "d", ["double whole", "double", "breve"]], [1, "w", ["whole", "semibreve"]], [2, "h", ["half", "minim"]], [4, "q", ["quarter", "crotchet"]], [8, "e", ["eighth", "quaver"]], [16, "s", ["sixteenth", "semiquaver"]], [32, "t", ["thirty-second", "demisemiquaver"]], [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]], [128, "h", ["hundred twenty-eighth"]], [256, "th", ["two hundred fifty-sixth"]]];
const VALUES = [];
DATA.forEach(([denominator, shorthand, names]) => add(denominator, shorthand, names));
const NoDuration = {
  empty: true,
  name: "",
  value: 0,
  fraction: [0, 0],
  shorthand: "",
  dots: "",
  names: []
};

function names() {
  return VALUES.reduce((names, duration) => {
    duration.names.forEach(name => names.push(name));
    return names;
  }, []);
}

function shorthands() {
  return VALUES.map(dur => dur.shorthand);
}

const REGEX = /^([^.]+)(\.*)$/;

function get(name) {
  const [_, simple, dots] = REGEX.exec(name) || [];
  const base = VALUES.find(dur => dur.shorthand === simple || dur.names.includes(simple));

  if (!base) {
    return NoDuration;
  }

  const fraction = calcDots(base.fraction, dots.length);
  const value = fraction[0] / fraction[1];
  return { ...base,
    name,
    dots,
    value,
    fraction
  };
}

const value = name => get(name).value;

exports.value = value;

const fraction = name => get(name).fraction;

exports.fraction = fraction;
var index = {
  names,
  shorthands,
  get,
  value,
  fraction
}; //// PRIVATE ////

function add(denominator, shorthand, names) {
  VALUES.push({
    empty: false,
    dots: "",
    name: "",
    value: 1 / denominator,
    fraction: denominator < 1 ? [1 / denominator, 1] : [1, denominator],
    shorthand,
    names
  });
}

function calcDots(fraction, dots) {
  const pow = Math.pow(2, dots);
  let numerator = fraction[0] * pow;
  let denominator = fraction[1] * pow;
  const base = numerator; // add fractions

  for (let i = 0; i < dots; i++) {
    numerator += base / Math.pow(2, i + 1);
  } // simplify


  while (numerator % 2 === 0 && denominator % 2 === 0) {
    numerator /= 2;
    denominator /= 2;
  }

  return [numerator, denominator];
}

var _default = index;
exports.default = _default;
},{}],"../node_modules/@tonaljs/interval/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromSemitones = fromSemitones;
exports.invert = invert;
exports.names = names;
exports.simplify = simplify;
exports.substract = exports.semitones = exports.quality = exports.num = exports.name = exports.get = exports.distance = exports.addTo = exports.add = exports.default = void 0;

var _core = require("@tonaljs/core");

/**
 * Get the natural list of names
 */
function names() {
  return "1P 2M 3M 4P 5P 6m 7m".split(" ");
}
/**
 * Get properties of an interval
 *
 * @function
 * @example
 * Interval.get('P4') // => {"alt": 0,  "dir": 1,  "name": "4P", "num": 4, "oct": 0, "q": "P", "semitones": 5, "simple": 4, "step": 3, "type": "perfectable"}
 */


const get = _core.interval;
/**
 * Get name of an interval
 *
 * @function
 * @example
 * Interval.name('4P') // => "4P"
 * Interval.name('P4') // => "4P"
 * Interval.name('C4') // => ""
 */

exports.get = get;

const name = name => (0, _core.interval)(name).name;
/**
 * Get semitones of an interval
 * @function
 * @example
 * Interval.semitones('P4') // => 5
 */


exports.name = name;

const semitones = name => (0, _core.interval)(name).semitones;
/**
 * Get quality of an interval
 * @function
 * @example
 * Interval.quality('P4') // => "P"
 */


exports.semitones = semitones;

const quality = name => (0, _core.interval)(name).q;
/**
 * Get number of an interval
 * @function
 * @example
 * Interval.num('P4') // => 4
 */


exports.quality = quality;

const num = name => (0, _core.interval)(name).num;
/**
 * Get the simplified version of an interval.
 *
 * @function
 * @param {string} interval - the interval to simplify
 * @return {string} the simplified interval
 *
 * @example
 * Interval.simplify("9M") // => "2M"
 * Interval.simplify("2M") // => "2M"
 * Interval.simplify("-2M") // => "7m"
 * ["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify)
 * // => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
 */


exports.num = num;

function simplify(name) {
  const i = (0, _core.interval)(name);
  return i.empty ? "" : i.simple + i.q;
}
/**
 * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * @function
 * @param {string} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {string} the inverted interval
 *
 * @example
 * Interval.invert("3m") // => "6M"
 * Interval.invert("2M") // => "7m"
 */


function invert(name) {
  const i = (0, _core.interval)(name);

  if (i.empty) {
    return "";
  }

  const step = (7 - i.step) % 7;
  const alt = i.type === "perfectable" ? -i.alt : -(i.alt + 1);
  return (0, _core.interval)({
    step,
    alt,
    oct: i.oct,
    dir: i.dir
  }).name;
} // interval numbers


const IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7]; // interval qualities

const IQ = "P m M m M P d P m M m M".split(" ");
/**
 * Get interval name from semitones number. Since there are several interval
 * names for the same number, the name it's arbitrary, but deterministic.
 *
 * @param {Integer} num - the number of semitones (can be negative)
 * @return {string} the interval name
 * @example
 * Interval.fromSemitones(7) // => "5P"
 * Interval.fromSemitones(-7) // => "-5P"
 */

function fromSemitones(semitones) {
  const d = semitones < 0 ? -1 : 1;
  const n = Math.abs(semitones);
  const c = n % 12;
  const o = Math.floor(n / 12);
  return d * (IN[c] + 7 * o) + IQ[c];
}
/**
 * Find interval between two notes
 *
 * @example
 * Interval.distance("C4", "G4"); // => "5P"
 */


const distance = _core.distance;
/**
 * Adds two intervals
 *
 * @function
 * @param {string} interval1
 * @param {string} interval2
 * @return {string} the added interval name
 * @example
 * Interval.add("3m", "5P") // => "7m"
 */

exports.distance = distance;
const add = combinator((a, b) => [a[0] + b[0], a[1] + b[1]]);
/**
 * Returns a function that adds an interval
 *
 * @function
 * @example
 * ['1P', '2M', '3M'].map(Interval.addTo('5P')) // => ["5P", "6M", "7M"]
 */

exports.add = add;

const addTo = interval => other => add(interval, other);
/**
 * Subtracts two intervals
 *
 * @function
 * @param {string} minuendInterval
 * @param {string} subtrahendInterval
 * @return {string} the substracted interval name
 * @example
 * Interval.substract('5P', '3M') // => '3m'
 * Interval.substract('3M', '5P') // => '-3m'
 */


exports.addTo = addTo;
const substract = combinator((a, b) => [a[0] - b[0], a[1] - b[1]]);
exports.substract = substract;
var index = {
  names,
  get,
  name,
  num,
  semitones,
  quality,
  fromSemitones,
  distance,
  invert,
  simplify,
  add,
  addTo,
  substract
};

function combinator(fn) {
  return (a, b) => {
    const coordA = (0, _core.interval)(a).coord;
    const coordB = (0, _core.interval)(b).coord;

    if (coordA && coordB) {
      const coord = fn(coordA, coordB);
      return (0, _core.coordToInterval)(coord).name;
    }
  };
}

var _default = index;
exports.default = _default;
},{"@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js"}],"../node_modules/@tonaljs/midi/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.freqToMidi = freqToMidi;
exports.isMidi = isMidi;
exports.midiToFreq = midiToFreq;
exports.midiToNoteName = midiToNoteName;
exports.toMidi = toMidi;
exports.default = void 0;

var _core = require("@tonaljs/core");

function isMidi(arg) {
  return +arg >= 0 && +arg <= 127;
}
/**
 * Get the note midi number (a number between 0 and 127)
 *
 * It returns undefined if not valid note name
 *
 * @function
 * @param {string|number} note - the note name or midi number
 * @return {Integer} the midi number or undefined if not valid note
 * @example
 * import { toMidi } from '@tonaljs/midi'
 * toMidi("C4") // => 60
 * toMidi(60) // => 60
 * toMidi('60') // => 60
 */


function toMidi(note$1) {
  if (isMidi(note$1)) {
    return +note$1;
  }

  const n = (0, _core.note)(note$1);
  return n.empty ? null : n.midi;
}
/**
 * Get the frequency in hertzs from midi number
 *
 * @param {number} midi - the note midi number
 * @param {number} [tuning = 440] - A4 tuning frequency in Hz (440 by default)
 * @return {number} the frequency or null if not valid note midi
 * @example
 * import { midiToFreq} from '@tonaljs/midi'
 * midiToFreq(69) // => 440
 */


function midiToFreq(midi, tuning = 440) {
  return Math.pow(2, (midi - 69) / 12) * tuning;
}

const L2 = Math.log(2);
const L440 = Math.log(440);
/**
 * Get the midi number from a frequency in hertz. The midi number can
 * contain decimals (with two digits precission)
 *
 * @param {number} frequency
 * @return {number}
 * @example
 * import { freqToMidi} from '@tonaljs/midi'
 * freqToMidi(220)); //=> 57
 * freqToMidi(261.62)); //=> 60
 * freqToMidi(261)); //=> 59.96
 */

function freqToMidi(freq) {
  const v = 12 * (Math.log(freq) - L440) / L2 + 69;
  return Math.round(v * 100) / 100;
}

const SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
const FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {number} midi - the midi note number
 * @param {Object} options = default: `{ sharps: false, pitchClass: false }`
 * @param {boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {string} the note name
 * @example
 * import { midiToNoteName } from '@tonaljs/midi'
 * midiToNoteName(61) // => "Db4"
 * midiToNoteName(61, { pitchClass: true }) // => "Db"
 * midiToNoteName(61, { sharps: true }) // => "C#4"
 * midiToNoteName(61, { pitchClass: true, sharps: true }) // => "C#"
 * // it rounds to nearest note
 * midiToNoteName(61.7) // => "D4"
 */

function midiToNoteName(midi, options = {}) {
  if (isNaN(midi) || midi === -Infinity || midi === Infinity) return "";
  midi = Math.round(midi);
  const pcs = options.sharps === true ? SHARPS : FLATS;
  const pc = pcs[midi % 12];

  if (options.pitchClass) {
    return pc;
  }

  const o = Math.floor(midi / 12) - 1;
  return pc + o;
}

var index = {
  isMidi,
  toMidi,
  midiToFreq,
  midiToNoteName,
  freqToMidi
};
var _default = index;
exports.default = _default;
},{"@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js"}],"../node_modules/@tonaljs/note/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromFreq = fromFreq;
exports.fromFreqSharps = fromFreqSharps;
exports.fromMidi = fromMidi;
exports.fromMidiSharps = fromMidiSharps;
exports.names = names;
exports.sortedNames = sortedNames;
exports.sortedUniqNames = sortedUniqNames;
exports.transposeFifths = transposeFifths;
exports.transposeFrom = exports.transposeBy = exports.transpose = exports.trFrom = exports.trFifths = exports.trBy = exports.tr = exports.simplify = exports.pitchClass = exports.octave = exports.name = exports.midi = exports.get = exports.freq = exports.enharmonic = exports.descending = exports.chroma = exports.ascending = exports.accidentals = exports.default = void 0;

var _core = require("@tonaljs/core");

var _midi = require("@tonaljs/midi");

const NAMES = ["C", "D", "E", "F", "G", "A", "B"];

const toName = n => n.name;

const onlyNotes = array => array.map(_core.note).filter(n => !n.empty);
/**
 * Return the natural note names without octave
 * @function
 * @example
 * Note.names(); // => ["C", "D", "E", "F", "G", "A", "B"]
 */


function names(array) {
  if (array === undefined) {
    return NAMES.slice();
  } else if (!Array.isArray(array)) {
    return [];
  } else {
    return onlyNotes(array).map(toName);
  }
}
/**
 * Get a note from a note name
 *
 * @function
 * @example
 * Note.get('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
 */


const get = _core.note;
/**
 * Get the note name
 * @function
 */

exports.get = get;

const name = note => get(note).name;
/**
 * Get the note pitch class name
 * @function
 */


exports.name = name;

const pitchClass = note => get(note).pc;
/**
 * Get the note accidentals
 * @function
 */


exports.pitchClass = pitchClass;

const accidentals = note => get(note).acc;
/**
 * Get the note octave
 * @function
 */


exports.accidentals = accidentals;

const octave = note => get(note).oct;
/**
 * Get the note midi
 * @function
 */


exports.octave = octave;

const midi = note => get(note).midi;
/**
 * Get the note midi
 * @function
 */


exports.midi = midi;

const freq = note => get(note).freq;
/**
 * Get the note chroma
 * @function
 */


exports.freq = freq;

const chroma = note => get(note).chroma;
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 *
 * @function
 * @param {number} midi - the midi note number
 * @return {string} the note name
 * @example
 * Note.fromMidi(61) // => "Db4"
 * Note.fromMidi(61.7) // => "D4"
 */


exports.chroma = chroma;

function fromMidi(midi) {
  return (0, _midi.midiToNoteName)(midi);
}
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 */


function fromFreq(freq) {
  return (0, _midi.midiToNoteName)((0, _midi.freqToMidi)(freq));
}
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 */


function fromFreqSharps(freq) {
  return (0, _midi.midiToNoteName)((0, _midi.freqToMidi)(freq), {
    sharps: true
  });
}
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 *
 * @function
 * @param {number} midi - the midi note number
 * @return {string} the note name
 * @example
 * Note.fromMidiSharps(61) // => "C#4"
 */


function fromMidiSharps(midi) {
  return (0, _midi.midiToNoteName)(midi, {
    sharps: true
  });
}
/**
 * Transpose a note by an interval
 */


const transpose = _core.transpose;
exports.transpose = transpose;
const tr = _core.transpose;
/**
 * Transpose by an interval.
 * @function
 * @param {string} interval
 * @return {function} a function that transposes by the given interval
 * @example
 * ["C", "D", "E"].map(Note.transposeBy("5P"));
 * // => ["G", "A", "B"]
 */

exports.tr = tr;

const transposeBy = interval => note => transpose(note, interval);

exports.transposeBy = transposeBy;
const trBy = transposeBy;
/**
 * Transpose from a note
 * @function
 * @param {string} note
 * @return {function}  a function that transposes the the note by an interval
 * ["1P", "3M", "5P"].map(Note.transposeFrom("C"));
 * // => ["C", "E", "G"]
 */

exports.trBy = trBy;

const transposeFrom = note => interval => transpose(note, interval);

exports.transposeFrom = transposeFrom;
const trFrom = transposeFrom;
/**
 * Transpose a note by a number of perfect fifths.
 *
 * @function
 * @param {string} note - the note name
 * @param {number} fifhts - the number of fifths
 * @return {string} the transposed note name
 *
 * @example
 * import { transposeFifths } from "@tonaljs/note"
 * transposeFifths("G4", 1) // => "D"
 * [0, 1, 2, 3, 4].map(fifths => transposeFifths("C", fifths)) // => ["C", "G", "D", "A", "E"]
 */

exports.trFrom = trFrom;

function transposeFifths(noteName, fifths) {
  const note = get(noteName);

  if (note.empty) {
    return "";
  }

  const [nFifths, nOcts] = note.coord;
  const transposed = nOcts === undefined ? (0, _core.coordToNote)([nFifths + fifths]) : (0, _core.coordToNote)([nFifths + fifths, nOcts]);
  return transposed.name;
}

const trFifths = transposeFifths;
exports.trFifths = trFifths;

const ascending = (a, b) => a.height - b.height;

exports.ascending = ascending;

const descending = (a, b) => b.height - a.height;

exports.descending = descending;

function sortedNames(notes, comparator) {
  comparator = comparator || ascending;
  return onlyNotes(notes).sort(comparator).map(toName);
}

function sortedUniqNames(notes) {
  return sortedNames(notes, ascending).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}
/**
 * Simplify a note
 *
 * @function
 * @param {string} note - the note to be simplified
 * - sameAccType: default true. Use same kind of accidentals that source
 * @return {string} the simplified note or '' if not valid note
 * @example
 * simplify("C##") // => "D"
 * simplify("C###") // => "D#"
 * simplify("C###")
 * simplify("B#4") // => "C5"
 */


const simplify = nameBuilder(true);
/**
 * Get enharmonic of a note
 *
 * @function
 * @param {string} note
 * @return {string} the enharmonic note or '' if not valid note
 * @example
 * Note.enharmonic("Db") // => "C#"
 * Note.enharmonic("C") // => "C"
 */

exports.simplify = simplify;
const enharmonic = nameBuilder(false);
exports.enharmonic = enharmonic;

function nameBuilder(sameAccidentals) {
  return noteName => {
    const note = get(noteName);

    if (note.empty) {
      return "";
    }

    const sharps = sameAccidentals ? note.alt > 0 : note.alt < 0;
    const pitchClass = note.midi === null;
    return (0, _midi.midiToNoteName)(note.midi || note.chroma, {
      sharps,
      pitchClass
    });
  };
}

var index = {
  names,
  get,
  name,
  pitchClass,
  accidentals,
  octave,
  midi,
  ascending,
  descending,
  sortedNames,
  sortedUniqNames,
  fromMidi,
  fromMidiSharps,
  freq,
  fromFreq,
  fromFreqSharps,
  chroma,
  transpose,
  tr,
  transposeBy,
  trBy,
  transposeFrom,
  trFrom,
  transposeFifths,
  trFifths,
  simplify,
  enharmonic
};
var _default = index;
exports.default = _default;
},{"@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/midi":"../node_modules/@tonaljs/midi/dist/index.es.js"}],"../node_modules/@tonaljs/roman-numeral/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.names = names;
exports.tokenize = tokenize;
exports.default = void 0;

var _core = require("@tonaljs/core");

const NoRomanNumeral = {
  empty: true,
  name: "",
  chordType: ""
};
const cache = {};
/**
 * Get properties of a roman numeral string
 *
 * @function
 * @param {string} - the roman numeral string (can have type, like: Imaj7)
 * @return {Object} - the roman numeral properties
 * @param {string} name - the roman numeral (tonic)
 * @param {string} type - the chord type
 * @param {string} num - the number (1 = I, 2 = II...)
 * @param {boolean} major - major or not
 *
 * @example
 * romanNumeral("VIIb5") // => { name: "VII", type: "b5", num: 7, major: true }
 */

function get(src) {
  return typeof src === "string" ? cache[src] || (cache[src] = parse(src)) : typeof src === "number" ? get(NAMES[src] || "") : (0, _core.isPitch)(src) ? fromPitch(src) : (0, _core.isNamed)(src) ? get(src.name) : NoRomanNumeral;
}

const romanNumeral = (0, _core.deprecate)("RomanNumeral.romanNumeral", "RomanNumeral.get", get);
/**
 * Get roman numeral names
 *
 * @function
 * @param {boolean} [isMajor=true]
 * @return {Array<String>}
 *
 * @example
 * names() // => ["I", "II", "III", "IV", "V", "VI", "VII"]
 */

function names(major = true) {
  return (major ? NAMES : NAMES_MINOR).slice();
}

function fromPitch(pitch) {
  return get((0, _core.altToAcc)(pitch.alt) + NAMES[pitch.step]);
}

const REGEX = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;

function tokenize(str) {
  return REGEX.exec(str) || ["", "", "", ""];
}

const ROMANS = "I II III IV V VI VII";
const NAMES = ROMANS.split(" ");
const NAMES_MINOR = ROMANS.toLowerCase().split(" ");

function parse(src) {
  const [name, acc, roman, chordType] = tokenize(src);

  if (!roman) {
    return NoRomanNumeral;
  }

  const upperRoman = roman.toUpperCase();
  const step = NAMES.indexOf(upperRoman);
  const alt = (0, _core.accToAlt)(acc);
  const dir = 1;
  return {
    empty: false,
    name,
    roman,
    interval: (0, _core.interval)({
      step,
      alt,
      dir
    }).name,
    acc,
    chordType,
    alt,
    step,
    major: roman === upperRoman,
    oct: 0,
    dir
  };
}

var index = {
  names,
  get,
  // deprecated
  romanNumeral
};
var _default = index;
exports.default = _default;
},{"@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js"}],"../node_modules/@tonaljs/key/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.majorKey = majorKey;
exports.majorTonicFromKeySignature = majorTonicFromKeySignature;
exports.minorKey = minorKey;
exports.default = void 0;

var _core = require("@tonaljs/core");

var _note = require("@tonaljs/note");

var _romanNumeral = require("@tonaljs/roman-numeral");

const Empty = Object.freeze([]);
const NoKey = {
  type: "major",
  tonic: "",
  alteration: 0,
  keySignature: ""
};
const NoKeyScale = {
  tonic: "",
  grades: Empty,
  intervals: Empty,
  scale: Empty,
  chords: Empty,
  chordsHarmonicFunction: Empty,
  chordScales: Empty
};
const NoMajorKey = { ...NoKey,
  ...NoKeyScale,
  type: "major",
  minorRelative: "",
  scale: Empty,
  secondaryDominants: Empty,
  secondaryDominantsMinorRelative: Empty,
  substituteDominants: Empty,
  substituteDominantsMinorRelative: Empty
};
const NoMinorKey = { ...NoKey,
  type: "minor",
  relativeMajor: "",
  natural: NoKeyScale,
  harmonic: NoKeyScale,
  melodic: NoKeyScale
};

const mapScaleToType = (scale, list, sep = "") => list.map((type, i) => `${scale[i]}${sep}${type}`);

function keyScale(grades, chords, harmonicFunctions, chordScales) {
  return tonic => {
    const intervals = grades.map(gr => (0, _romanNumeral.get)(gr).interval || "");
    const scale = intervals.map(interval => (0, _core.transpose)(tonic, interval));
    return {
      tonic,
      grades,
      intervals,
      scale,
      chords: mapScaleToType(scale, chords),
      chordsHarmonicFunction: harmonicFunctions.slice(),
      chordScales: mapScaleToType(scale, chordScales, " ")
    };
  };
}

const distInFifths = (from, to) => {
  const f = (0, _core.note)(from);
  const t = (0, _core.note)(to);
  return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
};

const MajorScale = keyScale("I II III IV V VI VII".split(" "), "maj7 m7 m7 maj7 7 m7 m7b5".split(" "), "T SD T SD D T D".split(" "), "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(","));
const NaturalScale = keyScale("I II bIII IV V bVI bVII".split(" "), "m7 m7b5 maj7 m7 m7 maj7 7".split(" "), "T SD T SD D SD SD".split(" "), "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(","));
const HarmonicScale = keyScale("I II bIII IV V bVI VII".split(" "), "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "), "T SD T SD D SD D".split(" "), "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(","));
const MelodicScale = keyScale("I II bIII IV V VI VII".split(" "), "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "), "T SD T SD D  ".split(" "), "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(","));
/**
 * Get a major key properties in a given tonic
 * @param tonic
 */

function majorKey(tonic) {
  const pc = (0, _core.note)(tonic).pc;
  if (!pc) return NoMajorKey;
  const keyScale = MajorScale(pc);
  const alteration = distInFifths("C", pc);

  const romanInTonic = src => {
    const r = (0, _romanNumeral.get)(src);
    if (r.empty) return "";
    return (0, _core.transpose)(tonic, r.interval) + r.chordType;
  };

  return { ...keyScale,
    type: "major",
    minorRelative: (0, _core.transpose)(pc, "-3m"),
    alteration,
    keySignature: (0, _core.altToAcc)(alteration),
    secondaryDominants: "- VI7 VII7 I7 II7 III7 -".split(" ").map(romanInTonic),
    secondaryDominantsMinorRelative: "- IIIm7b5 IV#m7 Vm7 VIm7 VIIm7b5 -".split(" ").map(romanInTonic),
    substituteDominants: "- bIII7 IV7 bV7 bVI7 bVII7 -".split(" ").map(romanInTonic),
    substituteDominantsMinorRelative: "- IIIm7 Im7 IIbm7 VIm7 IVm7 -".split(" ").map(romanInTonic)
  };
}
/**
 * Get minor key properties in a given tonic
 * @param tonic
 */


function minorKey(tnc) {
  const pc = (0, _core.note)(tnc).pc;
  if (!pc) return NoMinorKey;
  const alteration = distInFifths("C", pc) - 3;
  return {
    type: "minor",
    tonic: pc,
    relativeMajor: (0, _core.transpose)(pc, "3m"),
    alteration,
    keySignature: (0, _core.altToAcc)(alteration),
    natural: NaturalScale(pc),
    harmonic: HarmonicScale(pc),
    melodic: MelodicScale(pc)
  };
}
/**
 * Given a key signature, returns the tonic of the major key
 * @param sigature
 * @example
 * majorTonicFromKeySignature('###') // => 'A'
 */


function majorTonicFromKeySignature(sig) {
  if (typeof sig === "number") {
    return (0, _note.transposeFifths)("C", sig);
  } else if (typeof sig === "string" && /^b+|#+$/.test(sig)) {
    return (0, _note.transposeFifths)("C", (0, _core.accToAlt)(sig));
  }

  return null;
}

var index = {
  majorKey,
  majorTonicFromKeySignature,
  minorKey
};
var _default = index;
exports.default = _default;
},{"@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/note":"../node_modules/@tonaljs/note/dist/index.es.js","@tonaljs/roman-numeral":"../node_modules/@tonaljs/roman-numeral/dist/index.es.js"}],"../node_modules/@tonaljs/mode/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = all;
exports.get = get;
exports.names = names;
exports.mode = exports.entries = exports.default = void 0;

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

const DATA = [[0, 2773, 0, "ionian", "", "Maj7", "major"], [1, 2902, 2, "dorian", "m", "m7"], [2, 3418, 4, "phrygian", "m", "m7"], [3, 2741, -1, "lydian", "", "Maj7"], [4, 2774, 1, "mixolydian", "", "7"], [5, 2906, 3, "aeolian", "m", "m7", "minor"], [6, 3434, 5, "locrian", "dim", "m7b5"]];
const NoMode = { ..._pcset.EmptyPcset,
  name: "",
  alt: 0,
  modeNum: NaN,
  triad: "",
  seventh: "",
  aliases: []
};
const modes = DATA.map(toMode);
const index = {};
modes.forEach(mode => {
  index[mode.name] = mode;
  mode.aliases.forEach(alias => {
    index[alias] = mode;
  });
});
/**
 * Get a Mode by it's name
 *
 * @example
 * get('dorian')
 * // =>
 * // {
 * //   intervals: [ '1P', '2M', '3m', '4P', '5P', '6M', '7m' ],
 * //   modeNum: 1,
 * //   chroma: '101101010110',
 * //   normalized: '101101010110',
 * //   name: 'dorian',
 * //   setNum: 2902,
 * //   alt: 2,
 * //   triad: 'm',
 * //   seventh: 'm7',
 * //   aliases: []
 * // }
 */

function get(name) {
  return typeof name === "string" ? index[name.toLowerCase()] || NoMode : name && name.name ? get(name.name) : NoMode;
}

const mode = (0, _core.deprecate)("Mode.mode", "Mode.get", get);
/**
 * Get a list of all modes
 */

exports.mode = mode;

function all() {
  return modes.slice();
}

const entries = (0, _core.deprecate)("Mode.mode", "Mode.all", all);
/**
 * Get a list of all mode names
 */

exports.entries = entries;

function names() {
  return modes.map(mode => mode.name);
}

function toMode(mode) {
  const [modeNum, setNum, alt, name, triad, seventh, alias] = mode;
  const aliases = alias ? [alias] : [];
  const chroma = Number(setNum).toString(2);
  const intervals = (0, _pcset.chromaToIntervals)(chroma);
  return {
    empty: false,
    intervals,
    modeNum,
    chroma,
    normalized: chroma,
    name,
    setNum,
    alt,
    triad,
    seventh,
    aliases
  };
}

var index$1 = {
  get,
  names,
  all,
  // deprecated
  entries,
  mode
};
var _default = index$1;
exports.default = _default;
},{"@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"../node_modules/@tonaljs/pcset/dist/index.es.js"}],"../node_modules/@tonaljs/progression/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromRomanNumerals = fromRomanNumerals;
exports.toRomanNumerals = toRomanNumerals;
exports.default = void 0;

var _chord = require("@tonaljs/chord");

var _core = require("@tonaljs/core");

var _romanNumeral = require("@tonaljs/roman-numeral");

/**
 * Given a tonic and a chord list expressed with roman numeral notation
 * returns the progression expressed with leadsheet chords symbols notation
 * @example
 * fromRomanNumerals("C", ["I", "IIm7", "V7"]);
 * // => ["C", "Dm7", "G7"]
 */
function fromRomanNumerals(tonic, chords) {
  const romanNumerals = chords.map(_romanNumeral.get);
  return romanNumerals.map(rn => (0, _core.transpose)(tonic, (0, _core.interval)(rn)) + rn.chordType);
}
/**
 * Given a tonic and a chord list with leadsheet symbols notation,
 * return the chord list with roman numeral notation
 * @example
 * toRomanNumerals("C", ["CMaj7", "Dm7", "G7"]);
 * // => ["IMaj7", "IIm7", "V7"]
 */


function toRomanNumerals(tonic, chords) {
  return chords.map(chord => {
    const [note, chordType] = (0, _chord.tokenize)(chord);
    const intervalName = (0, _core.distance)(tonic, note);
    const roman = (0, _romanNumeral.get)((0, _core.interval)(intervalName));
    return roman.name + chordType;
  });
}

var index = {
  fromRomanNumerals,
  toRomanNumerals
};
var _default = index;
exports.default = _default;
},{"@tonaljs/chord":"../node_modules/@tonaljs/chord/dist/index.es.js","@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/roman-numeral":"../node_modules/@tonaljs/roman-numeral/dist/index.es.js"}],"../node_modules/@tonaljs/range/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chromatic = chromatic;
exports.numeric = numeric;
exports.default = void 0;

var _collection = require("@tonaljs/collection");

var _midi = require("@tonaljs/midi");

/**
 * Create a numeric range. You supply a list of notes or numbers and it will
 * be connected to create complex ranges.
 *
 * @param {Array} array - the list of notes or numbers used
 * @return {Array} an array of numbers or empty array if not valid parameters
 *
 * @example
 * numeric(["C5", "C4"]) // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
 * // it works midi notes
 * numeric([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
 * // complex range
 * numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
 */
function numeric(notes) {
  const midi = (0, _collection.compact)(notes.map(_midi.toMidi));

  if (!notes.length || midi.length !== notes.length) {
    // there is no valid notes
    return [];
  }

  return midi.reduce((result, note) => {
    const last = result[result.length - 1];
    return result.concat((0, _collection.range)(last, note).slice(1));
  }, [midi[0]]);
}
/**
 * Create a range of chromatic notes. The altered notes will use flats.
 *
 * @function
 * @param {String|Array} list - the list of notes or midi note numbers
 * @return {Array} an array of note names
 *
 * @example
 * Range.chromatic("C2 E2 D2") // => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
 * // with sharps
 * Range.chromatic("C2 C3", true) // => [ "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3" ]
 */


function chromatic(notes, options) {
  return numeric(notes).map(midi => (0, _midi.midiToNoteName)(midi, options));
}

var index = {
  numeric,
  chromatic
};
var _default = index;
exports.default = _default;
},{"@tonaljs/collection":"../node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/midi":"../node_modules/@tonaljs/midi/dist/index.es.js"}],"../node_modules/@tonaljs/scale/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extended = extended;
exports.get = get;
exports.modeNames = modeNames;
exports.reduced = reduced;
exports.scaleChords = scaleChords;
exports.scaleNotes = scaleNotes;
exports.tokenize = tokenize;
exports.scale = exports.names = exports.default = void 0;

var _chordType = require("@tonaljs/chord-type");

var _collection = require("@tonaljs/collection");

var _core = require("@tonaljs/core");

var _note = require("@tonaljs/note");

var _pcset = require("@tonaljs/pcset");

var _scaleType = require("@tonaljs/scale-type");

/**
 * References:
 * - https://www.researchgate.net/publication/327567188_An_Algorithm_for_Spelling_the_Pitches_of_Any_Musical_Scale
 * @module scale
 */
const NoScale = {
  empty: true,
  name: "",
  type: "",
  tonic: null,
  setNum: NaN,
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
};
/**
 * Given a string with a scale name and (optionally) a tonic, split
 * that components.
 *
 * It retuns an array with the form [ name, tonic ] where tonic can be a
 * note name or null and name can be any arbitrary string
 * (this function doesn"t check if that scale name exists)
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array} an array [tonic, name]
 * @example
 * tokenize("C mixolydean") // => ["C", "mixolydean"]
 * tokenize("anything is valid") // => ["", "anything is valid"]
 * tokenize() // => ["", ""]
 */

function tokenize(name) {
  if (typeof name !== "string") {
    return ["", ""];
  }

  const i = name.indexOf(" ");
  const tonic = (0, _core.note)(name.substring(0, i));

  if (tonic.empty) {
    const n = (0, _core.note)(name);
    return n.empty ? ["", name] : [n.name, ""];
  }

  const type = name.substring(tonic.name.length + 1);
  return [tonic.name, type.length ? type : ""];
}
/**
 * Get all scale names
 * @function
 */


const names = _scaleType.names;
/**
 * Get a Scale from a scale name.
 */

exports.names = names;

function get(src) {
  const tokens = Array.isArray(src) ? src : tokenize(src);
  const tonic = (0, _core.note)(tokens[0]).name;
  const st = (0, _scaleType.get)(tokens[1]);

  if (st.empty) {
    return NoScale;
  }

  const type = st.name;
  const notes = tonic ? st.intervals.map(i => (0, _core.transpose)(tonic, i)) : [];
  const name = tonic ? tonic + " " + type : type;
  return { ...st,
    name,
    type,
    tonic,
    notes
  };
}

const scale = (0, _core.deprecate)("Scale.scale", "Scale.get", get);
/**
 * Get all chords that fits a given scale
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array<string>} - the chord names
 *
 * @example
 * scaleChords("pentatonic") // => ["5", "64", "M", "M6", "Madd9", "Msus2"]
 */

exports.scale = scale;

function scaleChords(name) {
  const s = get(name);
  const inScale = (0, _pcset.isSubsetOf)(s.chroma);
  return (0, _chordType.all)().filter(chord => inScale(chord.chroma)).map(chord => chord.aliases[0]);
}
/**
 * Get all scales names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 * @example
 * extended("major") // => ["bebop", "bebop dominant", "bebop major", "chromatic", "ichikosucho"]
 */


function extended(name) {
  const s = get(name);
  const isSuperset = (0, _pcset.isSupersetOf)(s.chroma);
  return (0, _scaleType.all)().filter(scale => isSuperset(scale.chroma)).map(scale => scale.name);
}
/**
 * Find all scales names that are a subset of the given one
 * (has less notes but all from the given scale)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 *
 * @example
 * reduced("major") // => ["ionian pentatonic", "major pentatonic", "ritusen"]
 */


function reduced(name) {
  const isSubset = (0, _pcset.isSubsetOf)(get(name).chroma);
  return (0, _scaleType.all)().filter(scale => isSubset(scale.chroma)).map(scale => scale.name);
}
/**
 * Given an array of notes, return the scale: a pitch class set starting from
 * the first note of the array
 *
 * @function
 * @param {string[]} notes
 * @return {string[]} pitch classes with same tonic
 * @example
 * scaleNotes(['C4', 'c3', 'C5', 'C4', 'c4']) // => ["C"]
 * scaleNotes(['D4', 'c#5', 'A5', 'F#6']) // => ["D", "F#", "A", "C#"]
 */


function scaleNotes(notes) {
  const pcset = notes.map(n => (0, _core.note)(n).pc).filter(x => x);
  const tonic = pcset[0];
  const scale = (0, _note.sortedUniqNames)(pcset);
  return (0, _collection.rotate)(scale.indexOf(tonic), scale);
}
/**
 * Find mode names of a scale
 *
 * @function
 * @param {string} name - scale name
 * @example
 * modeNames("C pentatonic") // => [
 *   ["C", "major pentatonic"],
 *   ["D", "egyptian"],
 *   ["E", "malkos raga"],
 *   ["G", "ritusen"],
 *   ["A", "minor pentatonic"]
 * ]
 */


function modeNames(name) {
  const s = get(name);

  if (s.empty) {
    return [];
  }

  const tonics = s.tonic ? s.notes : s.intervals;
  return (0, _pcset.modes)(s.chroma).map((chroma, i) => {
    const modeName = get(chroma).name;
    return modeName ? [tonics[i], modeName] : ["", ""];
  }).filter(x => x[0]);
}

var index = {
  get,
  names,
  extended,
  modeNames,
  reduced,
  scaleChords,
  scaleNotes,
  tokenize,
  // deprecated
  scale
};
var _default = index;
exports.default = _default;
},{"@tonaljs/chord-type":"../node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/collection":"../node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/note":"../node_modules/@tonaljs/note/dist/index.es.js","@tonaljs/pcset":"../node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/scale-type":"../node_modules/@tonaljs/scale-type/dist/index.es.js"}],"../node_modules/@tonaljs/time-signature/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.names = names;
exports.parse = parse;
exports.default = void 0;
// CONSTANTS
const NONE = {
  empty: true,
  name: "",
  upper: undefined,
  lower: undefined,
  type: undefined,
  additive: []
};
const NAMES = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"]; // PUBLIC API

function names() {
  return NAMES.slice();
}

const REGEX = /^(\d?\d(?:\+\d)*)\/(\d)$/;
const CACHE = new Map();

function get(literal) {
  const cached = CACHE.get(literal);

  if (cached) {
    return cached;
  }

  const ts = build(parse(literal));
  CACHE.set(literal, ts);
  return ts;
}

function parse(literal) {
  if (typeof literal === "string") {
    const [_, up, low] = REGEX.exec(literal) || [];
    return parse([up, low]);
  }

  const [up, down] = literal;
  const denominator = +down;

  if (typeof up === "number") {
    return [up, denominator];
  }

  const list = up.split("+").map(n => +n);
  return list.length === 1 ? [list[0], denominator] : [list, denominator];
}

var index = {
  names,
  parse,
  get
}; // PRIVATE

function build([up, down]) {
  const upper = Array.isArray(up) ? up.reduce((a, b) => a + b, 0) : up;
  const lower = down;

  if (upper === 0 || lower === 0) {
    return NONE;
  }

  const name = Array.isArray(up) ? `${up.join("+")}/${down}` : `${up}/${down}`;
  const additive = Array.isArray(up) ? up : [];
  const type = lower === 4 || lower === 2 ? "simple" : lower === 8 && upper % 3 === 0 ? "compound" : "irregular";
  return {
    empty: false,
    name,
    type,
    upper,
    lower,
    additive
  };
}

var _default = index;
exports.default = _default;
},{}],"../node_modules/@tonaljs/tonal/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ChordDictionary: true,
  PcSet: true,
  ScaleDictionary: true,
  Tonal: true,
  AbcNotation: true,
  Array: true,
  Chord: true,
  ChordType: true,
  Collection: true,
  Core: true,
  DurationValue: true,
  Interval: true,
  Key: true,
  Midi: true,
  Mode: true,
  Note: true,
  Pcset: true,
  Progression: true,
  Range: true,
  RomanNumeral: true,
  Scale: true,
  ScaleType: true,
  TimeSignature: true
};
Object.defineProperty(exports, "AbcNotation", {
  enumerable: true,
  get: function () {
    return _abcNotation.default;
  }
});
Object.defineProperty(exports, "Chord", {
  enumerable: true,
  get: function () {
    return _chord.default;
  }
});
Object.defineProperty(exports, "ChordType", {
  enumerable: true,
  get: function () {
    return _chordType.default;
  }
});
Object.defineProperty(exports, "Collection", {
  enumerable: true,
  get: function () {
    return _collection.default;
  }
});
Object.defineProperty(exports, "DurationValue", {
  enumerable: true,
  get: function () {
    return _durationValue.default;
  }
});
Object.defineProperty(exports, "Interval", {
  enumerable: true,
  get: function () {
    return _interval.default;
  }
});
Object.defineProperty(exports, "Key", {
  enumerable: true,
  get: function () {
    return _key.default;
  }
});
Object.defineProperty(exports, "Midi", {
  enumerable: true,
  get: function () {
    return _midi.default;
  }
});
Object.defineProperty(exports, "Mode", {
  enumerable: true,
  get: function () {
    return _mode.default;
  }
});
Object.defineProperty(exports, "Note", {
  enumerable: true,
  get: function () {
    return _note.default;
  }
});
Object.defineProperty(exports, "Pcset", {
  enumerable: true,
  get: function () {
    return _pcset.default;
  }
});
Object.defineProperty(exports, "Progression", {
  enumerable: true,
  get: function () {
    return _progression.default;
  }
});
Object.defineProperty(exports, "Range", {
  enumerable: true,
  get: function () {
    return _range.default;
  }
});
Object.defineProperty(exports, "RomanNumeral", {
  enumerable: true,
  get: function () {
    return _romanNumeral.default;
  }
});
Object.defineProperty(exports, "Scale", {
  enumerable: true,
  get: function () {
    return _scale.default;
  }
});
Object.defineProperty(exports, "ScaleType", {
  enumerable: true,
  get: function () {
    return _scaleType.default;
  }
});
Object.defineProperty(exports, "TimeSignature", {
  enumerable: true,
  get: function () {
    return _timeSignature.default;
  }
});
exports.Core = exports.Array = exports.Tonal = exports.ScaleDictionary = exports.PcSet = exports.ChordDictionary = void 0;

var _abcNotation = _interopRequireDefault(require("@tonaljs/abc-notation"));

var array = _interopRequireWildcard(require("@tonaljs/array"));

exports.Array = array;

var _chord = _interopRequireDefault(require("@tonaljs/chord"));

var _chordType = _interopRequireDefault(require("@tonaljs/chord-type"));

var _collection = _interopRequireDefault(require("@tonaljs/collection"));

var Core = _interopRequireWildcard(require("@tonaljs/core"));

exports.Core = Core;
Object.keys(Core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === Core[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return Core[key];
    }
  });
});

var _durationValue = _interopRequireDefault(require("@tonaljs/duration-value"));

var _interval = _interopRequireDefault(require("@tonaljs/interval"));

var _key = _interopRequireDefault(require("@tonaljs/key"));

var _midi = _interopRequireDefault(require("@tonaljs/midi"));

var _mode = _interopRequireDefault(require("@tonaljs/mode"));

var _note = _interopRequireDefault(require("@tonaljs/note"));

var _pcset = _interopRequireDefault(require("@tonaljs/pcset"));

var _progression = _interopRequireDefault(require("@tonaljs/progression"));

var _range = _interopRequireDefault(require("@tonaljs/range"));

var _romanNumeral = _interopRequireDefault(require("@tonaljs/roman-numeral"));

var _scale = _interopRequireDefault(require("@tonaljs/scale"));

var _scaleType = _interopRequireDefault(require("@tonaljs/scale-type"));

var _timeSignature = _interopRequireDefault(require("@tonaljs/time-signature"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// deprecated (backwards compatibility)
const Tonal = Core;
exports.Tonal = Tonal;
const PcSet = _pcset.default;
exports.PcSet = PcSet;
const ChordDictionary = _chordType.default;
exports.ChordDictionary = ChordDictionary;
const ScaleDictionary = _scaleType.default;
exports.ScaleDictionary = ScaleDictionary;
},{"@tonaljs/abc-notation":"../node_modules/@tonaljs/abc-notation/dist/index.es.js","@tonaljs/array":"../node_modules/@tonaljs/array/dist/index.es.js","@tonaljs/chord":"../node_modules/@tonaljs/chord/dist/index.es.js","@tonaljs/chord-type":"../node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/collection":"../node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/duration-value":"../node_modules/@tonaljs/duration-value/dist/index.es.js","@tonaljs/interval":"../node_modules/@tonaljs/interval/dist/index.es.js","@tonaljs/key":"../node_modules/@tonaljs/key/dist/index.es.js","@tonaljs/midi":"../node_modules/@tonaljs/midi/dist/index.es.js","@tonaljs/mode":"../node_modules/@tonaljs/mode/dist/index.es.js","@tonaljs/note":"../node_modules/@tonaljs/note/dist/index.es.js","@tonaljs/pcset":"../node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/progression":"../node_modules/@tonaljs/progression/dist/index.es.js","@tonaljs/range":"../node_modules/@tonaljs/range/dist/index.es.js","@tonaljs/roman-numeral":"../node_modules/@tonaljs/roman-numeral/dist/index.es.js","@tonaljs/scale":"../node_modules/@tonaljs/scale/dist/index.es.js","@tonaljs/scale-type":"../node_modules/@tonaljs/scale-type/dist/index.es.js","@tonaljs/time-signature":"../node_modules/@tonaljs/time-signature/dist/index.es.js"}],"../node_modules/howler/dist/howler.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/*!
 *  howler.js v2.2.0
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Create the global controller. All contained methods and properties apply
   * to all sounds that are currently playing or will be in the future.
   */
  var HowlerGlobal = function() {
    this.init();
  };
  HowlerGlobal.prototype = {
    /**
     * Initialize the global Howler object.
     * @return {Howler}
     */
    init: function() {
      var self = this || Howler;

      // Create a global ID counter.
      self._counter = 1000;

      // Pool of unlocked HTML5 Audio objects.
      self._html5AudioPool = [];
      self.html5PoolSize = 10;

      // Internal properties.
      self._codecs = {};
      self._howls = [];
      self._muted = false;
      self._volume = 1;
      self._canPlayEvent = 'canplaythrough';
      self._navigator = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;

      // Public properties.
      self.masterGain = null;
      self.noAudio = false;
      self.usingWebAudio = true;
      self.autoSuspend = true;
      self.ctx = null;

      // Set to false to disable the auto audio unlocker.
      self.autoUnlock = true;

      // Setup the various state values for global tracking.
      self._setup();

      return self;
    },

    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function(vol) {
      var self = this || Howler;
      vol = parseFloat(vol);

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        self._volume = vol;

        // Don't update any of the nodes if we are muted.
        if (self._muted) {
          return self;
        }

        // When using Web Audio, we just need to adjust the master gain.
        if (self.usingWebAudio) {
          self.masterGain.gain.setValueAtTime(vol, Howler.ctx.currentTime);
        }

        // Loop through and change volume for all HTML5 audio nodes.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and change the volumes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node) {
                sound._node.volume = sound._volume * vol;
              }
            }
          }
        }

        return self;
      }

      return self._volume;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    mute: function(muted) {
      var self = this || Howler;

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      self._muted = muted;

      // With Web Audio, we just need to mute the master gain.
      if (self.usingWebAudio) {
        self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler.ctx.currentTime);
      }

      // Loop through and mute all HTML5 Audio nodes.
      for (var i=0; i<self._howls.length; i++) {
        if (!self._howls[i]._webAudio) {
          // Get all of the sounds in this Howl group.
          var ids = self._howls[i]._getSoundIds();

          // Loop through all sounds and mark the audio node as muted.
          for (var j=0; j<ids.length; j++) {
            var sound = self._howls[i]._soundById(ids[j]);

            if (sound && sound._node) {
              sound._node.muted = (muted) ? true : sound._muted;
            }
          }
        }
      }

      return self;
    },

    /**
     * Handle stopping all sounds globally.
     */
    stop: function() {
      var self = this || Howler;

      // Loop through all Howls and stop them.
      for (var i=0; i<self._howls.length; i++) {
        self._howls[i].stop();
      }

      return self;
    },

    /**
     * Unload and destroy all currently loaded Howl objects.
     * @return {Howler}
     */
    unload: function() {
      var self = this || Howler;

      for (var i=self._howls.length-1; i>=0; i--) {
        self._howls[i].unload();
      }

      // Create a new AudioContext to make sure it is fully reset.
      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
        self.ctx.close();
        self.ctx = null;
        setupAudioContext();
      }

      return self;
    },

    /**
     * Check for codec support of specific extension.
     * @param  {String} ext Audio file extention.
     * @return {Boolean}
     */
    codecs: function(ext) {
      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
    },

    /**
     * Setup various state values for global tracking.
     * @return {Howler}
     */
    _setup: function() {
      var self = this || Howler;

      // Keeps track of the suspend/resume state of the AudioContext.
      self.state = self.ctx ? self.ctx.state || 'suspended' : 'suspended';

      // Automatically begin the 30-second suspend process
      self._autoSuspend();

      // Check if audio is available.
      if (!self.usingWebAudio) {
        // No audio is available on this system if noAudio is set to true.
        if (typeof Audio !== 'undefined') {
          try {
            var test = new Audio();

            // Check if the canplaythrough event is available.
            if (typeof test.oncanplaythrough === 'undefined') {
              self._canPlayEvent = 'canplay';
            }
          } catch(e) {
            self.noAudio = true;
          }
        } else {
          self.noAudio = true;
        }
      }

      // Test to make sure audio isn't disabled in Internet Explorer.
      try {
        var test = new Audio();
        if (test.muted) {
          self.noAudio = true;
        }
      } catch (e) {}

      // Check for supported codecs.
      if (!self.noAudio) {
        self._setupCodecs();
      }

      return self;
    },

    /**
     * Check for browser support for various codecs and cache the results.
     * @return {Howler}
     */
    _setupCodecs: function() {
      var self = this || Howler;
      var audioTest = null;

      // Must wrap in a try/catch because IE11 in server mode throws an error.
      try {
        audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;
      } catch (err) {
        return self;
      }

      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
        return self;
      }

      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
      var checkOpera = self._navigator && self._navigator.userAgent.match(/OPR\/([0-6].)/g);
      var isOldOpera = (checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33);

      self._codecs = {
        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
        mpeg: !!mpegTest,
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        m4b: !!(audioTest.canPlayType('audio/x-m4b;') || audioTest.canPlayType('audio/m4b;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
      };

      return self;
    },

    /**
     * Some browsers/devices will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _unlockAudio: function() {
      var self = this || Howler;

      // Only run this if Web Audio is supported and it hasn't already been unlocked.
      if (self._audioUnlocked || !self.ctx) {
        return;
      }

      self._audioUnlocked = false;
      self.autoUnlock = false;

      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
        self._mobileUnloaded = true;
        self.unload();
      }

      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
      // http://stackoverflow.com/questions/24119684
      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

      // Call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS, Android, etc.
      var unlock = function(e) {
        // Create a pool of unlocked HTML5 Audio objects that can
        // be used for playing sounds without user interaction. HTML5
        // Audio objects must be individually unlocked, as opposed
        // to the WebAudio API which only needs a single activation.
        // This must occur before WebAudio setup or the source.onended
        // event will not fire.
        while (self._html5AudioPool.length < self.html5PoolSize) {
          try {
            var audioNode = new Audio();

            // Mark this Audio object as unlocked to ensure it can get returned
            // to the unlocked pool when released.
            audioNode._unlocked = true;

            // Add the audio node to the pool.
            self._releaseHtml5Audio(audioNode);
          } catch (e) {
            self.noAudio = true;
            break;
          }
        }

        // Loop through any assigned audio nodes and unlock them.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and unlock the audio nodes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node && !sound._node._unlocked) {
                sound._node._unlocked = true;
                sound._node.load();
              }
            }
          }
        }

        // Fix Android can not play in suspend state.
        self._autoResume();

        // Create an empty buffer.
        var source = self.ctx.createBufferSource();
        source.buffer = self._scratchBuffer;
        source.connect(self.ctx.destination);

        // Play the empty buffer.
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // Calling resume() on a stack initiated by user gesture is what actually unlocks the audio on Android Chrome >= 55.
        if (typeof self.ctx.resume === 'function') {
          self.ctx.resume();
        }

        // Setup a timeout to check that we are unlocked on the next event loop.
        source.onended = function() {
          source.disconnect(0);

          // Update the unlocked state and prevent this check from happening again.
          self._audioUnlocked = true;

          // Remove the touch start listener.
          document.removeEventListener('touchstart', unlock, true);
          document.removeEventListener('touchend', unlock, true);
          document.removeEventListener('click', unlock, true);

          // Let all sounds know that audio has been unlocked.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('unlock');
          }
        };
      };

      // Setup a touch start listener to attempt an unlock in.
      document.addEventListener('touchstart', unlock, true);
      document.addEventListener('touchend', unlock, true);
      document.addEventListener('click', unlock, true);

      return self;
    },

    /**
     * Get an unlocked HTML5 Audio object from the pool. If none are left,
     * return a new Audio object and throw a warning.
     * @return {Audio} HTML5 Audio object.
     */
    _obtainHtml5Audio: function() {
      var self = this || Howler;

      // Return the next object from the pool if one exists.
      if (self._html5AudioPool.length) {
        return self._html5AudioPool.pop();
      }

      //.Check if the audio is locked and throw a warning.
      var testPlay = new Audio().play();
      if (testPlay && typeof Promise !== 'undefined' && (testPlay instanceof Promise || typeof testPlay.then === 'function')) {
        testPlay.catch(function() {
          console.warn('HTML5 Audio pool exhausted, returning potentially locked audio object.');
        });
      }

      return new Audio();
    },

    /**
     * Return an activated HTML5 Audio object to the pool.
     * @return {Howler}
     */
    _releaseHtml5Audio: function(audio) {
      var self = this || Howler;

      // Don't add audio to the pool if we don't know if it has been unlocked.
      if (audio._unlocked) {
        self._html5AudioPool.push(audio);
      }

      return self;
    },

    /**
     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
     * @return {Howler}
     */
    _autoSuspend: function() {
      var self = this;

      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      // Check if any sounds are playing.
      for (var i=0; i<self._howls.length; i++) {
        if (self._howls[i]._webAudio) {
          for (var j=0; j<self._howls[i]._sounds.length; j++) {
            if (!self._howls[i]._sounds[j]._paused) {
              return self;
            }
          }
        }
      }

      if (self._suspendTimer) {
        clearTimeout(self._suspendTimer);
      }

      // If no sound has played after 30 seconds, suspend the context.
      self._suspendTimer = setTimeout(function() {
        if (!self.autoSuspend) {
          return;
        }

        self._suspendTimer = null;
        self.state = 'suspending';

        // Handle updating the state of the audio context after suspending.
        var handleSuspension = function() {
          self.state = 'suspended';

          if (self._resumeAfterSuspend) {
            delete self._resumeAfterSuspend;
            self._autoResume();
          }
        };

        // Either the state gets suspended or it is interrupted.
        // Either way, we need to update the state to suspended.
        self.ctx.suspend().then(handleSuspension, handleSuspension);
      }, 30000);

      return self;
    },

    /**
     * Automatically resume the Web Audio AudioContext when a new sound is played.
     * @return {Howler}
     */
    _autoResume: function() {
      var self = this;

      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      if (self.state === 'running' && self.ctx.state !== 'interrupted' && self._suspendTimer) {
        clearTimeout(self._suspendTimer);
        self._suspendTimer = null;
      } else if (self.state === 'suspended' || self.state === 'running' && self.ctx.state === 'interrupted') {
        self.ctx.resume().then(function() {
          self.state = 'running';

          // Emit to all Howls that the audio has resumed.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('resume');
          }
        });

        if (self._suspendTimer) {
          clearTimeout(self._suspendTimer);
          self._suspendTimer = null;
        }
      } else if (self.state === 'suspending') {
        self._resumeAfterSuspend = true;
      }

      return self;
    }
  };

  // Setup the global audio controller.
  var Howler = new HowlerGlobal();

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Create an audio group controller.
   * @param {Object} o Passed in properties for this group.
   */
  var Howl = function(o) {
    var self = this;

    // Throw an error if no source is provided.
    if (!o.src || o.src.length === 0) {
      console.error('An array of source files must be passed with any new Howl.');
      return;
    }

    self.init(o);
  };
  Howl.prototype = {
    /**
     * Initialize a new Howl group object.
     * @param  {Object} o Passed in properties for this group.
     * @return {Howl}
     */
    init: function(o) {
      var self = this;

      // If we don't have an AudioContext created yet, run the setup.
      if (!Howler.ctx) {
        setupAudioContext();
      }

      // Setup user-defined default properties.
      self._autoplay = o.autoplay || false;
      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
      self._html5 = o.html5 || false;
      self._muted = o.mute || false;
      self._loop = o.loop || false;
      self._pool = o.pool || 5;
      self._preload = (typeof o.preload === 'boolean' || o.preload === 'metadata') ? o.preload : true;
      self._rate = o.rate || 1;
      self._sprite = o.sprite || {};
      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
      self._volume = o.volume !== undefined ? o.volume : 1;
      self._xhr = {
        method: o.xhr && o.xhr.method ? o.xhr.method : 'GET',
        headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
        withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false,
      };

      // Setup all other default properties.
      self._duration = 0;
      self._state = 'unloaded';
      self._sounds = [];
      self._endTimers = {};
      self._queue = [];
      self._playLock = false;

      // Setup event listeners.
      self._onend = o.onend ? [{fn: o.onend}] : [];
      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
      self._onload = o.onload ? [{fn: o.onload}] : [];
      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
      self._onplayerror = o.onplayerror ? [{fn: o.onplayerror}] : [];
      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
      self._onseek = o.onseek ? [{fn: o.onseek}] : [];
      self._onunlock = o.onunlock ? [{fn: o.onunlock}] : [];
      self._onresume = [];

      // Web Audio or HTML5 Audio?
      self._webAudio = Howler.usingWebAudio && !self._html5;

      // Automatically try to enable audio.
      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.autoUnlock) {
        Howler._unlockAudio();
      }

      // Keep track of this Howl group in the global controller.
      Howler._howls.push(self);

      // If they selected autoplay, add a play event to the load queue.
      if (self._autoplay) {
        self._queue.push({
          event: 'play',
          action: function() {
            self.play();
          }
        });
      }

      // Load the source file unless otherwise specified.
      if (self._preload && self._preload !== 'none') {
        self.load();
      }

      return self;
    },

    /**
     * Load the audio file.
     * @return {Howler}
     */
    load: function() {
      var self = this;
      var url = null;

      // If no audio is available, quit immediately.
      if (Howler.noAudio) {
        self._emit('loaderror', null, 'No audio support.');
        return;
      }

      // Make sure our source is in an array.
      if (typeof self._src === 'string') {
        self._src = [self._src];
      }

      // Loop through the sources and pick the first one that is compatible.
      for (var i=0; i<self._src.length; i++) {
        var ext, str;

        if (self._format && self._format[i]) {
          // If an extension was specified, use that instead.
          ext = self._format[i];
        } else {
          // Make sure the source is a string.
          str = self._src[i];
          if (typeof str !== 'string') {
            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
            continue;
          }

          // Extract the file extension from the URL or base64 data URI.
          ext = /^data:audio\/([^;,]+);/i.exec(str);
          if (!ext) {
            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
          }

          if (ext) {
            ext = ext[1].toLowerCase();
          }
        }

        // Log a warning if no extension was found.
        if (!ext) {
          console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
        }

        // Check if this extension is available.
        if (ext && Howler.codecs(ext)) {
          url = self._src[i];
          break;
        }
      }

      if (!url) {
        self._emit('loaderror', null, 'No codec support for selected audio sources.');
        return;
      }

      self._src = url;
      self._state = 'loading';

      // If the hosting page is HTTPS and the source isn't,
      // drop down to HTML5 Audio to avoid Mixed Content errors.
      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
        self._html5 = true;
        self._webAudio = false;
      }

      // Create a new sound object and add it to the pool.
      new Sound(self);

      // Load and decode the audio data for playback.
      if (self._webAudio) {
        loadBuffer(self);
      }

      return self;
    },

    /**
     * Play a sound or resume previous playback.
     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Number}          Sound ID.
     */
    play: function(sprite, internal) {
      var self = this;
      var id = null;

      // Determine if a sprite, sound id or nothing was passed
      if (typeof sprite === 'number') {
        id = sprite;
        sprite = null;
      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
        // If the passed sprite doesn't exist, do nothing.
        return null;
      } else if (typeof sprite === 'undefined') {
        // Use the default sound sprite (plays the full audio length).
        sprite = '__default';

        // Check if there is a single paused sound that isn't ended.
        // If there is, play that sound. If not, continue as usual.
        if (!self._playLock) {
          var num = 0;
          for (var i=0; i<self._sounds.length; i++) {
            if (self._sounds[i]._paused && !self._sounds[i]._ended) {
              num++;
              id = self._sounds[i]._id;
            }
          }

          if (num === 1) {
            sprite = null;
          } else {
            id = null;
          }
        }
      }

      // Get the selected node, or get one from the pool.
      var sound = id ? self._soundById(id) : self._inactiveSound();

      // If the sound doesn't exist, do nothing.
      if (!sound) {
        return null;
      }

      // Select the sprite definition.
      if (id && !sprite) {
        sprite = sound._sprite || '__default';
      }

      // If the sound hasn't loaded, we must wait to get the audio's duration.
      // We also need to wait to make sure we don't run into race conditions with
      // the order of function calls.
      if (self._state !== 'loaded') {
        // Set the sprite value on this sound.
        sound._sprite = sprite;

        // Mark this sound as not ended in case another sound is played before this one loads.
        sound._ended = false;

        // Add the sound to the queue to be played on load.
        var soundId = sound._id;
        self._queue.push({
          event: 'play',
          action: function() {
            self.play(soundId);
          }
        });

        return soundId;
      }

      // Don't play the sound if an id was passed and it is already playing.
      if (id && !sound._paused) {
        // Trigger the play event, in order to keep iterating through queue.
        if (!internal) {
          self._loadQueue('play');
        }

        return sound._id;
      }

      // Make sure the AudioContext isn't suspended, and resume it if it is.
      if (self._webAudio) {
        Howler._autoResume();
      }

      // Determine how long to play for and where to start playing.
      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
      var duration = Math.max(0, ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek);
      var timeout = (duration * 1000) / Math.abs(sound._rate);
      var start = self._sprite[sprite][0] / 1000;
      var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
      sound._sprite = sprite;

      // Mark the sound as ended instantly so that this async playback
      // doesn't get grabbed by another call to play while this one waits to start.
      sound._ended = false;

      // Update the parameters of the sound.
      var setParams = function() {
        sound._paused = false;
        sound._seek = seek;
        sound._start = start;
        sound._stop = stop;
        sound._loop = !!(sound._loop || self._sprite[sprite][2]);
      };

      // End the sound instantly if seek is at the end.
      if (seek >= stop) {
        self._ended(sound);
        return;
      }

      // Begin the actual playback.
      var node = sound._node;
      if (self._webAudio) {
        // Fire this when the sound is ready to play to begin Web Audio playback.
        var playWebAudio = function() {
          self._playLock = false;
          setParams();
          self._refreshBuffer(sound);

          // Setup the playback params.
          var vol = (sound._muted || self._muted) ? 0 : sound._volume;
          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
          sound._playStart = Howler.ctx.currentTime;

          // Play the sound using the supported method.
          if (typeof node.bufferSource.start === 'undefined') {
            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
          } else {
            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
          }

          // Start a new timer if none is present.
          if (timeout !== Infinity) {
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }

          if (!internal) {
            setTimeout(function() {
              self._emit('play', sound._id);
              self._loadQueue();
            }, 0);
          }
        };

        if (Howler.state === 'running' && Howler.ctx.state !== 'interrupted') {
          playWebAudio();
        } else {
          self._playLock = true;

          // Wait for the audio context to resume before playing.
          self.once('resume', playWebAudio);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      } else {
        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
        var playHtml5 = function() {
          node.currentTime = seek;
          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
          node.volume = sound._volume * Howler.volume();
          node.playbackRate = sound._rate;

          // Some browsers will throw an error if this is called without user interaction.
          try {
            var play = node.play();

            // Support older browsers that don't support promises, and thus don't have this issue.
            if (play && typeof Promise !== 'undefined' && (play instanceof Promise || typeof play.then === 'function')) {
              // Implements a lock to prevent DOMException: The play() request was interrupted by a call to pause().
              self._playLock = true;

              // Set param values immediately.
              setParams();

              // Releases the lock and executes queued actions.
              play
                .then(function() {
                  self._playLock = false;
                  node._unlocked = true;
                  if (!internal) {
                    self._emit('play', sound._id);
                    self._loadQueue();
                  }
                })
                .catch(function() {
                  self._playLock = false;
                  self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
                    'on mobile devices and Chrome where playback was not within a user interaction.');

                  // Reset the ended and paused values.
                  sound._ended = true;
                  sound._paused = true;
                });
            } else if (!internal) {
              self._playLock = false;
              setParams();
              self._emit('play', sound._id);
              self._loadQueue();
            }

            // Setting rate before playing won't work in IE, so we set it again here.
            node.playbackRate = sound._rate;

            // If the node is still paused, then we can assume there was a playback issue.
            if (node.paused) {
              self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
                'on mobile devices and Chrome where playback was not within a user interaction.');
              return;
            }

            // Setup the end timer on sprites or listen for the ended event.
            if (sprite !== '__default' || sound._loop) {
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            } else {
              self._endTimers[sound._id] = function() {
                // Fire ended on this audio node.
                self._ended(sound);

                // Clear this listener.
                node.removeEventListener('ended', self._endTimers[sound._id], false);
              };
              node.addEventListener('ended', self._endTimers[sound._id], false);
            }
          } catch (err) {
            self._emit('playerror', sound._id, err);
          }
        };

        // If this is streaming audio, make sure the src is set and load again.
        if (node.src === 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA') {
          node.src = self._src;
          node.load();
        }

        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
        var loadedNoReadyState = (window && window.ejecta) || (!node.readyState && Howler._navigator.isCocoonJS);
        if (node.readyState >= 3 || loadedNoReadyState) {
          playHtml5();
        } else {
          self._playLock = true;

          var listener = function() {
            // Begin playback.
            playHtml5();

            // Clear this listener.
            node.removeEventListener(Howler._canPlayEvent, listener, false);
          };
          node.addEventListener(Howler._canPlayEvent, listener, false);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      }

      return sound._id;
    },

    /**
     * Pause playback and save current position.
     * @param  {Number} id The sound ID (empty to pause all in group).
     * @return {Howl}
     */
    pause: function(id) {
      var self = this;

      // If the sound hasn't loaded or a play() promise is pending, add it to the load queue to pause when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'pause',
          action: function() {
            self.pause(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be paused.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound && !sound._paused) {
          // Reset the seek position.
          sound._seek = self.seek(ids[i]);
          sound._rateSeek = 0;
          sound._paused = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound has been created.
              if (!sound._node.bufferSource) {
                continue;
              }

              if (typeof sound._node.bufferSource.stop === 'undefined') {
                sound._node.bufferSource.noteOff(0);
              } else {
                sound._node.bufferSource.stop(0);
              }

              // Clean up the buffer source.
              self._cleanBuffer(sound._node);
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.pause();
            }
          }
        }

        // Fire the pause event, unless `true` is passed as the 2nd argument.
        if (!arguments[1]) {
          self._emit('pause', sound ? sound._id : null);
        }
      }

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {Number} id The sound ID (empty to stop all in group).
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Howl}
     */
    stop: function(id, internal) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to stop when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'stop',
          action: function() {
            self.stop(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be stopped.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          // Reset the seek position.
          sound._seek = sound._start || 0;
          sound._rateSeek = 0;
          sound._paused = true;
          sound._ended = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound's AudioBufferSourceNode has been created.
              if (sound._node.bufferSource) {
                if (typeof sound._node.bufferSource.stop === 'undefined') {
                  sound._node.bufferSource.noteOff(0);
                } else {
                  sound._node.bufferSource.stop(0);
                }

                // Clean up the buffer source.
                self._cleanBuffer(sound._node);
              }
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.currentTime = sound._start || 0;
              sound._node.pause();

              // If this is a live stream, stop download once the audio is stopped.
              if (sound._node.duration === Infinity) {
                self._clearSound(sound._node);
              }
            }
          }

          if (!internal) {
            self._emit('stop', sound._id);
          }
        }
      }

      return self;
    },

    /**
     * Mute/unmute a single sound or all sounds in this Howl group.
     * @param  {Boolean} muted Set to true to mute and false to unmute.
     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
     * @return {Howl}
     */
    mute: function(muted, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to mute when capable.
      if (self._state !== 'loaded'|| self._playLock) {
        self._queue.push({
          event: 'mute',
          action: function() {
            self.mute(muted, id);
          }
        });

        return self;
      }

      // If applying mute/unmute to all sounds, update the group's value.
      if (typeof id === 'undefined') {
        if (typeof muted === 'boolean') {
          self._muted = muted;
        } else {
          return self._muted;
        }
      }

      // If no id is passed, get all ID's to be muted.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          sound._muted = muted;

          // Cancel active fade and set the volume to the end value.
          if (sound._interval) {
            self._stopFade(sound._id);
          }

          if (self._webAudio && sound._node) {
            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
          } else if (sound._node) {
            sound._node.muted = Howler._muted ? true : muted;
          }

          self._emit('mute', sound._id);
        }
      }

      return self;
    },

    /**
     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
     *   volume() -> Returns the group's volume value.
     *   volume(id) -> Returns the sound id's current volume.
     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
     *   volume(vol, id) -> Sets the volume of passed sound id.
     * @return {Howl/Number} Returns self or current volume.
     */
    volume: function() {
      var self = this;
      var args = arguments;
      var vol, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // Return the value of the groups' volume.
        return self._volume;
      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
        // First check if this is an ID, and if not, assume it is a new volume.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          vol = parseFloat(args[0]);
        }
      } else if (args.length >= 2) {
        vol = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the volume or return the current volume.
      var sound;
      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
        if (self._state !== 'loaded'|| self._playLock) {
          self._queue.push({
            event: 'volume',
            action: function() {
              self.volume.apply(self, args);
            }
          });

          return self;
        }

        // Set the group volume.
        if (typeof id === 'undefined') {
          self._volume = vol;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            sound._volume = vol;

            // Stop currently running fades.
            if (!args[2]) {
              self._stopFade(id[i]);
            }

            if (self._webAudio && sound._node && !sound._muted) {
              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
            } else if (sound._node && !sound._muted) {
              sound._node.volume = vol * Howler.volume();
            }

            self._emit('volume', sound._id);
          }
        }
      } else {
        sound = id ? self._soundById(id) : self._sounds[0];
        return sound ? sound._volume : 0;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id (omit to fade all sounds).
     * @return {Howl}
     */
    fade: function(from, to, len, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to fade when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'fade',
          action: function() {
            self.fade(from, to, len, id);
          }
        });

        return self;
      }

      // Make sure the to/from/len values are numbers.
      from = Math.min(Math.max(0, parseFloat(from)), 1);
      to = Math.min(Math.max(0, parseFloat(to)), 1);
      len = parseFloat(len);

      // Set the volume to the start position.
      self.volume(from, id);

      // Fade the volume of one or all sounds.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        // Create a linear fade or fall back to timeouts with HTML5 Audio.
        if (sound) {
          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
          if (!id) {
            self._stopFade(ids[i]);
          }

          // If we are using Web Audio, let the native methods do the actual fade.
          if (self._webAudio && !sound._muted) {
            var currentTime = Howler.ctx.currentTime;
            var end = currentTime + (len / 1000);
            sound._volume = from;
            sound._node.gain.setValueAtTime(from, currentTime);
            sound._node.gain.linearRampToValueAtTime(to, end);
          }

          self._startFadeInterval(sound, from, to, len, ids[i], typeof id === 'undefined');
        }
      }

      return self;
    },

    /**
     * Starts the internal interval to fade a sound.
     * @param  {Object} sound Reference to sound to fade.
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id to fade.
     * @param  {Boolean} isGroup   If true, set the volume on the group.
     */
    _startFadeInterval: function(sound, from, to, len, id, isGroup) {
      var self = this;
      var vol = from;
      var diff = to - from;
      var steps = Math.abs(diff / 0.01);
      var stepLen = Math.max(4, (steps > 0) ? len / steps : len);
      var lastTick = Date.now();

      // Store the value being faded to.
      sound._fadeTo = to;

      // Update the volume value on each interval tick.
      sound._interval = setInterval(function() {
        // Update the volume based on the time since the last tick.
        var tick = (Date.now() - lastTick) / len;
        lastTick = Date.now();
        vol += diff * tick;

        // Make sure the volume is in the right bounds.
        if (diff < 0) {
          vol = Math.max(to, vol);
        } else {
          vol = Math.min(to, vol);
        }

        // Round to within 2 decimal points.
        vol = Math.round(vol * 100) / 100;

        // Change the volume.
        if (self._webAudio) {
          sound._volume = vol;
        } else {
          self.volume(vol, sound._id, true);
        }

        // Set the group's volume.
        if (isGroup) {
          self._volume = vol;
        }

        // When the fade is complete, stop it and fire event.
        if ((to < from && vol <= to) || (to > from && vol >= to)) {
          clearInterval(sound._interval);
          sound._interval = null;
          sound._fadeTo = null;
          self.volume(to, sound._id);
          self._emit('fade', sound._id);
        }
      }, stepLen);
    },

    /**
     * Internal method that stops the currently playing fade when
     * a new fade starts, volume is changed or the sound is stopped.
     * @param  {Number} id The sound id.
     * @return {Howl}
     */
    _stopFade: function(id) {
      var self = this;
      var sound = self._soundById(id);

      if (sound && sound._interval) {
        if (self._webAudio) {
          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
        }

        clearInterval(sound._interval);
        sound._interval = null;
        self.volume(sound._fadeTo, id);
        sound._fadeTo = null;
        self._emit('fade', id);
      }

      return self;
    },

    /**
     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
     *   loop() -> Returns the group's loop value.
     *   loop(id) -> Returns the sound id's loop value.
     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
     *   loop(loop, id) -> Sets the loop value of passed sound id.
     * @return {Howl/Boolean} Returns self or current loop value.
     */
    loop: function() {
      var self = this;
      var args = arguments;
      var loop, id, sound;

      // Determine the values for loop and id.
      if (args.length === 0) {
        // Return the grou's loop value.
        return self._loop;
      } else if (args.length === 1) {
        if (typeof args[0] === 'boolean') {
          loop = args[0];
          self._loop = loop;
        } else {
          // Return this sound's loop value.
          sound = self._soundById(parseInt(args[0], 10));
          return sound ? sound._loop : false;
        }
      } else if (args.length === 2) {
        loop = args[0];
        id = parseInt(args[1], 10);
      }

      // If no id is passed, get all ID's to be looped.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        sound = self._soundById(ids[i]);

        if (sound) {
          sound._loop = loop;
          if (self._webAudio && sound._node && sound._node.bufferSource) {
            sound._node.bufferSource.loop = loop;
            if (loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop;
            }
          }
        }
      }

      return self;
    },

    /**
     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   rate() -> Returns the first sound node's current playback rate.
     *   rate(id) -> Returns the sound id's current playback rate.
     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
     *   rate(rate, id) -> Sets the playback rate of passed sound id.
     * @return {Howl/Number} Returns self or the current playback rate.
     */
    rate: function() {
      var self = this;
      var args = arguments;
      var rate, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current rate of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new rate value.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          rate = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        rate = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the playback rate or return the current value.
      var sound;
      if (typeof rate === 'number') {
        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
        if (self._state !== 'loaded' || self._playLock) {
          self._queue.push({
            event: 'rate',
            action: function() {
              self.rate.apply(self, args);
            }
          });

          return self;
        }

        // Set the group rate.
        if (typeof id === 'undefined') {
          self._rate = rate;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            // Keep track of our position when the rate changed and update the playback
            // start position so we can properly adjust the seek position for time elapsed.
            if (self.playing(id[i])) {
              sound._rateSeek = self.seek(id[i]);
              sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
            }
            sound._rate = rate;

            // Change the playback rate.
            if (self._webAudio && sound._node && sound._node.bufferSource) {
              sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler.ctx.currentTime);
            } else if (sound._node) {
              sound._node.playbackRate = rate;
            }

            // Reset the timers.
            var seek = self.seek(id[i]);
            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
            var timeout = (duration * 1000) / Math.abs(sound._rate);

            // Start a new end timer if sound is already playing.
            if (self._endTimers[id[i]] || !sound._paused) {
              self._clearTimer(id[i]);
              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
            }

            self._emit('rate', sound._id);
          }
        }
      } else {
        sound = self._soundById(id);
        return sound ? sound._rate : self._rate;
      }

      return self;
    },

    /**
     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   seek() -> Returns the first sound node's current seek position.
     *   seek(id) -> Returns the sound id's current seek position.
     *   seek(seek) -> Sets the seek position of the first sound node.
     *   seek(seek, id) -> Sets the seek position of passed sound id.
     * @return {Howl/Number} Returns self or the current seek position.
     */
    seek: function() {
      var self = this;
      var args = arguments;
      var seek, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current position of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new seek position.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else if (self._sounds.length) {
          id = self._sounds[0]._id;
          seek = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        seek = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // If there is no ID, bail out.
      if (typeof id === 'undefined') {
        return self;
      }

      // If the sound hasn't loaded, add it to the load queue to seek when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'seek',
          action: function() {
            self.seek.apply(self, args);
          }
        });

        return self;
      }

      // Get the sound.
      var sound = self._soundById(id);

      if (sound) {
        if (typeof seek === 'number' && seek >= 0) {
          // Pause the sound and update position for restarting playback.
          var playing = self.playing(id);
          if (playing) {
            self.pause(id, true);
          }

          // Move the position of the track and cancel timer.
          sound._seek = seek;
          sound._ended = false;
          self._clearTimer(id);

          // Update the seek position for HTML5 Audio.
          if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
            sound._node.currentTime = seek;
          }

          // Seek and emit when ready.
          var seekAndEmit = function() {
            self._emit('seek', id);

            // Restart the playback if the sound was playing.
            if (playing) {
              self.play(id, true);
            }
          };

          // Wait for the play lock to be unset before emitting (HTML5 Audio).
          if (playing && !self._webAudio) {
            var emitSeek = function() {
              if (!self._playLock) {
                seekAndEmit();
              } else {
                setTimeout(emitSeek, 0);
              }
            };
            setTimeout(emitSeek, 0);
          } else {
            seekAndEmit();
          }
        } else {
          if (self._webAudio) {
            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
          } else {
            return sound._node.currentTime;
          }
        }
      }

      return self;
    },

    /**
     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
     * @return {Boolean} True if playing and false if not.
     */
    playing: function(id) {
      var self = this;

      // Check the passed sound ID (if any).
      if (typeof id === 'number') {
        var sound = self._soundById(id);
        return sound ? !sound._paused : false;
      }

      // Otherwise, loop through all sounds and check if any are playing.
      for (var i=0; i<self._sounds.length; i++) {
        if (!self._sounds[i]._paused) {
          return true;
        }
      }

      return false;
    },

    /**
     * Get the duration of this sound. Passing a sound id will return the sprite duration.
     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
     * @return {Number} Audio duration in seconds.
     */
    duration: function(id) {
      var self = this;
      var duration = self._duration;

      // If we pass an ID, get the sound and return the sprite length.
      var sound = self._soundById(id);
      if (sound) {
        duration = self._sprite[sound._sprite][1] / 1000;
      }

      return duration;
    },

    /**
     * Returns the current loaded state of this Howl.
     * @return {String} 'unloaded', 'loading', 'loaded'
     */
    state: function() {
      return this._state;
    },

    /**
     * Unload and destroy the current Howl object.
     * This will immediately stop all sound instances attached to this group.
     */
    unload: function() {
      var self = this;

      // Stop playing any active sounds.
      var sounds = self._sounds;
      for (var i=0; i<sounds.length; i++) {
        // Stop the sound if it is currently playing.
        if (!sounds[i]._paused) {
          self.stop(sounds[i]._id);
        }

        // Remove the source or disconnect.
        if (!self._webAudio) {
          // Set the source to 0-second silence to stop any downloading (except in IE).
          self._clearSound(sounds[i]._node);

          // Remove any event listeners.
          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);

          // Release the Audio object back to the pool.
          Howler._releaseHtml5Audio(sounds[i]._node);
        }

        // Empty out all of the nodes.
        delete sounds[i]._node;

        // Make sure all timers are cleared out.
        self._clearTimer(sounds[i]._id);
      }

      // Remove the references in the global Howler object.
      var index = Howler._howls.indexOf(self);
      if (index >= 0) {
        Howler._howls.splice(index, 1);
      }

      // Delete this sound from the cache (if no other Howl is using it).
      var remCache = true;
      for (i=0; i<Howler._howls.length; i++) {
        if (Howler._howls[i]._src === self._src || self._src.indexOf(Howler._howls[i]._src) >= 0) {
          remCache = false;
          break;
        }
      }

      if (cache && remCache) {
        delete cache[self._src];
      }

      // Clear global errors.
      Howler.noAudio = false;

      // Clear out `self`.
      self._state = 'unloaded';
      self._sounds = [];
      self = null;

      return null;
    },

    /**
     * Listen to a custom event.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
     * @return {Howl}
     */
    on: function(event, fn, id, once) {
      var self = this;
      var events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
      }

      return self;
    },

    /**
     * Remove a custom event. Call without parameters to remove all events.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
     * @param  {Number}   id    (optional) Only remove events for this sound.
     * @return {Howl}
     */
    off: function(event, fn, id) {
      var self = this;
      var events = self['_on' + event];
      var i = 0;

      // Allow passing just an event and ID.
      if (typeof fn === 'number') {
        id = fn;
        fn = null;
      }

      if (fn || id) {
        // Loop through event store and remove the passed function.
        for (i=0; i<events.length; i++) {
          var isId = (id === events[i].id);
          if (fn === events[i].fn && isId || !fn && isId) {
            events.splice(i, 1);
            break;
          }
        }
      } else if (event) {
        // Clear out all events of this type.
        self['_on' + event] = [];
      } else {
        // Clear out all events of every type.
        var keys = Object.keys(self);
        for (i=0; i<keys.length; i++) {
          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
            self[keys[i]] = [];
          }
        }
      }

      return self;
    },

    /**
     * Listen to a custom event and remove it once fired.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @return {Howl}
     */
    once: function(event, fn, id) {
      var self = this;

      // Setup the event listener.
      self.on(event, fn, id, 1);

      return self;
    },

    /**
     * Emit all events of a specific type and pass the sound id.
     * @param  {String} event Event name.
     * @param  {Number} id    Sound ID.
     * @param  {Number} msg   Message to go with event.
     * @return {Howl}
     */
    _emit: function(event, id, msg) {
      var self = this;
      var events = self['_on' + event];

      // Loop through event store and fire all functions.
      for (var i=events.length-1; i>=0; i--) {
        // Only fire the listener if the correct ID is used.
        if (!events[i].id || events[i].id === id || event === 'load') {
          setTimeout(function(fn) {
            fn.call(this, id, msg);
          }.bind(self, events[i].fn), 0);

          // If this event was setup with `once`, remove it.
          if (events[i].once) {
            self.off(event, events[i].fn, events[i].id);
          }
        }
      }

      // Pass the event type into load queue so that it can continue stepping.
      self._loadQueue(event);

      return self;
    },

    /**
     * Queue of actions initiated before the sound has loaded.
     * These will be called in sequence, with the next only firing
     * after the previous has finished executing (even if async like play).
     * @return {Howl}
     */
    _loadQueue: function(event) {
      var self = this;

      if (self._queue.length > 0) {
        var task = self._queue[0];

        // Remove this task if a matching event was passed.
        if (task.event === event) {
          self._queue.shift();
          self._loadQueue();
        }

        // Run the task if no event type is passed.
        if (!event) {
          task.action();
        }
      }

      return self;
    },

    /**
     * Fired when playback ends at the end of the duration.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _ended: function(sound) {
      var self = this;
      var sprite = sound._sprite;

      // If we are using IE and there was network latency we may be clipping
      // audio before it completes playing. Lets check the node to make sure it
      // believes it has completed, before ending the playback.
      if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
        setTimeout(self._ended.bind(self, sound), 100);
        return self;
      }

      // Should this sound loop?
      var loop = !!(sound._loop || self._sprite[sprite][2]);

      // Fire the ended event.
      self._emit('end', sound._id);

      // Restart the playback for HTML5 Audio loop.
      if (!self._webAudio && loop) {
        self.stop(sound._id, true).play(sound._id);
      }

      // Restart this timer if on a Web Audio loop.
      if (self._webAudio && loop) {
        self._emit('play', sound._id);
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        sound._playStart = Howler.ctx.currentTime;

        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
      }

      // Mark the node as paused.
      if (self._webAudio && !loop) {
        sound._paused = true;
        sound._ended = true;
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        self._clearTimer(sound._id);

        // Clean up the buffer source.
        self._cleanBuffer(sound._node);

        // Attempt to auto-suspend AudioContext if no sounds are still playing.
        Howler._autoSuspend();
      }

      // When using a sprite, end the track.
      if (!self._webAudio && !loop) {
        self.stop(sound._id, true);
      }

      return self;
    },

    /**
     * Clear the end timer for a sound playback.
     * @param  {Number} id The sound ID.
     * @return {Howl}
     */
    _clearTimer: function(id) {
      var self = this;

      if (self._endTimers[id]) {
        // Clear the timeout or remove the ended listener.
        if (typeof self._endTimers[id] !== 'function') {
          clearTimeout(self._endTimers[id]);
        } else {
          var sound = self._soundById(id);
          if (sound && sound._node) {
            sound._node.removeEventListener('ended', self._endTimers[id], false);
          }
        }

        delete self._endTimers[id];
      }

      return self;
    },

    /**
     * Return the sound identified by this ID, or return null.
     * @param  {Number} id Sound ID
     * @return {Object}    Sound object or null.
     */
    _soundById: function(id) {
      var self = this;

      // Loop through all sounds and find the one with this ID.
      for (var i=0; i<self._sounds.length; i++) {
        if (id === self._sounds[i]._id) {
          return self._sounds[i];
        }
      }

      return null;
    },

    /**
     * Return an inactive sound from the pool or create a new one.
     * @return {Sound} Sound playback object.
     */
    _inactiveSound: function() {
      var self = this;

      self._drain();

      // Find the first inactive node to recycle.
      for (var i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          return self._sounds[i].reset();
        }
      }

      // If no inactive node was found, create a new one.
      return new Sound(self);
    },

    /**
     * Drain excess inactive sounds from the pool.
     */
    _drain: function() {
      var self = this;
      var limit = self._pool;
      var cnt = 0;
      var i = 0;

      // If there are less sounds than the max pool size, we are done.
      if (self._sounds.length < limit) {
        return;
      }

      // Count the number of inactive sounds.
      for (i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          cnt++;
        }
      }

      // Remove excess inactive sounds, going in reverse order.
      for (i=self._sounds.length - 1; i>=0; i--) {
        if (cnt <= limit) {
          return;
        }

        if (self._sounds[i]._ended) {
          // Disconnect the audio source when using Web Audio.
          if (self._webAudio && self._sounds[i]._node) {
            self._sounds[i]._node.disconnect(0);
          }

          // Remove sounds until we have the pool size.
          self._sounds.splice(i, 1);
          cnt--;
        }
      }
    },

    /**
     * Get all ID's from the sounds pool.
     * @param  {Number} id Only return one ID if one is passed.
     * @return {Array}    Array of IDs.
     */
    _getSoundIds: function(id) {
      var self = this;

      if (typeof id === 'undefined') {
        var ids = [];
        for (var i=0; i<self._sounds.length; i++) {
          ids.push(self._sounds[i]._id);
        }

        return ids;
      } else {
        return [id];
      }
    },

    /**
     * Load the sound back into the buffer source.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _refreshBuffer: function(sound) {
      var self = this;

      // Setup the buffer source for playback.
      sound._node.bufferSource = Howler.ctx.createBufferSource();
      sound._node.bufferSource.buffer = cache[self._src];

      // Connect to the correct node.
      if (sound._panner) {
        sound._node.bufferSource.connect(sound._panner);
      } else {
        sound._node.bufferSource.connect(sound._node);
      }

      // Setup looping and playback rate.
      sound._node.bufferSource.loop = sound._loop;
      if (sound._loop) {
        sound._node.bufferSource.loopStart = sound._start || 0;
        sound._node.bufferSource.loopEnd = sound._stop || 0;
      }
      sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler.ctx.currentTime);

      return self;
    },

    /**
     * Prevent memory leaks by cleaning up the buffer source after playback.
     * @param  {Object} node Sound's audio node containing the buffer source.
     * @return {Howl}
     */
    _cleanBuffer: function(node) {
      var self = this;
      var isIOS = Howler._navigator && Howler._navigator.vendor.indexOf('Apple') >= 0;

      if (Howler._scratchBuffer && node.bufferSource) {
        node.bufferSource.onended = null;
        node.bufferSource.disconnect(0);
        if (isIOS) {
          try { node.bufferSource.buffer = Howler._scratchBuffer; } catch(e) {}
        }
      }
      node.bufferSource = null;

      return self;
    },

    /**
     * Set the source to a 0-second silence to stop any downloading (except in IE).
     * @param  {Object} node Audio node to clear.
     */
    _clearSound: function(node) {
      var checkIE = /MSIE |Trident\//.test(Howler._navigator && Howler._navigator.userAgent);
      if (!checkIE) {
        node.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      }
    }
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Setup the sound object, which each node attached to a Howl group is contained in.
   * @param {Object} howl The Howl parent group.
   */
  var Sound = function(howl) {
    this._parent = howl;
    this.init();
  };
  Sound.prototype = {
    /**
     * Initialize a new Sound object.
     * @return {Sound}
     */
    init: function() {
      var self = this;
      var parent = self._parent;

      // Setup the default parameters.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a unique ID for this sound.
      self._id = ++Howler._counter;

      // Add itself to the parent's pool.
      parent._sounds.push(self);

      // Create the new node.
      self.create();

      return self;
    },

    /**
     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
     * @return {Sound}
     */
    create: function() {
      var self = this;
      var parent = self._parent;
      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume;

      if (parent._webAudio) {
        // Create the gain node for controlling volume (the source will connect to this).
        self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
        self._node.paused = true;
        self._node.connect(Howler.masterGain);
      } else if (!Howler.noAudio) {
        // Get an unlocked Audio object from the pool.
        self._node = Howler._obtainHtml5Audio();

        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
        self._errorFn = self._errorListener.bind(self);
        self._node.addEventListener('error', self._errorFn, false);

        // Listen for 'canplaythrough' event to let us know the sound is ready.
        self._loadFn = self._loadListener.bind(self);
        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

        // Setup the new audio node.
        self._node.src = parent._src;
        self._node.preload = parent._preload === true ? 'auto' : parent._preload;
        self._node.volume = volume * Howler.volume();

        // Begin loading the source.
        self._node.load();
      }

      return self;
    },

    /**
     * Reset the parameters of this sound to the original state (for recycle).
     * @return {Sound}
     */
    reset: function() {
      var self = this;
      var parent = self._parent;

      // Reset all of the parameters of this sound.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._rateSeek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a new ID so that it isn't confused with the previous sound.
      self._id = ++Howler._counter;

      return self;
    },

    /**
     * HTML5 Audio error listener callback.
     */
    _errorListener: function() {
      var self = this;

      // Fire an error event and pass back the code.
      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

      // Clear the event listener.
      self._node.removeEventListener('error', self._errorFn, false);
    },

    /**
     * HTML5 Audio canplaythrough listener callback.
     */
    _loadListener: function() {
      var self = this;
      var parent = self._parent;

      // Round up the duration to account for the lower precision in HTML5 Audio.
      parent._duration = Math.ceil(self._node.duration * 10) / 10;

      // Setup a sprite if none is defined.
      if (Object.keys(parent._sprite).length === 0) {
        parent._sprite = {__default: [0, parent._duration * 1000]};
      }

      if (parent._state !== 'loaded') {
        parent._state = 'loaded';
        parent._emit('load');
        parent._loadQueue();
      }

      // Clear the event listener.
      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
    }
  };

  /** Helper Methods **/
  /***************************************************************************/

  var cache = {};

  /**
   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
   * @param  {Howl} self
   */
  var loadBuffer = function(self) {
    var url = self._src;

    // Check if the buffer has already been cached and use it instead.
    if (cache[url]) {
      // Set the duration from the cache.
      self._duration = cache[url].duration;

      // Load the sound into this Howl.
      loadSound(self);

      return;
    }

    if (/^data:[^;]+;base64,/.test(url)) {
      // Decode the base64 data URI without XHR, since some browsers don't support it.
      var data = atob(url.split(',')[1]);
      var dataView = new Uint8Array(data.length);
      for (var i=0; i<data.length; ++i) {
        dataView[i] = data.charCodeAt(i);
      }

      decodeAudioData(dataView.buffer, self);
    } else {
      // Load the buffer from the URL.
      var xhr = new XMLHttpRequest();
      xhr.open(self._xhr.method, url, true);
      xhr.withCredentials = self._xhr.withCredentials;
      xhr.responseType = 'arraybuffer';

      // Apply any custom headers to the request.
      if (self._xhr.headers) {
        Object.keys(self._xhr.headers).forEach(function(key) {
          xhr.setRequestHeader(key, self._xhr.headers[key]);
        });
      }

      xhr.onload = function() {
        // Make sure we get a successful response back.
        var code = (xhr.status + '')[0];
        if (code !== '0' && code !== '2' && code !== '3') {
          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
          return;
        }

        decodeAudioData(xhr.response, self);
      };
      xhr.onerror = function() {
        // If there is an error, switch to HTML5 Audio.
        if (self._webAudio) {
          self._html5 = true;
          self._webAudio = false;
          self._sounds = [];
          delete cache[url];
          self.load();
        }
      };
      safeXhrSend(xhr);
    }
  };

  /**
   * Send the XHR request wrapped in a try/catch.
   * @param  {Object} xhr XHR to send.
   */
  var safeXhrSend = function(xhr) {
    try {
      xhr.send();
    } catch (e) {
      xhr.onerror();
    }
  };

  /**
   * Decode audio data from an array buffer.
   * @param  {ArrayBuffer} arraybuffer The audio data.
   * @param  {Howl}        self
   */
  var decodeAudioData = function(arraybuffer, self) {
    // Fire a load error if something broke.
    var error = function() {
      self._emit('loaderror', null, 'Decoding audio data failed.');
    };

    // Load the sound on success.
    var success = function(buffer) {
      if (buffer && self._sounds.length > 0) {
        cache[self._src] = buffer;
        loadSound(self, buffer);
      } else {
        error();
      }
    };

    // Decode the buffer into an audio source.
    if (typeof Promise !== 'undefined' && Howler.ctx.decodeAudioData.length === 1) {
      Howler.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
    } else {
      Howler.ctx.decodeAudioData(arraybuffer, success, error);
    }
  }

  /**
   * Sound is now loaded, so finish setting everything up and fire the loaded event.
   * @param  {Howl} self
   * @param  {Object} buffer The decoded buffer sound source.
   */
  var loadSound = function(self, buffer) {
    // Set the duration.
    if (buffer && !self._duration) {
      self._duration = buffer.duration;
    }

    // Setup a sprite if none is defined.
    if (Object.keys(self._sprite).length === 0) {
      self._sprite = {__default: [0, self._duration * 1000]};
    }

    // Fire the loaded event.
    if (self._state !== 'loaded') {
      self._state = 'loaded';
      self._emit('load');
      self._loadQueue();
    }
  };

  /**
   * Setup the audio context when available, or switch to HTML5 Audio mode.
   */
  var setupAudioContext = function() {
    // If we have already detected that Web Audio isn't supported, don't run this step again.
    if (!Howler.usingWebAudio) {
      return;
    }

    // Check if we are using Web Audio and setup the AudioContext if we are.
    try {
      if (typeof AudioContext !== 'undefined') {
        Howler.ctx = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        Howler.ctx = new webkitAudioContext();
      } else {
        Howler.usingWebAudio = false;
      }
    } catch(e) {
      Howler.usingWebAudio = false;
    }

    // If the audio context creation still failed, set using web audio to false.
    if (!Howler.ctx) {
      Howler.usingWebAudio = false;
    }

    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
    // If it is, disable Web Audio as it causes crashing.
    var iOS = (/iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform));
    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    var version = appVersion ? parseInt(appVersion[1], 10) : null;
    if (iOS && version && version < 9) {
      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
      if (Howler._navigator && !safari) {
        Howler.usingWebAudio = false;
      }
    }

    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
    if (Howler.usingWebAudio) {
      Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
      Howler.masterGain.gain.setValueAtTime(Howler._muted ? 0 : Howler._volume, Howler.ctx.currentTime);
      Howler.masterGain.connect(Howler.ctx.destination);
    }

    // Re-run the setup on Howler.
    Howler._setup();
  };

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return {
        Howler: Howler,
        Howl: Howl
      };
    });
  }

  // Add support for CommonJS libraries such as browserify.
  if (typeof exports !== 'undefined') {
    exports.Howler = Howler;
    exports.Howl = Howl;
  }

  // Add to global in Node.js (for testing, etc).
  if (typeof global !== 'undefined') {
    global.HowlerGlobal = HowlerGlobal;
    global.Howler = Howler;
    global.Howl = Howl;
    global.Sound = Sound;
  } else if (typeof window !== 'undefined') {  // Define globally in case AMD is not available or unused.
    window.HowlerGlobal = HowlerGlobal;
    window.Howler = Howler;
    window.Howl = Howl;
    window.Sound = Sound;
  }
})();


/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.2.0
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  // Setup default properties.
  HowlerGlobal.prototype._pos = [0, 0, 0];
  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Helper method to update the stereo panning position of all current Howls.
   * Future Howls will not use this value unless explicitly set.
   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
   * @return {Howler/Number}     Self or current stereo panning value.
   */
  HowlerGlobal.prototype.stereo = function(pan) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Loop through all Howls and update their stereo panning.
    for (var i=self._howls.length-1; i>=0; i--) {
      self._howls[i].stereo(pan);
    }

    return self;
  };

  /**
   * Get/set the position of the listener in 3D cartesian space. Sounds using
   * 3D position will be relative to the listener's position.
   * @param  {Number} x The x-position of the listener.
   * @param  {Number} y The y-position of the listener.
   * @param  {Number} z The z-position of the listener.
   * @return {Howler/Array}   Self or current listener position.
   */
  HowlerGlobal.prototype.pos = function(x, y, z) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._pos[1] : y;
    z = (typeof z !== 'number') ? self._pos[2] : z;

    if (typeof x === 'number') {
      self._pos = [x, y, z];

      if (typeof self.ctx.listener.positionX !== 'undefined') {
        self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
      }
    } else {
      return self._pos;
    }

    return self;
  };

  /**
   * Get/set the direction the listener is pointing in the 3D cartesian space.
   * A front and up vector must be provided. The front is the direction the
   * face of the listener is pointing, and up is the direction the top of the
   * listener is pointing. Thus, these values are expected to be at right angles
   * from each other.
   * @param  {Number} x   The x-orientation of the listener.
   * @param  {Number} y   The y-orientation of the listener.
   * @param  {Number} z   The z-orientation of the listener.
   * @param  {Number} xUp The x-orientation of the top of the listener.
   * @param  {Number} yUp The y-orientation of the top of the listener.
   * @param  {Number} zUp The z-orientation of the top of the listener.
   * @return {Howler/Array}     Returns self or the current orientation vectors.
   */
  HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    var or = self._orientation;
    y = (typeof y !== 'number') ? or[1] : y;
    z = (typeof z !== 'number') ? or[2] : z;
    xUp = (typeof xUp !== 'number') ? or[3] : xUp;
    yUp = (typeof yUp !== 'number') ? or[4] : yUp;
    zUp = (typeof zUp !== 'number') ? or[5] : zUp;

    if (typeof x === 'number') {
      self._orientation = [x, y, z, xUp, yUp, zUp];

      if (typeof self.ctx.listener.forwardX !== 'undefined') {
        self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
      }
    } else {
      return or;
    }

    return self;
  };

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core init.
   * @param  {Function} _super Core init method.
   * @return {Howl}
   */
  Howl.prototype.init = (function(_super) {
    return function(o) {
      var self = this;

      // Setup user-defined default properties.
      self._orientation = o.orientation || [1, 0, 0];
      self._stereo = o.stereo || null;
      self._pos = o.pos || null;
      self._pannerAttr = {
        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
      };

      // Setup event listeners.
      self._onstereo = o.onstereo ? [{fn: o.onstereo}] : [];
      self._onpos = o.onpos ? [{fn: o.onpos}] : [];
      self._onorientation = o.onorientation ? [{fn: o.onorientation}] : [];

      // Complete initilization with howler.js core's init function.
      return _super.call(this, o);
    };
  })(Howl.prototype.init);

  /**
   * Get/set the stereo panning of the audio source for this sound or all in the group.
   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Number}    Returns self or the current stereo panning value.
   */
  Howl.prototype.stereo = function(pan, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'stereo',
        action: function() {
          self.stereo(pan, id);
        }
      });

      return self;
    }

    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
    var pannerType = (typeof Howler.ctx.createStereoPanner === 'undefined') ? 'spatial' : 'stereo';

    // Setup the group's stereo panning if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's stereo panning if no parameters are passed.
      if (typeof pan === 'number') {
        self._stereo = pan;
        self._pos = [pan, 0, 0];
      } else {
        return self._stereo;
      }
    }

    // Change the streo panning of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof pan === 'number') {
          sound._stereo = pan;
          sound._pos = [pan, 0, 0];

          if (sound._node) {
            // If we are falling back, make sure the panningModel is equalpower.
            sound._pannerAttr.panningModel = 'equalpower';

            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || !sound._panner.pan) {
              setupPanner(sound, pannerType);
            }

            if (pannerType === 'spatial') {
              if (typeof sound._panner.positionX !== 'undefined') {
                sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
              } else {
                sound._panner.setPosition(pan, 0, 0);
              }
            } else {
              sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
            }
          }

          self._emit('stereo', sound._id);
        } else {
          return sound._stereo;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the 3D spatial position of the audio source for this sound or group relative to the global listener.
   * @param  {Number} x  The x-position of the audio source.
   * @param  {Number} y  The y-position of the audio source.
   * @param  {Number} z  The z-position of the audio source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
   */
  Howl.prototype.pos = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change position when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'pos',
        action: function() {
          self.pos(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? 0 : y;
    z = (typeof z !== 'number') ? -0.5 : z;

    // Setup the group's spatial position if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial position if no parameters are passed.
      if (typeof x === 'number') {
        self._pos = [x, y, z];
      } else {
        return self._pos;
      }
    }

    // Change the spatial position of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._pos = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || sound._panner.pan) {
              setupPanner(sound, 'spatial');
            }

            if (typeof sound._panner.positionX !== 'undefined') {
              sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
            } else {
              sound._panner.setPosition(x, y, z);
            }
          }

          self._emit('pos', sound._id);
        } else {
          return sound._pos;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
   * space. Depending on how direction the sound is, based on the `cone` attributes,
   * a sound pointing away from the listener can be quiet or silent.
   * @param  {Number} x  The x-orientation of the source.
   * @param  {Number} y  The y-orientation of the source.
   * @param  {Number} z  The z-orientation of the source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
   */
  Howl.prototype.orientation = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'orientation',
        action: function() {
          self.orientation(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._orientation[1] : y;
    z = (typeof z !== 'number') ? self._orientation[2] : z;

    // Setup the group's spatial orientation if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial orientation if no parameters are passed.
      if (typeof x === 'number') {
        self._orientation = [x, y, z];
      } else {
        return self._orientation;
      }
    }

    // Change the spatial orientation of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._orientation = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner) {
              // Make sure we have a position to setup the node with.
              if (!sound._pos) {
                sound._pos = self._pos || [0, 0, -0.5];
              }

              setupPanner(sound, 'spatial');
            }

            if (typeof sound._panner.orientationX !== 'undefined') {
              sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
              sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
              sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(x, y, z);
            }
          }

          self._emit('orientation', sound._id);
        } else {
          return sound._orientation;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the panner node's attributes for a sound or group of sounds.
   * This method can optionall take 0, 1 or 2 arguments.
   *   pannerAttr() -> Returns the group's values.
   *   pannerAttr(id) -> Returns the sound id's values.
   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
   *   pannerAttr(o, id) -> Set's the values of passed sound id.
   *
   *   Attributes:
   *     coneInnerAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      inside of which there will be no volume reduction.
   *     coneOuterAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      outside of which the volume will be reduced to a constant value of `coneOuterGain`.
   *     coneOuterGain - (0 by default) A parameter for directional audio sources, this is the gain outside of the
   *                     `coneOuterAngle`. It is a linear value in the range `[0, 1]`.
   *     distanceModel - ('inverse' by default) Determines algorithm used to reduce volume as audio moves away from
   *                     listener. Can be `linear`, `inverse` or `exponential.
   *     maxDistance - (10000 by default) The maximum distance between source and listener, after which the volume
   *                   will not be reduced any further.
   *     refDistance - (1 by default) A reference distance for reducing volume as source moves further from the listener.
   *                   This is simply a variable of the distance model and has a different effect depending on which model
   *                   is used and the scale of your coordinates. Generally, volume will be equal to 1 at this distance.
   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener. This is simply a
   *                     variable of the distance model and can be in the range of `[0, 1]` with `linear` and `[0, ∞]`
   *                     with `inverse` and `exponential`.
   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
   *                     Can be `HRTF` or `equalpower`.
   *
   * @return {Howl/Object} Returns self or current panner attributes.
   */
  Howl.prototype.pannerAttr = function() {
    var self = this;
    var args = arguments;
    var o, id, sound;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // Determine the values based on arguments.
    if (args.length === 0) {
      // Return the group's panner attribute values.
      return self._pannerAttr;
    } else if (args.length === 1) {
      if (typeof args[0] === 'object') {
        o = args[0];

        // Set the grou's panner attribute values.
        if (typeof id === 'undefined') {
          if (!o.pannerAttr) {
            o.pannerAttr = {
              coneInnerAngle: o.coneInnerAngle,
              coneOuterAngle: o.coneOuterAngle,
              coneOuterGain: o.coneOuterGain,
              distanceModel: o.distanceModel,
              maxDistance: o.maxDistance,
              refDistance: o.refDistance,
              rolloffFactor: o.rolloffFactor,
              panningModel: o.panningModel
            };
          }

          self._pannerAttr = {
            coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== 'undefined' ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
            coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== 'undefined' ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
            coneOuterGain: typeof o.pannerAttr.coneOuterGain !== 'undefined' ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
            distanceModel: typeof o.pannerAttr.distanceModel !== 'undefined' ? o.pannerAttr.distanceModel : self._distanceModel,
            maxDistance: typeof o.pannerAttr.maxDistance !== 'undefined' ? o.pannerAttr.maxDistance : self._maxDistance,
            refDistance: typeof o.pannerAttr.refDistance !== 'undefined' ? o.pannerAttr.refDistance : self._refDistance,
            rolloffFactor: typeof o.pannerAttr.rolloffFactor !== 'undefined' ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
            panningModel: typeof o.pannerAttr.panningModel !== 'undefined' ? o.pannerAttr.panningModel : self._panningModel
          };
        }
      } else {
        // Return this sound's panner attribute values.
        sound = self._soundById(parseInt(args[0], 10));
        return sound ? sound._pannerAttr : self._pannerAttr;
      }
    } else if (args.length === 2) {
      o = args[0];
      id = parseInt(args[1], 10);
    }

    // Update the values of the specified sounds.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      sound = self._soundById(ids[i]);

      if (sound) {
        // Merge the new values into the sound.
        var pa = sound._pannerAttr;
        pa = {
          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor,
          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel
        };

        // Update the panner values or create a new panner if none exists.
        var panner = sound._panner;
        if (panner) {
          panner.coneInnerAngle = pa.coneInnerAngle;
          panner.coneOuterAngle = pa.coneOuterAngle;
          panner.coneOuterGain = pa.coneOuterGain;
          panner.distanceModel = pa.distanceModel;
          panner.maxDistance = pa.maxDistance;
          panner.refDistance = pa.refDistance;
          panner.rolloffFactor = pa.rolloffFactor;
          panner.panningModel = pa.panningModel;
        } else {
          // Make sure we have a position to setup the node with.
          if (!sound._pos) {
            sound._pos = self._pos || [0, 0, -0.5];
          }

          // Create a new panner node.
          setupPanner(sound, 'spatial');
        }
      }
    }

    return self;
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core Sound init.
   * @param  {Function} _super Core Sound init method.
   * @return {Sound}
   */
  Sound.prototype.init = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Setup user-defined default properties.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete initilization with howler.js core Sound's init function.
      _super.call(this);

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      }
    };
  })(Sound.prototype.init);

  /**
   * Override the Sound.reset method to clean up properties from the spatial plugin.
   * @param  {Function} _super Sound reset method.
   * @return {Sound}
   */
  Sound.prototype.reset = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Reset all spatial plugin properties on this sound.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      } else if (self._panner) {
        // Disconnect the panner.
        self._panner.disconnect(0);
        self._panner = undefined;
        parent._refreshBuffer(self);
      }

      // Complete resetting of the sound.
      return _super.call(this);
    };
  })(Sound.prototype.reset);

  /** Helper Methods **/
  /***************************************************************************/

  /**
   * Create a new panner node and save it on the sound.
   * @param  {Sound} sound Specific sound to setup panning on.
   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
   */
  var setupPanner = function(sound, type) {
    type = type || 'spatial';

    // Create the new panner node.
    if (type === 'spatial') {
      sound._panner = Howler.ctx.createPanner();
      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
      sound._panner.refDistance = sound._pannerAttr.refDistance;
      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
      sound._panner.panningModel = sound._pannerAttr.panningModel;

      if (typeof sound._panner.positionX !== 'undefined') {
        sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
        sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
        sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
      }

      if (typeof sound._panner.orientationX !== 'undefined') {
        sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
        sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
        sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
      }
    } else {
      sound._panner = Howler.ctx.createStereoPanner();
      sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
    }

    sound._panner.connect(sound._node);

    // Update the connections.
    if (!sound._paused) {
      sound._parent.pause(sound._id, true).play(sound._id, true);
    }
  };
})();

},{}],"index.js":[function(require,module,exports) {
"use strict";

var _tonal = require("@tonaljs/tonal");

var _chord = require("@tonaljs/chord");

var _howler = require("howler");

var sound = new Howl({
  src: ['assets/pianosprite.mp3'],
  onload: function onload() {
    console.log('Sound file has been loaded.');
    soundEngine.init();
  },
  onloaderror: function onloaderror(e, msg) {
    console.log('Error', e, msg);
  }
});
var startNotes = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
var startNotesSelector = document.querySelector('#start-note');
var octaveSelector = document.querySelector('#octave');
var buttons = document.querySelector('.buttons');
var intervalsInChord = document.querySelector('.intervals-in-chord');
var notesInChord = document.querySelector('.notes-in-chord');
var selectedStartNote = 'C';
var selectedOctave = '1';
var selectedChord;
var app = {
  init: function init() {
    this.setupStartNotes();
    this.setupOctaves();
    this.setupButtons();
    this.setupEventListeners();
  },
  setupStartNotes: function setupStartNotes() {
    var _this = this;

    startNotes.forEach(function (noteName) {
      var noteNameOption = _this.createElement('option', noteName);

      startNotesSelector.appendChild(noteNameOption);
    });
  },
  setupOctaves: function setupOctaves() {
    for (var i = 1; i <= 4; i++) {
      var octaveNumber = this.createElement('option', i);
      octaveSelector.appendChild(octaveNumber);
    }
  },
  setupButtons: function setupButtons() {
    var _this2 = this;

    var chordNames = _tonal.ChordType.all().map(function (entry) {
      return entry.aliases[0];
    });

    chordNames.forEach(function (chordName) {
      var chordButton = _this2.createElement('button', chordName);

      buttons.appendChild(chordButton);
    });
  },
  setupEventListeners: function setupEventListeners() {
    var _this3 = this;

    startNotesSelector.addEventListener('change', function () {
      selectedStartNote = startNotesSelector.value; // console.log(selectedStartNote);
    });
    octaveSelector.addEventListener('change', function () {
      selectedOctave = octaveSelector.value; // console.log(selectedOctave);
    });
    buttons.addEventListener('click', function (event) {
      //to prevent console of <div class='buttons'>
      if (event.target.classList.contains('buttons')) {
        return;
      }

      selectedChord = event.target.innerText;

      _this3.displayAndPlayChord(selectedChord);
    });
  },
  displayAndPlayChord: function displayAndPlayChord(selectedChord) {
    var chordIntervals = (0, _chord.chord)(selectedChord).intervals;
    intervalsInChord.innerText = chordIntervals.join('-');
    var startNoteWithOctave = selectedStartNote + selectedOctave;
    var chordNotes = chordIntervals.map(function (val) {
      return (0, _tonal.transpose)(startNoteWithOctave, val);
    });
    notesInChord.innerText = chordNotes.join('-');
    soundEngine.play(chordNotes);
  },
  createElement: function createElement(elementName, content) {
    var element = document.createElement(elementName);
    element.innerHTML = content;
    return element;
  }
};
var soundEngine = {
  init: function init() {
    //know the time difference between two notes
    var lengthOfNote = 2400;
    var timeIndex = 0;

    for (var i = 24; i <= 96; i++) {
      sound['_sprite'][i] = [timeIndex, lengthOfNote];
      timeIndex += lengthOfNote;
    } // sound.play('44');

  },
  play: function play(soundSequence) {
    var soundSequenceMidiNumbers = soundSequence.map(function (noteName) {
      return (0, _tonal.note)(noteName).midi;
    });
    sound.volume(0.75);
    soundSequenceMidiNumbers.forEach(function (noteMidiNumber) {
      // console.log(noteMidiNumber);
      sound.play(noteMidiNumber.toString());
    });
  }
};
app.init();
},{"@tonaljs/tonal":"../node_modules/@tonaljs/tonal/dist/index.es.js","@tonaljs/chord":"../node_modules/@tonaljs/chord/dist/index.es.js","howler":"../node_modules/howler/dist/howler.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "42911" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map