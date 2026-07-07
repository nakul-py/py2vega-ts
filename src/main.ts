import { parse as pyparse } from "py-ast";

/**
 * Vega expression value types
 */
type VegaValue = string | number | boolean | null;

interface PyNode {
  nodeType: string;
  [key: string]: any;
}

/**
 * Maps Python operators to Vega operators
 */
const OPERATOR_MAPPING: Record<string, string> = {
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
 * Maps Python functions to Vega functions
 */

const FUNCTION_MAPPING: Record<string, string> = {
  abs: "abs",
  floor: "floor",
  ceil: "ceil",
  round: "round",
  sqrt: "sqrt",
  pow: "pow",
  log: "log",
  exp: "exp",
  sin: "sin",
  cos: "cos",
  tan: "tan",
  str: "toString",
  upper: "toUpperCase",
  lower: "toLowerCase",
  len: "length",
  min: "min",
  max: "max",
  type: "type",
  int: "int",
  float: "float",
};

/**
 * Maps Python constants to Vega constants
 */
const CONSTANTS_MAPPING: Record<string, string> = {
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

  // Not real Vega constants, but common enough Python-side spellings that
  // we pass them through as boolean/null literals rather than erroring.
  TRUE: "true",
  FALSE: "false",
  None: "null",
};

/**
 * Custom error class for py2vega transpilation
 */
export class Py2VegaError extends Error {
  constructor(msg: string) {
    super(`Py2Vega transpilation failed: ${msg}`);
    this.name = "Py2VegaError";
  }
}

/**
 * Extract the first expression from a py-ast Module
 */
function parseExpression(code: string): PyNode {
  const ast = pyparse(code);

  // py-ast returns a Module, extract the first statement/expression
  if (ast.body && ast.body.length > 0) {
    const firstNode = ast.body[0];

    // If it's an Expr node, extract the value
    if (firstNode.nodeType === "Expr") {
      return firstNode.value;
    }

    throw new Py2VegaError("Code is not a valid Python expression");
  }

  throw new Py2VegaError("No expression found in Python code");
}

/**
 * Visitor class to traverse Python AST and convert to Vega
 */
class PyToVegaVisitor {
  private scope: Record<string, VegaValue> = {};

  visit(node: PyNode): VegaValue {
    if (!node || !node.nodeType) {
      throw new Py2VegaError("Invalid AST node");
    }

    const method = `visit${node.nodeType}`;
    if (typeof (this as any)[method] === "function") {
      return (this as any)[method](node);
    }

    throw new Py2VegaError(`Unsupported node type: ${node.nodeType}`);
  }

  /**
   * Visit Constant node
   */
  visitConstant(node: PyNode): VegaValue {
    const { value } = node;

    if (value === null) return "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "number") return String(value);

    if (typeof value === "string") {
      return `'${value.replace(/'/g, "\\'")}'`;
    }

    throw new Py2VegaError(`Unsupported constant type`);
  }

  /**
   * Visit Name node
   */
  visitName(node: PyNode): VegaValue {
    const { id } = node;

    if (id === "datum") {
      return "datum";
    }

    if (id in CONSTANTS_MAPPING) {
      return String(CONSTANTS_MAPPING[id]);
    }

    if (id in this.scope) {
      return this.scope[id];
    }

    return id;
  }

  /**
   * Visit Attribute node (e.g., datum.population)
   */
  visitAttribute(node: PyNode): VegaValue {
    const { value, attr } = node;

    // Handle datum.field
    if (value.nodeType === "Name" && value.id === "datum") {
      return `datum.${attr}`;
    }

    // Handle nested attributes
    const obj = this.visit(value);
    return `${obj}.${attr}`;
  }

  /**
   * Visit BinOp node (binary operations)
   */
  visitBinOp(node: PyNode): VegaValue {
    const { left, right } = node;
    const op = OPERATOR_MAPPING[node.op.nodeType];

    if (!op) {
      throw new Py2VegaError(
        `Unsupported binary operator: ${node.op.nodeType}`
      );
    }

    if (node.op.nodeType === "Pow") {
      return `pow(${this.visit(left)}, ${this.visit(right)})`;
    }

    return `(${this.visit(left)} ${op} ${this.visit(right)})`;
  }

  /**
   * Visit Compare node (comparison operations)
   */
  visitCompare(node: PyNode): VegaValue {
    const { left, ops, comparators } = node;

    if (ops.length === 1) {
      const opType = ops[0].nodeType;
      const leftStr = this.visit(left);
      const rightStr = this.visit(comparators[0]);

      if (opType === "In") {
        return `(indexof(${rightStr}, ${leftStr}) != -1)`;
      }

      if (opType === "NotIn") {
        return `(indexof(${rightStr}, ${leftStr}) == -1)`;
      }

      // default operators
      const op = OPERATOR_MAPPING[opType];
      if (!op) {
        throw new Py2VegaError(`Unsupported comparison operator: ${opType}`);
      }

      return `(${leftStr} ${op} ${rightStr})`;
    }

    // chained: a < b < c -> (a < b) && (b < c)
    let parts: string[] = [];
    let current = left;

    for (let i = 0; i < ops.length; i++) {
      const op = OPERATOR_MAPPING[ops[i].nodeType];
      parts.push(`${this.visit(current)} ${op} ${this.visit(comparators[i])}`);
      current = comparators[i];
    }

    return `(${parts.join(" && ")})`;
  }

  /**
   * Visit UnaryOp node (unary operations)
   */
  visitUnaryOp(node: PyNode): VegaValue {
    const { op, operand } = node;
    const opType = op.nodeType;

    if (opType === "Not") {
      return `!(${this.visit(operand)})`;
    }

    if (opType === "USub") {
      return `-(${this.visit(operand)})`;
    }

    if (opType === "UAdd") {
      return this.visit(operand);
    }

    throw new Py2VegaError(`Unsupported unary operator: ${opType}`);
  }

  /**
   * Visit BoolOp node (and, or)
   */
  visitBoolOp(node: PyNode): VegaValue {
    const op = OPERATOR_MAPPING[node.op.nodeType];

    if (!op) {
      throw new Py2VegaError(
        `Unsupported boolean operator: ${node.op.nodeType}`
      );
    }

    return `(${node.values.map((v: PyNode) => this.visit(v)).join(` ${op} `)})`;
  }

  /**
   * Visit IfExp node (ternary operator: x if condition else y)
   */
  visitIfExp(node: PyNode): VegaValue {
    return `(${this.visit(node.test)} ? ${this.visit(node.body)} : ${this.visit(
      node.orelse
    )})`;
  }

  /**
   * Visit Call node (function calls)
   */
  visitCall(node: PyNode): VegaValue {
    let funcName: string;

    if (node.func.nodeType === "Name") {
      funcName = node.func.id;
    } else if (node.func.nodeType === "Attribute") {
      funcName = node.func.attr;
    } else {
      throw new Py2VegaError("Unsupported function call");
    }

    const vegaFunc = FUNCTION_MAPPING[funcName.toLowerCase()];
    if (!vegaFunc) {
      throw new Py2VegaError(`Unsupported function: ${funcName}`);
    }

    const args = node.args.map((a: PyNode) => this.visit(a));

    return `${vegaFunc}(${args.join(", ")})`;
  }

  /**
   * Visit List node
   */
  visitList(node: PyNode): VegaValue {
    const elements = node.elts.map((el: PyNode) => this.visit(el));
    return `[${elements.join(", ")}]`;
  }

  /**
   * Visit Tuple node
   */
  visitTuple(node: PyNode): string {
    const elements = node.elts.map((el: PyNode) => this.visit(el));
    return `[${elements.join(", ")}]`;
  }

  /**
   * Visit Dict node
   */
  visitDict(node: PyNode): string {
    const { keys, values } = node;
    const pairs: string[] = [];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];

      if (key.nodeType === "Constant") {
        const keyStr =
          typeof key.value === "string" ? `'${key.value}'` : key.value;
        const valueStr = this.visit(value);
        pairs.push(`${keyStr}: ${valueStr}`);
      }
    }

    return `{${pairs.join(", ")}}`;
  }
}

