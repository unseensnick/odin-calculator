# Lesson 2: The Operate Function - Strategy Pattern Implementation

## Overview
This document covers the implementation of the `operate()` function using the Strategy Pattern, creating a dispatcher that routes operations to the appropriate math functions.

## Implementation Coverage
This document covers:
- Strategy Pattern implementation and benefits over switch statements
- Functions as first-class citizens in JavaScript
- Dynamic function calls and object property access
- Call chain from user interaction to result
- Pattern extensibility considerations

---

## The Strategy Pattern: Clean Algorithm Selection

### Implementation
```javascript
function operate(operator, a, b) {
    const operations = {
        '+': add,
        '-': subtract,
        '×': multiply,
        '÷': divide
    };
    
    return operations[operator](a, b);
}
```

### What is the Strategy Pattern?
The Strategy Pattern allows you to select algorithms at runtime. Instead of hard-coding conditional logic, you store different strategies (functions) and choose which one to execute based on context.

### Alternative Approaches Comparison

#### 1. Switch Statement Approach
```javascript
// ❌ VERBOSE - Gets unwieldy as it grows
function operate(operator, a, b) {
    switch(operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '×':
            return multiply(a, b);
        case '÷':
            return divide(a, b);
        default:
            return "Error";
    }
}
```

#### 2. If-Else Chain Approach
```javascript
// ❌ EVEN WORSE - Cascading conditionals
function operate(operator, a, b) {
    if (operator === '+') {
        return add(a, b);
    } else if (operator === '-') {
        return subtract(a, b);
    } else if (operator === '×') {
        return multiply(a, b);
    } else if (operator === '÷') {
        return divide(a, b);
    } else {
        return "Error";
    }
}
```

#### 3. Our Object Lookup Approach
```javascript
// ✅ CLEAN - Declarative and extensible
function operate(operator, a, b) {
    const operations = {
        '+': add,
        '-': subtract,
        '×': multiply,
        '÷': divide
    };
    
    return operations[operator](a, b);
}
```

### Benefits of Object Lookup Approach

#### **1. Readability**
- Clear mapping between operators and functions
- No nested conditional logic
- Intent is immediately obvious

#### **2. Maintainability**
- Adding operations requires only one line
- No risk of breaking existing logic
- Easy to find and modify specific operations

#### **3. Performance**
- Object property lookup is O(1)
- No cascading condition checks
- JavaScript engines can optimize object access

#### **4. Extensibility**
```javascript
// Adding new operations
const operations = {
    '+': add,
    '-': subtract,
    '×': multiply,
    '÷': divide,
    '%': modulo,        // Add new operations
    '^': power,
    '√': squareRoot,
    'sin': sine,
    'cos': cosine
};
```

---

## JavaScript Concepts Deep Dive

### 1. Functions as First-Class Citizens

In JavaScript, functions are **first-class citizens**, meaning they can be:
- Stored in variables
- Passed as arguments
- Returned from other functions
- Stored in data structures (like our operations object)

```javascript
// Functions can be stored in variables
const myAdd = add;
console.log(myAdd(2, 3)); // Works just like add(2, 3)

// Functions can be stored in objects
const math = {
    addition: add,      // Storing function reference
    subtraction: subtract
};

// Functions can be passed as parameters
function calculate(operation, x, y) {
    return operation(x, y);  // operation is a function parameter
}

console.log(calculate(add, 5, 3)); // Passes add function as argument
```

### 2. Function References vs Function Calls

**Critical Distinction:**
```javascript
const operations = {
    '+': add,        // ✅ Function reference (no parentheses)
    '-': subtract    // ✅ Stores the function itself
};

const badOperations = {
    '+': add(),      // ❌ Function call (with parentheses)
    '-': subtract()  // ❌ Stores the result of calling function with no args
};

// Our way works:
operations['+'](2, 3);     // Calls add(2, 3) = 5

// Bad way breaks:
badOperations['+'](2, 3);  // Error! Trying to call undefined as function
```

### 3. Dynamic Property Access

JavaScript offers two ways to access object properties:

```javascript
const operations = {
    '+': add,
    '-': subtract
};

// Dot notation - for static/known property names
operations.'+';  // ❌ Invalid syntax - can't use symbols

// Bracket notation - for dynamic property names
operations['+']; // ✅ Functions correctly
operations[operator]; // ✅ Dynamic based on variable
```

### 4. The Complete Call Chain

Here's exactly what happens when we call `operate('+', 5, 3)`:

