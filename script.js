/* ---- Reveal ---- */
const revObs = new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{ if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('visible'),i*60); revObs.unobserve(e.target); } });
},{threshold:0.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>revObs.observe(el));

/* ---- Navbar ---- */
const navbar=document.getElementById('navbar'), backTop=document.getElementById('back-top');
window.addEventListener('scroll',()=>{ navbar.classList.toggle('scrolled',scrollY>50); backTop.classList.toggle('show',scrollY>400); });

/* ---- Mobile Menu ---- */
function toggleMenu(){ document.getElementById('mobileMenu').classList.toggle('open'); document.querySelector('.menu-overlay-bg').classList.toggle('open'); }
function closeMenu(){ document.getElementById('mobileMenu').classList.remove('open'); document.querySelector('.menu-overlay-bg').classList.remove('open'); }

/* ---- Theme ---- */
let isLight=false;
function toggleTheme(){
  isLight=!isLight;
  document.body.classList.toggle('light',isLight);
  document.querySelector('.theme-btn').textContent=isLight?'🌙':'☀️';
}

/* ---- Stats Counter ---- */
document.querySelectorAll('.stat-number[data-target]').forEach(el=>{
  new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;
    const t=+el.getAttribute('data-target'); let c=0,s=Math.ceil(t/50);
    const tm=setInterval(()=>{ c=Math.min(c+s,t); el.textContent='+'+c; if(c>=t)clearInterval(tm); },30);
  },{threshold:0.5}).observe(el);
});

/* ============================================================
   3D PROJECT CAROUSEL
   ============================================================ */
