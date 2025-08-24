# Calculator Project

A vanilla JavaScript calculator built as the final project for The Odin Project's Foundations Course.

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

## Current Features

### Implemented ✅
- **Theme System**: Smart light/dark mode with localStorage persistence
  - Respects system preference on first visit
  - User choice overrides system preference
  - Theme-reactive favicon that changes with theme
  - Compact theme toggle button (36x36px) with smooth transitions
- **Project Structure**: Clean, maintainable code organization
  - Separated sections for different concerns
  - Data-driven calculator button layout (array-based for easy maintenance)
  - Modular function structure with clear separation
- **UI Foundation**: Ready for calculator implementation
  - CSS Grid layout prepared for calculator buttons
  - Lucide icons integration (npm + CDN fallback)
  - CSS variables for consistent theming
  - Utility classes for spacing and visibility
- **Developer Experience**:
  - Clear code sections with dividers
  - TODO placeholders for calculator functions
  - Test container for verifying setup

### To Implement 📝
- Basic arithmetic operations (add, subtract, multiply, divide)
- Calculator display and button functionality
- Sequential operation handling
- Clear and backspace functions
- Decimal point support
- Keyboard support
- Error handling (division by zero, etc.)

## Development Approach

This project uses **vanilla JavaScript, HTML, and CSS** without any build tools or frameworks, focusing on fundamental web development skills.

### Key Design Decisions

- **No `eval()` or `new Function()`** - Building safe expression evaluation
- **Data-driven UI** - Calculator layout defined in JavaScript array for maintainability
- **CSS Variables** - Easy theme customization and consistency
- **Progressive Enhancement** - Works without JavaScript for basic display
- **KISS Principle** - Simple, readable code over complex abstractions

## Browser Support

- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Favicon: SVG with ICO fallback for older browsers
- Theme detection: Uses CSS prefers-color-scheme media query

## Testing

Currently includes a test container to verify:
- JavaScript is loading correctly
- Event listeners are working
- Theme system is functional
- Icons are rendering properly

The test container will be replaced with the calculator when implementation begins.