/* ============================================================
   e-Portfolio — 彭靖男 PENG Jing Nan
   CIS222 Individual Assignment · 全站互動腳本
   ------------------------------------------------------------
   互動元件（R5）：
     ① 技能篩選器（skills.html）
     ② 作品燈箱（portfolio.html）
     ③ 導覽列目前頁高亮（全站）
     ④ Hamburger 展開／收合（全站，mobile-first）

     ⑤ 卡片點擊閃光（全站）
     ⑥ 3D 旋轉輪盤（僅首頁）
   ============================================================ */

'use strict';


/* ------------------------------------------------------------
   ③ 導覽列目前頁高亮
   依當前檔名自動標記，不需在每頁手動維護。
   ------------------------------------------------------------ */
function markActiveNav() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav__link').forEach(function (link) {
    if (link.getAttribute('href') === currentFile) {
      link.classList.add('is-active');
    }
  });
}


/* ------------------------------------------------------------
   ④ Hamburger 展開／收合
   ============================================================ */
function initNavToggle() {
  const toggle = document.querySelector('.nav__toggle');
  const list = document.querySelector('.nav__list');
  if (!toggle || !list) return;

  toggle.addEventListener('click', function () {
    const opened = list.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(opened));
  });

  // 視窗放大到桌面尺寸時，收起狀態必須清除，
  // 否則窄螢幕收起後放大，選單會卡在不可見狀態。
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
      list.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ------------------------------------------------------------
   ① 技能篩選器（skills.html）
   ============================================================ */
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
   點縮圖開大圖；點背景、按 Esc、按關閉鈕皆可關閉。
   ============================================================ */
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
      overlayImg.setAttribute('src', src);
      overlayImg.setAttribute('alt', alt);
    }
    if (overlayCaption) overlayCaption.textContent = caption || '';
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
   E 卡片點擊閃光
   用 event delegation，一次綁在 document 上即可涵蓋所有卡片。
   ============================================================ */
function initCardFlash() {
  const FLASH_CLASS = 'is-flash';

  document.addEventListener('click', function (event) {
    const card = event.target.closest('.card, .skillrow, .work');
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
   ⑤ 3D 旋轉輪盤（僅首頁）
   ------------------------------------------------------------
   與「能力輪盤」原檔的差異：
     · 滑鼠與觸控統一為一組處理函式，並補上鍵盤操作（可及性）
     · 拖曳結束後自動吸附到最近的卡片，避免歪著停住
     · 加入指標點，可直接跳至指定卡片
     · 指標點與is-front 狀態隨旋轉同步更新
   ------------------------------------------------------------ */
const CARD_STEP = 360 / 6;   // 六張卡，每張間隔 60 度
let carouselAngle = 0;
let carouselTimer = null;

function initCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const cards = carousel.querySelectorAll('.carousel__card');
  const dots = document.querySelectorAll('.carousel__dot');
  const cardCount = cards.length;
  if (!cardCount) return;

  // 若卡片數不是 6，重新計算間隔
  const step = 360 / cardCount;

  function setAngle(angle) {
    carousel.style.transform = 'rotateY(' + angle + 'deg)';

    // 卡片 i 自身的角度是 i*step，要讓它正對前方（0° 方向），
    // 輪盤必須自轉 -i*step。因此反推目前正前方的卡片：
    //   front ≡ -angle / step  (mod cardCount)
    const norm = ((angle % 360) + 360) % 360;
    const front = (cardCount - Math.round(norm / step)) % cardCount;

    cards.forEach(function (c, i) {
      c.classList.toggle('is-front', i === front);
    });
    dots.forEach(function (d, i) {
      d.classList.toggle('is-active', i === front);
    });
  }

  // 讓指定卡片转到正前方
  function rotateTo(cardIndex) {
    carouselAngle = -cardIndex * step;
    setAngle(carouselAngle);
  }

  // --- 指標點 ---
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      // 同樣先停止自動旋轉，否則會干擾切換動畫
      stopAuto();
      rotateTo(i);
      setTimeout(startAuto, 700);
    });
  });

  // --- 拖曳（滑鼠 + 觸控共用） ---
  let dragging = false;
  let lastX = 0;

  function onStart(x) {
    dragging = true;
    lastX = x;
    stopAuto();
  }

  function onMove(x) {
    if (!dragging) return;
    const delta = (x - lastX) * 0.4;
    carouselAngle += delta;
    lastX = x;
    setAngle(carouselAngle);
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    // 先停止自動旋轉，否則吸附加動畫進行的 0.6 秒內
    // 自動旋轉又會疊加角度，導致吸附失敗。
    stopAuto();
    // 自動吸附：對齊到最近的卡片刻度（負值表示反向轉向正前方）
    const snapped = -Math.round(-carouselAngle / step) * step;
    carouselAngle = snapped;
    setAngle(carouselAngle);
    // 延後恢復自動旋轉，讓吸附動畫先完成
    setTimeout(startAuto, 700);
  }

  carousel.addEventListener('mousedown', function (e) { onStart(e.clientX); });
  window.addEventListener('mousemove', function (e) { onMove(e.clientX); });
  window.addEventListener('mouseup', onEnd);

  carousel.addEventListener('touchstart', function (e) {
    e.preventDefault();
    onStart(e.touches[0].clientX);
  }, { passive: false });
  window.addEventListener('touchmove', function (e) {
    if (dragging) e.preventDefault();
    onMove(e.touches[0].clientX);
  }, { passive: false });
  window.addEventListener('touchend', onEnd);

  // --- 鍵盤操作（可及性：原檔缺此功能） ---
  carousel.setAttribute('tabindex', '0');
  carousel.setAttribute('role', 'group');
  carousel.setAttribute('aria-label', '內容導覽輪盤，使用左右方向鍵切換');

  carousel.addEventListener('keydown', function (e) {
    // 取得目前正前方的卡片索引
    const current = (cardCount - Math.round((((carouselAngle % 360) + 360) % 360) / step)) % cardCount;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stopAuto();
      rotateTo((current + cardCount - 1) % cardCount);
      setTimeout(startAuto, 700);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stopAuto();
      rotateTo((current + 1) % cardCount);
      setTimeout(startAuto, 700);
    }
  });

  // --- 自動旋轉（閒置時）---
  function startAuto() {
    if (carouselTimer) clearInterval(carouselTimer);
    carouselTimer = setInterval(function () {
      carouselAngle += 0.18;
      setAngle(carouselAngle);
    }, 50);
  }

  function stopAuto() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  // 指標點 hover 時暫停自動旋轉，便於點擊
  dots.forEach(function (dot) {
    dot.addEventListener('mouseenter', stopAuto);
    dot.addEventListener('mouseleave', startAuto);
  });

  setAngle(0);
  startAuto();
}


/* ------------------------------------------------------------
   啟動
   每個函式都會先確認對應元素存在，
   因此同一份 main.js 可以安全地被全部 7 個頁面共用。
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function () {
  markActiveNav();
  initNavToggle();
  initSkillFilter();
  initLightbox();
  initCardFlash();
  initCarousel();
});