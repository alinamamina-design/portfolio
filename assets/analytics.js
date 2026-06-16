// Amplitude analytics + session replay — shared by all pages.
// Uses Amplitude's official per-project script loader (no build step needed).
// Project API key is a public client-side key — safe to keep in the repo.
(function () {
  var KEY = '2b12c0cb2a76dd4daca04e77e0b561da';

  // ── Internal / team opt-out ──────────────────────────────────────────────
  // Your own visits shouldn't pollute analytics. Mark a device ONCE by opening
  // any page with ?team=1 (persists in localStorage); clear with ?team=off.
  // When marked, nothing is sent to Amplitude (no events, no session replay).
  var IS_TEAM = false;
  try {
    var qp = new URLSearchParams(location.search);
    if (qp.has('team')) {
      var v = qp.get('team');
      if (v === '0' || v === 'off' || v === 'false') localStorage.removeItem('am_team');
      else localStorage.setItem('am_team', '1');
    }
    IS_TEAM = localStorage.getItem('am_team') === '1';
  } catch (e) {}

  var s = document.createElement('script');
  s.src = 'https://cdn.amplitude.com/script/' + KEY + '.js';
  s.async = true;
  s.onload = function () {
    if (!window.amplitude) return;

    // Team devices: init opted-out so no data leaves the browser, then stop.
    if (IS_TEAM) {
      amplitude.init(KEY, { optOut: true });
      return;
    }

    // Session Replay: record 100% of sessions (low-traffic portfolio)
    amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));

    // Autocapture: page views, sessions, attribution, element clicks, downloads.
    // optOut:false explicitly re-enables a device that was previously a team
    // device (Amplitude persists opt-out, so clearing the flag must reset it).
    amplitude.init(KEY, { autocapture: true, optOut: false });

    // ── Portfolio-specific events ──
    // Home: which case card was opened
    document.querySelectorAll('a.case').forEach(function (card) {
      card.addEventListener('click', function () {
        var title = card.querySelector('.title');
        amplitude.track('Case Card Clicked', { case: title ? title.textContent.trim() : card.href });
      });
    });

    // Case pages: "More cases" card clicks
    document.querySelectorAll('a.mc-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var title = card.querySelector('.mc-card-title');
        amplitude.track('More Cases Card Clicked', { case: title ? title.textContent.trim() : card.href });
      });
    });

    // Contact intent — the strongest signal a portfolio has
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      a.addEventListener('click', function () {
        amplitude.track('Contact Email Clicked');
      });
    });

    // Testimonial LinkedIn clicks
    document.querySelectorAll('a.tlink').forEach(function (a) {
      a.addEventListener('click', function () {
        var card = a.closest('.tcard');
        var name = card && card.querySelector('.tname');
        amplitude.track('Testimonial LinkedIn Clicked', { person: name ? name.textContent.trim() : '' });
      });
    });

    // CV opened (Google Doc in the nav) — strong hiring-intent signal
    document.querySelectorAll('a[href*="docs.google.com/document"]').forEach(function (a) {
      a.addEventListener('click', function () {
        amplitude.track('CV Opened');
      });
    });

    // Social buttons (LinkedIn / Telegram / WhatsApp) — contact intent, with platform
    document.querySelectorAll('a.social-btn').forEach(function (a) {
      a.addEventListener('click', function () {
        var h = a.getAttribute('href') || '';
        var platform = /linkedin\.com/.test(h) ? 'LinkedIn'
                     : /t\.me/.test(h) ? 'Telegram'
                     : /wa\.me/.test(h) ? 'WhatsApp'
                     : a.textContent.trim();
        amplitude.track('Social Link Clicked', { platform: platform });
      });
    });

    // Health case: which vision condition the visitor simulated (data-vs)
    document.querySelectorAll('button.vs-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        amplitude.track('Vision Filter Tested', { condition: b.getAttribute('data-vs') || b.textContent.trim() });
      });
    });

    // Time on page → "Page Time" event with seconds, for avg-time-per-page.
    // (Amplitude has no native per-page duration; this provides it.)
    var pgStart = Date.now(), pgSent = false;
    function sendPageTime() {
      if (pgSent) return; pgSent = true;
      var sec = Math.round((Date.now() - pgStart) / 1000);
      if (sec > 0 && sec < 3600) {
        amplitude.track('Page Time', { page: location.pathname, page_title: document.title, seconds: sec });
      }
    }
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') sendPageTime();
    });
    window.addEventListener('pagehide', sendPageTime);
  };
  document.head.appendChild(s);
})();
