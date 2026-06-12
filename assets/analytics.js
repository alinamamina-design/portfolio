// Amplitude analytics — shared by all pages.
// Setup: paste your project's API key below.
//   Amplitude → Settings (⚙) → Projects → <your project> → API Key
// The key is a public client-side key — safe to keep in the repo.
var AMPLITUDE_API_KEY = 'PASTE_API_KEY_HERE';
var AMPLITUDE_SERVER_ZONE = 'EU'; // 'EU' or 'US' — must match where the Amplitude project was created

(function () {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY.indexOf('PASTE') === 0) return; // not configured yet

  var s = document.createElement('script');
  s.src = 'https://cdn.amplitude.com/libs/analytics-browser-2-min.js.gz';
  s.async = true;
  s.onload = function () {
    if (!window.amplitude) return;

    amplitude.init(AMPLITUDE_API_KEY, {
      serverZone: AMPLITUDE_SERVER_ZONE,
      autocapture: {
        pageViews: true,
        sessions: true,
        elementInteractions: true,
        attribution: true,
        formInteractions: false,
        fileDownloads: false
      }
    });

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
