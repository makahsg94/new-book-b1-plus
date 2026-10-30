/* ============================================================
   Speakout B1+ Hub — app.js
   SPA router + global audio player + search + progress tracking
   يعتمد على: data.js + manifest.js + pdfviewer.js (ES module)
   ============================================================ */
const DATA = window.SODATA, MF = window.SOMANIFEST;
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => (s||'').replace(/</g,'&lt;');

/* ---------- Icons (inline SVG) ---------- */
const I = {
  logo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 19V5a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v5"/><path d="M4 19a2 2 0 0 1 2-2h10V9"/><path d="M16 9h4v8a2 2 0 0 1-2 2H6"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 19V5a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v5"/><path d="M4 19a2 2 0 0 1 2-2h10V9"/><path d="M16 9h4v8a2 2 0 0 1-2 2H6"/></svg>',
  head:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>',
  prev:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17 5h-2v14h2zM4 6.6v10.8a1 1 0 0 0 1.55.83L13 12 5.55 5.77A1 1 0 0 0 4 6.6z"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M7 5h2v14H7zM20 6.6v10.8a1 1 0 0 1-1.55.83L11 12l7.45-6.23A1 1 0 0 1 20 6.6z"/></svg>',
  film:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M8 5v14M16 5v14M3 12h18" opacity=".7"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',
  layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5" opacity=".8"/><path d="M3 17.5l9 3.5 9-3.5" opacity=".55"/></svg>',
  chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>',
  repeat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M17 3l3 3-3 3M20 6H8a4 4 0 0 0-4 4v1M7 21l-3-3 3-3M4 18h12a4 4 0 0 0 4-4v-1"/></svg>',
  toc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>'
};
const ic = n => I[n] || '';

/* ---------- State (localStorage) ---------- */
const LSK = 'sob1p-state-v1';
let state = { theme:'dark', trackDone:{}, lessonDone:{}, videoDone:{}, rate:1, repeat:'' };
try{ Object.assign(state, JSON.parse(localStorage.getItem(LSK)||'{}')); }catch(e){}
const save = () => { try{ localStorage.setItem(LSK, JSON.stringify(state)); }catch(e){} };

function toast(msg){
  const t = document.createElement('div'); t.className='toast'; t.textContent = msg;
  $('#toasts').appendChild(t); setTimeout(()=>t.remove(), 2800);
}

/* ---------- Data helpers ---------- */
const unitByNum = n => DATA.units.find(u=>u.num===+n);
const isD = lid => /^[1-8]D$/.test(lid);
function tracksFor(uNum, key){
  const arr = MF.audio['u'+uNum] || [];
  if(key === 'VB') return arr.filter(t=>t.kind==='VB');
  if(key === 'MB') return arr.filter(t=>t.kind==='MB');
  if(key === 'RR') return arr.filter(t=>t.kind==='R');
  return arr.filter(t=>t.kind==='lesson' && t.lesson===key);
}
function videosOf(uNum, which){
  let vs = (MF.video['u'+uNum]||[]).map(v=>({ id: v.id, kind: v.id }));
  if(which) vs = vs.filter(v=>v.kind===which);
  return vs;
}
const videoLabel = { vlogs:'BBC Vlog — سؤال الوحدة', street:'BBC Street Interviews — مقابلات الشارع', prog:'BBC Programme — برنامج الوحدة' };

function trackListObj(uNum, tracks){
  return tracks.map(t=>({
    src: `assets/audio/u${uNum}/${t.file}`,
    title: `Audio ${t.tag} — Unit ${uNum}`,
    sub: `${t.lesson} · ${t.tag}`,
    doneKey: `${uNum}-${t.tag}`
  }));
}
function unitProgress(u){
  const lessons = ['1A','1B','1C','1D','RR'];
  const totalTracks = (MF.audio['u'+u.num]||[]).length;
  const vlist = videosOf(u.num);
  const lessonsDone = lessons.filter(l=>state.lessonDone[u.num+'-'+l]).length;
  const tracksDone  = (MF.audio['u'+u.num]||[]).filter(t=>state.trackDone[u.num+'-'+t.tag]).length;
  const vidsDone    = vlist.filter(v=>state.videoDone[u.num+'-'+v.id]).length;
  const done = lessonsDone + tracksDone + vidsDone;
  const total = lessons.length + totalTracks + vlist.length;
  return Math.round(done/Math.max(1,total)*100);
}
const cssVars = u => `style="--c1:${u.color[0]};--c2:${u.color[1]}"`;
const fmtT = s => { if(!isFinite(s)||s<0) return '0:00'; s=Math.floor(s); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); };

/* ---------- Global audio player ---------- */
const Player = {
  q: [], idx: -1, m: null,
  init(){
    this.m = new Audio(); this.m.preload = 'metadata';
    this.ui = $('#pbar'); this.bind();
  },
  bind(){
    const m = this.m;
    m.addEventListener('timeupdate', ()=>{
      $('.seekfill').style.width = ((m.currentTime/(m.duration||1))*100)+'%';
      $('#tcur').textContent = fmtT(m.currentTime);
    });
    m.addEventListener('loadedmetadata', ()=>{ $('#tdur').textContent = fmtT(m.duration); });
    m.addEventListener('ended', ()=>{
      if(state.repeat==='one'){ m.currentTime = 0; m.play(); return; }
      this.next();
    });
    m.addEventListener('play', ()=>{ $('#playIc').innerHTML = I.pause; this.ui.classList.add('playing'); });
    m.addEventListener('pause', ()=>{ $('#playIc').innerHTML = I.play;  this.ui.classList.remove('playing'); });
    $('#pplay').onclick  = ()=> m.paused ? m.play() : m.pause();
    $('#pnext').onclick  = ()=> this.next();
    $('#pprev').onclick  = ()=> this.prev();
    $('#pclose').onclick = ()=>{ m.pause(); this.ui.classList.remove('open'); };
    $('#prepeat').onclick = ()=>{
      state.repeat = state.repeat==='one' ? '' : 'one'; save();
      $('#prepeat').classList.toggle('on', state.repeat==='one');
      toast(state.repeat==='one' ? '🔁 تكرار المسار شغال' : '🔁 التكرار اتقفل');
    };
    $('#pspeed').onchange = e=>{ m.playbackRate = +e.target.value; state.rate = +e.target.value; save(); };
    $('#pvol').oninput = e=>{ m.volume = +e.target.value/100; };
    $('.seektrack').addEventListener('click', e=>{
      const r = e.currentTarget.getBoundingClientRect();
      if(m.duration) m.currentTime = ((e.clientX - r.left)/r.width) * m.duration;
    });
  },
  open(list, i){
    this.q = list; this.idx = Math.max(0, Math.min(i, list.length-1));
    $$('.trk').forEach(el=>el.classList.remove('playing'));
    $('#pbar').classList.add('open');
    this.load();
  },
  load(){
    const t = this.q[this.idx]; if(!t) return;
    this.m.src = t.src; this.m.playbackRate = state.rate || 1;
    $('#ptitle').textContent = t.title;
    $('#psub').textContent = t.sub;
    this.m.play().catch(()=>{});
    const pk = t.doneKey;
    $$('.trk').forEach(el=>{
      el.classList.toggle('playing', el.dataset.pk===pk);
      el.querySelectorAll('.tag-eq').forEach(x=>x.style.opacity = el.dataset.pk===pk ? '1' : '0');
    });
  },
  next(){ if(this.idx < this.q.length-1){ this.idx++; this.load(); } else this.m.pause(); },
  prev(){ if(this.m.currentTime > 3){ this.m.currentTime = 0; return; } if(this.idx>0){ this.idx--; this.load(); } }
};