```javascript
function operate(operator, a, b) {
    // Step 1: Create operations object
    const operations = {
        '+': add,           // add function reference stored
        '-': subtract,
        '×': multiply,
        '÷': divide
    };
    
    // Step 2: Look up the function
    // operations['+'] returns the add function reference
    
    // Step 3: Call the function with arguments
    // operations[operator](a, b) becomes add(5, 3)
    
    return operations[operator](a, b);
    // Returns 8
}
```

**Step-by-step execution:**
1. `operate('+', 5, 3)` called
2. `operator` is `'+'`
3. `operations['+']` retrieves `add` function
4. `add(5, 3)` is called
5. `add` returns `8`
6. `operate` returns `8`

---

## Real-World Applications of Strategy Pattern

### 1. Redux Reducers
```javascript
// Redux uses this exact pattern
function reducer(state, action) {
    const handlers = {
        'ADD_TODO': handleAddTodo,
        'REMOVE_TODO': handleRemoveTodo,
        'TOGGLE_TODO': handleToggleTodo
    };
    
    return handlers[action.type](state, action) || state;
}
```

### 2. Express.js Routing
```javascript
// API route handlers
const routes = {
    'GET': handleGet,
    'POST': handlePost,
    'PUT': handlePut,
    'DELETE': handleDelete
};

function handleRequest(method, req, res) {
    return routes[method](req, res);
}
```

### 3. Form Validation
```javascript
// Field validation strategies
const validators = {
    'email': validateEmail,
    'phone': validatePhone,
    'password': validatePassword
};

function validateField(type, value) {
    return validators[type](value);
}
```

### 4. Game Input Handling
```javascript
// Game control mapping
const controls = {
    'ArrowUp': moveUp,
    'ArrowDown': moveDown,
    'ArrowLeft': moveLeft,
    'ArrowRight': moveRight,
    ' ': shoot  // Spacebar
};

document.addEventListener('keydown', (e) => {
    const action = controls[e.key];
    if (action) action();
});
```

---

## The Complete Calculator Call Chain

Understanding how our functions connect from user interaction to result:

### User Journey: "5 + 3 ="

```
1. User clicks "5"
   ↓
   handleNumber('5') called
   ↓
   Display shows "5"

2. User clicks "+"
   ↓
   handleOperator('+') called
   ↓
   Store operator, prepare for second number

3. User clicks "3"
   ↓
   handleNumber('3') called
   ↓
   Display shows "3"

4. User clicks "="
   ↓
   handleEquals() called
   ↓
   operate('+', 5, 3) called  ← Our function!
   ↓
   add(5, 3) called
   ↓
   Returns 8
   ↓
   Display shows "8"
```

### The Architecture Layers

```
┌─────────────────────┐
│   User Interface    │  ← Button clicks, keyboard input
├─────────────────────┤
│  Event Handlers     │  ← handleNumber, handleOperator, handleEquals
├─────────────────────┤
│  Operation Dispatcher │ ← operate() function (Strategy Pattern)
├─────────────────────┤
│   Pure Math Functions │ ← add, subtract, multiply, divide
└─────────────────────┘
```

Each layer has a specific responsibility:
- **UI**: Captures user input
- **Handlers**: Manage calculator state and flow
- **Dispatcher**: Routes operations to correct functions
- **Math**: Performs actual calculations

---

## Error Handling and Edge Cases

### Handling Invalid Operators
Our current implementation has a potential issue:
```javascript
operate('invalid', 5, 3); // Returns undefined
```

### Enhanced Version with Error Handling
```javascript
function operate(operator, a, b) {
    const operations = {
        '+': add,
        '-': subtract,
        '×': multiply,
        '÷': divide
    };
    
    // Check if operator exists
    if (!operations[operator]) {
        return "Error";
    }
    
    return operations[operator](a, b);
}
```

### Input Validation
```javascript
function operate(operator, a, b) {
    // Validate inputs
    if (typeof a !== 'number' || typeof b !== 'number') {
        return "Error";
    }
    
    const operations = {
        '+': add,
        '-': subtract,
        '×': multiply,
        '÷': divide
    };
    
    if (!operations[operator]) {
        return "Error";
    }
    
    return operations[operator](a, b);
}
```

---

## Testing the Strategy Pattern

### Comprehensive Test Suite
```javascript
// Test valid operations
console.log("Testing operate function:");
console.log("5 + 3 =", operate('+', 5, 3));     // Should be 8
console.log("10 - 4 =", operate('-', 10, 4));   // Should be 6
console.log("6 × 7 =", operate('×', 6, 7));     // Should be 42
console.log("15 ÷ 3 =", operate('÷', 15, 3));   // Should be 5

// Test edge cases
console.log("10 ÷ 0 =", operate('÷', 10, 0));   // Should be "Error"

// Test invalid operators (if we add validation)
console.log("5 % 3 =", operate('%', 5, 3));     // Should be "Error"
```

