/* ============================================================
   PDF.js page-range viewer component (lazy + sequential + zoom)
   Usage: mountPdfViewer(containerEl, {src, start, end, label})
   ============================================================ */
import * as pdfjsLib from '../assets/vendor/pdfjs/pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/vendor/pdfjs/pdf.worker.min.mjs';

const docs = new Map(); // src -> Promise<pdf document>
function getDoc(src){
  if(!docs.has(src)){
    docs.set(src, pdfjsLib.getDocument({ url: src }).promise);
  }
  return docs.get(src);
}

class PdfView {
  constructor(scrollEl, opts){
    this.scroll = scrollEl;
    this.src = opts.src; this.start = opts.start; this.end = opts.end;
    this.zoom = 1; this.queue = []; this.busy = false;
    this.pages = []; this.doc = null; this.ready = this.init();
  }
  async init(){
    try { this.doc = await getDoc(this.src); }
    catch(e){
      this.scroll.innerHTML = '<div class="pvload">تعذّر تحميل ملف PDF — شغّل الهَب عن طريق Start-Website.bat فيوضّع السيرفر المحلي.</div>';
      return;
    }
    const sp = document.createElement('div');
    this.scroll.innerHTML = '';
    this.scroll.appendChild(sp);
    const mountRoot = sp;
    if(this.start > this.doc.numPages){
      mountRoot.innerHTML = '<div class="pvload">نطاق الصفحات طعّر صفحة؟ غير موجود في الملف.</div>';
      return;
    }
    this.pages = [];
    for(let p = this.start; p <= Math.min(this.end, this.doc.numPages); p++){
      const pg = document.createElement('div');
      pg.className = 'pvpage'; pg.dataset.pstate = 'wait'; pg.dataset.page = p;
      pg.innerHTML = `<canvas></canvas><div class="plabel">صفحة ${p} (مطبوع: ${p+1})</div>`;
      mountRoot.appendChild(pg);
      this.pages.push(pg);
    }
    const ioLazy = new IntersectionObserver(es=>{
      for(const en of es) if(en.isIntersecting) this.mark(en.target);
    }, { root: null, rootMargin: '700px 0px' });
    this.pages.forEach(p=>ioLazy.observe(p));

    const ioCur = new IntersectionObserver(es=>{
      for(const en of es) if(en.isIntersecting){
        const cur = en.target.dataset.page;
        const inp = this.scroll.closest('.pvwrap')?.querySelector('.pjump');
        if(inp && document.activeElement !== inp) inp.value = cur;
      }
    }, { root: null, threshold: .45 });
    this.pages.forEach(p=>ioCur.observe(p));
  }
  mark(pageEl){
    if(pageEl.dataset.pstate !== 'wait') return;
    pageEl.dataset.pstate = 'queued';
    this.queue.push(pageEl);
    this.pump();
  }
  async pump(){
    if(this.busy) return; this.busy = true;
    while(this.queue.length){
      const pageEl = this.queue.shift();
      if(!pageEl.isConnected) continue;
      try{
        const page = await this.doc.getPage(+pageEl.dataset.page);
        const base = page.getViewport({ scale: 1 });
        const wrapW = (this.scroll.clientWidth || 800) - 24;
        const scale = Math.min(2.6, Math.max(.3, (wrapW / base.width) * this.zoom));
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const vp = page.getViewport({ scale: scale * dpr });
        const canvas = pageEl.querySelector('canvas');
        canvas.width = Math.floor(vp.width); canvas.height = Math.floor(vp.height);
        await page.render({ canvasContext: canvas.getContext('2d', { alpha: false }), viewport: vp }).promise;
        pageEl.dataset.pstate = 'done';
      }catch(e){
        pageEl.dataset.pstate = 'error';
        console.warn('page render failed', e);
      }
    }
    this.busy = false;
  }
  rerender(){
    this.pages?.forEach(p=>{
      if(p.dataset.pstate === 'done'){
        if(p.querySelector('canvas')) p.querySelector('canvas').width = 0;
        p.dataset.pstate = 'wait'; this.mark(p);
      }
    });
  }
  setZoom(z){ this.zoom = Math.min(2.6, Math.max(.5, z)); this.rerender(); }
  // فحص تقارب الصفحات من الشاشة — مسار بديل مضمون بجانب المراقبة بالتقاطع
  sweep(){
    if(!this.pages) return;
    const vh = window.innerHeight, margin = 900;
    this.pages.forEach(p=>{
      if(p.dataset.pstate !== 'wait') return;
      const r = p.getBoundingClientRect();
      if(r.top < vh + margin && r.bottom > -margin) this.mark(p);
    });
  }
  go(page){
    const t = this.pages?.find(p=>+p.dataset.page === page);
    if(t) t.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  cur(){ return +(this.scroll.closest('.pvwrap')?.querySelector('.pjump')?.value || this.start); }
  next(){ this.go(Math.min(this.cur() + 1, this.end)); }
  prev(){ this.go(Math.max(this.cur() - 1, this.start)); }
}

export function mountPdfViewer(container, opts){
  const { src, start, end, label } = opts;
  container.classList.add('pvwrap');
  container.innerHTML = `
    <div class="pvtool">
      <div class="fname"><b>📄 PDF</b><span class="en">${label || 'student-book.pdf'}</span></div>
      <button class="vbtn" data-act="prev" title="الصفحة اللي قبل">‹ قب</button>
      <input class="pjump" type="number" value="${start}" min="1" max="${end}" title="رقم صفحة PDF"/>
      <span class="rage">/ ${end}</span>
      <button class="vbtn" data-act="next" title="الصفحة اللي بعد">تالي ›</button>
      <button class="vbtn" style="margin-inline-start:auto" data-act="zin"  title="كبّر الصفحات">＋</button>
      <button class="vbtn" data-act="zout" title="صغّر الصفحات">－</button>
      <button class="vbtn" data-act="fit"   title="رجوع للحجم الافتراضي">ملء العرض</button>
      <button class="vbtn" data-act="full">↗ الكتاب كامل</button>
    </div>
    <div class="pvscroll"><div class="pvload"><div class="spin"></div><span>جاري تحديث الكتاب …</span></div></div>`;
  const scroll = container.querySelector('.pvscroll');
  const view = new PdfView(scroll, { src, start, end });
  const tool = container.querySelector('.pvtool');
  tool.addEventListener('click', e=>{
    const act = e.target.closest('[data-act]')?.dataset.act;
    if(!act) return;
    if(act === 'prev') view.prev();
    else if(act === 'next') view.next();
    else if(act === 'zin') view.setZoom(view.zoom + .25);
    else if(act === 'zout') view.setZoom(view.zoom - .25);
    else if(act === 'fit') view.setZoom(1);
    else if(act === 'full') window.open(src, '_blank');
  });
  tool.querySelector('.pjump').addEventListener('change', e=>{
    const v = Math.max(1, Math.min(end, +e.target.value || start)) ;
    e.target.value = v; view.go(v);
  });
  const onW = () => view.rerender();
  const onScroll = () => view.sweep();
  window.addEventListener('resize', onW);
  window.addEventListener('scroll', onScroll, {passive:true});
  view.sweep();
  return { view, destroy(){
    window.removeEventListener('resize', onW);
    window.removeEventListener('scroll', onScroll);
  } };
}
