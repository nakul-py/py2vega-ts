/**
 * Maps Python operators to Vega operators
 */
export const OPERATOR_MAPPING: Record<string, string> = {
  Eq: "==",
  NotEq: "!=",
  Lt: "<",
  LtE: "<=",
  Gt: ">",
  GtE: ">=",
  And: "&&",
  Or: "||",
  Add: "+",
  Sub: "-",
  Mult: "*",
  Div: "/",
  Mod: "%",
  BitAnd: "&",
  BitOr: "|",
  Pow: "**",
};

/**
 * Maps Python constants to Vega constants
 */
export const CONSTANTS_MAPPING: Record<string, string> = {
  NaN: "NaN",
  E: "E",
  LN2: "LN2",
  LN10: "LN10",
  LOG2E: "LOG2E",
  LOG10E: "LOG10E",
  MAX_VALUE: "MAX_VALUE",
  MIN_VALUE: "MIN_VALUE",
  PI: "PI",
  SQRT1_2: "SQRT1_2",
  SQRT2: "SQRT2",
};

/**
 * Maps Python functions to Vega functions
 */

export const FUNCTION_MAPPING: Record<string, string> = {
  // --- Type Checking ---
  isArray: "isArray",
  isBoolean: "isBoolean",
  isDate: "isDate",
  isDefined: "isDefined",
  isNumber: "isNumber",
  isObject: "isObject",
  isRegExp: "isRegExp",
  isString: "isString",
  isValid: "isValid",

  // --- Type Coercion ---
  str: "toString",
  toString: "toString",
  bool: "toBoolean",
  toBoolean: "toBoolean",
  float: "toNumber",
  int: "toNumber",
  toNumber: "toNumber",
  toDate: "toDate",

  // --- Math ---
  abs: "abs",
  acos: "acos",
  asin: "asin",
  atan: "atan",
  atan2: "atan2",
  ceil: "ceil",
  clamp: "clamp",
  cos: "cos",
  exp: "exp",
  floor: "floor",
  hypot: "hypot",
  isNaN: "isNaN",
  isFinite: "isFinite",
  log: "log",
  max: "max",
  min: "min",
  pow: "pow",
  random: "random",
  round: "round",
  sin: "sin",
  sqrt: "sqrt",
  tan: "tan",

  // --- Statistical ---
  sampleNormal: "sampleNormal",
  cumulativeNormal: "cumulativeNormal",
  densityNormal: "densityNormal",
  quantileNormal: "quantileNormal",
  samplelogNormal: "sampleLogNormal",
  cumulativelogNormal: "cumulativeLogNormal",
  densitylogNormal: "densityLogNormal",
  quantilelogNormal: "quantileLogNormal",
  sampleUniform: "sampleUniform",
  cumulativeUniform: "cumulativeUniform",
  densityUniform: "densityUniform",
  quantileUniform: "quantileUniform",

  // --- Date-Time ---
  now: "now",
  datetime: "datetime",
  date: "date",
  day: "day",
  dayofyear: "dayofyear",
  year: "year",
  quarter: "quarter",
  month: "month",
  week: "week",
  hours: "hours",
  minutes: "minutes",
  seconds: "seconds",
  milliseconds: "milliseconds",
  time: "time",
  timezoneoffset: "timezoneoffset",
  timeOffset: "timeOffset",
  timeSequence: "timeSequence",
  utc: "utc",
  utcdate: "utcdate",
  utcday: "utcday",
  utcdayofyear: "utcdayofyear",
  utcyear: "utcyear",
  utcquarter: "utcquarter",
  utcmonth: "utcmonth",
  utcweek: "utcweek",
  utchours: "utchours",
  utcminutes: "utcminutes",
  utcseconds: "utcseconds",
  utcmilliseconds: "utcmilliseconds",
  utcOffset: "utcOffset",
  utcSequence: "utcSequence",

  // --- Array ---
  extent: "extent",
  clampRange: "clampRange",
  indexof: "indexof",
  inrange: "inrange",
  join: "join",
  lastindexof: "lastindexof",
  len: "length",
  length: "length",
  lerp: "lerp",
  peek: "peek",
  pluck: "pluck",
  reversed: "reverse",
  reverse: "reverse",
  sequence: "sequence",
  slice: "slice",
  sorted: "sort",
  sort: "sort",
  span: "span",

  // --- String ---
  upper: "upper",
  lower: "lower",
  pad: "pad",
  parseFloat: "parseFloat",
  parseInt: "parseInt",
  replace: "replace",
  split: "split",
  substring: "substring",
  trim: "trim",
  truncate: "truncate",
  btoa: "btoa",
  atob: "atob",
  encodeURIComponent: "encodeURIComponent",

  // --- Object ---
  merge: "merge",

  // --- Formatting ---
  dayFormat: "dayFormat",
  dayAbbrevFormat: "dayAbbrevFormat",
  format: "format",
  monthFormat: "monthFormat",
  monthAbbrevFormat: "monthAbbrevFormat",
  timeUnitSpecifier: "timeUnitSpecifier",
  timeFormat: "timeFormat",
  timeParse: "timeParse",
  utcFormat: "utcFormat",
  utcParse: "utcParse",

  // --- RegExp ---
  regexp: "regexp",
  test: "test",

  // --- Color ---
  rgb: "rgb",
  hsl: "hsl",
  lab: "lab",
  hcl: "hcl",
  luminance: "luminance",
  contrast: "contrast",

  // --- Event (requires a live Vega event/scenegraph — see note below) ---
  item: "item",
  group: "group",
  xy: "xy",
  x: "x",
  y: "y",
  pinchDistance: "pinchDistance",
  pinchAngle: "pinchAngle",
  inScope: "inScope",

  // --- Data (requires a Vega view's data sets) ---
  data: "data",
  indata: "indata",

  // --- Scale & Projection (requires a Vega view's scale registry) ---
  scale: "scale",
  invert: "invert",
  copy: "copy",
  domain: "domain",
  range: "range",
  bandwidth: "bandwidth",
  bandspace: "bandspace",
  gradient: "gradient",
  panLinear: "panLinear",
  panLog: "panLog",
  panPow: "panPow",
  panSymlog: "panSymlog",
  zoomLinear: "zoomLinear",
  zoomLog: "zoomLog",
  zoomPow: "zoomPow",
  zoomSymlog: "zoomSymlog",

  // --- Geographic (requires a Vega view's projection registry) ---
  geoArea: "geoArea",
  geoBounds: "geoBounds",
  geoCentroid: "geoCentroid",
  geoScale: "geoScale",

  // --- Tree/Hierarchy (requires stratify/nest data sets) ---
  treePath: "treePath",
  treeAncestors: "treeAncestors",

  // --- Browser (requires a DOM/window context) ---
  containerSize: "containerSize",
  screen: "screen",
  windowSize: "windowSize",

  // --- Logging ---
  warn: "warn",
  info: "info",
  debug: "debug",
};
