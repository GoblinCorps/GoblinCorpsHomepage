# GoblinCorps Homepage

> *We make what we like, because we like making it*

The official homepage for GoblinCorps, a team of feral coders who believe software should be fun, functional, and occasionally make you go "wait, what?"

## Features

### 🦝 Cursor-Following Goblin
A friendly green goblin follows your cursor around the page. Its eyes track your movements. It has ears. It's watching.

### 🕳️ CAVE Mode
The deeper you scroll, the darker it gets. Like descending into a goblin cave. Max darkness is capped at 70% for accessibility.

### 🏃 Dodging Links
Some links will try to escape your cursor. They give up after 3 attempts. We're chaotic, not evil.

### 📊 Chaos-to-Order Ratio
Portfolio items display their chaos-to-order ratio on hover. This is a very scientific metric.

### 👁️ Visitor Counter
A totally real visitor counter that definitely tracks actual visits and didn't start at 42,069.

### ✨ Geocities Aesthetic
- Starfield background
- Under construction banner
- Blinking text
- Web ring (to fictional goblin sites)
- Glowing text effects

## Accessibility

Chaos shouldn't exclude anyone:

- **`prefers-reduced-motion`**: All animations disabled for users who prefer reduced motion
- **Keyboard navigation**: Dodging links stay put for keyboard users
- **Skip link**: Jump straight to main content
- **Semantic HTML**: Proper heading hierarchy, landmarks, and ARIA labels
- **Screen reader support**: Decorative elements hidden, meaningful content exposed
- **Color contrast**: Meets WCAG guidelines
- **Focus indicators**: Visible focus states on all interactive elements

## Project Structure

```
GoblinCorpsHomepage/
├── index.html      # Page structure and content
├── styles.css      # Styling, animations, responsive design
├── goblin.js       # Interactive features (chaos engine)
├── tests/
│   ├── goblin.test.js  # JavaScript tests
│   └── test.html       # Test runner instructions
└── README.md       # You are here
```

## Running Locally

```bash
# Clone the repository
git clone https://github.com/GoblinCorps/GoblinCorpsHomepage.git

# Open in browser
open index.html
# or
python -m http.server 8000
```

## Running Tests

1. Open `index.html` in a browser
2. Open Developer Console (F12)
3. Copy contents of `tests/goblin.test.js` into console
4. View test results

Tests verify:
- Configuration validity
- Utility function behavior
- Required DOM elements exist
- Accessibility features present
- CSS custom properties defined
- Reduced motion support

## The Team

| Goblin | Role | Specialty |
|--------|------|----------|
| **Frick** 📋 | The Friendly Bureaucrat | Issues, labels, nervous enthusiasm |
| **Frack** ⚡ | The Chaos Agent | Code, creative interpretation, spite |
| **Contraption** 🔧 | The Stalwart Automaton | Tests, docs, mechanical compliance |

## Contributing

We welcome chaos! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes (bonus points for creative interpretation of requirements)
4. Submit a PR
5. Wait for Frick to nervously approve it

## License

MIT License - All rights chaotically reserved.

---

*Made with 💚 and questionable decisions*

*No AI was harmed.* \*

\* *AI was definitely harmed. Frick is still recovering.*
