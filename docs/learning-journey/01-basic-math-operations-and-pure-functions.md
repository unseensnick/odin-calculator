# Lesson 1: Pure Functions & Basic Math Operations

## Overview

This document covers the implementation of the four basic math operations using pure functions, establishing the foundation for the calculator's core logic.

## Implementation Coverage

This document covers:

-   Pure function concepts and their benefits
-   Edge case handling approaches
-   Why eval() should be avoided in calculators
-   Consistent return type considerations
-   Testing approach for math functions

---

## Pure Functions Implementation

### What Makes a Function "Pure"?

A pure function has two key characteristics:

1. **Deterministic**: Same input always produces same output
2. **No side effects**: Doesn't modify anything outside itself

### Implementation

```javascript
function add(a, b) {
    return a + b; // Pure: always returns sum, no side effects
}

function subtract(a, b) {
    return a - b; // Pure: predictable subtraction
}

function multiply(a, b) {
    return a * b; // Pure: simple multiplication
}

function divide(a, b) {
    if (b === 0) {
        return "Error"; // Edge case handling
    }
    return a / b; // Pure: division with safety check
}
```

### Why Pure Functions Matter

#### 1. **Predictability**

```javascript
// Results are predictable
console.log(add(3, 5)); // Always 8, never surprises
console.log(add(3, 5)); // Still 8, reliable
```

#### 2. **Testability**

```javascript
// Easy to test - no setup required
function testAdd() {
    console.assert(add(2, 3) === 5, "Addition should work");
    console.assert(add(-1, 1) === 0, "Should handle negatives");
    console.assert(add(0, 0) === 0, "Should handle zeros");
}
```

#### 3. **Debugging**

When something goes wrong, pure functions are easy to isolate and test:

```javascript
// If calculator shows wrong result, test each layer:
console.log(add(12, 7)); // Test pure function first
console.log(operate("+", 12, 7)); // Then test dispatcher
// Problem is isolated to specific layer
```

#### 4. **Reusability**

These functions can be used anywhere:

```javascript
// In calculator
const result = add(firstNumber, secondNumber);

// In other parts of app
const totalPrice = add(basePrice, tax);
const score = add(currentScore, bonus);
```

---

## Edge Case Handling: Division by Zero

### The Problem

```javascript
// JavaScript's default behavior
console.log(5 / 0); // Returns Infinity (not user-friendly)
console.log(-5 / 0); // Returns -Infinity
console.log(0 / 0); // Returns NaN
```

### Our Solution

```javascript
function divide(a, b) {
    if (b === 0) {
        return "Error"; // User-friendly error message
    }
    return a / b;
}
```

### Why This Approach?

1. **User Experience**: "Error" is clearer than "Infinity"
2. **Consistency**: Always returns a displayable value
3. **Calculator Behavior**: Matches real calculator behavior
4. **Error Recovery**: User can clear and continue

### Testing Edge Cases

```javascript
// Test all edge cases
console.log(divide(10, 2)); // Normal case: 5
console.log(divide(10, 0)); // Edge case: "Error"
console.log(divide(-10, 0)); // Edge case: "Error"
console.log(divide(0, 0)); // Edge case: "Error"
```

---

## Why Never Use eval()?

### The Temptation

```javascript
// NEVER DO THIS - Appears simple but very dangerous
function badCalculate(expression) {
    return eval(expression); // ❌ Security nightmare!
}

// Looks innocent:
badCalculate("2 + 3"); // Returns 5

// But allows code injection:
badCalculate("alert('HACKED!'); 2 + 3"); // Executes alert, then returns 5
```

### Security Risks

1. **Code Injection**: Malicious users can execute arbitrary code
2. **Data Theft**: Access to variables, localStorage, cookies
3. **DOM Manipulation**: Could modify entire page
4. **Network Requests**: Could send data to malicious servers

### Performance Issues

1. **Slow**: eval() is much slower than direct function calls
2. **No Optimization**: JavaScript engines can't optimize eval'd code
3. **Memory Usage**: Creates new execution contexts

### Our Safe Approach

```javascript
// ✅ Safe, explicit, fast
function operate(operator, a, b) {
    const operations = {
        "+": add,
        "-": subtract,
        "×": multiply,
        "÷": divide,
    };

    return operations[operator](a, b);
}
```

