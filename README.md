# Christmas Gift Exchange

A small Secret Santa / Secret Gift Exchange web app with a clean, responsive UI.

Features
- Add and remove participant names
- Generate a derangement shuffle so no one is assigned themself
- Click your name card to reveal who you should give a gift to (modal + confetti)
- Reset confirmation dialog
- Responsive design for mobile and desktop

Files
- `index.html` — main HTML file
- `styles.css` — externalized CSS with responsive rules
- `app.js` — externalized JavaScript for app logic

Usage
1. Open `index.html` directly in a browser, or serve the folder with a local HTTP server for best results (recommended for some browsers):

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

2. Add participant names and press the start button. Click your card to reveal your assigned recipient.

Notes
- The assignment uses repeated shuffling to ensure no participant is assigned their own name.
- The application is intentionally simple and runs fully in the browser; no backend required.

License
- MIT (feel free to change)
