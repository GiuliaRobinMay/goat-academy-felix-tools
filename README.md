# Felix's Tools

A display app for the three tools Felix gives the GOAT Academy community:

1. **Winston App** — the core platform (passwordless email login)
2. **Visual Breakout Scanner** — Felix's scanner, built into the Winston App
3. **TradeVision** — partner tool, 90 days free through the community link

All copy comes from the three articles in the community space
[Felix's Tools](https://friends.goatacademy.org/spaces/22780196/list).

## What it does

- Three promotional cards. Clicking one enlarges it out of its own position
  into a full detail panel with the access steps, links, walkthrough video and
  support contact.
- Dark and light mode. Dark is the default; the toggle in the header remembers
  the member's choice.
- Access tracking: opening a tool's link marks it as *opened*, and the
  **"I've got access"** button marks it *confirmed*. The header percentage and
  the "Your setup" rail show how far along the member is.

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
| `assets/app.js` | Rendering, card-to-panel animation, progress tracking |
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
- Swap the placeholder hero quote for Felix's actual words.
- Add a card image / screenshot per tool if promo art becomes available.