/* ---------- Search ---------- */
function buildSearchIndex(){
  const out = [];
  DATA.units.forEach(u=>{
    out.push({ kind:'وحدة', t:`Unit ${u.num} — ${u.title}`, ar:u.ar, href:`#/unit/${u.num}` });
    Object.entries(u.lessons).forEach(([lid, l])=>{
      out.push({ kind:'درس', t:`${lid} — ${l.title}`, ar:l.ar, href:`#/unit/${u.num}/${lid}` });
    });
    (MF.audio['u'+u.num]||[]).forEach(tr=>{
      out.push({ kind:'صوت', t:`Audio ${tr.tag}`, ar:`Unit ${u.num} · ${tr.lesson}`, href:`#/unit/${u.num}/${tr.lesson}`, jump:true });
    });
    out.push({ kind:'قاعدة', t:`Grammar Bank`, ar:'بنك القواعد', href:'#/book', page:103 });
    out.push({ kind:'مفردات', t:`Vocabulary Bank`, ar:'بنك المفردات', href:'#/book', page:131 });
  });
  out.push({ kind:'سكربت', t:'Audioscripts PDF', ar:'نصوص الصوتيات', href:'#/scripts' });
  out.push({ kind:'سكربت', t:'Videoscripts PDF', ar:'نصوص الفيديو', href:'#/scripts' });
  return out;
}
const SIDX = buildSearchIndex();
function doSearch(q){
  q = (q||'').trim().toLowerCase();
  const box = $('#sresults');
  if(!q){ box.classList.remove('open'); return; }
  const res = SIDX.filter(x=> x.t.toLowerCase().includes(q) || (x.ar||'').includes(q) || x.t.toLowerCase().startsWith(q)).slice(0,14);
  box.innerHTML = res.length ? res.map((r,i)=>`
    <a class="sr" href="${r.href}" data-page="${r.page||''}">
      <span class="pill k">${r.kind}</span><span><span class="t en">${esc(r.t)}</span> <span style="color:var(--tx3);font-size:.82em">${esc(r.ar||'')}</span></span>
    </a>`).join('') : `<div class="sr">مفيش نتائج لـ "<b>${esc(q)}</b>"</div>`;
  box.classList.add('open');
}

/* ---------- Shared components ---------- */
function audioList(u, key, title, noteEmpty){
  const tracks = key==='opener' ? [] : tracksFor(u.num, key);
  if(!tracks.length){
    return `<div class="aud">
      <div class="audhead"><span class="ico">${I.head}</span> ${title}
      <span class="all" style="color:var(--tx3);font-weight:700">— ${noteEmpty || 'مفيش مسارات صوت للجزء ده في الملفات المرفقة'}</span></div>
    </div>`;
  }
  return `
  <div class="aud" data-audkey="${u.num}-${key}">
    <div class="audhead"><span class="ico">${I.head}</span> ${title}
      <span class="pill">${tracks.length} مسار</span>
      <button class="all" data-playall="1">▶ تشغيل الكل بالترتيب</button>
    </div>
    ${tracks.map((t,i)=>`
      <div class="trk" data-pk="${u.num}-${t.tag}">
        <button class="play" data-play="${i}">${I.play}</button>
        <span class="tag-eq"><i></i><i></i><i></i></span>
        <div class="tt">
          <div class="t1 en">Audio ${t.tag}</div>
          <div class="t2 en">Unit ${u.num} · ${t.lesson}</div>
        </div>
        <label class="dk" title="علّم لما تخلص التمرين">
          <input type="checkbox" data-done="${u.num}-${t.tag}" ${state.trackDone[u.num+'-'+t.tag]?'checked':''}/> خلصت
        </label>
      </div>`).join('')}
  </div>`;
}
function bindAudioList(root, u, key){
  const tracks = key==='opener' ? [] : tracksFor(u.num, key);
  if(!tracks.length) return;
  const list = trackListObj(u.num, tracks);
  $$('.trk [data-play]', root).forEach(btn=>btn.onclick = ()=>Player.open(list, +btn.dataset.play));
  $('[data-playall]', root).onclick = ()=>Player.open(list, 0);
  $$('[data-done]', root).forEach(cb=>cb.onchange = ()=>{
    state.trackDone[cb.dataset.done] = cb.checked; save(); refreshProgress();
  });
}
function videoCard(u, v){
  const done = !!state.videoDone[u.num+'-'+v.id];
  return `
  <div class="vcard" ${cssVars(u)}>
    <button class="vthumb" data-video="${v.id}" data-kind="${v.kind}">
      <span class="bbclb"><b>B</b><b>B</b><b>C</b></span>
      <span class="vb">${I.play}</span>
    </button>
    <div class="vmeta">
      <div class="t en">Unit ${u.num} — ${v.id==='vlogs'?'BBC Vlogs':(v.id==='street'?'BBC Street Interviews':'BBC Programme')}</div>
      <div class="d">${videoLabel[v.kind]||''}
        <span class="pill ${done?'ok':''}" style="margin-inline-start:6px">${done?'✓ اتشاف':'مش لسه'}</span>
      </div>
    </div>
  </div>`;
}
function bindVideoCards(root){
  $$('[data-video]', root).forEach(el=>el.onclick = ()=>{
    const uN = window.__curU ? window.__curU.num : (route.parts[1]||1);
    const u = unitByNum(uN) || DATA.units[0];
    openVideo(u, el.dataset.video, el.dataset.kind);
  });
}
function openVideo(u, id, kind){
  const box = $('#vmodal');
  $('#vvideo').src = `assets/video/u${u.num}/${id}.mp4`;
  $('#vtitle').textContent = `Unit ${u.num} — ${id}`;
  $('#vsub').textContent = videoLabel[kind] || '';
  box.classList.add('open');
  $('#vvideo').play().catch(()=>{});
  $('#vmarkdone').onclick = ()=>{
    const k = u.num+'-'+id;
    state.videoDone[k] = !state.videoDone[k]; save();
    toast(state.videoDone[k] ? '✅ تسجيل الفيديو كمشاف' : 'رجّعت الفيديو مش مشاف');
    refreshProgress();
  };
}

