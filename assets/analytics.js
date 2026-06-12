// Amplitude analytics + session replay — shared by all pages.
// Uses Amplitude's official per-project script loader (no build step needed).
// Project API key is a public client-side key — safe to keep in the repo.
(function () {
  var KEY = '2b12c0cb2a76dd4daca04e77e0b561da';

  var s = document.createElement('script');
  s.src = 'https://cdn.amplitude.com/script/' + KEY + '.js';
  s.async = true;
  s.onload = function () {
    if (!window.amplitude) return;

    // Session Replay: record 100% of sessions (low-traffic portfolio)
    amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));

    // Autocapture: page views, sessions, attribution, element clicks, downloads
    amplitude.init(KEY, { autocapture: true });

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
  };
  document.head.appendChild(s);
})();
