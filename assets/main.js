(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation');
    }));
  }
  window.addEventListener('pageshow', () => {
    if (toggle && nav) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); }
  });
  const header = document.querySelector('.site-header');
  const scrollHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', scrollHeader, { passive: true }); scrollHeader();
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.section, .service-card, .content-copy, .gallery-grid figure, .detail-tile').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
  }

  const comparisonTrack = document.querySelector('.before-after-track');
  const previousComparison = document.querySelector('.before-prev');
  const nextComparison = document.querySelector('.before-next');
  if (comparisonTrack) {
    const scrollAmount = () => { const card = comparisonTrack.querySelector('.comparison-card'); return card ? card.getBoundingClientRect().width + 20 : 340; };
    previousComparison?.addEventListener('click', () => comparisonTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    nextComparison?.addEventListener('click', () => comparisonTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  }
  // Accessible drag-to-reveal room transformation slider
  document.querySelectorAll('[data-comparison-slider]').forEach(slider => {
    const range = slider.querySelector('input[type="range"]');
    const afterWrap = slider.querySelector('.comparison-after-wrap');
    const handle = slider.querySelector('.comparison-handle');
    const afterImage = slider.querySelector('.comparison-after');
    const sync = value => { const pct = `${value}%`; afterWrap.style.width = pct; handle.style.left = pct; };
    const sizeImages = () => { if (afterImage) afterImage.style.width = `${slider.clientWidth}px`; };
    range?.addEventListener('input', () => sync(range.value));
    window.addEventListener('resize', sizeImages, {passive:true});
    sizeImages(); sync(range?.value || 50);
  });


  // Live quote-request summary. This is a local preview only; it does not claim an appointment is booked.
  const quoteForm = document.querySelector('#quote-form');
  if (quoteForm) {
    const summaryMap = {service:'service', location:'location', date:'date', size:'size', frequency:'frequency'};
    const updateSummary = () => {
      Object.entries(summaryMap).forEach(([fieldName, key]) => {
        const field = quoteForm.elements.namedItem(fieldName);
        const output = document.querySelector(`[data-summary="${key}"]`);
        if (!output) return;
        let value = String(field?.value || '').trim();
        if (fieldName === 'date' && value) {
          const parts = value.split('-');
          if (parts.length === 3) value = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        output.textContent = value || (fieldName === 'date' ? 'Flexible' : fieldName === 'service' ? 'Not selected yet' : fieldName === 'location' ? 'Not added yet' : 'Not specified');
      });
    };
    quoteForm.addEventListener('input', updateSummary);
    quoteForm.addEventListener('change', updateSummary);
    updateSummary();
  }

  // Semantic click events can be connected to an analytics provider once the owner supplies an ID.
  document.querySelectorAll('a[href^="tel:"], a[href*="wa.me/"]').forEach(link => {
    link.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('sahlan:contact-click', {detail:{type:link.href.startsWith('tel:') ? 'call' : 'whatsapp', href:link.href}}));
    });
  });

  // Accessible booking request: validate fields, then open a complete WhatsApp message.
  const form = document.querySelector('#quote-form');
  if (form) {
    const dateInput = form.querySelector('#date');
    const status = form.querySelector('#booking-status');
    const requiredFields = ['service', 'location', 'name', 'phone'];
    if (dateInput) {
      const now = new Date();
      dateInput.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }
    const setError = (field, message) => {
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      const output = form.querySelector(`[data-error-for="${field.name}"]`);
      if (output) output.textContent = message || '';
    };
    const validate = field => {
      let message = '';
      if (!String(field.value || '').trim()) message = 'Please complete this field.';
      if (field.name === 'phone' && field.value.trim() && field.value.replace(/\D/g, '').length < 9) message = 'Enter a valid phone number.';
      setError(field, message);
      return !message;
    };
    requiredFields.forEach(name => {
      const field = form.elements.namedItem(name);
      if (!field) return;
      field.addEventListener('blur', () => validate(field));
      field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
      field.addEventListener('change', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      let valid = true;
      requiredFields.forEach(name => { const field = form.elements.namedItem(name); if (field && !validate(field)) valid = false; });
      if (dateInput && dateInput.value && dateInput.min && dateInput.value < dateInput.min) {
        dateInput.setCustomValidity('Please choose today or a future date.'); dateInput.reportValidity(); valid = false;
      } else if (dateInput) dateInput.setCustomValidity('');
      if (!valid) {
        const first = form.querySelector('[aria-invalid="true"]'); first?.focus();
        if (status) { status.textContent = 'Please check the highlighted fields and try again.'; status.classList.add('show', 'error'); }
        return;
      }
      const data = new FormData(form);
      const value = key => String(data.get(key) || '').trim() || 'Not specified';
      const date = value('date');
      const message = [
        'Hello SAHLAN Premium Cleaners, I would like to request a booking and quote.', '',
        `Name: ${value('name')}`, `Phone: ${value('phone')}`, `Service: ${value('service')}`,
        `Property location: ${value('location')}`, `Preferred date: ${date === 'Not specified' ? 'Flexible' : date}`,
        `Preferred time: ${value('time')}`, `Property type: ${value('size')}`,
        `Cleaning frequency: ${value('frequency')}`, `Approximate size: ${value('rooms')}`,
        `Additional details: ${value('details')}`, '',
        'Please confirm availability and pricing. I understand this is a request, not a confirmed appointment.'
      ].join('\n');
      const url = `https://wa.me/254711224477?text=${encodeURIComponent(message)}`;
      if (status) { status.textContent = 'WhatsApp is opening with your details. Press Send in WhatsApp to submit your request. SAHLAN will confirm availability and pricing.'; status.classList.remove('error'); status.classList.add('show'); }
      // Use same-tab navigation: it is triggered by the submit gesture and avoids popup blockers on mobile.
      window.location.href = url;
    });
  }
})();