/* ---------- PDF viewer loader ---------- */
let curViewer = null;
async function viewerIn(host, src, start, end, label){
  host.innerHTML = '';
  if(curViewer){ try{ curViewer.destroy(); }catch(e){} curViewer = null; }
  const mod = await import('./pdfviewer.js');
  curViewer = mod.mountPdfViewer(host, { src, start, end, label: label||'' });
  return curViewer;
}

/* ---------- Notes + Quiz (شرح أصلي + تدريب تفاعلي) ---------- */
const notesKey = (u, key) => (['RR','VB','MB'].includes(key) ? u.num + key : key);
function guideHTML(nk){
  const n = (window.SONOTES||{})[nk]; if(!n) return '';
  return `
  <section class="guide">
    <div class="ghead"><span class="gico">🎯</span><div><b>شرح الدرس</b><small>${esc(n.about)}</small></div></div>
    ${n.grammar && n.grammar.length ? `<div class="gitems">${n.grammar.map(g=>`<div class="gitem"><div class="gt">${esc(g[0])}</div><div class="gd">${esc(g[1])}</div></div>`).join('')}</div>` : ''}
    ${n.pron ? `<div class="gpron">🔊 <b>نصيحة نطق:</b> ${esc(n.pron)}</div>` : ''}
    ${n.words && n.words.length ? `<div class="gwt">💡 <span>كلمات مهمة في الموضوع</span><button class="btn tiny ghost" data-hidemean="1">🙈 أخفِ المعاني</button></div>
    <div class="wgrid">${n.words.map(w=>`<div class="wcard"><span class="we en">${esc(w[0])}</span><span class="wa">${esc(w[1])}</span></div>`).join('')}</div>` : ''}
    ${n.steps && n.steps.length ? `<div class="gsteps"><b>📌 خطة دراستك</b><ol>${n.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div>` : ''}
  </section>`;
}
function quizHTML(nk){
  const qs = (window.SOQUIZ||{})[nk]; if(!qs || !qs.length) return '';
  return `
  <section class="quiz">
    <div class="qhead">⚡ تدريب سريع <span class="pill">${qs.length} أسئلة</span><span class="qscore">0 / ${qs.length}</span></div>
    ${qs.map((it,i)=>`
    <div class="qitem" data-i="${i}">
      <div class="qq"><b class="qn en">${i+1}.</b> ${esc(it.q)}</div>
      <div class="qopts">${it.opts.map((o,j)=>`<button class="qopt" data-j="${j}">${esc(o)}</button>`).join('')}</div>
      ${it.x ? `<div class="qx">${esc(it.x)}</div>` : ''}
    </div>`).join('')}
    <div class="qfoot"><button class="btn small ghost" data-retry="1">🔄 حاول تاني</button><span class="qmsg"></span></div>
  </section>`;
}
function bindQuiz(host, nk){
  const box = host.querySelector('.quiz'); if(!box) return;
  const qs = (window.SOQUIZ||{})[nk]; if(!qs) return;
  const scoreEl = box.querySelector('.qscore');
  const msg = box.querySelector('.qmsg');
  let score = 0, doneN = 0;
  const update = ()=>{
    scoreEl.textContent = `${score} / ${qs.length}`;
    if(doneN === qs.length){
      msg.textContent = score === qs.length ? '🏆 ممتاز — كلهم صح!'
        : (score >= qs.length/2 ? '👏 كويس — راجع الغلط وحاول تاني' : '💪 راجع الشرح فوق وحاول تاني');
      msg.classList.add('show');
    }
  };
  box.querySelectorAll('.qitem').forEach(item=>{
    const i = +item.dataset.i;
    item.querySelectorAll('.qopt').forEach(b=>{
      b.onclick = ()=>{
        if(item.dataset.done) return;
        item.dataset.done = '1'; doneN++;
        const pick = +b.dataset.j;
        if(pick === qs[i].a){ b.classList.add('ok'); score++; }
        else { b.classList.add('no'); item.querySelectorAll('.qopt')[qs[i].a].classList.add('ok'); }
        const qx = item.querySelector('.qx'); if(qx) qx.classList.add('show');
        update();
      };
    });
  });
  const rt = box.querySelector('[data-retry]');
  if(rt) rt.onclick = ()=>{
    box.querySelectorAll('.qitem').forEach(item=>{
      delete item.dataset.done;
      item.querySelectorAll('.qopt').forEach(b=>b.classList.remove('ok','no'));
      const qx = item.querySelector('.qx'); if(qx) qx.classList.remove('show');
    });
    score = 0; doneN = 0; msg.classList.remove('show'); update();
  };
  update();
}
function bindWords(host){
  const btn = host.querySelector('[data-hidemean]'); if(!btn) return;
  let hid = false;
  btn.onclick = ()=>{
    hid = !hid;
    host.querySelectorAll('.wcard').forEach(c=>c.classList.toggle('hidemeaning', hid));
    btn.textContent = hid ? '👁 اظهر المعاني' : '🙈 أخفِ المعاني';
  };
}

/* ---------- Views ---------- */
function viewHome(){
  const totalTracks = Object.keys(MF.audio).reduce((s,k)=>s+MF.audio[k].length,0);
  const totalVids   = Object.keys(MF.video).reduce((s,k)=>s+MF.video[k].length,0);
  return `
  <section class="hero">
    <div class="orb" style="width:280px;height:280px;background:#7c5cff;top:-90px;inset-inline-end:8%"></div>
    <div class="orb" style="width:220px;height:220px;background:#3aa7ff;top:45%;inset-inline-end:34%;animation-delay:3s"></div>
    <h1>مركز تعلّم <span class="en"><b>Speakout 3<sup>rd</sup> B1+</b></span></h1>
    <p class="sub">كل حاجة في مكان واحد: شرح عربي مبسّط لكل درس + تدريبات تفاعلية بالنتيجة، صفحات الكتاب الأصلية جوّه الموقع، كل مسارات الصوت مرتبة زي التمارين، فيديوهات BBC وسكربتات — بواجهة عربية عصرية.</p>
    <div class="ctas">
      <a class="btn" href="#/index">${I.toc} الفهرس الكامل</a>
      <a class="btn ghost" href="#/unit/1/1A">${I.play} ابدأ من الدرس الأول</a>
      <a class="btn ghost" href="#/scripts">${I.grid} سكربتات الصوت والفيديو</a>
    </div>
    <div class="stats">
      <div class="stat"><div class="n en" data-count="8">0</div><div class="l">وحدات كاملة</div></div>
      <div class="stat"><div class="n en" data-count="40">0</div><div class="l">دروس A·B·C·D + مراجعات</div></div>
      <div class="stat"><div class="n en" data-count="${totalTracks}">0</div><div class="l">مسار صوتي</div></div>
      <div class="stat"><div class="n en" data-count="${totalVids}">0</div><div class="l">فيديو BBC</div></div>
      <div class="stat"><div class="n en" data-count="136">0</div><div class="l">صفحة PDF جوّه الموقع</div></div>
    </div>
  </section>
  <div class="shead"><h2>الوحدات الثمانية</h2><span class="countpill">اضغط أي وحدة تفتح دروسها</span></div>
  <div class="ugrid">
    ${DATA.units.map(u=>`
    <a class="ucard rvl" ${cssVars(u)} href="#/unit/${u.num}">
      <div class="top">
        <div class="big en">${u.num}</div>
        <div><div class="ut en">${u.title}</div><div class="uar">${u.ar}</div></div>
      </div>
      <div class="q en">VLOGS · ${esc(u.vlog)}</div>
      <div class="meta">
        <span class="pill">${I.head} ${(MF.audio['u'+u.num]||[]).length} صوت</span>
        <span class="pill">${I.film} ${(MF.video['u'+u.num]||[]).length} فيديو</span>
        <span class="pill">${I.book} 12 صفحة</span>
      </div>
      <div class="foot">
        <span class="pill">افتح الوحدة ‹</span>
        <div class="ring" data-ring="${u.num}" style="--p:${unitProgress(u)}"><span>${unitProgress(u)}%</span></div>
      </div>
    </a>`).join('')}
  </div>
  <div class="shead"><h2>إيه اللي جوّه؟</h2></div>
  <div class="fgrid">
    <div class="fcard rvl"><div class="ic">${I.book}</div><h3>الكتاب جوّه الموقع</h3><p>فيوَر PDF تفاعلي يعرض صفحات درسك بالظبط مع تكبير وقفز بين الصفحات.</p></div>
    <div class="fcard rvl"><div class="ic">${I.head}</div><h3>مشغّل صوت ذكي</h3><p>سرعة 0.75x–2x، تكرار المسار، تقديم/رجوع، وعلامة "خلصت" لكل تمرين.</p></div>
    <div class="fcard rvl"><div class="ic">${I.film}</div><h3>فيديوهات BBC</h3><p>الـ Vlog والمقابلات والبرامج لكل وحدة في مشغّل أنيق داخل الصفحة.</p></div>
    <div class="fcard rvl"><div class="ic">${I.grid}</div><h3>بنوك الكتاب</h3><p>Grammar Bank + Vocabulary Banks متاحة كصفحات قابلة للقراءة أونلاين.</p></div>
  </div>
  <div class="shead"><h2>إزاي تذاكر بيه</h2></div>
  <div class="steps">
    <div class="step rvl"><div><div class="tt">افتح الوحدة</div><div class="dd">من الكروت فوق أو من الفهرس — هتلاقي بانر الوحدة وسؤال الـ Vlog وأهداف التعلّم.</div></div></div>
    <div class="step rvl"><div><div class="tt">في كل درس: اقرا + اسمع + شاهد</div><div class="dd">هتلاقي فوق: شرح عربي سريع + كلمات مهمة + تدريب تفاعلي بدرجة؛ وتحت: صفحات الكتاب الأصلية + الصوتيات والفيديو.</div></div></div>
    <div class="step rvl"><div><div class="tt">علّم "خلصت" وشوف النسبة</div><div class="dd">خاتمتا الوحدة بحلقة تقدّم تتحدث لحظيًا مع كل علامة.</div></div></div>
    <div class="step rvl"><div><div class="tt">بعد المراجعة: البنوك + السكربتات</div><div class="dd">كل الملحقات في مكانها من غير بحث في الفولدرات.</div></div></div>
  </div>
  <div class="shead"><h2>ملحقات الكتاب</h2></div>
  <div class="bmgrid">
    ${DATA.backmatter.map(b=>`
    <a class="bmcard rvl" href="#/book" data-page="${b.pages[0]}">
      <div class="ic">${I[b.icon]||I.book}</div>
      <div><div class="t en">${b.title}</div><div class="d">${b.ar} — PDF ${b.pages[0]}–${b.pages[1]}</div></div>
    </a>`).join('')}
    <a class="bmcard rvl" href="#/scripts">
      <div class="ic">${I.toc}</div>
      <div><div class="t en">Audioscripts · Videoscripts</div><div class="d">ملفين سكربت كاملين جوّه الموقع</div></div>
    </a>
  </div>`;
}
function bindHome(){
  $$('[data-count]').forEach(el=>{
    const to = +el.dataset.count; let c = 0;
    const iv = setInterval(()=>{ c += Math.ceil(to/22)||1; if(c>=to){ c=to; clearInterval(iv); } el.textContent = c; }, 30);
  });
}
function viewIndex(){
  return `
  <h1 class="mt2">📚 فهرس الكتاب</h1>
  <p style="color:var(--tx2)">الصفحات بالترقيم المطبوع زي ما هو مكتوب تحت صفحات الكتاب نفسها.</p>
  <div class="tocacc mt2">
    ${DATA.units.map(u=>`
    <section class="tocsec" ${cssVars(u)}>
      <button class="tocbtn"><span class="num en">${u.num}</span>
        <span><span class="en">${u.title}</span> <span style="color:var(--tx3)">· ${u.ar}</span></span>
        <span class="chev">${I.chev}</span></button>
      <div class="tocbody">
        ${['1A','1B','1C','1D','RR'].map(lid=>{
          const l = u.lessons[lid];
          const trs = tracksFor(u.num, lid);
          const vids = isD(lid) || lid==='RR' && false;
          return `<div class="tocrow">
            <div class="lid en">${lid}</div>
            <div>
              <div class="t en"><b>${esc(l.title)}</b> <span style="color:var(--tx3)">· ${l.ar}</span></div>
              <div class="d">مطبوع ${l.pages[0]+1}–${l.pages[1]+1}${l.grammar?` · <b class="en">${esc(l.grammar)}</b>`:''}${l.vocab?` · ${esc(l.vocab)}`:''}</div>
            </div>
            <div class="ac">
              ${trs.length?`<span class="pill">${I.head} ${trs.length}</span>`:''}
              ${isD(lid)?`<span class="pill">${I.film}</span>`:''}
              <a class="btn small" href="#/unit/${u.num}/${lid}">افتح</a>
            </div>
          </div>`;
        }).join('')}
      </div>
    </section>`).join('')}
    <section class="tocsec">
      <button class="tocbtn"><span class="num" style="background:var(--panel2);color:var(--tx)">✎</span>
        <span>ملحقات مابعد-الوحدات <span style="color:var(--tx3)">· Banks</span></span><span class="chev">${I.chev}</span></button>
      <div class="tocbody">
        ${DATA.backmatter.map(b=>`
        <div class="tocrow"><div class="lid en">${b.id.toUpperCase()}</div>
          <div><div class="t en"><b>${b.title}</b> <span style="color:var(--tx3)">· ${b.ar}</span></div><div class="d">PDF ${b.pages[0]}–${b.pages[1]}</div></div>
          <div class="ac"><a class="btn small" href="#/book" data-page="${b.pages[0]}">افتح</a></div></div>`).join('')}
        <div class="tocrow"><div class="lid en">SC</div>
          <div><div class="t en"><b>Audioscripts + Videoscripts</b> <span style="color:var(--tx3)">· السكربتات</span></div><div class="d">ملفان PDF مستقلان</div></div>
          <div class="ac"><a class="btn small" href="#/scripts">افتح</a></div></div>
      </div>
    </section>
  </div>`;
}
function bindIndex(){
  $$('.tocbtn').forEach(b=>b.onclick = ()=>b.closest('.tocsec').classList.toggle('open'));
  $$('[data-page]').forEach(el=>el.addEventListener('click', ()=>{ sessionStorage.setItem('bookjump', el.dataset.page); }));
}

function viewUnit(uN){
  const u = unitByNum(uN); if(!u) return '<h1>الوحدة مش موجودة</h1>';
  const TABNAME = k => k==='opener' ? 'الافتتاحية' : k==='RR' ? 'المراجعة'
    : k==='VB' ? 'بنك المفردات' : k==='MB' ? 'الوساطة' : ('درس ' + k.slice(1));
  const tabs = unitSeq(u).map(k=>({k, l: TABNAME(k)}));
  const seg = route.parts[2];
  const valid = ['opener','RR','VB','MB', ...Object.keys(u.lessons)];
  const active = valid.includes(seg) ? seg : 'opener';
  const prg = unitProgress(u);
  return `
  <section class="banner" ${cssVars(u)}>
    <div class="inum en">${u.num}</div>
    <h1 class="en">${u.title}</h1>
    <div class="bar">${u.ar} · Unit ${u.num} من 8</div>
    <div class="q"><span class="pill">${I.film} VLOGS</span><span class="en">${esc(u.vlog)}</span></div>
    <div class="objchips">${u.objectives.map(o=>`<span class="pill">${esc(o)}</span>`).join('')}</div>
    <div style="display:flex;gap:10px;margin-top:18px;position:relative;align-items:center">
      <div class="ring" data-ring="${u.num}" style="--p:${prg}"><span>${prg}%</span></div>
      <span style="color:var(--tx2);font-weight:700">تقدّمك في الوحدة — بيتحدث مع كل علامة "خلصت"</span>
    </div>
    <div class="contmark">⬇ كل دروس الوحدة متتابعة جوّه الصفحة — كمّل بالسكرول الطبيعي أو اقفز من التبويبات فوق</div>
  </section>
  <div class="tabsx">
    ${tabs.map(t=>{
      const n = tracksFor(u.num, t.k==='opener' ? 'zzz' : t.k).length;
      return `<button class="tab ${active===t.k?'active':''}" data-tab="${t.k}">${t.l}${n?`<span class="mini">${n}🎧</span>`:''}</button>`;
    }).join('')}
  </div>
  <div id="lessonHost"></div>`;
}
function bindUnit(uN){
  const u = unitByNum(uN);
  const seq = unitSeq(u);
  // التبويبات = قفز سلس لقسم الدرس جوّه نفس الصفحة
  $$('.tab').forEach(t=>t.onclick = ()=>goToSection(u, t.dataset.tab));
  renderLesson(uN);
  const want = (route.parts[2] && seq.includes(route.parts[2])) ? route.parts[2] : 'opener';
  $$('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===want));
  // التبويب الفعّال بيتحدث مع السكرول (فحص مباشر مضمون في كل المتصفحات)
  const pickMid = ()=>{
    const mid = window.innerHeight * .5;
    let cur = null;
    $$('#lessonHost .lsec').forEach(s=>{
      const r = s.getBoundingClientRect();
      if(r.top <= mid && r.bottom >= mid) cur = s.dataset.key;
    });
    if(cur) $$('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===cur));
  };
  if(window.__tabSpy) window.removeEventListener('scroll', window.__tabSpy);
  window.__tabSpy = pickMid;
  window.addEventListener('scroll', window.__tabSpy, {passive:true});
  setTimeout(pickMid, 60);
  if(want!=='opener') goToSection(u, want, true);
  else window.scrollTo({top:0, behavior:'instant'});
}
function goToSection(u, key, instant){
  const sec = document.querySelector(`#lessonHost .lsec[data-key="${key}"]`);
  if(!sec){ location.hash = `#/unit/${u.num}/${key}`; return; }
  // إزاحة ثابتة تحت الهيدر الشنطي + التبويبات
  const STICKY = 126;
  setTimeout(()=>{
    const top = sec.getBoundingClientRect().top + window.scrollY - STICKY;
    window.scrollTo({ top: Math.max(0, top), behavior: instant ? 'instant' : 'smooth' });
  }, 35);
}
function unitSeq(u){
  const s = ['opener', ...Object.keys(u.lessons), 'VB'];
  if(tracksFor(u.num,'MB').length) s.push('MB');
  return s;
}
function lessonInner(u, key){
  const l = u.lessons[key];
  const nk = notesKey(u, key);

  let inner = '';
  if(key === 'opener'){
    inner = `
    <div class="lpanel" ${cssVars(u)}>
      <div class="lhead"><span class="lid en">OPENER</span><h3 class="en">${u.title}</h3><span class="ar">${u.ar}</span></div>
      <p style="color:var(--tx2)">صفحة افتتاح الوحدة — العنوان بصورة كبيرة، سؤال الـ BBC Vlog، وأهداف تعلّم الوحدة كاملة.</p>
      <div class="actions">
        <button class="btn small" data-pages="opener">${I.book} افتح صفحة الافتتاحية (PDF ${u.opener})</button>
      </div>
      <div data-viewer-host></div>
      ${audioList(u,'opener','صوتيات الافتتاحية','ما فيش مسار Lead-in في ملفات الصوت المرفقة — الصوتيات تبدأ من Lesson A')}
      <h4 class="mt2">${I.film} BBC Vlog — سؤال الوحدة</h4>
      <div class="vgrid">${videosOf(u.num,'vlogs').map(v=>videoCard(u,v)).join('') || '<span class="pill">مفيش فيديو vlog مرفق</span>'}</div>
    </div>`;
  }
  else if(key === 'RR'){
    inner = `
    <div class="lpanel" ${cssVars(u)}>
      <div class="lhead"><span class="lid en">REVIEW</span><h3 class="en">Unit Review</h3><span class="ar">مراجعة الوحدة ${u.num}</span></div>
      <p style="color:var(--tx2)">صفحة المراجعة: تمارين قواعد ومفردات سريعة + مسار قصّة المسار ${tracksFor(u.num,'RR')[0]?.tag ? `Audio ${tracksFor(u.num,'RR')[0].tag}` : ''} للتقويم النهائي.</p>
      ${guideHTML(u.num+'RR')}${quizHTML(u.num+'RR')}
      <div class="actions"><button class="btn small" data-pages="RR">${I.book} افتح صفحة المراجعة</button></div>
      <div data-viewer-host></div>
      ${audioList(u,'RR','صوتيات المراجعة (R)')}
    </div>`;
  }
  else if(key === 'VB'){
    inner = `
    <div class="lpanel" ${cssVars(u)}>
      <div class="lhead"><span class="lid en">VB</span><h3 class="en">Vocabulary Bank — Unit ${u.num}</h3><span class="ar">صفحات مفردات الوحدة في نهاية الكتاب</span></div>
      <div class="note">بنك المفردات يبدأ من PDF 131 — الأقسام مرتبة على الوحدات؛ استخدم زر القفزة أو الكبّر لاستعراض قسم وحدتك.</div>
      ${guideHTML(u.num+'VB')}
      <div class="actions">
        <button class="btn small" data-pages="VB">${I.book} افتح صفحات الـ Vocabulary Bank</button>
      </div>
      <div data-viewer-host></div>
      ${audioList(u,'VB','مسارات الـ VB لو وحدة', tracksFor(u.num,'VB').length ? '' : 'مفيش مسار VB لو وحدتك في الملفات — الأقسام البصرية في الصفحات')}
    </div>`;
  }
  else if(key === 'MB'){
    inner = `
    <div class="lpanel" ${cssVars(u)}>
      <div class="lhead"><span class="lid en">MB</span><h3 class="en">Mediation — Unit ${u.num}</h3><span class="ar">تمارين الوساطة (مهارات CEFR)</span></div>
      <p style="color:var(--tx2)">مسارات الوساطة المرافقة لهذه الوحدة — تمارين الحوار والاتفاق والتلخيص اللي بتظهر في الكتاب.</p>
      ${guideHTML(u.num+'MB')}
      <div data-viewer-host></div>
      ${audioList(u,'MB','مسارات Mediation (MB)')}
    </div>`;
  }
  else {
    inner = `
    <div class="lpanel" ${cssVars(u)}>
      <div class="lhead"><span class="lid en">${key}</span><h3 class="en">${esc(l.title)}</h3><span class="ar">${esc(l.ar||'')}</span></div>
      <div class="chips">
        ${l.grammar?`<span class="chip">🧠 <b>القاعدة:</b> <span class="en">${esc(l.grammar)}</span></span>`:''}
        ${l.vocab?`<span class="chip">💡 <b>المفردات:</b> <span class="en">${esc(l.vocab)}</span></span>`:''}
        ${l.pron?`<span class="chip">🔊 <b>النطق:</b> <span class="en">${esc(l.pron)}</span></span>`:''}
        ${(l.extras||[]).map(x=>`<span class="chip">✨ ${esc(x)}</span>`).join('')}
      </div>
      ${guideHTML(nk)}${quizHTML(nk)}
      <div class="actions">
        <button class="btn small" data-pages="lesson">${I.book} افتح صفحات الدرس (مطبوع ${l.pages[0]+1}–${l.pages[1]+1})</button>
        ${l.video?`<button class="btn small ghost" data-jumpvid="1">${I.film} الفيديو أسفل</button>`:''}
      </div>
      <div data-viewer-host></div>
      ${l.video?`<h4 class="mt2">${I.film} ${videoLabel[l.video]||''}</h4>
      <div class="vgrid">${videosOf(u.num,l.video).map(v=>videoCard(u,v)).join('')}</div>`:''}
      ${audioList(u,key,`صوتيات Lesson ${key} (بنفس ترتيب التمارين)`)}
    </div>`;
  }

  return inner;
}
function lessonNavHTML(u, key){
  const seq = unitSeq(u);
  const i = seq.indexOf(key);
  const nm = k => k==='opener' ? 'الافتتاحية' : k==='VB' ? 'بنك المفردات' : k==='MB' ? 'الوساطة' : k;
  const prev = i>0 ? {h:`#/unit/${u.num}/${seq[i-1]}`, t:nm(seq[i-1])}
             : (u.num>1 ? {h:`#/unit/${u.num-1}`, t:`الوحدة ${u.num-1}`} : null);
  const next = i<seq.length-1 ? {h:`#/unit/${u.num}/${seq[i+1]}`, t:nm(seq[i+1])}
             : (u.num<8 ? {h:`#/unit/${u.num+1}`, t:`الوحدة ${u.num+1}`} : null);
  return `
  <div class="lnav">
    ${prev?`<a href="${prev.h}"><span>‹ اللي فات</span><b>${prev.t}</b></a>`
          :`<span class="lnv ldis"><b>بداية الوحدة</b></span>`}
    <span class="lnmid en">${i+1} / ${seq.length}</span>
    ${next?`<a class="tx" href="${next.h}"><span>التالي ›</span><b>${next.t}</b></a>`
          :`<span class="lnv ldis"><b>آخر الوحدة</b></span>`}
  </div>`;
}
function renderLesson(uN){
  const u = unitByNum(uN);
  const host = $('#lessonHost'); if(!host) return;
  const seq = unitSeq(u);
  host.innerHTML = seq.map(k=>`
    <section class="lsec" data-key="${k}" id="sec-${u.num}-${k}">${lessonInner(u, k)}${lessonNavHTML(u, k)}</section>`).join('');
  window.__curU = u;
  $$('.lsec', host).forEach(sec=>{
    const key = sec.dataset.key;
    const nk = notesKey(u, key);
    $$('[data-pages]', sec).forEach(b=>b.onclick = ()=>{
      const which = b.dataset.pages;
      let s, e, label;
      if(which==='opener'){ s = u.opener; e = u.opener; label = `Unit ${u.num} opener`; }
      else if(which==='RR'){ s = u.lessons.RR.pages[0]; e = u.lessons.RR.pages[1]; label = `Unit ${u.num} review`; }
      else if(which==='VB'){ s = 131; e = 136; label = 'Vocabulary Bank'; }
      else { const ll = u.lessons[key]; s = ll.pages[0]; e = ll.pages[1]; label = `${key} — ${ll.title}`; }
      viewerIn(sec.querySelector('[data-viewer-host]'), DATA.pdfs.book, s, e, label);
      b.scrollIntoView({ behavior:'smooth', block:'start' });
    });
    bindAudioList(sec, u, key);
    bindQuiz(sec, nk);
    bindWords(sec);
    bindVideoCards(sec);
    $$('[data-jumpvid]', sec).forEach(b=>b.onclick = ()=>sec.querySelector('.vgrid')?.scrollIntoView({behavior:'smooth'}));
  });
  refreshProgress();
}

function viewAudio(){
  const total = Object.keys(MF.audio).reduce((s,k)=>s+MF.audio[k].length,0);
  return `
  <h1 class="mt2">🎧 مكتبة الصوتيات</h1>
  <p style="color:var(--tx2)">كل مسارات الكتاب (${total} مسار) مرتبة وحدة وحدة — الكيو بيشتغل في المشغّل السفلي، وتعرف تقفل عليه من أي صفحة.</p>
  <div class="searchbox" style="margin:14px 0; max-width:420px">${I.search}
    <input id="aflt" placeholder="فلترة: اكتب 2B أو 1.03…"/>
  </div>
  <div id="agrid">${audioGrid('')}</div>`;
}
function audioGrid(flt){
  const f = (flt||'').toUpperCase();
  return DATA.units.map(u=>{
    const tracks = (MF.audio['u'+u.num]||[]).filter(t=>!f || t.tag.toUpperCase().includes(f) || t.lesson.toUpperCase().includes(f));
    if(!tracks.length) return '';
    return `<section class="mt2 lpanel" ${cssVars(u)}>
      <div class="lhead"><span class="badge-unit en">${u.num}</span><h3 class="en">${u.title}</h3><span class="ar">${u.ar}</span></div>
      <div class="aud">
        <div class="audhead"><span class="ico">${I.head}</span> مسارات الوحدة
          <span class="pill">${tracks.length}</span>
          <button class="all" data-playall-u="${u.num}">▶ تشغيل الكل</button></div>
        ${tracks.map(t=>`
        <div class="trk" data-pk="${u.num}-${t.tag}">
          <button class="play" data-u="${u.num}" data-file="${t.file}" data-tag="${t.tag}" data-le="${t.lesson}">${I.play}</button>
          <span class="tag-eq"><i></i><i></i><i></i></span>
          <div class="tt"><div class="t1 en">Audio ${t.tag}</div><div class="t2 en">Unit ${u.num} · ${t.lesson}</div></div>
          <label class="dk"><input type="checkbox" data-done="${u.num}-${t.tag}" ${state.trackDone[u.num+'-'+t.tag]?'checked':''}/> خلصت</label>
        </div>`).join('')}
      </div>
    </section>`;
  }).join('');
}
function bindAudio(){
  const grid = $('#agrid');
  const listOf = uN => trackListObj(uN, MF.audio['u'+uN]||[]);
  $$('.play[data-file]', grid).forEach(b=>b.onclick = ()=>{
    const uN = +b.dataset.u;
    const list = listOf(uN);
    const i = list.findIndex(x=>x.doneKey === `${uN}-${b.dataset.tag}`);
    Player.open(list, i>=0?i:0);
  });
  $$('[data-playall-u]', grid).forEach(b=>b.onclick = ()=>Player.open(listOf(+b.dataset.playallU), 0));
  $$('[data-done]', grid).forEach(cb=>cb.onchange = ()=>{ state.trackDone[cb.dataset.done]=cb.checked; save(); refreshProgress(); });
  $('#aflt').oninput = e=>{
    $('#agrid').innerHTML = audioGrid(e.target.value);
    bindAudio();
  };
}
function viewVideos(){
  return `
  <h1 class="mt2">🎬 مكتبة الفيديو — BBC</h1>
  <p style="color:var(--tx2)">كل فيديوهات ماتيريالك: Vlogs لكل وحدة + Street Interviews و البرامج مربوطة بأرقام الوحدات.</p>
  <div class="vgrid mt2">${DATA.units.map(u=>videosOf(u.num).map(v=>videoCard(u,v)).join('')).join('')}</div>`;
}
function viewScripts(){
  return `
  <h1 class="mt2">📝 سكربتات الصوت والفيديو</h1>
  <p style="color:var(--tx2)">النص الكامل المنقول من ملفات Pearson المرفقة — تشيك على أي حوار سمعته.</p>
  <div class="sctabs">
    <button class="tab active" data-sc="${DATA.pdfs.audioscripts}">Audioscripts (5 صفحات)</button>
    <button class="tab" data-sc="${DATA.pdfs.videoscripts}">Videoscripts (5 صفحات)</button>
  </div>
  <div id="scHost"></div>`;
}
function bindScripts(){
  const load = src => viewerIn($('#scHost'), src, 1, 5, src.split('/').pop());
  $$('.sctabs .tab').forEach(t=>t.onclick = ()=>{
    $$('.sctabs .tab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active'); load(t.dataset.sc);
  });
  load(DATA.pdfs.audioscripts);
}
function viewBook(){
  return `
  <h1 class="mt2">📖 الكتاب الكامل</h1>
  <p style="color:var(--tx2)">الـ PDF الأصلي (136 صفحة) — اكتب رقم صفحة في الأعلى للانتقال السريع، أو سكرول وسيتحمّل lazy.</p>
  <div class="mt2"><div id="bookHost"></div></div>`;
}
function bindBook(){
  const jump = +(sessionStorage.getItem('bookjump')||103);
  sessionStorage.removeItem('bookjump');
  viewerIn($('#bookHost'), DATA.pdfs.book, jump, 136, 'student-book.pdf — الكتاب كامل');
}

/* ---------- Router ---------- */
let route = { name:'home', parts:[] };
function parseHash(){
  const h = location.hash.replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  route = { name: parts[0] || 'home', parts };
}
function nav(){
  parseHash();
  if(curViewer){ try{ curViewer.destroy(); }catch(e){} curViewer = null; }
  const v = $('#view');
  const app = $('#view');
  switch(route.name){
    case '': case 'home': v.innerHTML = viewHome(); bindHome(); break;
    case 'index': v.innerHTML = viewIndex(); bindIndex(); break;
    case 'unit': {
      const uN = +route.parts[1];
      v.innerHTML = viewUnit(uN); bindUnit(uN); break;
    }
    case 'audio': v.innerHTML = viewAudio(); bindAudio(); break;
    case 'videos': case 'video': v.innerHTML = viewVideos(); window.__curU=null; bindVideoCards(v); break;
    case 'scripts': v.innerHTML = viewScripts(); bindScripts(); break;
    case 'book': v.innerHTML = viewBook(); bindBook(); break;
    default: v.innerHTML = `<h1 class="mt2">404</h1><p>الصفحة دي مش موجودة — <a class="btn small" href="#/">الرئيسية</a></p>`;
  }
  // nav active state
  $$('.navlinks a').forEach(a=>a.classList.toggle('active', (a.dataset.r||'')===route.name ||
    (route.name==='unit' && a.dataset.r==='index')));
  if(route.name==='unit'){
    const u = unitByNum(+route.parts[1]);
    if(u) $$('.side .unitlink').forEach(a=>a.classList.toggle('active', a.dataset.un===String(u.num)));
  }
  revealInit();
  if(route.name!=='unit') window.scrollTo({top:0, behavior:'instant'});
}

/* ---------- Progress + reveal ---------- */
function refreshProgress(){
  DATA.units.forEach(u=>{
    const p = unitProgress(u);
    $$(`[data-ring="${u.num}"]`).forEach(r=>{ r.style.setProperty('--p', p); const s=r.querySelector('span'); if(s) s.textContent = p+'%'; });
    const side = $(`.side .unitlink[data-un="${u.num}"] .prg`); if(side) side.textContent = p+'%';
  });
}
let revIO = null;
function revealInit(){
  if(revIO) revIO.disconnect();
  revIO = new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); revIO.unobserve(e.target); }
  }), { rootMargin:'-20px' });
  $$('.rvl:not(.in)').forEach(el=>revIO.observe(el));
}

