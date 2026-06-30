/* ============================================
   EK ELLIX — Content Manager (Admin Panel)
   Full CRUD for: Audio, Videos, Graphics,
   Testimonials, Portfolio
   ============================================ */

'use strict';

/* ─── State ─── */
const DB = {
  audio: { beats: [], cta: {} },
  videos: { videos: [], cta: {} },
  graphics: { graphics: [], cta: {} },
  testimonials: { testimonials: [] },
  portfolio: { items: [], categories: [] }
};

let currentSection = 'audio';
let editingId = null;
let deleteConfirmId = null;

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupNav();
  setupModal();
  setupExportImport();
  renderSection();
});

/* ─── Local Storage ─── */
function loadData() {
  const keys = ['audio', 'videos', 'graphics', 'testimonials', 'portfolio'];
  keys.forEach(key => {
    const stored = localStorage.getItem('ekdb_' + key);
    if (stored) {
      try { DB[key] = JSON.parse(stored); } catch(e) { /* keep defaults */ }
    }
  });
  /* If no data in localStorage, load defaults */
  if (!localStorage.getItem('ekdb_audio')) loadDefaults();
}

function saveData(section) {
  if (section) {
    localStorage.setItem('ekdb_' + section, JSON.stringify(DB[section]));
  } else {
    Object.keys(DB).forEach(k => localStorage.setItem('ekdb_' + k, JSON.stringify(DB[k])));
  }
}

