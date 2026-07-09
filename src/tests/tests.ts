import { py2vega, Py2VegaError } from "../main.js";

interface TestResult {
  name: string;
  passed: boolean;
  expected?: any;
  actual?: any;
}

const results: TestResult[] = [];

function assertEqual(actual: any, expected: any, name: string) {
  const passed = actual === expected;
  results.push({ name, passed, expected, actual: passed ? undefined : actual });
}

function test(name: string, fn: () => void) {
  try {
    fn();
  } catch (e) {
    results.push({
      name,
      passed: false,
      expected: "no error",
      actual: (e as Error).message,
    });
  }
}

function expectError(name: string, fn: () => void) {
  try {
    fn();
    results.push({
      name,
      passed: false,
      expected: "error",
      actual: "no error thrown",
    });
  } catch (e) {
    if (e instanceof Py2VegaError) {
      results.push({ name, passed: true });
    } else {
      results.push({
        name,
        passed: false,
        expected: "Py2VegaError",
        actual: (e as Error).message,
      });
    }
  }
}

function printResults() {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;

  console.log(
    `\n${results.length} tests → ${passed} passed, ${failed} failed\n`
  );

  results.forEach((r) => {
    console.log(`${r.passed ? "✅" : "❌"} ${r.name}`);
    if (!r.passed) {
      console.log(`   expected: ${r.expected}`);
      console.log(`   got:      ${r.actual}`);
    }
  });

  return failed === 0 ? 0 : 1;
}

//
// CORE EXPRESSIONS
//
test("simple comparison", () => {
  assertEqual(py2vega("datum.value > 100"), "datum.value > 100", "comparison");
});

test("equality check", () => {
  assertEqual(
    py2vega("datum.status == 'alert'"),
    "datum.status == 'alert'",
    "equality"
  );
});

test("binary arithmetic", () => {
  assertEqual(py2vega("datum.a + datum.b"), "datum.a + datum.b", "addition");
});

//
// COLLECTIONS
//
test("list", () => {
  assertEqual(py2vega("[1, 2, 3]"), "[1, 2, 3]", "list");
});

test("tuple", () => {
  assertEqual(py2vega("(1, 2, 3)"), "[1, 2, 3]", "tuple");
});

test("dict", () => {
  assertEqual(py2vega("{'a': 1, 'b': 2}"), "{'a': 1, 'b': 2}", "dict");
});

//
// TERNARY
//
test("simple ternary", () => {
  assertEqual(
    py2vega("'red' if datum.status == 'alert' else 'green'"),
    "(datum.status == 'alert') ? 'red' : 'green'",
    "ternary"
  );
});

test("complex ternary", () => {
  assertEqual(
    py2vega("abs(datum.value) * 2 if datum.active else 0"),
    "datum.active ? (abs(datum.value) * 2) : 0",
    "complex ternary"
  );
});

//
// FUNCTIONS
//
test("abs function call", () => {
  assertEqual(py2vega("abs(datum.value)"), "abs(datum.value)", "abs()");
});

test("rgb function call", () => {
  assertEqual(py2vega("rgb(255, 0, 0)"), "rgb(255, 0, 0)", "rgb()");
});

test("upper function call", () => {
  assertEqual(py2vega("upper(datum.name)"), "upper(datum.name)", "upper()");
});

test("lower function call", () => {
  assertEqual(py2vega("lower(datum.name)"), "lower(datum.name)", "lower()");
});

test("sort function call", () => {
  assertEqual(py2vega("sorted(datum.name)"), "sort(datum.name)", "sort()");
});

test("len function call", () => {
  assertEqual(py2vega("len(datum.name)"), "length(datum.name)", "len()");
});

test("max function call", () => {
  assertEqual(py2vega("max(datum.name)"), "max(datum.name)", "max()");
});

test("min function call", () => {
  assertEqual(py2vega("min(datum.name)"), "min(datum.name)", "min()");
});

test("str function call", () => {
  assertEqual(py2vega("str(datum.name)"), "toString(datum.name)", "str()");
});

test("bool function call", () => {
  assertEqual(py2vega("bool(datum.name)"), "toBoolean(datum.name)", "bool()");
});

test("float function call", () => {
  assertEqual(py2vega("float(datum.name)"), "toNumber(datum.name)", "float()");
});