/* ---------- Sidebar ---------- */
function buildSidebar(){
  const side = $('.side');
  side.innerHTML = `
  <h5>الوحدات</h5>
  ${DATA.units.map(u=>`
    <a class="unitlink" data-un="${u.num}" ${cssVars(u)} href="#/unit/${u.num}">
      <span class="num en">${u.num}</span><span class="vs en">${u.title}</span>
      <span class="prg">${unitProgress(u)}%</span></a>`).join('')}
  <h5>مكتبات</h5>
  <a class="unitlink" href="#/audio"><span class="num" style="background:var(--panel2)">🎧</span><span class="vs">مكتبة الصوت</span></a>
  <a class="unitlink" href="#/videos"><span class="num" style="background:var(--panel2)">🎬</span><span class="vs">مكتبة الفيديو</span></a>
  <a class="unitlink" href="#/scripts"><span class="num" style="background:var(--panel2)">📝</span><span class="vs">السكربتات</span></a>
  <a class="unitlink" href="#/book"><span class="num" style="background:var(--panel2)">📖</span><span class="vs">الكتاب كامل</span></a>
  <a class="unitlink" href="#/index"><span class="num" style="background:var(--panel2)">📚</span><span class="vs">فهرس الكتاب</span></a>`;
}

/* ---------- Boot ---------- */
function boot(){
  document.documentElement.dataset.theme = state.theme || 'dark';
  $('#themeBtn').innerHTML = (state.theme||'dark')==='dark' ? I.sun : I.moon;
  $('#themeBtn').onclick = ()=>{
    state.theme = state.theme==='dark' ? 'light' : 'dark'; save();
    document.documentElement.dataset.theme = state.theme;
    $('#themeBtn').innerHTML = state.theme==='dark' ? I.sun : I.moon;
  };
  const si = $('#searchIn');
  si.addEventListener('input', ()=>doSearch(si.value));
  si.addEventListener('focus', ()=>doSearch(si.value));
  document.addEventListener('click', e=>{
    if(!e.target.closest('.searchwrap')) $('#sresults').classList.remove('open');
  });
  $('#sresults').addEventListener('click', e=>{
    const a = e.target.closest('a.sr'); if(!a) return;
    if(a.dataset.page) sessionStorage.setItem('bookjump', a.dataset.page);
    $('#sresults').classList.remove('open'); si.value='';
  });
  // keyboard
  document.addEventListener('keydown', e=>{
    if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); si.focus(); }
    if(e.target.matches('input,textarea,select')) return;
    const open = $('#pbar').classList.contains('open');
    if(e.code==='Space' && open){ e.preventDefault(); Player.m.paused ? Player.m.play() : Player.m.pause(); }
    if(e.code==='ArrowRight' && open) Player.m.currentTime = Math.max(0, Player.m.currentTime-5);
    if(e.code==='ArrowLeft'  && open) Player.m.currentTime = Math.min(Player.m.duration||9e9, Player.m.currentTime+5);
    if(e.key==='Escape'){
      $('#vmodal').classList.remove('open'); $('#vvideo').pause();
      $('#sresults').classList.remove('open');
    }
  });
  // video modal
  $('#vclose').onclick = ()=>{ $('#vvideo').pause(); $('#vmodal').classList.remove('open'); };
  $('#vmodal').addEventListener('click', e=>{
    if(e.target.id==='vmodal'){ $('#vvideo').pause(); $('#vmodal').classList.remove('open'); }
  });
  // sidebar toggle (mobile)
  $('#menuBtn').onclick = ()=>$('.side').classList.add('open');
  $('#sideClose').onclick = ()=>$('.side').classList.remove('open');
  document.addEventListener('click', e=>{
    const side = $('.side');
    if(side.classList.contains('open') && !e.target.closest('.side') && !e.target.closest('#menuBtn')) side.classList.remove('open');
  });
  // player init
  Player.init();
  $('#prepeat').classList.toggle('on', state.repeat==='one');
  if(state.rate) $('#pspeed').value = state.rate;
  // go
  buildSidebar();
  window.addEventListener('hashchange', nav);
  nav();
  refreshProgress();
  console.log('%cSpeakout B1+ Hub','background:#4a7dff;color:#fff;padding:2px 8px;border-radius:4px','جاهز ✅');
}
window.addEventListener('error', e=>console.error('App error:', e.message));
boot();
