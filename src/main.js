console.log("JavaScript loaded successfully!");

// ============================================================================
// DEPENDENCIES & IMPORTS
// ============================================================================

// Import Lucide icons - try local npm version first
import("../node_modules/lucide/dist/umd/lucide.js")
    .then(() => {
        console.log("Lucide loaded from npm");
        lucide.createIcons();
    })
    .catch(() => {
        // Fallback to CDN if local version not found
        console.log("Loading Lucide from CDN");
        const script = document.createElement("script");
        script.src = "https://unpkg.com/lucide@latest/dist/umd/lucide.js";
        script.onload = () => {
            console.log("Lucide loaded from CDN");
            lucide.createIcons();
        };
        document.head.appendChild(script);
    });

// ============================================================================
// THEME SYSTEM
// ============================================================================

// Get current theme (user preference or system default)
function getTheme() {
    // Check if user has manually set a theme
    const userTheme = localStorage.getItem("userTheme");
    if (userTheme) {
        return userTheme;
    }
    // Otherwise use system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

// Set theme
function setTheme(theme, isUserAction = false) {
    if (isUserAction) {
        // User manually changed theme, store their preference
        localStorage.setItem("userTheme", theme);
    }

    document.documentElement.setAttribute("data-theme", theme);
    updateFavicon(theme === "dark");
}

// Toggle between light and dark themes
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme, true);
    return newTheme;
}

// Update favicon based on theme
function updateFavicon(isDark) {
    fetch("favicon.svg")
        .then((response) => response.text())
        .then((svgText) => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
            const gElement = svgDoc.querySelector("g");

            gElement.setAttribute("fill", isDark ? "#ffffff" : "#000000");

            const svg = svgDoc.querySelector("svg");
            const rect = svgDoc.createElementNS(
                "http://www.w3.org/2000/svg",
                "rect"
            );
            rect.setAttribute("width", "512");
            rect.setAttribute("height", "512");
            rect.setAttribute("fill", isDark ? "#1a1a1a" : "#f0f0f0");
            svg.insertBefore(rect, svg.firstChild);

            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgDoc);
            const dataUrl = `data:image/svg+xml,${encodeURIComponent(
                svgString
            )}`;

            const favicon = document.querySelector("link[rel='icon']");
            if (favicon) {
                favicon.href = dataUrl;
            }
        })
        .catch((err) => console.error("Failed to update favicon:", err));
}

// ============================================================================
// CALCULATOR LOGIC
// ============================================================================

// Calculator button configuration (single source of truth)
const CALCULATOR_BUTTONS = [
    { value: "AC", type: "all-clear" },
    { value: "C", type: "clear" },
    { value: "←", type: "backspace" },
    { value: "÷", type: "operator" },
    { value: "7", type: "number" },
    { value: "8", type: "number" },
    { value: "9", type: "number" },
    { value: "×", type: "operator" },
    { value: "4", type: "number" },
    { value: "5", type: "number" },
    { value: "6", type: "number" },
    { value: "-", type: "operator" },
    { value: "1", type: "number" },
    { value: "2", type: "number" },
    { value: "3", type: "number" },
    { value: "+", type: "operator" },
    { value: "0", type: "zero" },
    { value: ".", type: "decimal" },
    { value: "=", type: "equals" },
];

// Calculator state variables
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let shouldResetDisplay = false;
let currentEquation = "";

// Function to generate calculator buttons
function generateCalculatorButtons() {
    const container = document.getElementById("calculator-buttons");
    if (!container) return;

    CALCULATOR_BUTTONS.forEach((btnConfig) => {
        if (btnConfig.type === "spacer") {
            // Create invisible placeholder for grid alignment
            const placeholder = document.createElement("div");
            container.appendChild(placeholder);
            return;
        }

        const button = document.createElement("button");
        button.textContent = btnConfig.value;
        button.className = `calculator-button calculator-button--${btnConfig.type}`;

        // Add data attributes for event handling
        button.dataset.value = btnConfig.value;
        button.dataset.type = btnConfig.type;

        container.appendChild(button);
    });
}

