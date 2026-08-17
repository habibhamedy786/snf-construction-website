/* SNF Construction — site behaviour */
(function () {
  'use strict';

  /* ---- Header state on scroll + back-to-top ---- */
  var header = document.getElementById('siteHeader');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- Reveal on scroll ----
     Two behaviours, one observer:
       .reveal  — the element fades up on its own (headings, labels, lede text)
       .stagger — the element's CHILDREN fade up in sequence (card grids, chip rows)

     Fires once per element and then stops watching it. Re-animating something every
     time it scrolls back into view is an interface arguing with its reader. */
  var targets = document.querySelectorAll('.reveal, .stagger');

  // Past roughly 8 items the tail of a stagger reads as lag rather than rhythm,
  // so the delay index plateaus instead of growing with the list.
  var MAX_STEPS = 7;

  function reveal(el) {
    if (el.classList.contains('stagger')) {
      var kids = el.children;
      for (var i = 0; i < kids.length; i++) {
        // set on the child, never on the parent: a custom property on the parent
        // invalidates style for the whole subtree on every write
        kids[i].style.setProperty('--i', Math.min(i, MAX_STEPS));
      }
    }
    el.classList.add('in');
  }

  function revealAll() {
    targets.forEach(reveal);
  }

  if ('IntersectionObserver' in window) {
    var observerFired = false;

    var io = new IntersectionObserver(function (entries) {
      observerFired = true;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    targets.forEach(function (el) { io.observe(el); });

    /* Failsafe. Because the reveal styles start at opacity 0, anything that stops the
       observer from delivering entries doesn't degrade the page — it erases it. A
       healthy browser invokes the callback on the first frame after observe(), so
       `observerFired` is true almost immediately and this timer does nothing. If it is
       still false a second later, the observer is not working and we show everything
       rather than leave the visitor on a blank page. */
    setTimeout(function () {
      if (observerFired) return;
      io.disconnect();
      revealAll();
    }, 1000);
  } else {
    revealAll();
  }

  /* ---- Current year in footer ---- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- 3D tilt + parallax ----
     Only runs for mouse/trackpad users who have not asked for reduced motion.
     Touch devices and prefers-reduced-motion get the flat, static layout. */
  var wantsMotion =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* A 7-degree 3D tilt used to follow the cursor across every service card, "who we
     serve" tile, "why SNF" item and review. It has been removed rather than tuned:

       - Those cards hold text people are reading. Motion on content being read is
         friction, not polish.
       - Card hover is a tens-of-times-per-visit interaction. At that frequency the
         only acceptable motion is near-imperceptible, and a 7-degree rotation on a
         perspective of 900px is not that.
       - It wrote transforms on every mousemove with no rAF batching, forcing a style
         recalculation per event on up to 20 elements.

     The gated hover lift in styles.css already confirms "this is interactive", which
     is the whole job. The hero keeps its parallax — one decorative surface, no text
     being read, and it is the page's first impression. */

  if (wantsMotion) {
    var heroInner = document.querySelector('.hero-inner');

    if (heroInner) {
      var px = 0, py = 0, queued = false;

      // Pointer events fire far faster than the screen refreshes. Coalescing writes
      // into one rAF means at most one style write per frame instead of per event.
      function applyParallax() {
        queued = false;
        heroInner.style.transform =
          'translate3d(' + (px * 14).toFixed(2) + 'px, ' + (py * 9).toFixed(2) + 'px, 0)';
      }

      function queueParallax() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(applyParallax);
      }

      document.querySelector('.hero').addEventListener('mousemove', function (e) {
        var r = this.getBoundingClientRect();
        px = (e.clientX - r.left) / r.width - 0.5;
        py = (e.clientY - r.top) / r.height - 0.5;
        queueParallax();
      });

      document.querySelector('.hero').addEventListener('mouseleave', function () {
        px = py = 0;
        queueParallax();
      });
    }
  }

  /* ------------------------------------------------------------------
     Contact form
     ------------------------------------------------------------------
     Right now the form opens the visitor's email app with everything
     pre-filled and sends to snfconstruction23@gmail.com.

     To receive submissions straight in your inbox instead (recommended
     once the site is live), create a free form at https://formspree.io
     and paste your endpoint URL below. See README.md, step 5.
  ------------------------------------------------------------------ */
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbgrkrqe';
  var CONTACT_EMAIL = 'snfconstruction23@gmail.com';

  var form = document.getElementById('quoteForm');
  var note = document.getElementById('formNote');

  function setNote(text, kind) {
    note.textContent = text;
    note.className = 'form-note' + (kind ? ' ' + kind : '');
  }

  var REQUIRED = ['name', 'email', 'message'];

  function fieldError(id) {
    var el = document.getElementById(id);
    var v = el.value.trim();
    if (!v) {
      return id === 'name' ? 'Please enter your name.'
           : id === 'email' ? 'Please enter your email address.'
           : 'Please tell us a little about the project.';
    }
    if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return 'That email address does not look right.';
    }
    return '';
  }

  /* Validate each field when the visitor leaves it, rather than waiting for submit —
     the error appears next to the field they just filled in, while it is still in mind. */
  REQUIRED.forEach(function (id) {
    var el = document.getElementById(id);
    var msg = document.createElement('p');
    msg.className = 'field-error';
    msg.id = id + '-error';
    el.parentNode.appendChild(msg);

    function check() {
      var err = fieldError(id);
      el.classList.toggle('invalid', !!err);
      el.setAttribute('aria-invalid', err ? 'true' : 'false');
      msg.textContent = err;
      return !err;
    }

    el.setAttribute('aria-describedby', msg.id);
    el.addEventListener('blur', check);
    // once a field has been flagged, re-check as they type so the error clears immediately
    el.addEventListener('input', function () {
      if (el.classList.contains('invalid')) check();
    });
    el._check = check;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var missing = false;
    var firstBad = null;

    REQUIRED.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el._check()) {
        missing = true;
        if (!firstBad) firstBad = el;
      }
    });

    if (missing) {
      setNote('Please check the highlighted fields above.', 'err');
      firstBad.focus();
      return;
    }

    var data = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      type: document.getElementById('type').value,
      city: document.getElementById('city').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    if (FORMSPREE_ENDPOINT) {
      setNote('Sending…');
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('bad response');
          form.reset();
          setNote('Thank you — your message is on its way. We will be in touch within one business day.', 'ok');
        })
        .catch(function () {
          setNote('Something went wrong. Please call (530) 350-6659 or email ' + CONTACT_EMAIL + '.', 'err');
        });
      return;
    }

    // Fallback: open the visitor's email app with the message pre-filled.
    var subject = 'Project Inquiry — ' + data.type + (data.city ? ' — ' + data.city : '');
    var body =
      'Name: ' + data.name + '\n' +
      'Email: ' + data.email + '\n' +
      'Phone: ' + (data.phone || '—') + '\n' +
      'Project Type: ' + data.type + '\n' +
      'City: ' + (data.city || '—') + '\n\n' +
      'Project Details:\n' + data.message + '\n';

    window.location.href =
      'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    setNote('Opening your email app… If nothing happens, email ' + CONTACT_EMAIL + ' directly.', 'ok');
  });
})();