test("floor function call", () => {
  assertEqual(py2vega("floor(datum.name)"), "floor(datum.name)", "floor()");
});

test("ceil function call", () => {
  assertEqual(py2vega("ceil(datum.name)"), "ceil(datum.name)", "ceil()");
});

test("round function call", () => {
  assertEqual(py2vega("round(datum.name)"), "round(datum.name)", "round()");
});

test("trim function call", () => {
  assertEqual(py2vega("trim(datum.name)"), "trim(datum.name)", "trim()");
});

test("hsl function call", () => {
  assertEqual(py2vega("hsl(120, 1, 0.5)"), "hsl(120, 1, 0.5)", "hsl()");
});

test("year function call", () => {
  assertEqual(py2vega("year(datum.date)"), "year(datum.date)", "year()");
});

test("month function call", () => {
  assertEqual(py2vega("month(datum.date)"), "month(datum.date)", "month()");
});

test("now function call", () => {
  assertEqual(py2vega("now()"), "now()", "now()");
});

test("sqrt function call", () => {
  assertEqual(py2vega("sqrt(datum.value)"), "sqrt(datum.value)", "sqrt()");
});

test("pow function call", () => {
  assertEqual(py2vega("pow(datum.value, 2)"), "pow(datum.value, 2)", "pow()");
});

test("isNaN function call", () => {
  assertEqual(py2vega("isNaN(datum.value)"), "isNaN(datum.value)", "isNaN()");
});

test("span function call", () => {
  assertEqual(py2vega("span(datum.values)"), "span(datum.values)", "span()");
});

test("reverse function call", () => {
  assertEqual(
    py2vega("reversed(datum.name)"),
    "reverse(datum.name)",
    "reverse()"
  );
});

test("isValid function call", () => {
  assertEqual(
    py2vega("isValid(datum.value)"),
    "isValid(datum.value)",
    "isValid()"
  );
});

test("isNumber function call", () => {
  assertEqual(
    py2vega("isNumber(datum.value)"),
    "isNumber(datum.value)",
    "isNumber()"
  );
});

test("isString function call", () => {
  assertEqual(
    py2vega("isString(datum.value)"),
    "isString(datum.value)",
    "isString()"
  );
});

test("isArray function call", () => {
  assertEqual(
    py2vega("isArray(datum.value)"),
    "isArray(datum.value)",
    "isArray()"
  );
});

test("clamp function call", () => {
  assertEqual(
    py2vega("clamp(datum.value, 0, 100)"),
    "clamp(datum.value, 0, 100)",
    "clamp()"
  );
});

test("isFinite function call", () => {
  assertEqual(
    py2vega("isFinite(datum.value)"),
    "isFinite(datum.value)",
    "isFinite()"
  );
});

test("indexof function call", () => {
  assertEqual(
    py2vega("indexof(datum.values, 3)"),
    "indexof(datum.values, 3)",
    "indexof()"
  );
});

test("slice function call", () => {
  assertEqual(
    py2vega("slice(datum.values, 1, 3)"),
    "slice(datum.values, 1, 3)",
    "slice()"
  );
});

test("extent function call", () => {
  assertEqual(
    py2vega("extent(datum.values)"),
    "extent(datum.values)",
    "extent()"
  );
});

test("join function call", () => {
  assertEqual(
    py2vega("join(datum.values, ',')"),
    "join(datum.values, ',')",
    "join()"
  );
});

test("replace function call", () => {
  assertEqual(
    py2vega("replace(datum.name, 'a', 'b')"),
    "replace(datum.name, 'a', 'b')",
    "replace()"
  );
});

test("split function call", () => {
  assertEqual(
    py2vega("split(datum.name, ',')"),
    "split(datum.name, ',')",
    "split()"
  );
});

test("substring function call", () => {
  assertEqual(
    py2vega("substring(datum.name, 0, 3)"),
    "substring(datum.name, 0, 3)",
    "substring()"
  );
});

test("truncate function call", () => {
  assertEqual(
    py2vega("truncate(datum.name, 10)"),
    "truncate(datum.name, 10)",
    "truncate()"
  );
});

test("format function call", () => {
  assertEqual(
    py2vega("format(datum.value, ',.2f')"),
    "format(datum.value, ',.2f')",
    "format()"
  );
});

