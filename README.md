# Calculator Project

A fully functional vanilla JavaScript calculator built as the final project for The Odin Project's Foundations Course. Features progressive equation display, comprehensive keyboard support, and a clean architectural design.

## Project Structure

```
calculator/
├── src/
│   ├── index.html      # Main HTML file with semantic structure
│   ├── global.css      # Organized styles with CSS variables
│   ├── main.js         # Modular JavaScript with clear sections
│   ├── favicon.svg     # Theme-reactive calculator icon
│   └── favicon.ico     # Fallback icon for older browsers
├── .gitignore          # Git ignore rules
├── CLAUDE.md           # AI assistant guidelines
├── README.md           # Project documentation
├── package.json        # NPM dependencies (Lucide icons)
└── package-lock.json   # Dependency lock file
```

## Getting Started

### Running the Project

Open `src/index.html` directly in your browser, or serve it using a local server:

```bash
# Using Python
cd src && python3 -m http.server 8000

# Using Node.js (if installed)
npx serve src

# Or any other static file server
```

Then navigate to `http://localhost:8000` in your browser.

## Features

### Core Functionality ✅

-   **Basic Arithmetic**: Add, subtract, multiply, divide operations
-   **Progressive Equation Display**: Shows equation building in real-time (4 → 41 → 41+ → 41+8 → 41+8=49)
-   **Sequential Operations**: Handles chained calculations (12+7-1=18)
-   **Error Handling**: Division by zero protection and graceful error states
-   **Memory Management**: Proper state tracking for complex calculations

### Input Methods ✅

-   **Mouse/Touch**: Click calculator buttons
-   **Full Keyboard Support**:
    -   Numbers: 0-9 keys and numpad
    -   Operators: +, -, *, / (maps to ×, ÷)
    -   Actions: Enter/NumpadEnter (=), Escape (AC), Delete/C (Clear), Backspace (←)
    -   Decimal: . and NumpadDecimal

### Advanced Features ✅

-   **AC/C Button Functionality**:
    -   AC (All Clear): Complete calculator reset
    -   C (Clear): Context-aware entry clearing
-   **Decimal Support**: Prevents multiple decimal points per number
-   **Backspace**: Character-by-character removal
-   **Smart Display**: Shows full equation context with results

### UI/UX ✅

-   **Theme System**: Smart light/dark mode with localStorage persistence
    -   Respects system preference on first visit
    -   User choice overrides system preference
    -   Theme-reactive favicon that changes with theme
-   **Visual Feedback**: Hover effects and button state transitions
-   **Professional Styling**: Clean, modern calculator interface

## Development Approach

This project uses **vanilla JavaScript, HTML, and CSS** without any build tools or frameworks, focusing on fundamental web development skills.

### Key Design Decisions

-   **No `eval()` or `new Function()`** - Custom safe expression evaluation
-   **Single Source of Truth** - `CALCULATOR_BUTTONS` array drives all functionality
-   **Event Delegation** - One listener for all buttons, better performance
-   **Data-driven Architecture** - Button configuration centralized for easy maintenance
-   **Algorithmic Key Transformation** - Smart numpad handling without duplication
-   **Progressive Enhancement** - Clean separation of concerns

## Browser Support

-   Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
-   Favicon: SVG with ICO fallback for older browsers
-   Theme detection: Uses CSS prefers-color-scheme media query
