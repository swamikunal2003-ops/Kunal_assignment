(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menuToggle = $('#menuToggle');
  const navPanel = $('#navPanel');
  const menuBackdrop = $('#menuBackdrop');
  const menuClose = $('#menuClose');
  const searchOverlay = $('#searchOverlay');
  const searchTrigger = $('#searchTrigger');
  const searchInput = $('#siteSearch');
  const searchResults = $('#searchResults');
  const searchEmpty = $('#searchEmpty');
  const status = $('#interactionStatus');
  let previousFocus = null;

  $('#year').textContent = new Date().getFullYear();

  const openMenu = () => {
    previousFocus = document.activeElement;
    menuBackdrop.hidden = false;
    requestAnimationFrame(() => menuBackdrop.classList.add('is-visible'));
    navPanel.classList.add('is-open');
    navPanel.removeAttribute('inert');
    navPanel.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('menu-open');
    menuClose.focus();
  };
  const closeMenu = (restoreFocus = true) => {
    navPanel.classList.remove('is-open');
    navPanel.setAttribute('aria-hidden', 'true');
    navPanel.setAttribute('inert', '');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('menu-open');
    window.setTimeout(() => { menuBackdrop.hidden = true; }, 380);
    if (restoreFocus && previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  };
  menuToggle.addEventListener('click', () => menuToggle.getAttribute('aria-expanded') === 'true' ? closeMenu(false) : openMenu());
  menuClose.addEventListener('click', () => closeMenu());
  menuBackdrop.addEventListener('click', () => closeMenu());
  $$('.panel-links a').forEach(link => link.addEventListener('click', () => closeMenu(false)));

  const openSearch = () => {
    if (!searchOverlay.hidden) { searchInput.focus(); return; }
    previousFocus = document.activeElement;
    searchOverlay.hidden = false;
    document.body.classList.add('search-open');
    searchInput.value = '';
    filterSearch('');
    window.setTimeout(() => searchInput.focus(), 20);
  };
  const closeSearch = (restoreFocus = true) => {
    if (searchOverlay.hidden) return;
    searchOverlay.hidden = true;
    document.body.classList.remove('search-open');
    if (restoreFocus && previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  };
  searchTrigger.addEventListener('click', openSearch);
  $$('[data-search-close]').forEach(el => el.addEventListener('click', () => closeSearch()));
  searchInput.addEventListener('input', event => filterSearch(event.target.value));
  $$('[data-query]').forEach(button => button.addEventListener('click', () => {
    searchInput.value = button.dataset.query;
    filterSearch(searchInput.value);
    searchInput.focus();
  }));

  const searchableItems = [
    { title: 'Water treatment', detail: 'Treatment systems and water quality', href: '#services', terms: 'water treatment clean potable quality service' },
    { title: 'Sewage and wastewater treatment', detail: 'Wastewater treatment and responsible processing', href: '#services', terms: 'sewage wastewater waste water treatment restore' },
    { title: 'Water reuse and resource recovery', detail: 'Reuse, efficiency and circular water use', href: '#services', terms: 'reuse recovery resource circular efficiency water' },
    { title: 'Treatment solutions', detail: 'Engineering, performance and long-term resilience', href: '#solutions', terms: 'solutions engineering efficiency sustainability resilience' },
    { title: 'Our impact and approach', detail: 'Client needs, reliability and collaboration', href: '#impact', terms: 'impact approach reliability responsibility collaboration environment' },
    { title: 'Community', detail: 'Start a conversation about your project', href: '#community', terms: 'community project conversation help' },
    { title: 'Resources', detail: 'Guidance and useful project resources', href: '#resources', terms: 'resources guide guidance learn' },
    { title: 'Help and support', detail: 'Find a service or get in touch', href: '#support', terms: 'support help enquiry questions service' },
    { title: 'Contact Aquavex', detail: 'Talk to the team about your water challenge', href: '#contact', terms: 'contact talk expert email enquiries' },
    { title: 'About Aquavex', detail: 'Cleaner Water. Healthier Tomorrow.', href: '#about', terms: 'about brand aquavex purpose' }
  ];
  function filterSearch(query) {
    const q = query.trim().toLowerCase();
    const matches = q ? searchableItems.filter(item => (item.title + ' ' + item.detail + ' ' + item.terms).toLowerCase().includes(q)) : searchableItems.filter(item => ['Water treatment','Treatment solutions','Contact Aquavex'].includes(item.title));
    searchResults.innerHTML = '<span class="suggestion-label">' + (q ? 'SEARCH RESULTS' : 'QUICK LINKS') + '</span>';
    matches.forEach(item => {
      const link = document.createElement('a');
      link.href = item.href;
      link.setAttribute('data-search-item', '');
      const title = document.createElement('span'); title.textContent = item.title;
      const detail = document.createElement('small'); detail.textContent = item.detail;
      const arrow = document.createElement('b'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
      link.append(title, detail, arrow);
      link.addEventListener('click', () => closeSearch(false));
      searchResults.appendChild(link);
    });
    searchResults.hidden = matches.length === 0;
    searchEmpty.hidden = matches.length !== 0;
    status.textContent = q ? `${matches.length} search results found` : 'Quick links displayed';
  }

  document.addEventListener('keydown', event => {
    const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (isShortcut) { event.preventDefault(); if (searchOverlay.hidden) openSearch(); else closeSearch(); }
    if (event.key === 'Escape') {
      if (!searchOverlay.hidden) closeSearch();
      else if (menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
    }
    if (!searchOverlay.hidden && event.key === 'Tab') {
      const focusable = $$('button:not([disabled]),input:not([disabled]),a[href]', searchOverlay).filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if (menuToggle.getAttribute('aria-expanded') === 'true' && event.key === 'Tab') {
      const focusable = $$('button:not([disabled]),a[href]', navPanel).filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Progressive reveal: stop observing an element once it has appeared.
  const revealItems = $$('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Interactive water artwork: subtle pointer tracking, with no layout movement.
  const interactiveArt = $$('.hero-art, .solution-art');
  interactiveArt.forEach(art => {
    let frame = 0;
    const move = event => {
      const rect = art.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        art.style.setProperty('--pointer-x', x.toFixed(3));
        art.style.setProperty('--pointer-y', y.toFixed(3));
        art.style.setProperty('--light-x', `${((x + 1) * 50).toFixed(1)}%`);
        art.style.setProperty('--light-y', `${((y + 1) * 50).toFixed(1)}%`);
      });
    };
    const reset = () => {
      art.classList.remove('is-hovering');
      art.style.setProperty('--pointer-x', '0');
      art.style.setProperty('--pointer-y', '0');
      art.style.setProperty('--light-x', '50%');
      art.style.setProperty('--light-y', '50%');
    };
    art.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') art.classList.add('is-hovering'); });
    art.addEventListener('pointermove', event => { if (event.pointerType !== 'touch') move(event); });
    art.addEventListener('pointerleave', reset);
    art.addEventListener('focusin', () => art.classList.add('is-hovering'));
    art.addEventListener('focusout', reset);
  });

  // Ensure direct navigation links close any open overlay and announce destination.
  $$('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) status.textContent = `Navigating to ${target.id.replace(/-/g, ' ')}`;
  }));
})();