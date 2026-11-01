/* ============================================================
   site.js ： 六頁共用腳本
   ------------------------------------------------------------
   ① 導覽標記：為當前頁的連結加 class「is-here」
      （依 aria-current 或檔名，兩種來源都支援）

   ② 進場動效：依 data-rise-as 分流，進入視窗時分層進場
      ── 為什麼放在這裡 ──
      提示詞 §6.2 寫 site.js「只做一件事」（導覽標記），但 §8.2
      要求每一頁都 still-page 歸零（≥16 個元素真的在動）。六頁若只有
      導覽標記，就沒有任何東西會動，§8.2 必然不過。
      進場邏輯放全站共用腳本裡是唯一不需要新增第三個檔案的解法，
      故併入本檔；若決策層要拆成獨立檔案，把 initRise 整段搬走即可。

   退路：隱藏狀態只寫在 .js 之下；無 JS 或不支援
   IntersectionObserver 時，全部元素直接顯示。
   ============================================================ */

'use strict';

/* ---------- ① 導覽標記 ---------- */
function markHere() {
  var file = (window.location.pathname.split('/').pop() || 'index.html').split('#')[0];
  if (!file) file = 'index.html';

  document.querySelectorAll('.masthead__links a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('#')[0];
    if (href === file) {
      link.classList.add('is-here');
      link.setAttribute('aria-current', 'page');
    }
  });
}


/* ---------- ② 進場動效 ---------- */
function initRise() {
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-rise]'));
  if (!items.length) return;

  // 不支援 IntersectionObserver 就直接顯示，不做半套動畫
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  // 錯開步長與基準延遲由 CSS 提供（--step / --base），
  // 同一父層內的多個 data-rise 依序錯開，跨父層各自獨立計數。
  var seen = new Map();

  items.forEach(function (el) {
    var parent = el.parentElement;
    var indexInGroup = seen.get(parent) || 0;
    seen.set(parent, indexInGroup + 1);

    var cs = getComputedStyle(el);
    var step = parseFloat(cs.getPropertyValue('--step')) || 0;
    var base = parseFloat(cs.getPropertyValue('--base')) || 0;

    el.style.setProperty('--d', (base + indexInGroup * step) + 'ms');
  });

  // threshold 用 0 而非 0.1：wipe 類型的初始狀態只留 2px 窄條，
  // 面積遠不足 10%，用 0.1 會永遠等不到進場。
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });

  items.forEach(function (el) { observer.observe(el); });
}


document.addEventListener('DOMContentLoaded', function () {
  markHere();
  initRise();
});
