/* ============================================================
   index.html 專用腳本
   ------------------------------------------------------------
   ① 職位分頁：切換同一份檔案的三種讀法（互動元件）
   ② 進場動效：六種進場方式，依 data-rise-as 分流（§4.3）
   ③ 紙張材質層：2D canvas 畫紙（§4.7）
   ④ 指標傾斜：卡片跟隨指標 ±2°，lerp 阻尼

   §4.7 架構鐵律：canvas 只畫材質，所有文字、按鈕、連結都在 DOM。
   文字一個都不畫進 canvas ：： canvas 內的字不可選取、不可搜尋、
   螢幕閱讀器讀不到、縮放會模糊。

   退路：canvas 不可用時卡片退回純 CSS 版本（--paper 底色 + dotted
   打孔邊）；無 JS 時內容完整可讀。
   ============================================================ */

'use strict';

var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- ① 職位分頁 ---------- */
function initRoleTabs() {
  var tabs = document.querySelectorAll('[data-role-btn]');
  var panels = document.querySelectorAll('[data-role-panel]');
  if (!tabs.length || !panels.length) return;

  function select(key) {
    tabs.forEach(function (tab) {
      tab.setAttribute('aria-selected', String(tab.getAttribute('data-role-btn') === key));
    });
    panels.forEach(function (panel) {
      panel.classList.toggle('is-on', panel.getAttribute('data-role-panel') === key);
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      select(tab.getAttribute('data-role-btn'));
    });

    // 方向鍵在分頁間移動，符合 tablist 的鍵盤慣例
    tab.addEventListener('keydown', function (event) {
      var next = null;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (next === null) return;
      event.preventDefault();
      tabs[next].focus();
      select(tabs[next].getAttribute('data-role-btn'));
    });
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


/* ---------- ③ 紙張材質層：2D canvas（§4.7） ---------- */

/* 讀 CSS 權杖，canvas 永遠跟著 :root 走，不會和樣式表脫節 */
function readToken(el, name) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

/* 把 #rrggbb 乘一個係數，用來做標籤突出塊那種「同一張紙的深一階」 */
function shade(hex, k) {
  var m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  var n = parseInt(m[1], 16);
  return 'rgb(' +
    Math.round(((n >> 16) & 255) * k) + ',' +
    Math.round(((n >> 8) & 255) * k) + ',' +
    Math.round((n & 255) * k) + ')';
}

/* 纖維紋理：離屏 256×256 噪點，pattern 只生成一次 */
function makeFiberPattern(ctx) {
  var off = document.createElement('canvas');
  off.width = 256;
  off.height = 256;
  var octx = off.getContext('2d');
  if (!octx) return null;

  var img = octx.createImageData(256, 256);
  var d = img.data;
  for (var i = 0; i < d.length; i += 4) {
    var v = 176 + Math.floor(Math.random() * 72);
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v - 6;
    d[i + 3] = 255;
  }
  octx.putImageData(img, 0, 0);
  return ctx.createPattern(off, 'repeat');
}

/*
   每個 [data-paper] 元素都會得到一層紙的材質：
     data-paper-fill     canvas 畫出不透明的紙本體（CSS 底色同時退場）
     data-paper-tab      額外畫左上方的標籤突出塊
     data-paper-shadow   額外畫紙下的接觸陰影
     （三者都不加）      canvas 只在 CSS 的紙上疊一層纖維紋理

   首屏卡片用 fill + tab + shadow：紙整張由 canvas 畫，
   打孔處用 destination-out 挖掉，底下的桌面影片直接透出來。
   信紙是撕下來的一頁，沒有標籤也沒有投影，而且 CSS 底色必須留著
   ：：靜態分析看不到 canvas 畫的紙，底色一撤 analyses 就會把這頁
   判成「透明區塊上放深色字」（對比 1:1）。
*/
function initPaper() {
  var sheets = Array.prototype.slice.call(document.querySelectorAll('[data-paper]'));
  if (!sheets.length) return;

  sheets.forEach(function (sheet) {
    var canvas = sheet.querySelector('[data-paper-canvas]');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    // canvas 不可用 → 隱藏它，退回純 CSS 版本（--paper 底色 + dotted 打孔邊）
    if (!ctx) {
      canvas.hidden = true;
      return;
    }

    var pattern = makeFiberPattern(ctx);
    var wantFill = sheet.hasAttribute('data-paper-fill');
    var wantTab = sheet.hasAttribute('data-paper-tab');
    var wantShadow = sheet.hasAttribute('data-paper-shadow');

    function paint() {
      var rect = sheet.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // devicePixelRatio 上限 2
      var dpr = Math.min(window.devicePixelRatio || 1, 2);

      var cssW = rect.width;
      var paperH = rect.height;
      var cssH = wantShadow ? paperH + 28 : paperH;

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      // 紙色直接取自 --paper 權杖
      var paper = readToken(sheet, '--paper') || '#edece6';

      /* ④ 接觸陰影：紙張下方一層柔化橢圓，靜止時保留。
         這是本系統唯一允許的靜止陰影：它代表真實物件落在桌面上的投影。 */
      if (wantShadow) {
        var sh = ctx.createRadialGradient(cssW / 2, paperH, 0, cssW / 2, paperH, cssW * 0.46);
        sh.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
        sh.addColorStop(0.6, 'rgba(0, 0, 0, 0.18)');
        sh.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sh;
        ctx.beginPath();
        ctx.ellipse(cssW / 2, paperH, cssW * 0.44, 24, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ① 紙張本體：直角矩形（左上標籤突出塊另計） */
      if (wantFill) {
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, cssW, paperH);
      }

      if (wantTab) {
        ctx.fillStyle = shade(paper, 0.94);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(148, 0);
        ctx.lineTo(130, 34);
        ctx.lineTo(0, 34);
        ctx.closePath();
        ctx.fill();
      }

      /* ② 纖維紋理：離屏噪點 pattern 重複貼上，透明度 0.06 */
      if (pattern) {
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, cssW, paperH);
        ctx.globalAlpha = 1;
      }

      /* ③ 打孔邊：底邊一排圓孔，用 destination-out 挖掉。
         只有紙本體由 canvas 畫時才挖 ：： 否則挖開的是底下的 CSS 紙，
         孔洞不會真的透出桌面。 */
      if (wantFill) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000';
        var r = 3;
        var step = 22;
        for (var x = step / 2; x < cssW; x += step) {
          ctx.beginPath();
          ctx.arc(x, paperH - r, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    // 尺寸定了才畫；之後只有 resize 才重畫（紋理 pattern 不重建）
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(paint);
    } else {
      paint();
    }
    window.addEventListener('resize', paint);

    // 紙由 canvas 畫時，CSS 的底色與打孔邊才退場
    if (wantFill) sheet.classList.add('has-canvas');
  });
}


/* ---------- ④ 指標傾斜：卡片跟隨指標 ±2°，lerp 阻尼 ---------- */
function initTilt() {
  var tilt = document.querySelector('.card__tilt');
  if (!tilt) return;
  if (REDUCED || !FINE_POINTER) return;   // 觸屏與減少動態都不啟用

  var MAX = 2;          // 度
  var EASE = 0.12;      // lerp 阻尼係數
  var tx = 0, ty = 0;   // 目標角
  var cx = 0, cy = 0;   // 目前角
  var raf = null;
  var lastX = -1, lastY = -1;

  function apply() {
    tilt.style.transform =
      'rotate(' + cx.toFixed(3) + 'deg) rotateY(' + cy.toFixed(3) + 'deg)';
  }

  function tick() {
    cx += (tx - cx) * EASE;
    cy += (ty - cy) * EASE;
    apply();

    // 靜止即停：requestAnimationFrame 不得常駐
    if (Math.abs(tx - cx) < 0.01 && Math.abs(ty - cy) < 0.01) {
      cx = tx; cy = ty;
      apply();
      raf = null;
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (raf === null) raf = requestAnimationFrame(tick);
  }

  function aim(clientX, clientY) {
    var rect = tilt.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var mx = rect.left + rect.width / 2;
    var my = rect.top + rect.height / 2;
    var dx = (clientX - mx) / (rect.width / 2);
    var dy = (clientY - my) / (rect.height / 2);

    // 指標離開卡片範圍就回正
    if (dx < -1.35 || dx > 1.35 || dy < -1.6 || dy > 1.6) {
      tx = 0; ty = 0;
    } else {
      tx = Math.max(-MAX, Math.min(MAX, dx * MAX));
      ty = Math.max(-MAX, Math.min(MAX, dy * MAX * -1));
    }
  }

  function onMove(event) {
    aim(event.clientX, event.clientY);
    lastX = event.clientX;
    lastY = event.clientY;
    start();
  }

  function onLeave() {
    tx = 0; ty = 0;
    start();
  }

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('blur', onLeave);
  document.addEventListener('pointerleave', onLeave);

  // 捲動時重新對位（捲動與傾斜同時進行會很怪）
  window.addEventListener('scroll', function () {
    if (lastX >= 0) aim(lastX, lastY);
  }, { passive: true });
}


document.addEventListener('DOMContentLoaded', function () {
  initRoleTabs();
  initRise();
  initPaper();
  initTilt();
});
