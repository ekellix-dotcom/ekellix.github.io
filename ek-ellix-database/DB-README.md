# EK ELLIX — Content Database System

## 📁 File Structure

```
├── index.html              ← Main website (reads from database)
├── css/style.css           ← Website styles
├── js/main.js              ← Website core scripts
├── js/data-loader.js       ← Loads JSON database → renders content
├── db/                     ← 🗄️ THE DATABASE (JSON files)
│   ├── audio.json          ← Beats, instrumentals, audio tracks
│   ├── videos.json         ← Video showcases, YouTube embeds
│   ├── graphics.json       ← Graphic design portfolio items
│   ├── testimonials.json   ← Client testimonials & reviews
│   └── portfolio.json      ← Portfolio items & categories
├── admin/                  ← 🛠️ ADMIN PANEL
│   ├── index.html          ← Admin interface
│   └── admin.js            ← Admin CRUD logic
└── DB-README.md            ← This file
```

---

## 🛠️ How to Update Content

### Option 1: Use the Admin Panel (Recommended)

1. **Open** `admin/index.html` in your browser
2. **Click** a section in the sidebar (Audio, Videos, Graphics, Testimonials, Portfolio)
3. **Add** new items with the "+ Add New" button
4. **Edit** existing items with the ✏️ button
5. **Delete** items with the 🗑 button
6. **Reorder** items with the ↑↓ buttons
7. **Export** all data as JSON files with the 📦 button
8. **Copy** the exported JSON files into the `db/` folder on your website

### Option 2: Edit JSON Files Directly

Open any file in the `db/` folder with a text editor and modify the data.

---

## 📋 JSON Database Schemas

### audio.json — Beats & Audio
```json
{
  "sectionTitle": "Beats & Audio Library",
  "beats": [
    {
      "id": "b1",
      "title": "Beat Title",
      "genre": "Amapiano",
      "bpm": 120,
      "duration": "3:42",
      "coverEmoji": "🎹",
      "audioFile": "audio/beat-name.mp3",
      "tags": ["Tag1", "Tag2"],
      "isFree": false,
      "freeLabel": "",
      "actions": { "download": true, "purchase": true, "inquire": true },
      "featured": true,
      "dateAdded": "2024-06-01",
      "sortOrder": 1
    }
  ],
  "cta": {
    "title": "🎤 Want a Custom Beat?",
    "description": "Description text",
    "buttonText": "Request Custom Beat",
    "buttonLink": "#contact"
  }
}
```

### videos.json — Videos
```json
{
  "videos": [
    {
      "id": "v1",
      "type": "youtube",              // "youtube" or "local"
      "youtubeEmbedUrl": "https://www.youtube.com/embed/VIDEO_ID",
      "poster": "images/poster.jpg",   // for local videos
      "localVideo": "videos/file.mp4", // for local videos
      "title": "Video Title",
      "subtitle": "YouTube • Featured",
      "description": "Video description",
      "tags": ["Tag1", "Tag2"],
      "actions": [
        { "label": "📺 YouTube", "url": "https://...", "external": true }
      ],
      "featured": true,
      "sortOrder": 1
    }
  ],
  "cta": { ... }
}
```

### graphics.json — Graphic Design
```json
{
  "graphics": [
    {
      "id": "g1",
      "title": "Design Title",
      "category": "Flyer Design",
      "description": "Design description",
      "image": "images/design.png",
      "tags": ["Flyer", "Business"],
      "sortOrder": 1
    }
  ],
  "cta": { ... }
}
```

### testimonials.json — Client Reviews
```json
{
  "testimonials": [
    {
      "id": "t1",
      "text": "Client testimonial text...",
      "clientName": "John Doe",
      "clientInitials": "JD",
      "service": "Photography Service",
      "rating": 5,
      "sortOrder": 1
    }
  ]
}
```

### portfolio.json — Portfolio
```json
{
  "categories": [
    { "id": "all", "label": "All" },
    { "id": "photography", "label": "Photography" }
  ],
  "items": [
    {
      "id": "p1",
      "title": "Project Title",
      "category": "photography",
      "image": "images/project.jpg",
      "description": "Short description",
      "sortOrder": 1
    }
  ]
}
```

---

## 🔄 Workflow: Update → Deploy

1. Open `admin/index.html` in your browser
2. Make your changes (add/edit/delete/reorder)
3. Click **📦 Export All** — downloads 5 JSON files
4. Replace the files in the `db/` folder with the exported ones
5. Push to GitHub (or upload to your hosting)
6. The website automatically loads the updated content!

---

## 💡 Tips

- **Adding a new beat**: Set `audioFile` to the path of the MP3 (e.g., `audio/new-beat.mp3`)
- **Adding a YouTube video**: Set `type` to `"youtube"` and paste the embed URL
- **Adding a local video**: Set `type` to `"local"` and provide `localVideo` and `poster` paths
- **Free beats**: Set `isFree: true` — it automatically gets a green "FREE" badge
- **Reordering**: Use the ↑↓ arrows in the admin panel, or change `sortOrder` numbers in JSON
- **Tags**: Type a tag and press Enter in the admin panel, or edit the `tags` array in JSON
- **Images**: Use relative paths from the website root (e.g., `images/photo.jpg`)

---

## ⚙️ How It Works

1. When the website loads, `data-loader.js` fetches all 5 JSON files from the `db/` folder
2. It renders the content into the website sections (Beats, Videos, Graphics, Testimonials, Portfolio)
3. If a JSON file fails to load, it falls back to empty defaults (graceful degradation)
4. The admin panel stores edits in `localStorage` and exports them as downloadable JSON files
5. Simply replace the `db/` files with the exported ones to update the live site