test("timeFormat function call", () => {
  assertEqual(
    py2vega("timeFormat(datum.date, '%A')"),
    "timeFormat(datum.date, '%A')",
    "timeFormat()"
  );
});

test("luminance function call", () => {
  assertEqual(
    py2vega("luminance(datum.color)"),
    "luminance(datum.color)",
    "luminance()"
  );
});

//
// BOOLEAN LOGIC
//
test("and operator", () => {
  assertEqual(
    py2vega("datum.a > 1 and datum.b < 5"),
    "(datum.a > 1) && (datum.b < 5)",
    "and"
  );
});

test("or operator", () => {
  assertEqual(
    py2vega("datum.a > 1 or datum.b < 5"),
    "(datum.a > 1) || (datum.b < 5)",
    "or"
  );
});

test("not operator", () => {
  assertEqual(py2vega("not datum.active"), "!(datum.active)", "not");
});

//
// ADVANCED EXPRESSIONS
//
test("power operator", () => {
  assertEqual(py2vega("datum.value ** 2"), "pow(datum.value, 2)", "power");
});

test("chained comparison", () => {
  assertEqual(
    py2vega("1 < datum.value <= 10"),
    "1 < datum.value && datum.value <= 10",
    "chained compare"
  );
});

test("in operator (tuple)", () => {
  assertEqual(
    py2vega("datum.a in ['USA', 'India']"),
    "indexof(['USA', 'India'], datum.a) != -1",
    "indexof"
  );
});

test("in operator (list)", () => {
  assertEqual(
    py2vega("datum.value in ['USA', 'India']"),
    "indexof(['USA', 'India'], datum.value) != -1",
    "in list"
  );
});

test("in operator (reverse)", () => {
  assertEqual(
    py2vega("'India' in value"),
    "indexof(value, 'India') != -1",
    "in reverse"
  );
});

test("not in operator", () => {
  assertEqual(
    py2vega("'Rome' not in value"),
    "indexof(value, 'Rome') == -1",
    "not in"
  );
});

//
// CONSTANTS
//
test("PI constant", () => {
  assertEqual(py2vega("PI"), "PI", "PI");
});

test("E constant", () => {
  assertEqual(py2vega("E"), "E", "E");
});

test("NaN constant", () => {
  assertEqual(py2vega("NaN"), "NaN", "NaN");
});

test("LN2 constant", () => {
  assertEqual(py2vega("LN2"), "LN2", "LN2");
});

test("LN10 constant", () => {
  assertEqual(py2vega("LN10"), "LN10", "LN10");
});

test("LOG2E constant", () => {
  assertEqual(py2vega("LOG2E"), "LOG2E", "LOG2E");
});

test("LOG10E constant", () => {
  assertEqual(py2vega("LOG10E"), "LOG10E", "LOG10E");
});

test("MAX_VALUE constant", () => {
  assertEqual(py2vega("MAX_VALUE"), "MAX_VALUE", "MAX_VALUE");
});

test("MIN_VALUE constant", () => {
  assertEqual(py2vega("MIN_VALUE"), "MIN_VALUE", "MIN_VALUE");
});

test("SQRT1_2 constant", () => {
  assertEqual(py2vega("SQRT1_2"), "SQRT1_2", "SQRT1_2");
});

test("SQRT2 constant", () => {
  assertEqual(py2vega("SQRT2"), "SQRT2", "SQRT2");
});

test("True constant", () => {
  assertEqual(py2vega("True"), "true", "True -> true");
});

test("False constant", () => {
  assertEqual(py2vega("False"), "false", "False -> false");
});

test("None constant", () => {
  assertEqual(py2vega("None"), "null", "None -> null");
});

test("constant used in an expression", () => {
  assertEqual(
    py2vega("datum.value > PI"),
    "datum.value > PI",
    "constant in comparison"
  );
});

test("constant in a function call", () => {
  assertEqual(py2vega("abs(E)"), "abs(E)", "constant as function arg");
});

//
// ERROR HANDLING
//

expectError("invalid syntax throws", () => {
  py2vega("!!!");
});

expectError("non-string input throws", () => {
  py2vega(123 as any);
});

expectError("reject assignment", () => {
  py2vega("a = 5");
});

process.exit(printResults());
