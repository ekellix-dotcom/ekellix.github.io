/* ============================================
   EK ELLIX — Data Loader
   Loads content from JSON database and renders
   dynamic sections: Beats, Videos, Graphics,
   Testimonials, Portfolio
   ============================================ */

'use strict';

const EKDB = {
  data: {},
  loaded: false,

  /* Fetch a JSON file */
  async fetchJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[EKDB] Could not load ${path}:`, e.message);
      return null;
    }
  },

  /* Load all database files */
  async loadAll() {
    const [audio, videos, graphics, testimonials, portfolio] = await Promise.all([
      this.fetchJSON('db/audio.json'),
      this.fetchJSON('db/videos.json'),
      this.fetchJSON('db/graphics.json'),
      this.fetchJSON('db/testimonials.json'),
      this.fetchJSON('db/portfolio.json')
    ]);

    this.data = {
      audio: audio || EKDBDefaults.audio,
      videos: videos || EKDBDefaults.videos,
      graphics: graphics || EKDBDefaults.graphics,
      testimonials: testimonials || EKDBDefaults.testimonials,
      portfolio: portfolio || EKDBDefaults.portfolio
    };

    this.loaded = true;
    return this.data;
  },

  /* Render all sections */
  renderAll() {
    if (!this.loaded) return;
    this.renderBeats();
    this.renderVideos();
    this.renderGraphics();
    this.renderTestimonials();
    this.renderPortfolio();
  },

  /* ─── BEATS / AUDIO ─── */
  renderBeats() {
    const container = document.getElementById('beats-container');
    const ctaContainer = document.getElementById('beats-cta');
    if (!container) return;
    const d = this.data.audio;
    if (!d || !d.beats) return;

    const sorted = [...d.beats].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    container.innerHTML = sorted.map(beat => {
      const tagsHTML = beat.tags.map(t => {
        if (beat.isFree) {
          return `<span class="beat-tag" style="background:rgba(34,197,94,0.2);border-color:rgba(34,197,94,0.4);color:#22c55e;">${t}</span>`;
        }
        return `<span class="beat-tag">${t}</span>`;
      }).join('');

      const freeBadge = beat.isFree && beat.freeLabel
        ? `<div style="position:absolute;top:0.75rem;right:0.75rem;background:#22c55e;color:#000;padding:0.25rem 0.85rem;border-radius:9999px;font-size:0.7rem;font-weight:800;letter-spacing:0.05em;z-index:2;">${beat.freeLabel}</div>`
        : '';

      const downloadBtn = beat.isFree
        ? `<a href="${beat.audioFile}" download class="beat-action-btn download" style="background:#22c55e;border-color:#22c55e;color:#000;font-weight:800;">⬇ Free Download</a>`
        : `<a href="${beat.audioFile}" download class="beat-action-btn download">⬇ Download</a>`;

      const purchaseBtn = beat.actions.purchase
        ? `<a href="#contact" class="beat-action-btn purchase">💰 Buy License</a>`
        : beat.actions.customBeat
        ? `<a href="#contact" class="beat-action-btn purchase">💰 Custom Beat</a>`
        : '';

      const inquireBtn = beat.actions.inquire
        ? `<a href="https://wa.me/260767165702" target="_blank" rel="noopener" class="beat-action-btn">💬 Inquire</a>`
        : '';

      const cardBorder = beat.isFree ? 'border-color: rgba(34,197,94,0.4);' : '';

      return `
        <div class="beat-card" style="${cardBorder}">
          ${freeBadge}
          <div class="beat-card-header">
            <div class="beat-card-cover">${beat.coverEmoji}</div>
            <div class="beat-card-info">
              <h4>${beat.title}</h4>
              <span>${beat.genre}${beat.bpm ? ' • ' + beat.bpm + ' BPM' : ''} • ${beat.duration}</span>
            </div>
          </div>
          <div class="beat-card-tags">${tagsHTML}</div>
          <div class="beat-player">
            <audio controls preload="metadata">
              <source src="${beat.audioFile}" type="audio/mpeg">
              Your browser does not support audio.
            </audio>
          </div>
          <div class="beat-actions">${downloadBtn}${purchaseBtn}${inquireBtn}</div>
        </div>`;
    }).join('');

    if (ctaContainer && d.cta) {
      ctaContainer.innerHTML = `
        <h3>${d.cta.title}</h3>
        <p>${d.cta.description}</p>
        <a href="${d.cta.buttonLink}" class="btn btn-primary btn-lg">${d.cta.buttonText}</a>`;
    }
  },

  /* ─── VIDEOS ─── */
  renderVideos() {
    const container = document.getElementById('videos-container');
    const ctaContainer = document.getElementById('videos-cta');
    if (!container) return;
    const d = this.data.videos;
    if (!d || !d.videos) return;

    const sorted = [...d.videos].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    container.innerHTML = sorted.map(video => {
      let thumbHTML = '';
      if (video.type === 'youtube' && video.youtubeEmbedUrl) {
        thumbHTML = `<iframe src="${video.youtubeEmbedUrl}" title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      } else {
        thumbHTML = `<video controls preload="metadata" poster="${video.poster || ''}">
          <source src="${video.localVideo}" type="video/mp4">
          Your browser does not support video playback.
        </video>`;
      }

      const tagsHTML = (video.tags || []).map(t => `<span class="video-tag">${t}</span>`).join('');
      const actionsHTML = (video.actions || []).map(a => {
        const target = a.external ? ' target="_blank" rel="noopener"' : '';
        return `<a href="${a.url}" class="video-action"${target}>${a.label}</a>`;
      }).join('');

      return `
        <div class="video-card">
          <div class="video-thumb">${thumbHTML}</div>
          <div class="video-body">
            <h4>${video.title}</h4>
            <span>${video.subtitle}</span>
            <p>${video.description}</p>
            <div class="video-tags">${tagsHTML}</div>
            <div class="video-actions">${actionsHTML}</div>
          </div>
        </div>`;
    }).join('');

    if (ctaContainer && d.cta) {
      const target = d.cta.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      ctaContainer.innerHTML = `
        <h3>${d.cta.title}</h3>
        <p>${d.cta.description}</p>
        <a href="${d.cta.buttonUrl}" class="btn btn-primary btn-lg"${target}>${d.cta.buttonText}</a>`;
    }
  },

  /* ─── GRAPHICS ─── */
  renderGraphics() {
    const container = document.getElementById('graphics-container');
    const ctaContainer = document.getElementById('graphics-cta');
    if (!container) return;
    const d = this.data.graphics;
    if (!d || !d.graphics) return;

    const sorted = [...d.graphics].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    container.innerHTML = sorted.map(gfx => {
      const tagsHTML = (gfx.tags || []).map(t => `<span class="graphic-tag">${t}</span>`).join('');
      return `
        <div class="graphic-card">
          <div class="graphic-image"><img src="${gfx.image}" alt="${gfx.title} by EK ELLIX" loading="lazy"></div>
          <div class="graphic-body">
            <h4>${gfx.title}</h4>
            <span>${gfx.category}</span>
            <p>${gfx.description}</p>
            <div class="graphic-tags">${tagsHTML}</div>
          </div>
        </div>`;
    }).join('');

    if (ctaContainer && d.cta) {
      ctaContainer.innerHTML = `
        <h3>${d.cta.title}</h3>
        <p>${d.cta.description}</p>
        <a href="${d.cta.buttonLink}" class="btn btn-primary btn-lg">${d.cta.buttonText}</a>`;
    }
  },

  /* ─── TESTIMONIALS ─── */
  renderTestimonials() {
    const container = document.getElementById('testimonials-container');
    const dotsContainer = document.getElementById('testimonials-dots');
    if (!container) return;
    const d = this.data.testimonials;
    if (!d || !d.testimonials) return;

    const sorted = [...d.testimonials].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    container.innerHTML = sorted.map(t => {
      const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
      return `
        <div class="testimonial-card">
          <div class="testimonial-quote">&ldquo;</div>
          <p class="testimonial-text">${t.text}</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${t.clientInitials}</div>
            <div class="testimonial-info">
              <h4>${t.clientName}</h4>
              <span>${t.service}</span>
              <div class="testimonial-stars">${stars}</div>
            </div>
          </div>
        </div>`;
    }).join('');

    if (dotsContainer) {
      dotsContainer.innerHTML = sorted.map((_, i) =>
        `<button class="carousel-dot${i === 0 ? ' active' : ''}" role="tab" aria-label="Testimonial ${i + 1}"></button>`
      ).join('');
    }

    /* Re-initialize carousel */
    if (typeof initTestimonialsCarousel === 'function') {
      initTestimonialsCarousel();
    }
  },

  /* ─── PORTFOLIO ─── */
  renderPortfolio() {
    const filterContainer = document.getElementById('portfolio-filters');
    const gridContainer = document.getElementById('portfolio-grid');
    if (!gridContainer) return;
    const d = this.data.portfolio;
    if (!d || !d.items) return;

    /* Render filter buttons */
    if (filterContainer && d.categories) {
      filterContainer.innerHTML = d.categories.map((cat, i) =>
        `<button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${cat.id}">${cat.label}</button>`
      ).join('');
    }

    /* Render items */
    const sorted = [...d.items].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    gridContainer.innerHTML = sorted.map(item => {
      return `
        <div class="portfolio-item" data-category="${item.category}">
          <img src="${item.image}" alt="${item.title} by EK ELLIX" loading="lazy">
          <div class="portfolio-overlay">
            <h4>${item.title}</h4>
            <span>${item.description}</span>
          </div>
        </div>`;
    }).join('');

    /* Re-init filter and lightbox */
    if (typeof initPortfolioFilter === 'function') initPortfolioFilter();
    if (typeof initLightbox === 'function') initLightbox();
  }
};

