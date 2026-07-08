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
test("function call", () => {
  assertEqual(py2vega("abs(datum.value)"), "abs(datum.value)", "abs()");
});

test("rgb function call", () => {
  assertEqual(
    py2vega("rgb(255, 0, 0)"),
    "rgb(255, 0, 0)",
    "rgb()"
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
