/**
 * Felix's Tools — a three-card deck.
 *
 * Three cards fanned like a hand: one upright in the middle, the others
 * tilted left and right. Click a side card and it takes the middle. Click the
 * middle card and it opens into the full setup guide.
 *
 * Members confirm they got into each tool; progress is kept in localStorage
 * and mirrored to an optional endpoint / parent frame so it can be collected.
 */
(function () {
  'use strict';

  var STORE_KEY = 'felixTools.progress.v1';
  var THEME_KEY = 'felixTools.theme';
  var tools = window.FELIX_TOOLS || [];

  /* ---------------------------------------------------------------- icons */

  var ICONS = {
    chart:
      '<path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /><circle cx="7" cy="15" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="6" r="1.4" fill="currentColor" stroke="none"/>',
    scanner:
      '<path d="M3 8V5a2 2 0 0 1 2-2h3" /><path d="M16 3h3a2 2 0 0 1 2 2v3" /><path d="M21 16v3a2 2 0 0 1-2 2h-3" /><path d="M8 21H5a2 2 0 0 1-2-2v-3" /><path d="M7 14l3-3.5L13 13l4-5" />',
    vision:
      '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />',
    deck:
      '<rect x="8" y="5" width="11" height="15" rx="2.5" /><path d="M14.5 3.6 6.2 5.7a2 2 0 0 0-1.4 2.5l2.6 9.6" />',
    arrow: '<path d="M5 12h14" /><path d="m13 6 6 6-6 6" />',
    left: '<path d="m14 6-6 6 6 6" />',
    right: '<path d="m10 6 6 6-6 6" />',
    check: '<path d="m4 12 5 5L20 6" />',
    external:
      '<path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />',
    close: '<path d="M5 5l14 14" /><path d="M19 5 5 19" />',
    play: '<path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" stroke="none" />',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />',
    sun: '<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M19.1 4.9l-1.5 1.5M6.4 17.6l-1.5 1.5" />'
  };

  function icon(name, cls) {
    return (
      '<svg class="' +
      (cls || '') +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || '') +
      '</svg>'
    );
  }

  /** The drawn scene for a tool, or the plain emblem if art is missing. */
  function scene(tool) {
    var art = (window.FELIX_ART || {})[tool.art];
    return art || '<span class="pcard__emblem">' + icon(tool.icon) + '</span>';
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }

  /* -------------------------------------------------------------- storage */

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (err) {
      return {};
    }
  }

  var progress = loadProgress();

  function stateOf(id) {
    var entry = progress[id];
    if (!entry) return 'todo';
    if (entry.confirmedAt) return 'done';
    if (entry.openedAt) return 'opened';
    return 'todo';
  }

  function confirmedCount() {
    return tools.filter(function (tool) {
      return stateOf(tool.id) === 'done';
    }).length;
  }

  function saveProgress(id, patch) {
    progress[id] = Object.assign({}, progress[id], patch);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(progress));
    } catch (err) {
      /* private mode — the UI still works for this session */
    }
    report(id);
    paint();
  }

  /**
   * Mirror progress outward so it can be collected server-side later.
   * - posts to the endpoint in <body data-progress-endpoint="...">, if set
   * - always posts a message to the parent frame (Mighty Networks embed)
   */
  function report(id) {
    var payload = {
      type: 'felix-tools:progress',
      member: memberId(),
      toolId: id,
      state: stateOf(id),
      confirmed: confirmedCount(),
      total: tools.length,
      progress: progress,
      at: new Date().toISOString()
    };

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(payload, '*');
      }
    } catch (err) {
      /* cross-origin parent — nothing to do */
    }

    var endpoint = document.body.getAttribute('data-progress-endpoint');
    if (endpoint && navigator.sendBeacon) {
      try {
        navigator.sendBeacon(
          endpoint,
          new Blob([JSON.stringify(payload)], { type: 'application/json' })
        );
      } catch (err) {
        /* best effort only */
      }
    }
  }

  /** Optional member identity, e.g. ?member=41136831 from the Mighty embed. */
  function memberId() {
    var fromUrl = new URLSearchParams(location.search).get('member');
    if (fromUrl) {
      try {
        localStorage.setItem('felixTools.member', fromUrl);
      } catch (err) {}
      return fromUrl;
    }
    try {
      return localStorage.getItem('felixTools.member') || null;
    } catch (err) {
      return null;
    }
  }

  /* ---------------------------------------------------------------- theme */

  function initTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (err) {}
    // Dark is the house look; the member's own choice always wins.
    setTheme(saved === 'light' || saved === 'dark' ? saved : 'dark');
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {}
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  /* ----------------------------------------------------------------- deck */

  var deckEl = document.getElementById('deck');
  var dotsEl = document.getElementById('dots');
  var statusEl = document.getElementById('deckStatus');
  var overlay = document.getElementById('overlay');
  var detail = document.getElementById('detail');
  var themeToggle = document.getElementById('themeToggle');
  var progressChip = document.getElementById('progressChip');
  var active = 0;

  function cardMarkup(tool, index) {
    // Corner pips, the way a playing card carries its rank and suit.
    var corner =
      '<span class="pcard__corner pcard__corner--{side}">' +
      esc(tool.code || '') +
      icon(tool.icon) +
      '</span>';

    return (
      '<button class="pcard" type="button" data-id="' +
      esc(tool.id) +
      '" data-index="' +
      index +
      '" data-accent="' +
      esc(tool.accent) +
      '" aria-haspopup="dialog">' +
      '<span class="pcard__face">' +
      '<span class="pcard__art">' +
      corner.replace('{side}', 'tl') +
      scene(tool) +
      corner.replace('{side}', 'br').replace(esc(tool.code || ''), '') +
      (tool.badge
        ? '<span class="pcard__flag" data-tone="' +
          esc(tool.badgeTone || 'lime') +
          '">' +
          esc(tool.badge) +
          '</span>'
        : '') +
      '<span class="pcard__seal">' +
      icon('check') +
      '</span>' +
      '</span>' +
      '<span class="pcard__label">' +
      '<span class="pcard__kicker">' +
      esc(tool.kicker) +
      '</span>' +
      '<span class="pcard__name">' +
      esc(tool.name) +
      '</span>' +
      '<span class="pcard__tagline">' +
      esc(tool.tagline) +
      '</span>' +
      '<span class="pcard__hint">Open' +
      icon('arrow') +
      '</span>' +
      '</span>' +
      '</span>' +
      '</button>'
    );
  }

  function build() {
    deckEl.innerHTML = tools.map(cardMarkup).join('');
    dotsEl.innerHTML = tools
      .map(function (tool, index) {
        return (
          '<button class="dot" type="button" data-index="' +
          index +
          '" aria-label="' +
          esc(tool.name) +
          '"></button>'
        );
      })
      .join('');
    paint();
  }

  /**
   * Where a card sits relative to the active one. The deck wraps, so with
   * three cards the active one is always flanked by the other two rather
   * than ending up at one end of the fan.
   */
  function positionOf(index) {
    var count = tools.length;
    var pos = (((index - active) % count) + count) % count;
    return pos > count / 2 ? pos - count : pos;
  }

  /**
   * Lay a card out for its slot in the fan. Everything is derived from the
   * distance to the middle, so three tools and ten tools both work: cards
   * further out sit lower, smaller and more tilted, and anything past the
   * fourth ring is parked out of sight behind the deck.
   */
  function place(card, pos) {
    var depth = Math.abs(pos);
    var dir = pos < 0 ? -1 : 1;
    var side =
      depth === 0 ? 'center' : depth <= 2 ? 'side' : depth === 3 ? 'far' : 'hidden';

    card.style.setProperty('--x', pos === 0 ? '0' : dir * (64 + (depth - 1) * 42));
    card.style.setProperty('--y', depth * 28 + 'px');
    card.style.setProperty('--r', dir * Math.min(depth, 4) * 10 + 'deg');
    card.style.setProperty('--s', Math.max(1 - depth * 0.13, 0.55));
    card.style.setProperty('--z', String(20 - depth));
    card.setAttribute('data-side', side);
    card.setAttribute('data-pos', String(pos));
    return side;
  }

  /** Position every card relative to the active one, and refresh state. */
  function paint() {
    tools.forEach(function (tool, index) {
      var card = deckEl.children[index];
      var state = stateOf(tool.id);
      place(card, positionOf(index));
      card.setAttribute('data-state', state);
      card.setAttribute('aria-hidden', index === active ? 'false' : 'true');
      card.setAttribute('tabindex', index === active ? '0' : '-1');

      var dot = dotsEl.children[index];
      dot.setAttribute('aria-current', String(index === active));
      dot.setAttribute('data-state', state);
    });

    var done = confirmedCount();
    statusEl.textContent =
      done === tools.length
        ? 'All ' + tools.length + ' unlocked — you’re set up.'
        : done + ' of ' + tools.length + ' unlocked';
    progressChip.textContent = tools.length
      ? Math.round((done / tools.length) * 100) + '%'
      : '0%';

    var openId = detail.getAttribute('data-id');
    if (openId) syncDetailButton(openId);
  }

  function goTo(index) {
    active = (index + tools.length) % tools.length;
    paint();
  }

  /* --------------------------------------------------------------- detail */

  function detailMarkup(tool) {
    var state = stateOf(tool.id);
    var html =
      '<button class="close" type="button" data-close aria-label="Close">' +
      icon('close') +
      '</button>' +
      '<div class="detail__inner">' +
      '<div class="detail__head">' +
      '<span class="detail__scene">' +
      scene(tool) +
      '</span>' +
      '<span class="detail__emblem">' +
      icon(tool.icon) +
      '</span>' +
      '<div>' +
      '<p class="eyebrow">' +
      esc(tool.kicker) +
      ' · ' +
      esc(tool.tagline) +
      '</p>' +
      '<h2 id="detailTitle">' +
      esc(tool.name) +
      '</h2>' +
      '<p class="detail__summary">' +
      esc(tool.summary) +
      '</p>' +
      '</div>' +
      '</div>' +
      '<div class="detail__body">';

    if (tool.highlights && tool.highlights.length) {
      html +=
        '<section class="block"><h3>What you get</h3><ul class="highlights">' +
        tool.highlights
          .map(function (item) {
            return '<li>' + icon('check') + '<span>' + esc(item) + '</span></li>';
          })
          .join('') +
        '</ul></section>';
    }

    html +=
      '<section class="block"><h3>How to get access</h3><ol class="steps">' +
      tool.steps
        .map(function (step) {
          return (
            '<li><div><strong class="step__title">' +
            esc(step.title) +
            '</strong><p>' +
            step.body +
            '</p></div></li>'
          );
        })
        .join('') +
      '</ol></section>';

    if (tool.note) {
      html += '<p class="callout"><strong>Note:</strong> ' + tool.note + '</p>';
    }

    html +=
      '<section class="block"><h3>Get in</h3><div class="actions">' +
      '<a class="btn btn--primary" href="' +
      esc(tool.ctaUrl) +
      '" target="_blank" rel="noopener" data-cta>' +
      esc(tool.ctaLabel) +
      icon('external') +
      '</a>' +
      '<button class="btn btn--confirm" type="button" data-confirm aria-pressed="' +
      (state === 'done') +
      '"><span class="check">' +
      icon('check') +
      '</span><span data-confirm-label>' +
      (state === 'done' ? 'Access confirmed' : 'I’ve got access') +
      '</span></button>' +
      '</div>' +
      '<p class="confirm-hint">Tick this once you’re inside — it’s how we know you’ve unlocked all three tools.</p>' +
      '</section>';

    if (tool.video) {
      html +=
        '<section class="block"><h3>Walkthrough</h3>' +
        '<a class="video" href="' +
        esc(tool.video.url) +
        '" target="_blank" rel="noopener">' +
        '<img src="' +
        esc(tool.video.poster) +
        '" alt="" loading="lazy">' +
        '<span class="video__play"><span>' +
        icon('play') +
        '</span></span>' +
        '<span class="video__label">' +
        esc(tool.video.label) +
        '</span></a></section>';
    }

    if (tool.support) {
      html +=
        '<section class="support"><h4>' +
        esc(tool.support.title) +
        '</h4><p>' +
        tool.support.body +
        '</p><a class="btn btn--ghost" href="' +
        esc(tool.support.linkUrl) +
        '" target="_blank" rel="noopener">' +
        esc(tool.support.linkLabel) +
        icon('external') +
        '</a></section>';
    }

    if (tool.sourceUrl) {
      html +=
        '<a class="source-link" href="' +
        esc(tool.sourceUrl) +
        '" target="_blank" rel="noopener">Read the original post in the community →</a>';
    }

    return html + '</div></div>';
  }

  function syncDetailButton(id) {
    var btn = detail.querySelector('[data-confirm]');
    if (!btn) return;
    var done = stateOf(id) === 'done';
    btn.setAttribute('aria-pressed', String(done));
    btn.querySelector('[data-confirm-label]').textContent = done
      ? 'Access confirmed'
      : 'I’ve got access';
  }

  function openDetail(index) {
    var tool = tools[index];
    if (!tool) return;
    var card = deckEl.children[index];

    detail.setAttribute('data-id', tool.id);
    detail.setAttribute('data-accent', tool.accent);
    detail.innerHTML = detailMarkup(tool);

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Grow the panel out of the card it came from.
    if (card && !prefersReducedMotion()) {
      card.classList.add('is-source');
      var from = card.getBoundingClientRect();
      var to = detail.getBoundingClientRect();
      detail.style.transition = 'none';
      detail.style.transform =
        'translate(' +
        (from.left - to.left) +
        'px,' +
        (from.top - to.top) +
        'px) scale(' +
        from.width / to.width +
        ',' +
        from.height / to.height +
        ')';
      requestAnimationFrame(function () {
        detail.style.transition = 'transform 0.42s cubic-bezier(0.22,0.85,0.25,1)';
        detail.style.transform = 'none';
      });
    }

    detail.setAttribute('tabindex', '-1');
    detail.focus({ preventScroll: true });
    document.addEventListener('keydown', onDetailKeydown);
  }

  function closeDetail() {
    if (!overlay.classList.contains('is-open')) return;
    var card = deckEl.querySelector('.pcard.is-source');

    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onDetailKeydown);

    if (card && !prefersReducedMotion()) {
      var from = card.getBoundingClientRect();
      var to = detail.getBoundingClientRect();
      detail.style.transition = 'transform 0.32s cubic-bezier(0.4,0,0.6,1)';
      detail.style.transform =
        'translate(' +
        (from.left - to.left) +
        'px,' +
        (from.top - to.top) +
        'px) scale(' +
        from.width / to.width +
        ',' +
        from.height / to.height +
        ')';
    }

    window.setTimeout(
      function () {
        detail.style.transition = 'none';
        detail.style.transform = 'none';
        detail.removeAttribute('data-id');
        detail.innerHTML = '';
        if (card) {
          card.classList.remove('is-source');
          card.focus({ preventScroll: true });
        }
      },
      prefersReducedMotion() ? 0 : 320
    );
  }

  function onDetailKeydown(event) {
    if (event.key === 'Escape') closeDetail();
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /* --------------------------------------------------------------- events */

  deckEl.addEventListener('click', function (event) {
    var card = event.target.closest('.pcard');
    if (!card) return;
    var index = Number(card.getAttribute('data-index'));
    // A side card steps into the middle; the middle card opens.
    if (index === active) openDetail(index);
    else goTo(index);
  });

  dotsEl.addEventListener('click', function (event) {
    var dot = event.target.closest('.dot');
    if (dot) goTo(Number(dot.getAttribute('data-index')));
  });

  document.getElementById('prevBtn').innerHTML = icon('left');
  document.getElementById('nextBtn').innerHTML = icon('right');
  document.getElementById('prevBtn').addEventListener('click', function () {
    goTo(active - 1);
  });
  document.getElementById('nextBtn').addEventListener('click', function () {
    goTo(active + 1);
  });

  document.addEventListener('keydown', function (event) {
    if (overlay.classList.contains('is-open')) return;
    if (event.key === 'ArrowLeft') goTo(active - 1);
    if (event.key === 'ArrowRight') goTo(active + 1);
  });

  // Swipe the deck on touch devices.
  var touchX = null;
  deckEl.addEventListener(
    'touchstart',
    function (event) {
      touchX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );
  deckEl.addEventListener(
    'touchend',
    function (event) {
      if (touchX === null) return;
      var delta = event.changedTouches[0].clientX - touchX;
      if (Math.abs(delta) > 45) goTo(active + (delta < 0 ? 1 : -1));
      touchX = null;
    },
    { passive: true }
  );

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay || event.target.closest('[data-close]')) {
      closeDetail();
      return;
    }

    var id = detail.getAttribute('data-id');
    if (!id) return;

    // Opening the real tool marks it as started.
    if (event.target.closest('[data-cta]')) {
      if (stateOf(id) === 'todo') {
        saveProgress(id, { openedAt: new Date().toISOString() });
      }
      return;
    }

    var confirmBtn = event.target.closest('[data-confirm]');
    if (confirmBtn) {
      var isDone = stateOf(id) === 'done';
      saveProgress(id, {
        openedAt:
          (progress[id] && progress[id].openedAt) || new Date().toISOString(),
        confirmedAt: isDone ? null : new Date().toISOString()
      });
    }
  });

  themeToggle.addEventListener('click', function () {
    setTheme(
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark'
    );
  });

  /* ----------------------------------------------------------------- boot */

  document.getElementById('brandIcon').innerHTML = ICONS.deck;
  document.getElementById('toolCount').textContent =
    tools.length + (tools.length === 1 ? ' tool' : ' tools');
  document.getElementById('iconMoon').innerHTML = ICONS.moon;
  document.getElementById('iconSun').innerHTML = ICONS.sun;

  initTheme();
  build();
  // Start with the middle card of the fan facing front.
  goTo(Math.floor(tools.length / 2));
})();