function loadDefaults() {
  /* These match the JSON files in db/ folder */
  DB.audio = {
    beats: [
      { id:'b1', title:'Afro Fusion Heat', genre:'Amapiano', bpm:120, duration:'3:42', coverEmoji:'🎹', audioFile:'audio/beat-sample-1.mp3', tags:['Amapiano','Afrobeat','Dance'], isFree:false, freeLabel:'', actions:{download:true,purchase:true,inquire:true}, featured:true, dateAdded:'2024-06-01', sortOrder:1 },
      { id:'b2', title:'Emotional Trap', genre:'Emotional Trap', bpm:0, duration:'Free Beat Sample', coverEmoji:'💚', audioFile:'audio/beat-sample-2.mp3', tags:['Emotional','Trap','FREE'], isFree:true, freeLabel:'FREE', actions:{download:true,purchase:false,inquire:true,customBeat:true}, featured:true, dateAdded:'2024-05-15', sortOrder:2 },
      { id:'b3', title:'Kalindula Vibes', genre:'Traditional Fusion', bpm:108, duration:'3:58', coverEmoji:'🎧', audioFile:'audio/beat-sample-3.mp3', tags:['Traditional','Fusion','Zambian'], isFree:false, freeLabel:'', actions:{download:true,purchase:true,inquire:true}, featured:false, dateAdded:'2024-04-20', sortOrder:3 },
      { id:'b4', title:'Sunset R&B Groove', genre:'R&B', bpm:85, duration:'4:02', coverEmoji:'🎸', audioFile:'audio/beat-sample-4.mp3', tags:['R&B','Soul','Slow Jam'], isFree:false, freeLabel:'', actions:{download:true,purchase:true,inquire:true}, featured:false, dateAdded:'2024-03-10', sortOrder:4 }
    ],
    cta: { title:'🎤 Want a Custom Beat?', description:'Need an original beat tailored to your sound? Let\'s create something unique together.', buttonText:'Request Custom Beat', buttonLink:'#contact' }
  };
  DB.videos = {
    videos: [
      { id:'v1', type:'youtube', youtubeEmbedUrl:'https://www.youtube.com/embed/eYCzfdeMW0w', youtubeChannelUrl:'https://youtube.com/@ekellix1921', poster:'', title:'EK ELLIX Production', subtitle:'YouTube • Featured', description:'Watch our latest video production on YouTube.', tags:['YouTube','Featured','Production'], actions:[{label:'📺 YouTube',url:'https://youtube.com/@ekellix1921',external:true},{label:'💬 WhatsApp',url:'https://wa.me/260767165702',external:true}], featured:true, dateAdded:'2024-06-01', sortOrder:1 },
      { id:'v2', type:'local', youtubeEmbedUrl:'', poster:'images/founder-2.jpg', localVideo:'videos/showreel.mp4', title:'EK ELLIX Cinematic Showreel', subtitle:'Videography • 2:30', description:'A showcase of our best cinematography work.', tags:['Cinematic','Showreel','4K'], actions:[{label:'📞 Book Videography',url:'#contact',external:false},{label:'💬 WhatsApp',url:'https://wa.me/260767165702',external:true}], featured:true, dateAdded:'2024-05-20', sortOrder:2 },
      { id:'v3', type:'local', youtubeEmbedUrl:'', poster:'images/founder-3.png', localVideo:'videos/event-highlights.mp4', title:'Event Highlights Reel', subtitle:'Event Coverage • 3:15', description:'Capturing key moments from events.', tags:['Events','Corporate','Highlights'], actions:[{label:'📞 Book Videography',url:'#contact',external:false},{label:'💬 WhatsApp',url:'https://wa.me/260767165702',external:true}], featured:false, dateAdded:'2024-04-15', sortOrder:3 },
      { id:'v4', type:'local', youtubeEmbedUrl:'', poster:'images/founder-1.jpeg', localVideo:'videos/promo-sample.mp4', title:'Promotional Video Sample', subtitle:'Commercial • 1:45', description:'Engaging promotional content for your brand.', tags:['Promo','Commercial','Branding'], actions:[{label:'📞 Book Videography',url:'#contact',external:false},{label:'💬 WhatsApp',url:'https://wa.me/260767165702',external:true}], featured:false, dateAdded:'2024-03-01', sortOrder:4 }
    ],
    cta: { title:'📺 More Videos on YouTube', description:'Visit our YouTube channel for more.', buttonText:'Visit YouTube Channel', buttonUrl:'https://youtube.com/@ekellix1921', external:true }
  };
  DB.graphics = {
    graphics: [
      { id:'g1', title:'Modern Business Flyer', category:'Flyer Design', description:'Clean, professional flyer design.', image:'images/flyer.png', tags:['Flyer','Business','Print'], dateAdded:'2024-06-01', sortOrder:1 },
      { id:'g2', title:'Brand Identity, EK ELLIX', category:'Logo Design', description:'Complete brand identity with logo and guidelines.', image:'images/logo.png', tags:['Logo','Branding','Identity'], dateAdded:'2024-05-15', sortOrder:2 },
      { id:'g3', title:'Event Certificate Design', category:'Certificate Design', description:'Elegant certificate templates.', image:'images/founder-3.png', tags:['Certificate','Events','Corporate'], dateAdded:'2024-04-20', sortOrder:3 },
      { id:'g4', title:'Event Poster Design', category:'Poster Design', description:'Bold, eye-catching posters.', image:'images/flyer.png', tags:['Poster','Event','Promo'], dateAdded:'2024-04-01', sortOrder:4 },
      { id:'g5', title:'Social Media Graphics', category:'Digital Design', description:'Optimized visuals for social platforms.', image:'images/founder-2.jpg', tags:['Social','Digital','Marketing'], dateAdded:'2024-03-15', sortOrder:5 },
      { id:'g6', title:'Complete Branding Package', category:'Brand Identity', description:'Full branding suite.', image:'images/logo.png', tags:['Branding','Business','Identity'], dateAdded:'2024-03-01', sortOrder:6 }
    ],
    cta: { title:'🖌️ Need Custom Designs?', description:'We create designs that stand out.', buttonText:'Request Design Work', buttonLink:'#contact' }
  };
  DB.testimonials = {
    testimonials: [
      { id:'t1', text:'EK ELLIX delivered exceptional photography services for our corporate event. The quality, professionalism, and attention to detail were outstanding!', clientName:'Business Client', clientInitials:'BK', service:'Corporate Event Photography', rating:5, dateAdded:'2024-06-01', sortOrder:1 },
      { id:'t2', text:'The logo design and branding work by EK ELLIX exceeded my expectations. Truly world-class service.', clientName:'Small Business Owner', clientInitials:'SM', service:'Logo & Brand Design', rating:5, dateAdded:'2024-05-15', sortOrder:2 },
      { id:'t3', text:'I needed urgent data recovery and EK ELLIX came through for me. Professional, fast, and reliable.', clientName:'Student', clientInitials:'KM', service:'Data Recovery Services', rating:5, dateAdded:'2024-04-20', sortOrder:3 },
      { id:'t4', text:'The music production quality is incredible. A true creative partner!', clientName:'Recording Artist', clientInitials:'AM', service:'Music Production', rating:5, dateAdded:'2024-03-10', sortOrder:4 }
    ]
  };
  DB.portfolio = {
    categories: [
      { id:'all', label:'All' }, { id:'photography', label:'Photography' },
      { id:'videography', label:'Videography' }, { id:'design', label:'Graphic Design' },
      { id:'music', label:'Music Production' }, { id:'tech', label:'Technology' }
    ],
    items: [
      { id:'p1', title:'Portrait Photography', category:'photography', image:'images/founder-1.jpeg', description:'Portrait Photography', dateAdded:'2024-06-01', sortOrder:1 },
      { id:'p2', title:'Corporate Photography', category:'photography', image:'images/founder-2.jpg', description:'Corporate Photography', dateAdded:'2024-05-15', sortOrder:2 },
      { id:'p3', title:'Creative Portraits', category:'photography', image:'images/founder-3.png', description:'Creative Portraits', dateAdded:'2024-04-20', sortOrder:3 },
      { id:'p4', title:'Modern Flyer Design', category:'design', image:'images/flyer.png', description:'Modern Flyer Design', dateAdded:'2024-04-01', sortOrder:4 },
      { id:'p5', title:'Brand Identity Design', category:'design', image:'images/logo.png', description:'Brand Identity Design', dateAdded:'2024-03-15', sortOrder:5 },
      { id:'p6', title:'Event Coverage', category:'photography', image:'images/founder-3.png', description:'Event Coverage', dateAdded:'2024-03-01', sortOrder:6 }
    ]
  };
  saveData();
}

