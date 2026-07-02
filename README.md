# py2vega-ts 🐍 -> 📊

A TypeScript library that converts Python code to Typescript's Vega expressions with the help of [`py-ast`](https://jsr.io/@kriss-u/py-ast)

## Installation

```bash
npm install py2vega-ts
```

## Development

### Setup

```bash
# Install dependencies
  npm install

# Build
  npm run build
```

### Testing

```bash
# Run tests
  npm run test
```

### Linting

```bash
# install pre-commit hooks
  pre-commit install

# fix linting issues
  pre-commit run --all-files
```

## Quick Start

```typescript
import { py2vega } from 'py2vega-ts';

// Simple comparison
const vega = py2vega('datum.value > 100');
console.log(vega);
// Output: datum.value > 100
// Ternary operator
const colored = py2vega("'red' if datum.status == 'alert' else 'green'");
console.log(colored);
// Output: ((datum.status == 'alert') ? 'red' : 'green')

// Complex expression
const complex = py2vega('abs(datum.value) * 2 if datum.active else 0');
console.log(complex);
// Output: (datum.active ? (abs(datum.value) * 2) : 0)
```

## 📖 Supported Python Syntax

### Data Access

```python
datum.field_name
datum.magnitude
datum.coordinates.x
```

### Comparisons

```python
datum.value > 100
datum.value < 50
datum.value == 5
datum.value != 10
datum.value >= 100
datum.value <= 50
datum.a < datum.b
```

### Arithmetic Operations

```python
datum.a + datum.b
datum.a - datum.b
datum.a * datum.b
datum.a / datum.b
datum.a % datum.b
-datum.value
```

### Logical Operations

```python
datum.a > 5 and datum.b < 10
# datum.a > 5 && datum.b < 10

datum.status == "A" or datum.status == "B"
# datum.status == "A" || datum.status == "B"

not (datum.value > 100)
# !(datum.value > 100)
```

### Ternary Operator (If-Else)

```python
42 if datum.value > 100 else 10
# datum.value > 100 ? 42 : 10

# Nested ternaries
'red' if datum.severity > 8 else 'yellow' if datum.severity > 5 else 'green'
# datum.severity > 8 ? 'red' : datum.severity > 5 ? 'yellow' : 'green'
```

## Related Projects

- **[vega2ol](https://github.com/geojupyter/vega2ol)** - Convert Vega expressions to OpenLayers
- **[py2vega](https://github.com/QuantStack/py2vega)** - Python package for this functionality
- **[JupyterGIS](https://github.com/geojupyter/jupytergis)** - Web-based GIS in Jupyter

Made with ❤️ for Jupyter lovers and geospatial enthusiasts.