### Performance Testing
```javascript
// This approach has good performance
console.time('Strategy Pattern');
for (let i = 0; i < 10000; i++) {
    operate('+', i, i + 1);
}
console.timeEnd('Strategy Pattern');

// Compare with switch statement for performance
```

---

## Extension Examples

### Adding Scientific Operations
```javascript
function operate(operator, a, b) {
    const operations = {
        // Basic operations
        '+': add,
        '-': subtract,
        '×': multiply,
        '÷': divide,
        
        // Scientific operations
        '^': power,
        '%': modulo,
        'log': logarithm,
        'sin': sine,
        'cos': cosine,
        'tan': tangent
    };
    
    return operations[operator](a, b);
}

// Easy to add supporting functions
function power(a, b) {
    return Math.pow(a, b);
}

function modulo(a, b) {
    return a % b;
}
```

### Adding Validation and Logging
```javascript
function operate(operator, a, b) {
    // Log operation for debugging
    console.log(`Operating: ${a} ${operator} ${b}`);
    
    const operations = {
        '+': add,
        '-': subtract,
        '×': multiply,
        '÷': divide
    };
    
    if (!operations[operator]) {
        console.error(`Invalid operator: ${operator}`);
        return "Error";
    }
    
    const result = operations[operator](a, b);
    console.log(`Result: ${result}`);
    
    return result;
}
```

---

## Common Mistakes to Avoid

### 1. **Calling Functions Instead of Storing References**
```javascript
// ❌ WRONG - Calls functions immediately
const operations = {
    '+': add(2, 3),     // Stores 5, not the add function!
    '-': subtract()     // Stores undefined!
};

// ✅ RIGHT - Stores function references
const operations = {
    '+': add,           // Stores the add function itself
    '-': subtract       // Stores the subtract function itself
};
```

### 2. **Using Dot Notation for Dynamic Keys**
```javascript
// ❌ WRONG - Can't use dot notation with symbols
const op = '+';
operations.op;       // Looks for property named 'op', not '+'
operations.+;        // Syntax error!

// ✅ RIGHT - Use bracket notation for dynamic keys
operations[op];      // Correctly looks up the '+' property
operations['+'];     // Also correct for literal access
```

### 3. **Forgetting Return Statement**
```javascript
// ❌ WRONG - Doesn't return the result
function operate(operator, a, b) {
    const operations = {
        '+': add,
        '-': subtract
    };
    
    operations[operator](a, b);  // Missing return!
}

// ✅ RIGHT - Returns the result
function operate(operator, a, b) {
    const operations = {
        '+': add,
        '-': subtract
    };
    
    return operations[operator](a, b);  // Returns result
}
```

### 4. **Not Handling Invalid Operators**
```javascript
// ❌ RISKY - No validation
function operate(operator, a, b) {
    const operations = {
        '+': add,
        '-': subtract
    };
    
    return operations[operator](a, b);  // Could be undefined(a, b) - error!
}

// ✅ SAFE - With validation
function operate(operator, a, b) {
    const operations = {
        '+': add,
        '-': subtract
    };
    
    if (!operations[operator]) {
        return "Error";
    }
    
    return operations[operator](a, b);
}
```

---

## Performance Considerations

### Why Object Lookup is Fast
1. **Hash Table Implementation**: JavaScript objects use hash tables internally
2. **O(1) Average Case**: Constant time lookup for property access
3. **No Branching**: Unlike if/else chains, no conditional checks needed
4. **JIT Optimization**: JavaScript engines can optimize object property access

### Memory Efficiency
```javascript
// The operations object is created fresh each call
// For better performance in high-frequency scenarios:
const OPERATIONS = {  // Create once, reuse
    '+': add,
    '-': subtract,
    '×': multiply,
    '÷': divide
};

function operate(operator, a, b) {
    return OPERATIONS[operator](a, b);  // Reuse the object
}
```

---

## Key Takeaways

1. **Strategy Pattern**: Cleaner than switch statements for algorithm selection
2. **Function References**: Store functions without calling them (no parentheses)
3. **Dynamic Access**: Use bracket notation for dynamic property names
4. **First-Class Functions**: JavaScript functions can be stored and passed around
5. **Extensibility**: Easy to add new operations without changing existing code
6. **Performance**: Object lookup is fast and efficient
7. **Maintainability**: Clear mapping between operators and functions

---

## Next Steps

The operation dispatcher provides:
- ✅ Pure math functions that handle all calculations
- ✅ Clean operation routing that scales gracefully
- ✅ Error handling for edge cases

The next phase involves UI activation and connecting these functions to user interactions.

This system handles all calculator operation routing.