// Basic math operations
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Error";
    }
    return a / b;
}

// Main operate function
function operate(operator, a, b) {
    const operations = {
        "+": add,
        "-": subtract,
        "×": multiply,
        "÷": divide,
    };

    return operations[operator](a, b);
}

// Display functions
function updateDisplay(value) {
    const display = document.getElementById("display");
    if (display) {
        // Always show the current equation if it exists, otherwise show the value
        display.textContent = currentEquation || value;
    }
}

function clearCalculator() {
    // C button - clears current entry only
    if (shouldResetDisplay || currentEquation.includes("=")) {
        // If we just got a result or pressed an operator, clear everything
        firstNumber = null;
        secondNumber = null;
        currentOperator = null;
        shouldResetDisplay = false;
        currentEquation = "";
        updateDisplay("0");
    } else {
        // Clear current number only, keep the operation
        const parts = currentEquation.split(/[\+\-\×\÷]/);
        if (parts.length > 1) {
            // There's an operator, just clear the current number
            const operatorMatch = currentEquation.match(/[\+\-\×\÷]/);
            if (operatorMatch) {
                currentEquation = currentEquation.substring(0, currentEquation.lastIndexOf(operatorMatch[0]) + 1);
                shouldResetDisplay = true;
            }
        } else {
            // No operator yet, clear everything
            currentEquation = "";
        }
        updateDisplay(currentEquation || "0");
    }
}

function handleAllClear() {
    // AC button - clears everything completely
    firstNumber = null;
    secondNumber = null;
    currentOperator = null;
    shouldResetDisplay = false;
    currentEquation = "";
    updateDisplay("0");
}

function handleNumber(num) {
    if (shouldResetDisplay) {
        // Start fresh after operator or result
        if (currentEquation.includes("=")) {
            // Start completely new equation after getting a result
            currentEquation = num;
        } else {
            // Continue building equation after operator
            currentEquation += num;
        }
        shouldResetDisplay = false;
    } else {
        // Continue building current number
        if (currentEquation === "0" || currentEquation.includes("=")) {
            currentEquation = num;
        } else {
            currentEquation += num;
        }
    }
    
    updateDisplay(currentEquation);
}

function handleOperator(op) {
    // Get the current number from the equation (everything after the last operator or from start)
    let currentNumber;
    if (currentEquation.includes("=")) {
        // Use result as the first number for new calculation
        currentNumber = parseFloat(currentEquation.split("=")[1]);
        currentEquation = currentNumber.toString();
    } else {
        // Find the current number being entered
        const parts = currentEquation.split(/[\+\-\×\÷]/);
        currentNumber = parseFloat(parts[parts.length - 1]);
    }

    if (firstNumber === null) {
        firstNumber = currentNumber;
        currentEquation += op;
    } else if (currentOperator && !shouldResetDisplay) {
        // Perform intermediate calculation
        secondNumber = currentNumber;
        const result = operate(currentOperator, firstNumber, secondNumber);
        firstNumber = parseFloat(result);
        currentEquation = result + op;
    } else {
        // Replace the last operator if user pressed multiple operators
        currentEquation = currentEquation.slice(0, -1) + op;
    }

    currentOperator = op;
    shouldResetDisplay = true;
    updateDisplay(currentEquation);
}

function handleEquals() {
    if (firstNumber !== null && currentOperator && !shouldResetDisplay) {
        // Get the second number from the current equation
        const parts = currentEquation.split(/[\+\-\×\÷]/);
        secondNumber = parseFloat(parts[parts.length - 1]);
        
        const result = operate(currentOperator, firstNumber, secondNumber);
        
        // Complete the equation with the result
        currentEquation += "=" + result;
        updateDisplay(currentEquation);

        firstNumber = null;
        secondNumber = null;
        currentOperator = null;
        shouldResetDisplay = true;
    }
}