/* ─── Navigation ─── */
function setupNav() {
  document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentSection = btn.dataset.section;
      document.querySelectorAll('.nav-item[data-section]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      editingId = null;
      deleteConfirmId = null;
      renderSection();
    });
  });
}

/* ─── Render Section ─── */
function renderSection() {
  const main = document.getElementById('main-content');
  const sectionLabels = {
    audio: { icon: '🎵', title: 'Audio / Beats', desc: 'Manage beats, instrumentals, and audio tracks' },
    videos: { icon: '🎬', title: 'Videos', desc: 'Manage video showcases and YouTube embeds' },
    graphics: { icon: '🎨', title: 'Graphics', desc: 'Manage graphic design portfolio items' },
    testimonials: { icon: '⭐', title: 'Testimonials', desc: 'Manage client reviews and testimonials' },
    portfolio: { icon: '📷', title: 'Portfolio', desc: 'Manage portfolio items and categories' }
  };
  const s = sectionLabels[currentSection];
  const items = getItems();
  const count = items.length;

  main.innerHTML = `
    <div class="main-header">
      <div>
        <h1>${s.icon} ${s.title}</h1>
        <p>${s.desc} — ${count} item${count !== 1 ? 's' : ''}</p>
      </div>
      <button class="btn btn-primary" onclick="openAddModal()">+ Add New</button>
    </div>
    <div class="stats-bar">
      <div class="stat-box"><div class="num">${count}</div><div class="lbl">Total Items</div></div>
      <div class="stat-box"><div class="num">${items.filter(i => i.featured).length}</div><div class="lbl">Featured</div></div>
    </div>
    <div class="entry-list" id="entry-list">
      ${count === 0 ? `<div class="empty-state"><div class="icon">${s.icon}</div><p>No items yet. Click "Add New" to get started.</p></div>` : ''}
      ${items.map((item, idx) => renderEntryCard(item, idx)).join('')}
    </div>`;

  /* Wire up delete confirm buttons */
  document.querySelectorAll('[data-confirm-delete]').forEach(btn => {
    btn.addEventListener('click', () => { deleteItem(btn.dataset.confirmDelete); });
  });
  document.querySelectorAll('[data-cancel-delete]').forEach(btn => {
    btn.addEventListener('click', () => { deleteConfirmId = null; renderSection(); });
  });
  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => { deleteConfirmId = btn.dataset.delete; renderSection(); });
  });
  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => { openEditModal(btn.dataset.edit); });
  });
  /* Move up/down */
  document.querySelectorAll('[data-move-up]').forEach(btn => {
    btn.addEventListener('click', () => { moveItem(btn.dataset.moveUp, -1); });
  });
  document.querySelectorAll('[data-move-down]').forEach(btn => {
    btn.addEventListener('click', () => { moveItem(btn.dataset.moveDown, 1); });
  });
}

