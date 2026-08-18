# Embedding Felix's Tools

Live app: <https://goat-academy-felix-tools.vercel.app/>

`embed.html` in this repo is a working test page — open it in a browser to see
the app inside an iframe exactly as members will.

## Paste this into Mighty Networks

Add an **Embed / custom HTML** block and paste:

```html
<div style="width:100%">
  <iframe
    id="felixTools"
    src="https://goat-academy-felix-tools.vercel.app/"
    title="Felix's Tools"
    style="width:100%;height:900px;border:0;border-radius:16px;display:block"
    loading="lazy"
  ></iframe>
</div>
<script>
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'felix-tools:height') return;
    var f = document.getElementById('felixTools');
    var h = Math.min(Math.max(Number(e.data.height) || 0, 480), 3000);
    if (f && h && Math.abs(f.offsetHeight - h) > 2) f.style.height = h + 'px';
  });
</script>
```

The app posts its own height to the host page, so the iframe grows to fit —
including on phones, where the three cards stack.

### If the block strips `<script>`

Some embed blocks allow only markup. Use the iframe on its own with a fixed
height; `900px` suits desktop, and the media query keeps phones scrollable:

```html
<iframe
  src="https://goat-academy-felix-tools.vercel.app/"
  title="Felix's Tools"
  style="width:100%;height:900px;border:0;border-radius:16px;display:block"
  loading="lazy"
></iframe>
```

## Identifying the member

The app reads a `?member=` parameter and stores it, so progress can later be
tied to a person:

```
https://goat-academy-felix-tools.vercel.app/?member=41136831
```

If Mighty exposes a member-ID merge tag in embeds, drop it in there. Without
it the app still works — progress is just anonymous per browser.

## What the app sends to the host page

Both messages are posted to `window.parent`:

| Message | When | Payload |
| --- | --- | --- |
| `felix-tools:height` | load, resize, panel open/close | `{ height }` |
| `felix-tools:progress` | a tool is opened or confirmed | `{ member, toolId, state, confirmed, total, progress, at }` |

The progress message is what a collector would listen to in order to report on
who has unlocked all three tools.
