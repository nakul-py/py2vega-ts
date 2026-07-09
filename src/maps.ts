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
  isarray: "isArray",
  isboolean: "isBoolean",
  isdate: "isDate",
  isdefined: "isDefined",
  isnumber: "isNumber",
  isobject: "isObject",
  isregexp: "isRegExp",
  isstring: "isString",
  isvalid: "isValid",

  // --- Type Coercion ---
  str: "toString",
  tostring: "toString",
  bool: "toBoolean",
  toboolean: "toBoolean",
  float: "toNumber",
  int: "toNumber",
  tonumber: "toNumber",
  todate: "toDate",

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
  isnan: "isNaN",
  isfinite: "isFinite",
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
  samplenormal: "sampleNormal",
  cumulativenormal: "cumulativeNormal",
  densitynormal: "densityNormal",
  quantilenormal: "quantileNormal",
  samplelognormal: "sampleLogNormal",
  cumulativelognormal: "cumulativeLogNormal",
  densitylognormal: "densityLogNormal",
  quantilelognormal: "quantileLogNormal",
  sampleuniform: "sampleUniform",
  cumulativeuniform: "cumulativeUniform",
  densityuniform: "densityUniform",
  quantileuniform: "quantileUniform",

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
  timeoffset: "timeOffset",
  timesequence: "timeSequence",
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
  utcoffset: "utcOffset",
  utcsequence: "utcSequence",

  // --- Array ---
  extent: "extent",
  clamprange: "clampRange",
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
  parsefloat: "parseFloat",
  parseint: "parseInt",
  replace: "replace",
  split: "split",
  substring: "substring",
  trim: "trim",
  truncate: "truncate",
  btoa: "btoa",
  atob: "atob",
  encodeuricomponent: "encodeURIComponent",

  // --- Object ---
  merge: "merge",

  // --- Formatting ---
  dayformat: "dayFormat",
  dayabbrevformat: "dayAbbrevFormat",
  format: "format",
  monthformat: "monthFormat",
  monthabbrevformat: "monthAbbrevFormat",
  timeunitspecifier: "timeUnitSpecifier",
  timeformat: "timeFormat",
  timeparse: "timeParse",
  utcformat: "utcFormat",
  utcparse: "utcParse",

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
  pinchdistance: "pinchDistance",
  pinchangle: "pinchAngle",
  inscope: "inScope",

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
  panlinear: "panLinear",
  panlog: "panLog",
  panpow: "panPow",
  pansymlog: "panSymlog",
  zoomlinear: "zoomLinear",
  zoomlog: "zoomLog",
  zoompow: "zoomPow",
  zoomsymlog: "zoomSymlog",

  // --- Geographic (requires a Vega view's projection registry) ---
  geoarea: "geoArea",
  geobounds: "geoBounds",
  geocentroid: "geoCentroid",
  geoscale: "geoScale",

  // --- Tree/Hierarchy (requires stratify/nest data sets) ---
  treepath: "treePath",
  treeancestors: "treeAncestors",

  // --- Browser (requires a DOM/window context) ---
  containersize: "containerSize",
  screen: "screen",
  windowsize: "windowSize",

  // --- Logging ---
  warn: "warn",
  info: "info",
  debug: "debug",
};
