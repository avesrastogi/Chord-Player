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
},{}],"../node_modules/@tonaljs/collection/dist/index.es.js":[function(require,module,exports) {
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
},{"@tonaljs/chord-detect":"../node_modules/@tonaljs/chord-detect/dist/index.es.js","@tonaljs/chord-type":"../node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/core":"../node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"../node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/scale-type":"../node_modules/@tonaljs/scale-type/dist/index.es.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _chord = require("@tonaljs/chord");
},{"@tonaljs/chord":"../node_modules/@tonaljs/chord/dist/index.es.js"}],"../../.nvm/versions/node/v14.8.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "40885" + '/');

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
},{}]},{},["../../.nvm/versions/node/v14.8.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map