function getItems() {
  switch(currentSection) {
    case 'audio': return [...(DB.audio.beats || [])].sort((a,b) => (a.sortOrder||0)-(b.sortOrder||0));
    case 'videos': return [...(DB.videos.videos || [])].sort((a,b) => (a.sortOrder||0)-(b.sortOrder||0));
    case 'graphics': return [...(DB.graphics.graphics || [])].sort((a,b) => (a.sortOrder||0)-(b.sortOrder||0));
    case 'testimonials': return [...(DB.testimonials.testimonials || [])].sort((a,b) => (a.sortOrder||0)-(b.sortOrder||0));
    case 'portfolio': return [...(DB.portfolio.items || [])].sort((a,b) => (a.sortOrder||0)-(b.sortOrder||0));
    default: return [];
  }
}

function setItems(items) {
  switch(currentSection) {
    case 'audio': DB.audio.beats = items; break;
    case 'videos': DB.videos.videos = items; break;
    case 'graphics': DB.graphics.graphics = items; break;
    case 'testimonials': DB.testimonials.testimonials = items; break;
    case 'portfolio': DB.portfolio.items = items; break;
  }
  saveData(currentSection);
}

function renderEntryCard(item, idx) {
  let thumb = '';
  let subtitle = '';
  let badges = '';

  switch(currentSection) {
    case 'audio':
      thumb = `<div class="entry-thumb">${item.coverEmoji || '🎵'}</div>`;
      subtitle = `${item.genre}${item.bpm ? ' • ' + item.bpm + ' BPM' : ''} • ${item.duration}`;
      badges = (item.isFree ? '<span class="badge badge-free">Free</span>' : '') + (item.featured ? '<span class="badge badge-featured">Featured</span>' : '');
      break;
    case 'videos':
      thumb = item.type === 'youtube' ? `<div class="entry-thumb">▶️</div>` : `<div class="entry-thumb">${item.poster ? `<img src="../${item.poster}" alt="">` : '🎬'}</div>`;
      subtitle = item.subtitle || item.type;
      badges = item.featured ? '<span class="badge badge-featured">Featured</span>' : '';
      break;
    case 'graphics':
      thumb = `<div class="entry-thumb">${item.image ? `<img src="../${item.image}" alt="">` : '🎨'}</div>`;
      subtitle = item.category || '';
      break;
    case 'testimonials':
      thumb = `<div class="entry-thumb" style="font-size:1rem;font-weight:700;">${item.clientInitials || '??'}</div>`;
      subtitle = `${item.clientName} — ${item.service}`;
      badges = `<span class="badge badge-featured">★ ${item.rating}/5</span>`;
      break;
    case 'portfolio':
      thumb = `<div class="entry-thumb">${item.image ? `<img src="../${item.image}" alt="">` : '📷'}</div>`;
      subtitle = item.category || '';
      break;
  }

  const isDeleting = deleteConfirmId === item.id;

  return `
    <div class="entry-card">
      ${thumb}
      <div class="entry-info">
        <h4>${item.title || 'Untitled'}</h4>
        <span>${subtitle}</span>
        <div style="margin-top:0.35rem;">${badges}</div>
        ${isDeleting ? `
          <div class="confirm-bar">
            <p>Are you sure you want to delete this?</p>
            <button class="btn btn-danger btn-sm" data-confirm-delete="${item.id}">Delete</button>
            <button class="btn btn-secondary btn-sm" data-cancel-delete>Cancel</button>
          </div>` : ''}
      </div>
      <div class="entry-actions">
        <button class="btn btn-secondary btn-sm" data-move-up="${item.id}" title="Move up">↑</button>
        <button class="btn btn-secondary btn-sm" data-move-down="${item.id}" title="Move down">↓</button>
        <button class="btn btn-secondary btn-sm" data-edit="${item.id}">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" data-delete="${item.id}">🗑</button>
      </div>
    </div>`;
}