(function(){
  const stage=document.getElementById('carouselStage');
  if(!stage)return;
  const cards=Array.from(stage.querySelectorAll('.proj-card'));
  const dotsEl=document.getElementById('carouselDots');
  const total=cards.length;
  let cur=0;

  /* Buat dots */
  cards.forEach((_,i)=>{
    const d=document.createElement('button');
    d.className='carousel-dot'+(i===0?' active':'');
    d.onclick=()=>goTo(i);
    dotsEl.appendChild(d);
  });

  function layout(){
    const angleStep=360/total;
    const radius=Math.max(330,total*92);
    cards.forEach((card,i)=>{
      let diff=i-cur;
      /* Shortest path wrapping */
      if(diff>total/2) diff-=total;
      if(diff<-total/2) diff+=total;

      const angleDeg=angleStep*diff;
      const rad=angleDeg*Math.PI/180;
      const x=Math.sin(rad)*radius;
      const z=Math.cos(rad)*radius-radius;
      const rotY=-angleDeg*0.55;
      const absDiff=Math.abs(diff);
      const scale=absDiff===0?1:Math.max(0.58,1-absDiff*0.17);
      const opacity=absDiff===0?1:Math.max(0.3,1-absDiff*0.28);

      card.style.transform=`translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
      card.style.opacity=opacity;
      card.style.zIndex=absDiff===0?10:Math.max(1,6-absDiff);
      card.classList.toggle('is-active',absDiff===0);
    });
    dotsEl.querySelectorAll('.carousel-dot').forEach((d,i)=>d.classList.toggle('active',i===cur));
  }

  function goTo(idx){ cur=((idx%total)+total)%total; layout(); }
  window.carouselNext=()=>goTo(cur+1);
  window.carouselPrev=()=>goTo(cur-1);

  /* Touch swipe */
  let tx=0;
  stage.parentElement.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;},{passive:true});
  stage.parentElement.addEventListener('touchend',e=>{ const dx=e.changedTouches[0].clientX-tx; if(Math.abs(dx)>40) dx<0?carouselNext():carouselPrev(); });

  /* Keyboard */
  document.addEventListener('keydown',e=>{ if(e.key==='ArrowRight')carouselNext(); if(e.key==='ArrowLeft')carouselPrev(); });

  /* Auto play */
  let timer=setInterval(carouselNext,4500);
  stage.parentElement.addEventListener('mouseenter',()=>clearInterval(timer));
  stage.parentElement.addEventListener('mouseleave',()=>{timer=setInterval(carouselNext,4500);});

  layout();
})();

/* ---- Music Player ---- */
const audio=document.getElementById('audioPlayer');
const playerBar=document.getElementById('playerBar');
const playerTitle=document.getElementById('playerTitle');
const playerArtist=document.getElementById('playerArtist');
const mainPlayBtn=document.getElementById('mainPlayBtn');
const progressSlider=document.getElementById('progressSlider');
const timeCurrent=document.getElementById('timeCurrent');
const timeDuration=document.getElementById('timeDuration');
let curTrack=null;

function getTrackList(){return Array.from(document.querySelectorAll('.music-track'));}

function playTrack(el){
  const src=el.getAttribute('data-src'),title=el.getAttribute('data-title'),artist=el.getAttribute('data-artist');
  if(curTrack){curTrack.classList.remove('playing');curTrack.querySelector('.track-play-btn i').className='fa fa-play';}
  if(curTrack===el&&!audio.paused){audio.pause();el.classList.remove('playing');el.querySelector('.track-play-btn i').className='fa fa-play';mainPlayBtn.querySelector('i').className='fa fa-play';curTrack=el;return;}
  curTrack=el;el.classList.add('playing');el.querySelector('.track-play-btn i').className='fa fa-pause';
  audio.src=src;
  audio.play().then(()=>{playerBar.classList.add('active');playerTitle.textContent=title;playerArtist.textContent=artist;mainPlayBtn.querySelector('i').className='fa fa-pause';}).catch(()=>{showToast('File audio tidak ditemukan. Letakkan file .mp3 di folder yang sama.');el.classList.remove('playing');curTrack=null;});
}
function togglePlay(){if(!audio.src||audio.src===location.href)return;if(audio.paused){audio.play();mainPlayBtn.querySelector('i').className='fa fa-pause';if(curTrack){curTrack.classList.add('playing');curTrack.querySelector('.track-play-btn i').className='fa fa-pause';}}else{audio.pause();mainPlayBtn.querySelector('i').className='fa fa-play';if(curTrack){curTrack.classList.remove('playing');curTrack.querySelector('.track-play-btn i').className='fa fa-play';}}}
function nextTrack(){const t=getTrackList();if(!curTrack||t.length<2)return;playTrack(t[(t.indexOf(curTrack)+1)%t.length]);}
function prevTrack(){const t=getTrackList();if(!curTrack||t.length<2)return;playTrack(t[(t.indexOf(curTrack)-1+t.length)%t.length]);}
function closePlayer(){audio.pause();audio.src='';playerBar.classList.remove('active');if(curTrack){curTrack.classList.remove('playing');curTrack.querySelector('.track-play-btn i').className='fa fa-play';curTrack=null;}}
audio.addEventListener('timeupdate',()=>{if(!audio.duration)return;progressSlider.value=(audio.currentTime/audio.duration)*100;timeCurrent.textContent=fmt(audio.currentTime);timeDuration.textContent=fmt(audio.duration);});
audio.addEventListener('ended',nextTrack);
function seekTo(v){if(audio.duration)audio.currentTime=(v/100)*audio.duration;}
function fmt(s){const m=Math.floor(s/60),sc=Math.floor(s%60);return m+':'+(sc<10?'0':'')+sc;}

function openMusicModal(){document.getElementById('musicModalOverlay').classList.add('open');}
function closeMusicModal(e){if(!e||e.target===document.getElementById('musicModalOverlay'))document.getElementById('musicModalOverlay').classList.remove('open');}
function addMusicTrack(){
  const t=document.getElementById('newTrackTitle').value.trim(),a=document.getElementById('newTrackArtist').value.trim(),s=document.getElementById('newTrackSrc').value.trim();
  if(!t||!s){showToast('Judul dan nama file wajib diisi!');return;}
  const list=document.getElementById('musicList'),track=document.createElement('div');
  track.className='music-track';track.setAttribute('data-src',s);track.setAttribute('data-title',t);track.setAttribute('data-artist',a||'Unknown');
  track.onclick=function(){playTrack(this);};
  track.innerHTML=`<div class="track-play-btn"><i class="fa fa-play"></i></div><div class="track-info"><p class="track-title">${t}</p><p class="track-artist">${a||'Unknown'}</p></div><div class="equalizer"><span></span><span></span><span></span><span></span></div>`;
  list.appendChild(track);
  document.getElementById('newTrackTitle').value='';document.getElementById('newTrackArtist').value='';document.getElementById('newTrackSrc').value='';
  closeMusicModal();showToast('Lagu "'+t+'" berhasil ditambahkan!');
}

function openLightbox(el){const img=el.querySelector('img');if(!img){showToast('Tambahkan foto terlebih dahulu di kode HTML.');return;}document.getElementById('lightboxImg').src=img.src;document.getElementById('lightboxOverlay').classList.add('open');}
function closeLightbox(){document.getElementById('lightboxOverlay').classList.remove('open');}

function sendContact(){
  const n=document.getElementById('contactName').value.trim();
  const e=document.getElementById('contactEmail').value.trim();
  const m=document.getElementById('contactMsg').value.trim();

  if(!n || !e || !m){
    showToast('Semua field wajib diisi!');
    return;
  }

  fetch('send_message.php',{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:`name=${n}&email=${e}&message=${m}`
  })
  .then(res=>res.text())
  .then(res=>{
    if(res==="success"){
      showToast('Pesan berhasil dikirim!');
      loadMessages();
    } else {
      showToast('Gagal mengirim pesan!');
    }
  });

  document.getElementById('contactName').value='';
  document.getElementById('contactEmail').value='';
  document.getElementById('contactMsg').value='';
}

function loadMessages(){
  fetch('get_messages.php')
  .then(res=>res.json())
  .then(data=>{
    const container = document.getElementById('messageList');
    if(!container) return;

    if(data.length === 0){
      container.innerHTML = "<p class='empty-msg'>Belum ada pesan. Jadilah yang pertama!</p>";
      return;
    }

    container.innerHTML = data.map(msg => {
      const initial = msg.name.charAt(0).toUpperCase();

      return `
        <div class="message-card" data-initial="${initial}">
          <div class="msg-header">
            <h4>${msg.name}</h4>
            <span class="msg-date">${msg.created_at}</span>
          </div>
          <small>${msg.email}</small>
          <p>${msg.message}</p>
        </div>
      `;
    }).join('');
  })
  // Tambahkan baris ini untuk menangkap error
  .catch(error => {
    console.error("Error mengambil pesan:", error);
    const container = document.getElementById('messageList');
    if(container) container.innerHTML = "<p class='error-msg'>Gagal memuat komentar.</p>";
  });
}

document.addEventListener("DOMContentLoaded", loadMessages);

function showToast(msg,dur=3000){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),dur);}
function scrollSkills(direction){
const container=document.getElementById("skillsGrid");
if(!container) return;
const card=container.querySelector(".skills-card");
const scrollAmount=card ? card.offsetWidth+24 : 260;
container.scrollBy({
left:direction*scrollAmount,
behavior:"smooth"
});
}

/* ============================================
   SCIENTIFIC CALCULATOR - calculator.js
   ============================================ */

// ---- State ----
let currentInput = '';
let lastResult   = null;
let isResult     = false;
let angleMode    = 'DEG';
let openParens   = 0;

// ---- Elemen DOM ----
const displayResult  = document.getElementById('result');
const displayExpr    = document.getElementById('expression');
const angleModeLabel = document.getElementById('angleMode');

// ---- Helper ----
function updateDisplay(value, expr) {
  displayResult.textContent = value;
  displayResult.classList.remove('error');
  if (expr !== undefined) displayExpr.textContent = expr;
}

function showError(msg) {
  displayResult.textContent = msg;
  displayResult.classList.add('error');
}

function prettyPrint(expr) {
  return expr
    .replace(/Math\.PI/g, 'π')
    .replace(/Math\.E/g, 'e')
    .replace(/\*\*/g, '^')
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');
}

// ---- Input angka ----
function inputNumber(num) {
  if (isResult) { currentInput = num; isResult = false; }
  else currentInput += num;
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = currentInput;
  displayResult.classList.remove('error');
}

// ---- Titik desimal ----
function inputDot() {
  const lastNum = currentInput.split(/[\+\-\*\/\(]/).pop();
  if (lastNum.includes('.')) return;
  if (isResult) { currentInput = '0.'; isResult = false; }
  else currentInput = currentInput === '' ? '0.' : currentInput + '.';
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = currentInput;
  displayResult.classList.remove('error');
}

// ---- Operator ----
function inputOperator(op) {
  if (isResult) { currentInput = String(lastResult); isResult = false; }
  if (currentInput === '' && op !== '-') return;
  const lastChar = currentInput.slice(-1);
  if (['+', '-', '*', '/'].includes(lastChar)) currentInput = currentInput.slice(0, -1);
  currentInput += op;
  const opDisplay = { '+': '+', '-': '−', '*': '×', '/': '÷' }[op];
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = opDisplay;
  displayResult.classList.remove('error');
}

// ---- Fungsi: sin, cos, tan, sqrt, log, ln ----
function inputFunction(fn) {
  if (isResult && lastResult !== null) {
    currentInput = fn + '(' + lastResult + ')';
    isResult = false;
  } else {
    currentInput += fn + '(';
    openParens++;
  }
  displayExpr.textContent = currentInput;
  displayResult.textContent = fn + '(';
  displayResult.classList.remove('error');
}

// ---- Pangkat xʸ ----
function inputPower() {
  if (currentInput === '' && lastResult === null) return;
  if (isResult) { currentInput = String(lastResult); isResult = false; }
  currentInput += '**';
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = 'xʸ';
  displayResult.classList.remove('error');
}

// ---- Kuadrat x² ----
function inputSquare() {
  if (isResult && lastResult !== null) {
    currentInput = '(' + lastResult + ')**2';
    isResult = false;
  } else {
    if (currentInput === '') return;
    currentInput = '(' + currentInput + ')**2';
  }
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = 'x²';
  displayResult.classList.remove('error');
}

// ---- Kurung () ----
function inputParenthesis() {
  if (isResult) { currentInput = String(lastResult); isResult = false; }
  if (openParens === 0) { currentInput += '('; openParens++; }
  else { currentInput += ')'; openParens--; }
  displayExpr.textContent = currentInput;
  displayResult.textContent = currentInput;
  displayResult.classList.remove('error');
}

// ---- Konstanta π dan e ----
function inputConstant(c) {
  const map   = { pi: 'Math.PI', e: 'Math.E' };
  const label = { pi: 'π', e: 'e' };
  if (isResult) { currentInput = map[c]; isResult = false; }
  else currentInput += map[c];
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = label[c];
  displayResult.classList.remove('error');
}

// ---- Persen % ----
function inputPercent() {
  if (currentInput === '' && lastResult === null) return;

  if (isResult) {
    const val = parseFloat(lastResult) / 100;
    currentInput  = String(val);
    lastResult    = currentInput;
    displayExpr.textContent   = lastResult + '%';
    displayResult.textContent = currentInput;
    displayResult.classList.remove('error');
    return;
  }

  // Cek apakah ada base + operator sebelum angka terakhir
  // Contoh: "200+50" → base=200, op=+, num=50 → hasil = 200 + (200*50/100) = 300
  const match = currentInput.match(/^(.*)([\+\-\*\/])([^+\-*/]+)$/);
  if (match) {
    const baseExpr = match[1];          // "200"
    const op       = match[2];          // "+"
    const numStr   = match[3];          // "50"
    const base     = parseFloat(baseExpr);
    const num      = parseFloat(numStr);
    if (!isNaN(base) && !isNaN(num)) {
      const pct = (base * num) / 100;
      currentInput = baseExpr + op + pct;
      displayExpr.textContent   = prettyPrint(baseExpr) + op + numStr + '%';
      displayResult.textContent = String(pct);
      displayResult.classList.remove('error');
      return;
    }
  }

  // Tidak ada operator → langsung /100
  const val = parseFloat(currentInput) / 100;
  if (isNaN(val)) return;
  displayExpr.textContent   = currentInput + '%';
  currentInput              = String(val);
  displayResult.textContent = currentInput;
  displayResult.classList.remove('error');
}

// ---- Toggle DEG / RAD ----
function toggleAngle() {
  angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
  angleModeLabel.textContent = angleMode;
}

// ---- AC ----
function clearAll() {
  currentInput = ''; lastResult = null; isResult = false; openParens = 0;
  updateDisplay('0', '');
}

// ---- ⌫ ----
function deleteLast() {
  if (isResult) { clearAll(); return; }
  if      (currentInput.endsWith('Math.PI')) currentInput = currentInput.slice(0, -7);
  else if (currentInput.endsWith('Math.E'))  currentInput = currentInput.slice(0, -6);
  else if (currentInput.endsWith('**'))      currentInput = currentInput.slice(0, -2);
  else {
    const fnMatch = currentInput.match(/(sin|cos|tan|sqrt|log|ln)\($/);
    if (fnMatch) {
      currentInput = currentInput.slice(0, -fnMatch[0].length);
      openParens = Math.max(0, openParens - 1);
    } else {
      const last = currentInput.slice(-1);
      if (last === ')') openParens++;
      if (last === '(') openParens = Math.max(0, openParens - 1);
      currentInput = currentInput.slice(0, -1);
    }
  }
  updateDisplay(currentInput || '0', prettyPrint(currentInput));
}

// ---- Hitung = ----
function calculate() {
  if (currentInput === '') return;

  // Tutup kurung yang belum tertutup
  let expr = currentInput;
  for (let i = 0; i < openParens; i++) expr += ')';
  openParens = 0;

  displayExpr.textContent = prettyPrint(expr) + ' =';

  try {
    // Ganti fungsi ke placeholder aman, lalu kirim sebagai parameter fungsi
    let evalExpr = expr
      .replace(/\bsqrt\(/g, 'Math.sqrt(')
      .replace(/\blog\(/g,  'Math.log10(')
      .replace(/\bln\(/g,   'Math.log(');

    let result;

    if (angleMode === 'DEG') {
      // Ganti sin/cos/tan → fungsi helper konversi DEG→RAD
      evalExpr = evalExpr
        .replace(/\bsin\(/g, '_sin_(')
        .replace(/\bcos\(/g, '_cos_(')
        .replace(/\btan\(/g, '_tan_(');

      const fn = new Function('_sin_', '_cos_', '_tan_', 'Math',
        '"use strict"; return (' + evalExpr + ');'
      );
      result = fn(
        (x) => Math.sin(x * Math.PI / 180),
        (x) => Math.cos(x * Math.PI / 180),
        (x) => Math.tan(x * Math.PI / 180),
        Math
      );
    } else {
      evalExpr = evalExpr
        .replace(/\bsin\(/g, 'Math.sin(')
        .replace(/\bcos\(/g, 'Math.cos(')
        .replace(/\btan\(/g, 'Math.tan(');

      const fn = new Function('Math', '"use strict"; return (' + evalExpr + ');');
      result = fn(Math);
    }

    if (!isFinite(result)) throw new Error('Inf');
    if (isNaN(result))     throw new Error('NaN');

    // Bulatkan nilai yang sangat mendekati nol (floating point artifact)
    // Contoh: cos(90) di JS = 6.12e-17, seharusnya 0
    if (Math.abs(result) < 1e-10) result = 0;

    const formatted = parseFloat(result.toPrecision(10)).toString();
    lastResult   = formatted;
    currentInput = formatted;
    isResult     = true;

    displayResult.textContent = formatted;
    displayResult.classList.remove('error');

  } catch (err) {
    showError('Error');
    currentInput = '';
    isResult     = false;
  }
}

// ---- Keyboard ----
document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9')           inputNumber(e.key);
  else if (e.key === '.')                      inputDot();
  else if (e.key === '+')                      inputOperator('+');
  else if (e.key === '-')                      inputOperator('-');
  else if (e.key === '*')                      inputOperator('*');
  else if (e.key === '/') { e.preventDefault(); inputOperator('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace')              deleteLast();
  else if (e.key === 'Escape')                 clearAll();
  else if (e.key === '(' || e.key === ')')     inputParenthesis();
  else if (e.key === '%')                      inputPercent();
});


/* Active nav */
const secs=document.querySelectorAll('section[id]'),navLks=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{let c='';secs.forEach(s=>{if(scrollY>=s.offsetTop-120)c=s.id;});navLks.forEach(a=>{a.style.color=a.getAttribute('href')==='#'+c?'var(--accent-yellow)':'';});});