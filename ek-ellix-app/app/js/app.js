/* ============================================
   EK ELLIX — Android App Logic
   ============================================ */

'use strict';

const App = {
  currentTab: 'home',
  services: [
    { icon: '📸', name: 'Photography', desc: 'Professional event & portrait photography', id: 'photography' },
    { icon: '🎬', name: 'Videography', desc: 'Cinematic video production', id: 'videography' },
    { icon: '✂️', name: 'Video Editing', desc: 'Professional post-production', id: 'video-editing' },
    { icon: '🎵', name: 'Beat Making', desc: 'Original beats & music production', id: 'music-production' },
    { icon: '🎙️', name: 'Sound Recording', desc: 'Studio recording & mastering', id: 'sound-recording' },
    { icon: '🎨', name: 'Flyer Design', desc: 'Posters, certificates & flyers', id: 'design' },
    { icon: '💾', name: 'Data Recovery', desc: 'Recover lost & deleted files', id: 'data-recovery' },
    { icon: '✏️', name: 'Logo Design', desc: 'Unique brand identities', id: 'logo-design' }
  ],

  testimonials: [
    { initials: 'BK', name: 'Business Client', service: 'Corporate Event Photography', text: 'EK ELLIX delivered exceptional photography services for our corporate event. The quality, professionalism, and attention to detail were outstanding!', stars: 5 },
    { initials: 'SM', name: 'Small Business Owner', service: 'Logo & Brand Design', text: 'The logo design and branding work by EK ELLIX exceeded my expectations. Enock understood exactly what I wanted. Truly world-class service.', stars: 5 },
    { initials: 'KM', name: 'Student', service: 'Data Recovery Services', text: 'I needed urgent data recovery and EK ELLIX came through for me. They recovered all my important files. Professional, fast, and reliable.', stars: 5 },
    { initials: 'AM', name: 'Recording Artist', service: 'Music Production', text: 'The music production quality from EK ELLIX is incredible. Professional-grade beats and outstanding support. A true creative partner!', stars: 5 }
  ],

  portfolio: [
    { img: 'images/founder-1.jpeg', label: 'Portrait Photography' },
    { img: 'images/founder-2.jpg', label: 'Corporate Photography' },
    { img: 'images/flyer.png', label: 'Flyer Design' },
    { img: 'images/logo.png', label: 'Brand Identity' },
    { img: 'images/founder-3.png', label: 'Event Coverage' },
    { img: 'images/founder-2.jpg', label: 'Videography' }
  ],

  init() {
    this.bindTabs();
    this.bindTopbar();
    this.renderHome();
    this.renderBooking();
    this.renderContact();
    this.renderPortfolio();
    this.renderTestimonials();

    /* Register service worker */
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  },

  /* ─── Tab Navigation ─── */
  bindTabs() {
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        const screen = tab.dataset.screen;
        this.switchTab(screen);
      });
    });
  },

  switchTab(screen) {
    this.currentTab = screen;
    document.querySelectorAll('.tab-item').forEach(t => t.classList.toggle('active', t.dataset.screen === screen));
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-' + screen));
    document.querySelector('.topbar-title').textContent = this.getTopbarTitle(screen);

    /* Scroll to top */
    document.querySelector('.content').scrollTop = 0;
  },

  getTopbarTitle(screen) {
    const titles = { home: 'EK ELLIX', services: 'Services', booking: 'Book Now', portfolio: 'Portfolio', contact: 'Contact' };
    return titles[screen] || 'EK ELLIX';
  },

  bindTopbar() {
    const homeBtn = document.getElementById('topbar-home');
    if (homeBtn) homeBtn.addEventListener('click', () => this.switchTab('home'));
  },

  /* ─── Home Screen ─── */
  renderHome() {
    const servicesHTML = this.services.map(s =>
      `<div class="service-card" onclick="App.switchTab('booking');App.preselectService('${s.id}')">
        <div class="sc-icon">${s.icon}</div>
        <h4>${s.name}</h4>
        <p>${s.desc}</p>
      </div>`
    ).join('');

    document.getElementById('home-services').innerHTML = servicesHTML;
  },

  /* ─── Booking Screen ─── */
  renderBooking() {
    const select = document.getElementById('booking-service');
    if (!select) return;

    select.innerHTML = '<option value="">Select a service</option>' +
      this.services.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('');
  },

  preselectService(id) {
    const select = document.getElementById('booking-service');
    if (select) {
      select.value = id;
      select.dispatchEvent(new Event('change'));
    }
  },

  submitBooking() {
    const form = document.getElementById('booking-form');
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const service = form.querySelector('[name="service"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name) { this.showToast('Please enter your name', 'error'); return; }
    if (!phone) { this.showToast('Please enter your phone number', 'error'); return; }
    if (!service) { this.showToast('Please select a service', 'error'); return; }

    /* Build WhatsApp message */
    const serviceName = this.services.find(s => s.id === service)?.name || service;
    const text = `Hello EK ELLIX! 👋\n\nI'd like to book a service:\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Service:* ${serviceName}\n${message ? '*Message:* ' + message : ''}\n\nThank you!`;

    const whatsappUrl = `https://wa.me/260767165702?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');

    /* Reset form */
    form.reset();
    this.showToast('✅ Opening WhatsApp...');
  },

  submitCall() {
    window.open('tel:+260974206465', '_self');
  },

  submitWhatsApp() {
    window.open('https://wa.me/260767165702', '_blank');
  },

  submitEmail() {
    window.open('mailto:ekellix@gmail.com?subject=Service%20Inquiry', '_self');
  },

  /* ─── Contact Screen ─── */
  renderContact() {},

  /* ─── Portfolio Screen ─── */
  renderPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    grid.innerHTML = this.portfolio.map(p =>
      `<div class="portfolio-item">
        <img src="${p.img}" alt="${p.label}" loading="lazy">
        <div class="pi-label">${p.label}</div>
      </div>`
    ).join('');
  },

  /* ─── Testimonials ─── */
  renderTestimonials() {
    const container = document.getElementById('home-testimonials');
    if (!container) return;

    container.innerHTML = this.testimonials.map(t => {
      const stars = '★'.repeat(t.stars);
      return `
        <div class="testimonial-card">
          <div class="tc-quote">&ldquo;</div>
          <div class="tc-text">${t.text}</div>
          <div class="tc-author">
            <div class="tc-avatar">${t.initials}</div>
            <div>
              <div class="tc-name">${t.name}</div>
              <div class="tc-service">${t.service}</div>
              <div class="tc-stars">${stars}</div>
            </div>
          </div>
        </div>`;
    }).join('');
  },

  /* ─── Toast ─── */
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)';
    toast.style.borderColor = type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)';
    toast.style.color = type === 'error' ? '#ef4444' : '#22c55e';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
