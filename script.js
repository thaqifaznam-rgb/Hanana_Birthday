/* ======================================================================
   EDIT EVERYTHING YOU NEED RIGHT HERE. Nothing below this CONFIG object
   needs to be touched.
   ====================================================================== */
const CONFIG = {

  // Her name — shown in the big headline
  girlfriendName: "Hanana",

  // Small line above the envelope on the opening screen
  coverTagline: "a little something for you my Anugerah Terindah",

  // Your letter. Leave a blank line between paragraphs to start a new one.
  letter: `Dear Hanana,

I don't think I tell you enough how much you mean to me, so today felt like the right day to put it in writing.

(Write the rest of your letter right here. Talk about a memory you love, something you admire about her, or what you're excited for together. Replace this whole paragraph with your own words.)

Happy birthday. I love you more than these words can hold.

Yours always,
Your Name`,

  // The song file. Keep it in the same folder as this script (or paste a
  // direct link to an mp3 file instead).
  songSrc: "song.mp3",

  // Add as many photos as you like. Files live in the "images" folder.
  // caption is optional — leave it as "" if you don't want one.
  images: [
    { src: "images/1.jpg", caption: "" },
    { src: "images/2.jpg", caption: "" },
    { src: "images/3.jpg", caption: "" },
    { src: "images/4.jpg", caption: "" },
    { src: "images/5.jpg", caption: "" },
    { src: "images/6.jpg", caption: "" }
  ]
};
/* ====================================================================== */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init(){
  document.title = "Happy Birthday, " + CONFIG.girlfriendName;
  document.getElementById('heroName').textContent = "Happy Birthday, " + CONFIG.girlfriendName + "!";
  document.getElementById('coverTagline').textContent = CONFIG.coverTagline;

  buildLetter();
  buildGallery();

  const audio = document.getElementById('bgm');
  audio.src = CONFIG.songSrc;

  if(!reducedMotion){
    spawnPetals(document.getElementById('coverPetals'), 9);
    spawnPetals(document.getElementById('heroPetals'), 6);
  }
}

function buildLetter(){
  const wrap = document.getElementById('letterText');
  const paragraphs = CONFIG.letter.split(/\n\s*\n/);
  paragraphs.forEach(block => {
    const p = document.createElement('p');
    const lines = block.split('\n');
    lines.forEach((line, i) => {
      p.appendChild(document.createTextNode(line));
      if(i < lines.length - 1) p.appendChild(document.createElement('br'));
    });
    wrap.appendChild(p);
  });
}

function buildGallery(){
  const row = document.getElementById('polaroidRow');
  CONFIG.images.forEach(item => {
    const card = document.createElement('div');
    card.className = 'polaroid';

    const photo = document.createElement('div');
    photo.className = 'photo';
    photo.style.backgroundImage = "url('" + item.src + "')";
    card.appendChild(photo);

    const label = document.createElement('div');
    label.className = 'placeholder-label';
    label.innerHTML = 'add your photo here<code>' + item.src + '</code>';
    card.appendChild(label);

    if(item.caption){
      const cap = document.createElement('p');
      cap.className = 'cap';
      cap.textContent = item.caption;
      card.appendChild(cap);
    }

    // detect missing image and show the placeholder instead of a broken icon
    const test = new Image();
    test.onload = () => {};
    test.onerror = () => card.classList.add('empty');
    test.src = item.src;

    row.appendChild(card);
  });
}

function spawnPetals(container, count){
  for(let i = 0; i < count; i++){
    const p = document.createElement('span');
    p.className = 'petal';
    p.innerHTML = '&#10084;';
    p.style.left = Math.random() * 100 + '%';
    p.style.fontSize = (0.6 + Math.random() * 0.8) + 'rem';
    p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    p.style.animationDuration = (7 + Math.random() * 6) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    container.appendChild(p);
  }
}

function triggerConfetti(){
  if(reducedMotion) return;
  const burst = document.getElementById('confettiBurst');
  const colors = ['#d4a847', '#e8b4bc', '#f7efe1', '#9c7222'];
  for(let i = 0; i < 40; i++){
    const c = document.createElement('span');
    c.className = 'confetti-piece';
    c.style.left = Math.random() * 100 + '%';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.setProperty('--rot', (Math.random() * 360 + 280) + 'deg');
    c.style.animationDuration = (2.4 + Math.random() * 1.6) + 's';
    c.style.animationDelay = (Math.random() * 0.4) + 's';
    burst.appendChild(c);
  }
  setTimeout(() => { burst.innerHTML = ''; }, 4500);
}

let opened = false;
function openEnvelope(){
  if(opened) return;
  opened = true;

  // Start the song immediately and synchronously inside the tap.
  // iPhones only allow audio to start this way — never after a delay.
  const audio = document.getElementById('bgm');
  audio.play().then(() => {
    document.getElementById('musicToggle').innerHTML = '&#10074;&#10074;';
    document.getElementById('musicToggle').setAttribute('aria-label','Pause music');
  }).catch(() => {});

  document.getElementById('seal').classList.add('cracking');

  setTimeout(() => {
    document.getElementById('envelopeFlap').classList.add('open');
  }, 350);

  setTimeout(() => {
    document.getElementById('envelopePaper').classList.add('rise');
    triggerConfetti();
  }, 950);

  setTimeout(() => {
    document.getElementById('cover').classList.add('hidden');
  }, 1700);
}

document.getElementById('envelope').addEventListener('click', openEnvelope);
document.getElementById('envelope').addEventListener('keydown', e => {
  if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openEnvelope(); }
});

document.getElementById('musicToggle').addEventListener('click', () => {
  const audio = document.getElementById('bgm');
  const btn = document.getElementById('musicToggle');
  if(audio.paused){
    audio.play().then(() => {
      btn.innerHTML = '&#10074;&#10074;';
      btn.setAttribute('aria-label','Pause music');
    }).catch(() => {});
  } else {
    audio.pause();
    btn.innerHTML = '&#9835;';
    btn.setAttribute('aria-label','Play music');
  }
});

document.getElementById('replayBtn').addEventListener('click', () => {
  const audio = document.getElementById('bgm');
  audio.pause();
  audio.currentTime = 0;
  opened = false;
  document.getElementById('seal').classList.remove('cracking');
  document.getElementById('envelopeFlap').classList.remove('open');
  document.getElementById('envelopePaper').classList.remove('rise');
  document.getElementById('cover').classList.remove('hidden');
  document.getElementById('musicToggle').innerHTML = '&#9835;';
  document.getElementById('musicToggle').setAttribute('aria-label','Play music');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

init();
