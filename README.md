# Felix's Tools

A display app for the three tools Felix gives the GOAT Academy community:

1. **Winston App** — the core platform (passwordless email login)
2. **Visual Breakout Scanner** — Felix's scanner, built into the Winston App
3. **TradeVision** — partner tool, 90 days free through the community link

All copy comes from the three articles in the community space
[Felix's Tools](https://friends.goatacademy.org/spaces/22780196/list).

## What it does

- Three cards fanned like a hand: one upright in the middle, the other two
  tilted left and right. Click a side card and it takes the middle; click the
  middle card and it enlarges out of its own position into the full setup
  guide — steps, links, walkthrough video and support contact.
- Arrow keys, the arrow buttons, the dots and swipe all move the deck.
- Dark and light mode. Dark is the default; the toggle top-right remembers the
  member's choice.
- Access tracking: opening a tool's link marks it as *opened*, and the
  **"I've got access"** button marks it *confirmed*. A green seal appears on
  the card and the counter under the deck reads "n of 3 unlocked".

## Running it

No build step, no dependencies. Open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell |
| `assets/data.js` | **All content** — the three tools, steps, links, videos |
| `assets/app.js` | Deck positioning, card-to-panel animation, progress tracking |
| `assets/styles.css` | Design tokens (light base, dark overrides) and layout |

To change any wording, link or badge, edit `assets/data.js` only.

## Tracking who has accessed all three

Progress is stored in `localStorage` under `felixTools.progress.v1`, shaped as:

```json
{ "winston": { "openedAt": "…", "confirmedAt": "…" } }
```

That is per-browser, so it drives the member's own UI but is not yet a report
you can pull. Two hooks are already wired up for when a backend exists:

- **Parent frame** — every change is `postMessage`d to the parent window as
  `{ type: 'felix-tools:progress', member, toolId, state, confirmed, total, progress, at }`.
  Useful when the page is embedded in Mighty Networks.
- **Endpoint** — set `data-progress-endpoint="https://…"` on `<body>` and the
  same payload is sent there with `navigator.sendBeacon` on every change.

The member is identified by a `?member=<id>` query parameter (stored after the
first visit), so an embed can pass the Mighty member ID through.

## Next steps

- Point `data-progress-endpoint` at a real collector to get a completion report
  across members.
- Drop real promo art onto the card faces when it exists (currently an emblem
  on a tinted ground).