function handleDecimal() {
    // Get the current number being entered (after last operator or from start)
    const parts = currentEquation.split(/[\+\-\×\÷=]/);
    const currentNumber = parts[parts.length - 1];

    if (shouldResetDisplay) {
        if (currentEquation.includes("=")) {
            currentEquation = "0.";
        } else {
            currentEquation += "0.";
        }
        shouldResetDisplay = false;
    } else if (!currentNumber.includes(".")) {
        if (currentEquation === "0" || currentEquation.includes("=")) {
            currentEquation = "0.";
        } else {
            currentEquation += ".";
        }
    }
    
    updateDisplay(currentEquation);
}

function handleBackspace() {
    // If showing complete equation with result, extract just the result
    if (currentEquation.includes("=")) {
        const result = currentEquation.split("=")[1];
        currentEquation = result;
        updateDisplay(currentEquation);
        return;
    }

    // Remove last character from equation
    if (currentEquation.length > 1) {
        currentEquation = currentEquation.slice(0, -1);
    } else {
        currentEquation = "0";
    }
    
    updateDisplay(currentEquation);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize theme on page load
setTheme(getTheme());

// Listen for system theme changes (only if user hasn't set preference)
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
        if (!localStorage.getItem("userTheme")) {
            // No user preference, follow system
            setTheme(e.matches ? "dark" : "light");
        }
    });

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    // Theme toggle button
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const newTheme = toggleTheme();
            console.log(`Theme changed to: ${newTheme}`);

            // Re-create icons after theme change
            setTimeout(() => {
                if (window.lucide) lucide.createIcons();
            }, 100);
        });
    }

    // Generate calculator buttons
    generateCalculatorButtons();

    // Shared routing function for button actions
    function routeCalculatorAction(value, type) {
        switch (type) {
            case "number":
            case "zero":
                handleNumber(value);
                break;
            case "operator":
                handleOperator(value);
                break;
            case "equals":
                handleEquals();
                break;
            case "decimal":
                handleDecimal();
                break;
            case "all-clear":
                handleAllClear();
                break;
            case "clear":
                clearCalculator();
                break;
            case "backspace":
                handleBackspace();
                break;
        }
    }

    // Calculator button event listeners
    const calculatorContainer = document.getElementById("calculator-buttons");
    if (calculatorContainer) {
        calculatorContainer.addEventListener("click", (e) => {
            if (!e.target.matches(".calculator-button")) return;

            routeCalculatorAction(
                e.target.dataset.value,
                e.target.dataset.type
            );
        });
    }

    // Minimal keyboard-to-calculator mapping (only differences)
    const KEYBOARD_MAP = {
        "*": "×",
        "/": "÷",
        Enter: "=",
        Escape: "AC",
        Delete: "C",
        c: "C",
        C: "C",
        Backspace: "←",
        // Numpad keys
        NumpadDivide: "÷",
        NumpadMultiply: "×",
        NumpadSubtract: "-",
        NumpadAdd: "+",
        NumpadEnter: "=",
        NumpadDecimal: ".",
    };

    // Keyboard support
    document.addEventListener("keydown", (e) => {
        let buttonValue = KEYBOARD_MAP[e.key] || e.key;

        // Transform numpad number keys (Numpad0 → 0, Numpad1 → 1, etc.)
        if (
            e.key.startsWith("Numpad") &&
            e.key.length === 7 &&
            !isNaN(e.key.slice(-1))
        ) {
            buttonValue = e.key.slice(-1); // Extract the last character (the digit)
        }

        // Find the button configuration from our single source of truth
        const buttonConfig = CALCULATOR_BUTTONS.find(
            (btn) => btn.value === buttonValue
        );

        if (buttonConfig && buttonConfig.type !== "spacer") {
            e.preventDefault();
            routeCalculatorAction(buttonConfig.value, buttonConfig.type);
        }
    });

    console.log("Event listeners attached");
});