/**
 * Strip outermost parentheses
 */
function stripOuterParens(expr: string): string {
  expr = expr.trim();

  if (!expr.startsWith("(") || !expr.endsWith(")")) {
    return expr;
  }

  let depth = 0;

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];

    if (char === "(") depth++;
    if (char === ")") depth--;

    // If we close before the last char → not outermost
    if (depth === 0 && i < expr.length - 1) {
      return expr;
    }
  }

  return expr.slice(1, -1);
}

/**
 * Main transpiler function
 * Converts Python code to Vega expression
 *
 * @param pythonCode - Python expression as a string
 * @returns Vega expression (array, string, number, boolean, or null)
 * @throws Py2VegaError if parsing or conversion fails
 */

export function py2vega(pythonCode: string): VegaValue {
  if (typeof pythonCode !== "string") {
    throw new Py2VegaError("Input must be a string");
  }

  try {
    // Parse Python code to AST using py-ast
    const ast = parseExpression(pythonCode);

    // Convert AST to Vega
    const visitor = new PyToVegaVisitor();
    const vegaExpr = visitor.visit(ast);

    if (typeof vegaExpr !== "string") {
      throw new Py2VegaError("Expected Vega expression to be a string");
    }

    return stripOuterParens(vegaExpr);
  } catch (error) {
    if (error instanceof Py2VegaError) {
      throw error;
    }
    throw new Py2VegaError(
      `Failed to parse Python code: ${(error as Error).message}`
    );
  }
}

export type { PyNode, VegaValue };
