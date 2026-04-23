# Random Users

A responsive web app that fetches and displays random user profiles from the [Random User API](https://randomuser.me/). Browse 50 users across paginated cards, preview quick info in a modal, or open a full profile page.

## Features

- **5×2 card grid** — displays 10 users per page with staggered fade-in animations
- **Quick preview modal** — click a user's avatar to see name, email, phone, city, country, age, and gender in a pop-up
- **Full profile page** — "View Profile" opens a dedicated detail page with extended info (street, postcode, nationality)
- **Pagination** — Prev / Next controls with smooth scroll-to-top on page change
- **Responsive layout** — grid collapses from 5 → 4 → 3 → 2 → 1 columns across breakpoints
- **Glassmorphism header** — sticky, blurred header that stays visible while scrolling
- **Keyboard & click-outside support** — press `Escape` or click the backdrop to close the modal
- **XSS-safe rendering** — all user data is HTML-escaped before insertion

## Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, CSS Grid, keyframe animations) |
| Scripting | Vanilla JS + jQuery 3.6 |
| Icons | Font Awesome 6.4 |
| Font | Poppins (Google Fonts) |
| Data | [randomuser.me API](https://randomuser.me/) |

## Project Structure

```
├── index.html        # Main listing page (grid + pagination + modal)
├── user-details.html # Full profile detail page
├── style.css         # All styles (variables, layout, components, responsive)
└── script.js         # Data fetching, rendering, modal, and pagination logic
```

## Getting Started

No build step required — open directly in a browser.

```bash
# Clone the repo
git clone https://github.com/KHUSHIBANSAL1604/Random-users.git

# Open in browser
open index.html
```

Or serve locally with any static file server:

```bash
npx serve .
# then visit http://localhost:3000
```

## How It Works

1. On load, `fetchUsers()` calls `https://randomuser.me/api/?results=50&seed=hakarux2024` — the fixed seed keeps the dataset consistent across reloads.
2. `renderPage(n)` slices the cached array and builds card HTML for page `n`.
3. Clicking a card image calls `openModal(user)` which renders a quick-view panel.
4. "View Full Profile" stores the user object in `localStorage` and navigates to `user-details.html`, where `renderUserDetails()` reads it back and renders the full card.

## Responsive Breakpoints

| Viewport | Columns |
|----------|---------|
| > 1100 px | 5 |
| 861 – 1100 px | 4 |
| 601 – 860 px | 3 |
| 381 – 600 px | 2 |
| ≤ 380 px | 1 |

## License

MIT