/* ─── Default fallback data (if JSON files can't be loaded) ─── */
const EKDBDefaults = {
  audio: {
    sectionLabel: "🎶 Audio Production",
    sectionTitle: "Beats & Audio Library",
    sectionSubtitle: "Listen to original beats, instrumentals, and audio productions.",
    beats: [],
    cta: { title: "🎤 Want a Custom Beat?", description: "Need an original beat tailored to your sound?", buttonText: "Request Custom Beat", buttonLink: "#contact" }
  },
  videos: {
    sectionLabel: "🎬 Video Production",
    sectionTitle: "Video Showcase",
    sectionSubtitle: "Cinematic video production, event coverage, promotional content.",
    videos: [],
    cta: { title: "📺 More Videos on YouTube", description: "Visit our YouTube channel for more.", buttonText: "Visit YouTube Channel", buttonUrl: "https://youtube.com/@ekellix1921", external: true }
  },
  graphics: {
    sectionLabel: "🎨 Graphic Design",
    sectionTitle: "Design Portfolio",
    sectionSubtitle: "Posters, flyers, certificates, logos, and branding.",
    graphics: [],
    cta: { title: "🖌️ Need Custom Designs?", description: "We create designs that stand out.", buttonText: "Request Design Work", buttonLink: "#contact" }
  },
  testimonials: {
    sectionLabel: "Testimonials",
    sectionTitle: "What Our Clients Say",
    sectionSubtitle: "Real feedback from the individuals and businesses we've served.",
    testimonials: []
  },
  portfolio: {
    sectionLabel: "Portfolio",
    sectionTitle: "Our Creative Work",
    sectionSubtitle: "Explore our recent projects across photography, videography, design, and technology.",
    categories: [
      { id: "all", label: "All" },
      { id: "photography", label: "Photography" },
      { id: "videography", label: "Videography" },
      { id: "design", label: "Graphic Design" },
      { id: "music", label: "Music Production" },
      { id: "tech", label: "Technology" }
    ],
    items: []
  }
};
