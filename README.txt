JELAN GAMES (Web made by Jelan)
Isi: index.html, style.css, app.js. Tanpa framework, tanpa file Vercel.

Cara pakai:
1. Paling mudah: buka folder ini di terminal lalu jalankan  python3 -m http.server 8000
   kemudian buka http://localhost:8000
   (membuka index.html langsung juga bisa, tapi sebagian browser membatasi request API).
2. Untuk online, upload semua file ke hosting statis apa pun (Netlify, GitHub Pages, Cloudflare Pages, dll).

Catatan:
- Soal diambil dari api.jerexd.my.id. Apikey ada di bagian atas app.js (konstanta KEY).
  Karena ini web statis, apikey terlihat oleh siapa pun yang membuka web-nya.
- Efek suara dibuat lewat WebAudio, jadi tidak ada file audio tambahan.
- Rekor skor tiap game disimpan di browser (localStorage).
