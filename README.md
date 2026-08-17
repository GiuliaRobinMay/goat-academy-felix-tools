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
| `index.html` | Page shell — banner, masthead, deck, overlay |
| `assets/data.js` | **All content** — the tools, steps, links, videos |
| `assets/art.js` | The drawn scene on each card face |
| `assets/app.js` | Deck positioning, card-to-panel animation, progress tracking |
| `assets/styles.css` | Design tokens (light base, dark overrides) and layout |

To change any wording, link or badge, edit `assets/data.js` only.

## Adding a tool

Append an object to `window.FELIX_TOOLS` in `assets/data.js`. The deck reads
the list at load: the card, the dot, the counter and the "n of N unlocked"
line all follow, and the fan geometry is computed from each card's distance to
the middle, so four, five or ten tools fan correctly with no CSS to touch.

Fields: `id` (unique, also the progress key), `code` (corner pip), `name`,
`tagline`, `kicker`, `summary`, `accent` (`blue` / `teal` / `violet`), `icon`
(`chart` / `scanner` / `vision`), `ctaLabel`, `ctaUrl` and `steps`. Optional:
`badge` + `badgeTone`, `highlights`, `note`, `video`, `support`, `sourceUrl`,
and `art` — the key of a scene in `assets/art.js`. Leave `art` off and the
card falls back to the plain icon emblem, so a new tool works before its
artwork exists.

## Where the content comes from

Access steps, links, videos and support contacts are verbatim from the three
community articles. The feature bullets come from public product information —
the Winston launch announcement (Stock Radar, Metal Minute, ETF Edge, 10,800+
instruments, 11 exchanges) and tradevision.io (screener with breakout
indicator, real-time options chains and dark pool activity, options profit
calculator). Worth a read-through by someone at GOAT before this goes live.

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