/* ─── Move / Reorder ─── */
function moveItem(id, direction) {
  const items = getItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx < 0) return;
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= items.length) return;
  [items[idx], items[newIdx]] = [items[newIdx], items[idx]];
  items.forEach((item, i) => item.sortOrder = i + 1);
  setItems(items);
  renderSection();
  toast('Order updated', 'success');
}

/* ─── Delete ─── */
function deleteItem(id) {
  const items = getItems().filter(i => i.id !== id);
  items.forEach((item, i) => item.sortOrder = i + 1);
  setItems(items);
  deleteConfirmId = null;
  renderSection();
  toast('Item deleted', 'success');
}

/* ─── Modal ─── */
function setupModal() {
  const overlay = document.getElementById('modal-overlay');
  const cancelBtn = document.getElementById('modal-cancel');
  const saveBtn = document.getElementById('modal-save');

  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  saveBtn.addEventListener('click', saveFromModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

function openModal(title) {
  document.getElementById('modal-title').innerHTML = title;
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  editingId = null;
}

function openAddModal() {
  editingId = null;
  const titles = { audio:'Add New Beat', videos:'Add New Video', graphics:'Add New Graphic', testimonials:'Add New Testimonial', portfolio:'Add New Portfolio Item' };
  document.getElementById('modal-body').innerHTML = getFormHTML();
  openModal(titles[currentSection]);
}

function openEditModal(id) {
  editingId = id;
  const items = getItems();
  const item = items.find(i => i.id === id);
  if (!item) return;
  const titles = { audio:'Edit Beat', videos:'Edit Video', graphics:'Edit Graphic', testimonials:'Edit Testimonial', portfolio:'Edit Portfolio Item' };
  document.getElementById('modal-body').innerHTML = getFormHTML(item);
  openModal(titles[currentSection]);
}

/* ─── Form HTML Generators ─── */
function getFormHTML(item = {}) {
  const v = (field) => escapeHTML(item[field] || '');
  const chk = (field, val) => (item[field] === val || (!item[field] && val === true)) ? 'checked' : '';

  switch(currentSection) {
    case 'audio': return `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Title *</label><input class="form-input" data-field="title" value="${v('title')}" placeholder="Beat title"></div>
        <div class="form-group"><label class="form-label">Genre</label><input class="form-input" data-field="genre" value="${v('genre')}" placeholder="e.g. Amapiano"></div>
        <div class="form-group"><label class="form-label">BPM</label><input class="form-input" data-field="bpm" type="number" value="${v('bpm')}" placeholder="120"></div>
        <div class="form-group"><label class="form-label">Duration</label><input class="form-input" data-field="duration" value="${v('duration')}" placeholder="3:42"></div>
        <div class="form-group"><label class="form-label">Cover Emoji</label><input class="form-input" data-field="coverEmoji" value="${v('coverEmoji')}" placeholder="🎹"></div>
        <div class="form-group"><label class="form-label">Audio File Path</label><input class="form-input" data-field="audioFile" value="${v('audioFile')}" placeholder="audio/beat-name.mp3"><div class="form-hint">Relative path from website root</div></div>
        <div class="form-group full"><label class="form-label">Tags (press Enter to add)</label><div class="tags-input" id="tags-input">${(item.tags||[]).map(t=>`<span class="tag">${t}<span class="remove" onclick="this.parentElement.remove()">×</span></span>`).join('')}<input type="text" placeholder="Type tag + Enter" onkeydown="handleTagInput(event)"></div></div>
        <div class="form-group"><label class="form-checkbox"><input type="checkbox" data-field="isFree" ${chk('isFree')}> Free beat</label></div>
        <div class="form-group"><label class="form-checkbox"><input type="checkbox" data-field="featured" ${chk('featured')}> Featured</label></div>
      </div>`;

    case 'videos': return `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Title *</label><input class="form-input" data-field="title" value="${v('title')}" placeholder="Video title"></div>
        <div class="form-group"><label class="form-label">Subtitle</label><input class="form-input" data-field="subtitle" value="${v('subtitle')}" placeholder="YouTube • Featured"></div>
        <div class="form-group"><label class="form-label">Type</label><select class="form-select" data-field="type"><option value="youtube" ${item.type==='youtube'?'selected':''}>YouTube Embed</option><option value="local" ${item.type==='local'?'selected':''}>Local Video</option></select></div>
        <div class="form-group"><label class="form-label">Featured</label><label class="form-checkbox"><input type="checkbox" data-field="featured" ${chk('featured')}> Featured</label></div>
        <div class="form-group full"><label class="form-label">YouTube Embed URL</label><input class="form-input" data-field="youtubeEmbedUrl" value="${v('youtubeEmbedUrl')}" placeholder="https://www.youtube.com/embed/..."><div class="form-hint">Only needed if type is YouTube</div></div>
        <div class="form-group"><label class="form-label">Local Video Path</label><input class="form-input" data-field="localVideo" value="${v('localVideo')}" placeholder="videos/my-video.mp4"></div>
        <div class="form-group"><label class="form-label">Poster Image</label><input class="form-input" data-field="poster" value="${v('poster')}" placeholder="images/poster.jpg"></div>
        <div class="form-group full"><label class="form-label">Description</label><textarea class="form-textarea" data-field="description" placeholder="Video description...">${v('description')}</textarea></div>
        <div class="form-group full"><label class="form-label">Tags (press Enter)</label><div class="tags-input" id="tags-input">${(item.tags||[]).map(t=>`<span class="tag">${t}<span class="remove" onclick="this.parentElement.remove()">×</span></span>`).join('')}<input type="text" placeholder="Type tag + Enter" onkeydown="handleTagInput(event)"></div></div>
      </div>`;

    case 'graphics': return `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Title *</label><input class="form-input" data-field="title" value="${v('title')}" placeholder="Design title"></div>
        <div class="form-group"><label class="form-label">Category</label><input class="form-input" data-field="category" value="${v('category')}" placeholder="e.g. Flyer Design"></div>
        <div class="form-group full"><label class="form-label">Description</label><textarea class="form-textarea" data-field="description" placeholder="Design description...">${v('description')}</textarea></div>
        <div class="form-group full"><label class="form-label">Image Path</label><input class="form-input" data-field="image" value="${v('image')}" placeholder="images/my-design.png"><div class="form-hint">Relative path from website root</div></div>
        <div class="form-group full"><label class="form-label">Tags (press Enter)</label><div class="tags-input" id="tags-input">${(item.tags||[]).map(t=>`<span class="tag">${t}<span class="remove" onclick="this.parentElement.remove()">×</span></span>`).join('')}<input type="text" placeholder="Type tag + Enter" onkeydown="handleTagInput(event)"></div></div>
      </div>`;

    case 'testimonials': return `
      <div class="form-grid">
        <div class="form-group full"><label class="form-label">Testimonial Text *</label><textarea class="form-textarea" data-field="text" placeholder="What the client said...">${v('text')}</textarea></div>
        <div class="form-group"><label class="form-label">Client Name *</label><input class="form-input" data-field="clientName" value="${v('clientName')}" placeholder="John Doe"></div>
        <div class="form-group"><label class="form-label">Client Initials *</label><input class="form-input" data-field="clientInitials" value="${v('clientInitials')}" placeholder="JD" maxlength="3"></div>
        <div class="form-group"><label class="form-label">Service</label><input class="form-input" data-field="service" value="${v('service')}" placeholder="Photography Service"></div>
        <div class="form-group"><label class="form-label">Rating</label><select class="form-select" data-field="rating"><option value="5" ${item.rating==5?'selected':''}>★★★★★ (5)</option><option value="4" ${item.rating==4?'selected':''}>★★★★☆ (4)</option><option value="3" ${item.rating==3?'selected':''}>★★★☆☆ (3)</option><option value="2" ${item.rating==2?'selected':''}>★★☆☆☆ (2)</option><option value="1" ${item.rating==1?'selected':''}>★☆☆☆☆ (1)</option></select></div>
      </div>`;

    case 'portfolio': return `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Title *</label><input class="form-input" data-field="title" value="${v('title')}" placeholder="Project title"></div>
        <div class="form-group"><label class="form-label">Category</label><select class="form-select" data-field="category">${(DB.portfolio.categories||[]).map(c=>`<option value="${c.id}" ${item.category===c.id?'selected':''}>${c.label}</option>`).join('')}</select></div>
        <div class="form-group full"><label class="form-label">Description</label><input class="form-input" data-field="description" value="${v('description')}" placeholder="Short description"></div>
        <div class="form-group full"><label class="form-label">Image Path</label><input class="form-input" data-field="image" value="${v('image')}" placeholder="images/project.jpg"><div class="form-hint">Relative path from website root</div></div>
      </div>`;
  }
  return '';
}

/* ─── Save from Modal ─── */
function saveFromModal() {
  const modal = document.getElementById('modal-body');
  const data = {};

  /* Collect regular fields */
  modal.querySelectorAll('[data-field]').forEach(el => {
    const field = el.dataset.field;
    if (el.type === 'checkbox') {
      data[field] = el.checked;
    } else if (el.type === 'number') {
      data[field] = parseInt(el.value) || 0;
    } else if (el.tagName === 'SELECT' && field === 'rating') {
      data[field] = parseInt(el.value) || 5;
    } else {
      data[field] = el.value.trim();
    }
  });

  /* Collect tags */
  const tagsContainer = modal.querySelector('#tags-input');
  if (tagsContainer) {
    data.tags = [...tagsContainer.querySelectorAll('.tag')].map(t => t.textContent.replace('×','').trim()).filter(Boolean);
  }

  /* Validation */
  const titleField = data.title || data.text;
  if (!titleField) { toast('Title/text is required', 'error'); return; }

  /* Build item */
  const items = getItems();
  if (editingId) {
    /* Update existing */
    const idx = items.findIndex(i => i.id === editingId);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...data, dateAdded: items[idx].dateAdded || new Date().toISOString().split('T')[0] };
    }
  } else {
    /* Create new */
    const newId = currentSection.charAt(0) + Date.now().toString(36);
    const newItem = {
      id: newId,
      ...data,
      dateAdded: new Date().toISOString().split('T')[0],
      sortOrder: items.length + 1
    };

    /* Section-specific defaults */
    if (currentSection === 'audio') {
      newItem.actions = { download: true, purchase: true, inquire: true };
      newItem.freeLabel = newItem.isFree ? 'FREE' : '';
    }
    if (currentSection === 'videos') {
      if (!newItem.type) newItem.type = 'local';
      if (!newItem.actions) newItem.actions = [{ label: '📞 Book', url: '#contact', external: false }, { label: '💬 WhatsApp', url: 'https://wa.me/260767165702', external: true }];
    }

    items.push(newItem);
  }

  setItems(items);
  closeModal();
  renderSection();
  toast(editingId ? 'Item updated' : 'Item added', 'success');
}