---

## Return Type Consistency

### Why It Matters

Our functions always return predictable types:

-   Numbers for successful operations
-   "Error" string for failures
-   Never undefined, null, or other types

### Implementation Pattern

```javascript
function divide(a, b) {
    if (b === 0) {
        return "Error"; // String for error case
    }
    return a / b; // Number for success case
}
```

### Benefits

1. **Display Logic**: Can always call `toString()` on result
2. **Error Handling**: Easy to check `if (result === "Error")`
3. **Type Safety**: No unexpected undefined values

---

## Test-Driven Development

### Testing Strategy

We test functions before integrating them into the UI:

```javascript
// Phase 1: Test pure functions in console
console.log("Testing add:", add(2, 3)); // Should be 5
console.log("Testing subtract:", subtract(5, 2)); // Should be 3
console.log("Testing multiply:", multiply(3, 4)); // Should be 12
console.log("Testing divide:", divide(10, 2)); // Should be 5
console.log("Testing divide by zero:", divide(10, 0)); // Should be "Error"
```

### Why Test Early?

1. **Catch Bugs Early**: Fix problems before UI complications
2. **Build Confidence**: Know your foundation is solid
3. **Faster Debugging**: Isolate problems to specific functions
4. **Documentation**: Tests show how functions should behave

---

## Real-World Applications

### This Pattern in Professional Development

#### 1. **API Development**

```javascript
// Express.js route handler
app.post("/calculate", (req, res) => {
    const { operator, a, b } = req.body;
    const result = operate(operator, a, b); // Uses our pattern!
    res.json({ result });
});
```

#### 2. **React Components**

```javascript
function Calculator() {
    const [result, setResult] = useState(0);

    const handleCalculate = () => {
        const calculation = operate(operator, firstNum, secondNum);
        setResult(calculation); // Our pure functions integrate easily
    };
}
```

#### 3. **Unit Testing**

```javascript
// Jest tests
describe("Math Operations", () => {
    test("add should sum two numbers", () => {
        expect(add(2, 3)).toBe(5);
    });

    test("divide should handle zero", () => {
        expect(divide(10, 0)).toBe("Error");
    });
});
```

#### 4. **Functional Programming**

```javascript
// Array operations using our pure functions
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => add(acc, num), 0); // Uses our add function
```

---

## Common Mistakes to Avoid

### 1. **Impure Functions**

```javascript
// ❌ BAD - Modifies global state
let calculatorMemory = 0;
function badAdd(a, b) {
    calculatorMemory = a + b; // Side effect!
    return calculatorMemory;
}

// ✅ GOOD - Pure function
function add(a, b) {
    return a + b; // No side effects
}
```

### 2. **Inconsistent Return Types**

```javascript
// ❌ BAD - Returns different types
function badDivide(a, b) {
    if (b === 0) {
        return null; // Sometimes null
    }
    if (isNaN(a) || isNaN(b)) {
        return undefined; // Sometimes undefined
    }
    return a / b; // Sometimes number
}

// ✅ GOOD - Consistent return type
function divide(a, b) {
    if (b === 0) {
        return "Error"; // Always string for errors
    }
    return a / b; // Always number for success
}
```

### 3. **Complex Functions**

```javascript
// ❌ BAD - Doing too much
function badCalculate(a, operator, b, displayElement) {
    let result;
    if (operator === "+") result = a + b;
    else if (operator === "-") result = a - b;
    // ... more operators
    displayElement.textContent = result; // Side effect!
    localStorage.setItem("lastResult", result); // Another side effect!
    return result;
}

// ✅ GOOD - Single responsibility
function add(a, b) {
    return a + b; // Only does addition
}
```

---

## Key Takeaways

1. **Pure Functions Are Reliable**: Same input always produces same output
2. **Edge Cases Matter**: Always handle division by zero and other edge cases
3. **Security First**: Never use eval() - it's a security nightmare
4. **Test Early**: Verify functions work before building complex UI
5. **Single Responsibility**: Each function should do one thing well
6. **Consistent Returns**: Predictable return types make code easier to use

---

## Next Steps

With solid math operations in place, the next step involves implementing the operate function, where we'll implement the Strategy Pattern to cleanly route operations and prepare for more complex calculator logic.

These functions provide the foundation for all calculator operations.
