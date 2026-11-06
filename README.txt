JELAN GAMES versi Vercel.
Key API disimpan sebagai Environment Variable JEREXD_KEY di Vercel (bukan di kode).
File api/game.js adalah fungsi server yang memanggil API dengan key itu.
Deploy: upload semua file ke GitHub, import ke Vercel, isi JEREXD_KEY, Deploy.
Tidak bisa dibuka lewat file:// atau python http.server karena butuh fungsi /api/game.