/* ─── Tags Input Helper ─── */
function handleTagInput(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const input = e.target;
    const val = input.value.trim();
    if (!val) return;
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `${escapeHTML(val)}<span class="remove" onclick="this.parentElement.remove()">×</span>`;
    input.parentElement.insertBefore(tag, input);
    input.value = '';
  }
}

/* ─── Export / Import ─── */
function setupExportImport() {
  document.getElementById('btn-export-all').addEventListener('click', exportAll);
  document.getElementById('btn-import').addEventListener('click', () => {
    document.getElementById('import-file').click();
  });
  document.getElementById('import-file').addEventListener('change', handleImport);
}

function exportAll() {
  const sections = {
    'audio.json': DB.audio,
    'videos.json': DB.videos,
    'graphics.json': DB.graphics,
    'testimonials.json': DB.testimonials,
    'portfolio.json': DB.portfolio
  };

  Object.entries(sections).forEach(([filename, data]) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  });

  toast('All 5 JSON files exported!', 'success');
}

function handleImport(e) {
  const files = e.target.files;
  if (!files.length) return;

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const name = file.name.toLowerCase();

        if (name.includes('audio')) { DB.audio = data; saveData('audio'); }
        else if (name.includes('video')) { DB.videos = data; saveData('videos'); }
        else if (name.includes('graphic')) { DB.graphics = data; saveData('graphics'); }
        else if (name.includes('testimonial')) { DB.testimonials = data; saveData('testimonials'); }
        else if (name.includes('portfolio')) { DB.portfolio = data; saveData('portfolio'); }

        renderSection();
        toast(`Imported ${file.name}`, 'success');
      } catch(err) {
        toast(`Failed to import ${file.name}: Invalid JSON`, 'error');
      }
    };
    reader.readAsText(file);
  });

  e.target.value = '';
}

/* ─── Toast ─── */
function toast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ─── Utility ─── */
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
