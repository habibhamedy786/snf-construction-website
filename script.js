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

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Current year in footer ---- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Contact form
     ------------------------------------------------------------------
     Right now the form opens the visitor's email app with everything
     pre-filled and sends to snfconstruction23@gmail.com.

     To receive submissions straight in your inbox instead (recommended
     once the site is live), create a free form at https://formspree.io
     and paste your endpoint URL below. See README.md, step 5.
  ------------------------------------------------------------------ */
  var FORMSPREE_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxxx'
  var CONTACT_EMAIL = 'snfconstruction23@gmail.com';

  var form = document.getElementById('quoteForm');
  var note = document.getElementById('formNote');

  function setNote(text, kind) {
    note.textContent = text;
    note.className = 'form-note' + (kind ? ' ' + kind : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var required = ['name', 'email', 'message'];
    var missing = false;

    required.forEach(function (id) {
      var el = document.getElementById(id);
      var bad = !el.value.trim() || (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
      el.classList.toggle('invalid', bad);
      if (bad) missing = true;
    });

    if (missing) {
      setNote('Please fill in your name, a valid email, and your project details.', 'err');
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
