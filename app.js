const API='/api/game?g=';
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
/* suara: dibuat langsung dengan WebAudio, tanpa file */
let mute=localStorage.jm==='1',ac;
function tone(f,d=.12,t='triangle',at=0,v=.07){if(mute)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),s=ac.currentTime+at;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.001,s+d);o.connect(g);g.connect(ac.destination);o.start(s);o.stop(s+d)}catch(e){}}
const sfx={click:()=>tone(520,.06),ok:()=>{tone(523,.12);tone(784,.22,'triangle',.1)},no:()=>tone(160,.28,'sawtooth',0,.05),win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.2,'triangle',i*.09))};
const snd=$('#snd');const sl=()=>snd.textContent='Suara: '+(mute?'mati':'nyala');sl();
snd.onclick=()=>{mute=!mute;localStorage.jm=mute?1:0;sl();sfx.click()};
/* daftar game: n() menyeragamkan respons API */
const T=(id,t,d,ini,n,x={})=>({id,t,d,ini,n,...x});
const G=[
T('asahotak','Asah Otak','Teka-teki pengetahuan umum','AO',r=>({q:r.soal,a:[r.jawaban]})),
T('caklontong','Cak Lontong','Jawaban nyeleneh, siap-siap ketawa','CL',r=>({q:r.soal,a:[r.jawaban],info:r.deskripsi})),
T('cc-sd','Cerdas Cermat SD','5 soal pilihan ganda pelajaran SD','CC',r=>r,{type:'mc'}),
T('family100','Family 100','Tebak semua jawaban yang ada di papan','F1',r=>({q:r.soal,a:r.jawaban}),{type:'f100'}),
T('karakter-freefire','Karakter Free Fire','Kenali karakternya dari gambar','FF',r=>({q:'Siapa nama karakter ini?',img:r.gambar,a:[r.name]})),
T('lengkapikalimat','Lengkapi Kalimat','Isi bagian yang kosong','LK',r=>({q:r.pertanyaan,a:[r.jawaban]})),
T('maths','Matematika','Hitung cepat sebelum waktu habis','M+',r=>({q:r.str,a:[String(r.result)],num:1,time:r.time,hint:'Mode '+r.mode})),
T('siapakahaku','Siapakah Aku?','Tebak dari petunjuk yang diberikan','SA',r=>({q:r.soal,a:[r.jawaban]})),
T('susunkata','Susun Kata','Acak huruf jadi kata yang benar','SK',r=>({q:r.soal,a:[r.jawaban],hint:'Jenis: '+r.tipe})),
T('tebakbendera','Tebak Bendera','Bendera negara mana ini?','TB',r=>({q:'Bendera negara apa ini?',img:r.img,a:[r.name]})),
T('tebakgambar','Tebak Gambar','Terjemahkan gambar jadi kata','TG',r=>({q:'Apa arti gambar ini?',img:r.img,a:[r.jawaban],info:r.deskripsi})),
T('tebakheroml','Tebak Hero ML','Dengar voiceline, tebak heronya','ML',r=>({q:r.soal,audio:r.audio,a:[r.jawaban]})),
T('tebaklagu','Tebak Lagu','Dengar potongannya, tebak judulnya','TL',r=>({q:'Apa judul lagu ini?',audio:r.lagu,a:[r.judul],info:'Artis: '+r.artis})),
T('tebaktebakan','Tebak-tebakan','Receh tapi bikin penasaran','TT',r=>({q:r.soal,a:[r.jawaban]})),
T('tebaklogo','Tebak Logo','Logo merek apa ini?','LG',r=>({q:'Logo apa ini?',img:r.data.image,a:[r.data.jawaban]})),
T('tebakkartun','Tebak Kartun','Kenali kartunnya dari gambar','KT',r=>({q:'Kartun apa ini?',img:r.img,a:[r.name]}))
];
let S={};
const best=()=>JSON.parse(localStorage.jb||'{}');
const app=$('#app');
function hub(){
S={};const b=best();
app.innerHTML=`<section class="hero"><div class="tiles" aria-label="Jelan Games">${[...'JELAN'].map((c,i)=>`<span style="--r:${[-4,3,-2,4,-3][i]}deg;animation-delay:${i*.08}s">${c}</span>`).join('')}${[...'GAMES'].map((c,i)=>`<span style="--r:${[2,-3,4,-2,3][i]}deg;animation-delay:${.4+i*.08}s">${c}</span>`).join('')}</div><p>Enam belas game tebak-tebakan dalam satu tempat. Pilih satu, main sepuasnya, kejar rekor skormu.</p></section><div class="grid">${G.map(g=>`<button class="gc" data-id="${g.id}"><i>${g.ini}</i><span><b>${g.t}</b><small>${g.d}</small>${b[g.id]?`<em>Rekor ${b[g.id]}</em>`:''}</span></button>`).join('')}</div>`;
app.querySelectorAll('.gc').forEach(el=>el.onclick=()=>{sfx.click();open(G.find(g=>g.id===el.dataset.id))});
}
function open(g){
S={g,score:0,streak:0,n:0};
app.innerHTML=`<div class="bar"><button class="ghost" id="bk">Kembali ke menu</button><h2>${g.t}</h2><div class="chips"><span>Skor <b id="sc">0</b></span><span>Beruntun <b id="st">0</b></span></div></div><div id="stage" class="stage"></div>`;
$('#bk').onclick=()=>{sfx.click();clearTimeout(S.tm);hub()};
load();
}
function upd(){
$('#sc').textContent=S.score;$('#st').textContent=S.streak;
const e=$('#sc');e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop');
const b=best();if(S.score>(b[S.g.id]||0)){b[S.g.id]=S.score;localStorage.jb=JSON.stringify(b)}
}
async function load(){
const st=$('#stage');st.innerHTML='<div class="load">Memuat soal…</div>';
const id=S.g.id;
try{
const r=await fetch(API+id);
if(!r.ok)throw 0;const j=await r.json();
if(S.g.id!==id||!j.result)throw 0;
S.raw=S.g.n(j.result);
if(S.g.type==='mc'){S.list=j.result.soal;S.i=0;S.right=0;drawMC()}
else if(S.g.type==='f100')drawF()
else drawText();
}catch(e){st.innerHTML='<div class="card"><p class="q">Soal gagal dimuat</p><p class="hint">Cek koneksi internetmu, lalu coba lagi.</p><div class="row"><button class="go" id="rt">Coba lagi</button></div></div>';$('#rt').onclick=()=>{sfx.click();load()}}
}
function media(q){return (q.img?`<img class="pic" src="${esc(q.img)}" referrerpolicy="no-referrer" alt="Gambar soal">`:'')+(q.audio?`<audio controls preload="auto" src="${esc(q.audio)}"></audio>`:'')}
function ok(a,q){
const i=String(a).trim();
if(q.num){const x=Number(i.replace(',','.')),y=Number(q.a[0]);return isFinite(x)&&Math.abs(x-y)<=Math.max(1,Math.abs(y)*1e-9)}
return q.a.some(v=>norm(v)===norm(i))&&norm(i)!=='';
}
function drawText(){
const q=S.raw;S.done=0;S.n++;
$('#stage').innerHTML=`<div class="card"><div class="tag">Soal ke-${S.n}</div>${media(q)}<p class="q">${esc(q.q)}</p>${q.hint?`<p class="hint">${esc(q.hint)}</p>`:''}${q.time?`<div class="time"><i style="animation-duration:${q.time}ms"></i></div>`:''}<form id="f"><input id="in" autocomplete="off" autocapitalize="off" placeholder="Ketik jawabanmu" aria-label="Jawaban"><button class="go">Jawab</button></form><div class="row"><button class="ghost" id="sk">Lewati</button><button class="ghost" id="gv">Nyerah</button></div><div id="fb"></div></div>`;
const c=$('.card'),inp=$('#in');inp.focus({preventScroll:true});
$('#f').onsubmit=e=>{e.preventDefault();if(S.done||!inp.value.trim())return;
if(ok(inp.value,q))end(true);else{sfx.no;sfx.no();c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');inp.select()}};
$('#sk').onclick=()=>{sfx.click();clearTimeout(S.tm);S.streak=0;upd();load()};
$('#gv').onclick=()=>end(false,'Kamu menyerah');
if(q.time)S.tm=setTimeout(()=>end(false,'Waktu habis'),q.time);
}
function end(win,msg){
if(S.done)return;S.done=1;clearTimeout(S.tm);const q=S.raw;
if(win){S.streak++;S.score+=10+Math.min(S.streak,5)*2;sfx.ok()}else{S.streak=0;sfx.no()}
upd();
$('#in').disabled=true;$('#f .go').disabled=true;$('#sk').remove();$('#gv').remove();
const t=$('.time i');if(t)t.style.animationPlayState='paused';
$('#fb').innerHTML=`<div class="rev ${win?'g':'b'}"><b>${win?'Benar!':msg||'Belum tepat'}</b><span>Jawaban: ${esc(q.a[0])}</span>${q.info?`<span>${esc(q.info)}</span>`:''}</div><div class="row" style="margin-top:12px"><button class="go" id="nx">Soal berikutnya</button></div>`;
const n=$('#nx');n.focus();n.onclick=()=>{sfx.click();load()};
}
/* cerdas cermat: 5 soal pilihan ganda */
function drawMC(){
const q=S.list[S.i];
if(!q){sfx.win();$('#stage').innerHTML=`<div class="card" style="text-align:center"><p class="tag">Selesai</p><p class="big">${S.right}/${S.list.length}</p><p class="q">${S.right>=S.list.length-1?'Hebat, hampir sempurna!':'Lumayan, coba lagi untuk skor lebih tinggi.'}</p><div class="row" style="justify-content:center"><button class="go" id="again">Main lagi</button></div></div>`;$('#again').onclick=()=>{sfx.click();load()};return}
const opts=q.semua_jawaban.map(o=>Object.entries(o)[0]);
$('#stage').innerHTML=`<div class="card"><div class="tag">${esc(S.raw.matapelajaran||'')}${S.raw.matapelajaran?', ':''}soal ${S.i+1} dari ${S.list.length}</div><p class="q">${esc(q.pertanyaan)}</p><div class="opts">${opts.map(([k,v])=>`<button class="opt" data-k="${k}"><b>${k.toUpperCase()}.</b> ${esc(v)}</button>`).join('')}</div><div id="fb"></div></div>`;
document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
const w=b.dataset.k===q.jawaban_benar;
document.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(x.dataset.k===q.jawaban_benar)x.classList.add('g')});
if(w){S.right++;S.streak++;S.score+=10+Math.min(S.streak,5)*2;sfx.ok()}else{b.classList.add('b');S.streak=0;sfx.no();$('.card').classList.add('shake')}
upd();$('#fb').innerHTML='<button class="go" id="nx">'+(S.i+1<S.list.length?'Soal berikutnya':'Lihat hasil')+'</button>';
const n=$('#nx');n.focus();n.onclick=()=>{sfx.click();S.i++;drawMC()};
});
}
/* family 100 */
function drawF(){
const q=S.raw;S.done=0;S.n++;S.found=new Set();
$('#stage').innerHTML=`<div class="card"><div class="tag">Ronde ${S.n}, ${q.a.length} jawaban</div><p class="q">${esc(q.q)}</p><div class="slots">${q.a.map((_,i)=>`<div class="slot" id="s${i}">Jawaban ${i+1}</div>`).join('')}</div><form id="f"><input id="in" autocomplete="off" autocapitalize="off" placeholder="Tebak satu jawaban" aria-label="Tebakan"><button class="go">Tebak</button></form><div class="row"><button class="ghost" id="gv">Nyerah</button></div><div id="fb"></div></div>`;
const c=$('.card'),inp=$('#in');inp.focus({preventScroll:true});
$('#f').onsubmit=e=>{e.preventDefault();if(S.done||!inp.value.trim())return;
const i=q.a.findIndex((v,k)=>!S.found.has(k)&&norm(v)===norm(inp.value));
if(i<0){sfx.no();c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');inp.select();return}
S.found.add(i);const s=$('#s'+i);s.textContent=q.a[i];s.classList.add('on');S.score+=10;sfx.ok();upd();inp.value='';
if(S.found.size===q.a.length){S.streak++;sfx.win();fin('Semua jawaban terbuka!',1)}};
$('#gv').onclick=()=>{q.a.forEach((v,k)=>{if(!S.found.has(k)){const s=$('#s'+k);s.textContent=v;s.classList.add('miss')}});S.streak=0;sfx.no();fin('Kamu menyerah',0)};
function fin(m,w){S.done=1;upd();inp.disabled=true;$('#f .go').disabled=true;$('#gv').remove();$('#fb').innerHTML=`<div class="rev ${w?'g':'b'}"><b>${m}</b><span>Terbuka ${S.found.size} dari ${q.a.length}</span></div><div class="row" style="margin-top:12px"><button class="go" id="nx">Ronde berikutnya</button></div>`;const n=$('#nx');n.focus();n.onclick=()=>{sfx.click();load()}}
}
hub();
