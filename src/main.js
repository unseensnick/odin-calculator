console.log('JavaScript loaded successfully!');

// ============================================================================
// DEPENDENCIES & IMPORTS
// ============================================================================

// Import Lucide icons - try local npm version first
import('../node_modules/lucide/dist/umd/lucide.js')
    .then(() => {
        console.log('Lucide loaded from npm');
        lucide.createIcons();
    })
    .catch(() => {
        // Fallback to CDN if local version not found
        console.log('Loading Lucide from CDN');
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
        script.onload = () => {
            console.log('Lucide loaded from CDN');
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
    const userTheme = localStorage.getItem('userTheme');
    if (userTheme) {
        return userTheme;
    }
    // Otherwise use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Set theme
function setTheme(theme, isUserAction = false) {
    if (isUserAction) {
        // User manually changed theme, store their preference
        localStorage.setItem('userTheme', theme);
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    updateFavicon(theme === 'dark');
}

// Toggle between light and dark themes
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme, true);
    return newTheme;
}

// Update favicon based on theme
function updateFavicon(isDark) {
    fetch('favicon.svg')
        .then(response => response.text())
        .then(svgText => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const gElement = svgDoc.querySelector('g');
            
            gElement.setAttribute('fill', isDark ? '#ffffff' : '#000000');
            
            const svg = svgDoc.querySelector('svg');
            const rect = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('width', '512');
            rect.setAttribute('height', '512');
            rect.setAttribute('fill', isDark ? '#1a1a1a' : '#f0f0f0');
            svg.insertBefore(rect, svg.firstChild);
            
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgDoc);
            const dataUrl = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
            
            const favicon = document.querySelector("link[rel='icon']");
            if (favicon) {
                favicon.href = dataUrl;
            }
        })
        .catch(err => console.error('Failed to update favicon:', err));
}

// ============================================================================
// CALCULATOR LOGIC
// ============================================================================

// Calculator button layout - much easier to maintain!
const CALCULATOR_LAYOUT = [
    ['C', '←', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
];

// Button type mapping for styling
const BUTTON_TYPES = {
    'C': 'clear',
    '←': 'backspace',
    '÷': 'operator',
    '×': 'operator',
    '-': 'operator',
    '+': 'operator',
    '=': 'equals',
    '.': 'decimal',
    '0': 'zero'
};

// Calculator state variables
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let shouldResetDisplay = false;

// Function to generate calculator buttons
function generateCalculatorButtons() {
    const container = document.getElementById('calculator-buttons');
    if (!container) return;
    
    CALCULATOR_LAYOUT.forEach(row => {
        row.forEach(btnText => {
            const button = document.createElement('button');
            button.textContent = btnText;
            button.className = 'calculator-button';
            
            // Add type-specific class
            const type = BUTTON_TYPES[btnText];
            if (type) {
                button.classList.add(`calculator-button--${type}`);
            }
            
            // Add data attribute for easier event handling
            button.dataset.value = btnText;
            
            container.appendChild(button);
        });
    });
}

// Basic math operations
function add(a, b) {
    // TODO: Implement addition
}

function subtract(a, b) {
    // TODO: Implement subtraction
}

function multiply(a, b) {
    // TODO: Implement multiplication
}

function divide(a, b) {
    // TODO: Implement division with zero check
}

// Main operate function
function operate(operator, a, b) {
    // TODO: Call appropriate operation based on operator
}

// Display functions
function updateDisplay(value) {
    // TODO: Update calculator display
}

function clearCalculator() {
    // TODO: Reset all calculator state
}

function handleNumber(num) {
    // TODO: Handle number button clicks
}

function handleOperator(op) {
    // TODO: Handle operator button clicks
}

function handleEquals() {
    // TODO: Calculate and display result
}

function handleDecimal() {
    // TODO: Add decimal point handling
}

function handleBackspace() {
    // TODO: Remove last digit
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize theme on page load
setTheme(getTheme());

// Listen for system theme changes (only if user hasn't set preference)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('userTheme')) {
        // No user preference, follow system
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = toggleTheme();
            console.log(`Theme changed to: ${newTheme}`);
            
            // Re-create icons after theme change
            setTimeout(() => {
                if (window.lucide) lucide.createIcons();
            }, 100);
        });
    }
    
    // Generate calculator buttons (when calculator is ready to be shown)
    // generateCalculatorButtons();
    
    // Calculator button event listeners
    // TODO: Add event listeners for calculator buttons
    
    // Keyboard support
    // TODO: Add keyboard event listeners
    
    // Test button functionality (remove when calculator is implemented)
    const button = document.getElementById('test-button');
    const output = document.getElementById('output');
    
    if (button && output) {
        let clickCount = 0;
        
        button.addEventListener('click', () => {
            clickCount++;
            output.textContent = `Button clicked ${clickCount} time${clickCount !== 1 ? 's' : ''}`;
            console.log(`Click event fired: ${clickCount}`);
        });
    }
    
    console.log('Event listeners attached');
});