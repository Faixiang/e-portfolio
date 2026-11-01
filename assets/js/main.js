/* ============================================================
   e-Portfolio ： 彭靖男 PENG Jing Nan
   CIS222 Individual Assignment · 六頁共用互動腳本
   ------------------------------------------------------------
   互動元件（R5）：
     ① 技能篩選器（skills.html）
     ② 作品燈箱（portfolio.html）
     ③ 卡片點擊閃光（skills / portfolio）
     ④ 作品列群組 hover 編排（portfolio.html）
     ⑤ 自訂游標（portfolio.html，僅桌面）

   導覽列目前頁高亮已改由 assets/js/site.js 負責（.is-here），
   本檔不再重複處理。

   2026-10-23：原 3D 旋轉輪盤已隨首頁改版（page-is-the-object）
   一併廢止 ：： 首頁改用「職位分頁」互動，全站無任何頁面帶
   data-carousel，故 initCarousel 一併移除。
   ============================================================ */

'use strict';

var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;


/* ------------------------------------------------------------
   ① 技能篩選器（skills.html）
   依賴的 hook：data-skill-filter / data-category /
   data-skill-item / data-skill-count / class is-selected
   ：： 這些名字不能改，改了互動元件會直接死掉。
   ------------------------------------------------------------ */
function initSkillFilter() {
  const container = document.querySelector('[data-skill-filter]');
  if (!container) return;

  const buttons = container.querySelectorAll('[data-category]');
  const items = document.querySelectorAll('[data-skill-item]');
  const countEl = document.querySelector('[data-skill-count]');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');

      const chosen = btn.getAttribute('data-category');
      let visible = 0;

      items.forEach(function (item) {
        const match = (chosen === 'all') ||
                      (item.getAttribute('data-category') === chosen);
        item.hidden = !match;
        if (match) visible += 1;
      });

      if (countEl) countEl.textContent = String(visible);
    });
  });
}


/* ------------------------------------------------------------
   ② 作品燈箱（portfolio.html）
   點整列開大圖；點背景、按 Esc、按關閉鈕皆可關。
   work-1~3.jpg 目前不存在，圖片載入失敗時不顯示破圖，
   改顯示「圖片待補」與說明文字。
   ------------------------------------------------------------ */
function initLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox]');
  const overlay = document.querySelector('[data-lightbox-overlay]');
  if (!triggers.length || !overlay) return;

  const overlayImg = overlay.querySelector('img');
  const overlayCaption = overlay.querySelector('[data-lightbox-caption]');
  const closeBtn = overlay.querySelector('[data-lightbox-close]');
  let lastFocused = null;

  function open(src, alt, caption) {
    lastFocused = document.activeElement;

    if (overlayImg) {
      overlayImg.hidden = false;
      overlayImg.removeAttribute('src');
      overlayImg.setAttribute('alt', alt || '');
      // 圖片不存在時不讓使用者看到破圖
      overlayImg.onerror = function () {
        overlayImg.hidden = true;
        if (overlayCaption) {
          overlayCaption.textContent = (caption || '') + '（圖片待補）';
        }
      };
      overlayImg.setAttribute('src', src);
    } else if (overlayCaption) {
      overlayCaption.textContent = (caption || '') + '（圖片待補）';
    }

    if (overlayImg && overlayImg.complete && overlayImg.naturalWidth === 0) {
      overlayImg.hidden = true;
    }

    if (overlayCaption && overlayImg && !overlayImg.hidden) {
      overlayCaption.textContent = caption || '';
    }

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      open(
        trigger.getAttribute('data-lightbox'),
        trigger.getAttribute('data-alt') || '',
        trigger.getAttribute('data-caption') || ''
      );
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) close();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !overlay.hidden) close();
  });
}


/* ------------------------------------------------------------
   ③ 卡片點擊閃光
   用 event delegation，一次綁在 document 上即可涵蓋所有卡片。
   ------------------------------------------------------------ */
function initCardFlash() {
  const FLASH_CLASS = 'is-flash';

  document.addEventListener('click', function (event) {
    const card = event.target.closest('.skillrow, .work');
    if (!card) return;

    card.classList.remove(FLASH_CLASS);
    // 強制重繪，讓同一張卡片被連續點擊時動畫能重新播放
    void card.offsetWidth;
    card.classList.add(FLASH_CLASS);

    card.addEventListener('animationend', function handler() {
      card.classList.remove(FLASH_CLASS);
      card.removeEventListener('animationend', handler);
    });
  });
}


/* ------------------------------------------------------------
   ④ 作品列群組 hover 編排
   游標所在列滿對比，同組其他列轉 --muted。
   不用低透明度 ：： 可讀文字必須維持 4.5:1。
   ------------------------------------------------------------ */
function initWorkHover() {
  const list = document.querySelector('[data-works]');
  if (!list) return;

  const rows = list.querySelectorAll('.work');
  if (!rows.length) return;

  function point(row) {
    list.classList.add('is-pointing');
    rows.forEach(function (r) {
      r.classList.toggle('is-point', r === row);
    });
  }

  function release() {
    list.classList.remove('is-pointing');
    rows.forEach(function (r) { r.classList.remove('is-point'); });
  }

  rows.forEach(function (row) {
    row.addEventListener('mouseenter', function () { point(row); });
    row.addEventListener('mouseleave', release);
    row.addEventListener('focus', function () { point(row); });
    row.addEventListener('blur', release);
  });

  list.addEventListener('mouseleave', release);
}


/* ------------------------------------------------------------
   ⑤ 自訂游標（僅桌面）
   一個跟隨指標的方塊，用 transform 位移，lerp 阻尼。
   觸屏裝置不啟用；prefers-reduced-motion 時停用。
   requestAnimationFrame 僅在指標移動期間運行，靜止即停。
   ------------------------------------------------------------ */
function initCursor() {
  const cursor = document.querySelector('[data-cursor]');
  if (!cursor) return;
  if (REDUCED || !FINE_POINTER) { cursor.remove(); return; }

  const EASE = 0.18;
  let tx = 0, ty = 0;
  let cx = 0, cy = 0;
  let raf = null;

  function apply() {
    cursor.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
  }

  function tick() {
    cx += (tx - cx) * EASE;
    cy += (ty - cy) * EASE;
    apply();

    if (Math.abs(tx - cx) < 0.2 && Math.abs(ty - cy) < 0.2) {
      cx = tx; cy = ty;
      apply();
      raf = null;
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener('pointermove', function (event) {
    tx = event.clientX - 10;
    ty = event.clientY - 10;
    cursor.classList.add('is-on');
    if (raf === null) raf = requestAnimationFrame(tick);
  }, { passive: true });

  document.addEventListener('pointerleave', function () {
    cursor.classList.remove('is-on');
  });
}


document.addEventListener('DOMContentLoaded', function () {
  initSkillFilter();
  initLightbox();
  initCardFlash();
  initWorkHover();
  initCursor();
});
