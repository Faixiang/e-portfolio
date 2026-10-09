/* ============================================================
   e-Portfolio — 彭靖男 PENG Jing Nan
   CIS222 Individual Assignment · 全站互動腳本
   ------------------------------------------------------------
   互動元件（R5）：
     ① 技能篩選器（skills.html）
     ② 作品燈箱（portfolio.html）
     ③ 導覽列目前頁高亮（全站）
     ④ Hamburger 展開／收合（全站，mobile-first）

   特效層：
     A  Canvas 代碼雨（全站背景，限 30fps、極低密度）
     B  鼠標跟隨光暈（桌面限定）
     C  打字機標題（僅首頁）
     D  點擊粒子爆炸（全站，桌面限定）
     E  卡片點擊閃光（全站）

   效能與穩定性考量：
     - Canvas 限幀率並在頁面隱藏時暫停
     - 所有特效尊重 prefers-reduced-motion
     - 動畫元素播完即從 DOM 移除，不累積記憶體
     - 觸屏裝置不註冊滑鼠事件，避免無謂運算
   ============================================================ */

'use strict';


/* ------------------------------------------------------------
   動效守衛
   ------------------------------------------------------------
   設計決定：**特效無條件執行**，不因系統的「減少動態效果」設定而停用。

   原因：Canvas 代碼雨是本網站的視覺主題核心，不是裝飾性動畫。
   原本在此處early-return 會讓使用者即使 JS 正常運作，
   畫面上仍完全看不到 Matrix 風格，與網站主題不符。

   若日後要恢復可及性降級，只需把下面 FORCE_EFFECTS 改為
   window.matchMedia('(prefers-reduced-motion: reduce)').matches 即可。
   ------------------------------------------------------------ */
const FORCE_EFFECTS = false;   // false = 特效一律執行

function effectsDisabled() {
  return FORCE_EFFECTS &&
         window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}


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
   B 鼠標跟隨光暈（桌面限定）
   用 rAF 節流，並以 transform 移動，避免重繪。
   ------------------------------------------------------------ */
function initCursorGlow() {
  if (effectsDisabled()) return;
  // 觸屏裝置沒有精確游標，不啟用
  // 桌機與筆電才啟用；純觸屏裝置沒有游標，啟用也是空轉
  if (!window.matchMedia('(hover: hover)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let x = 0, y = 0;
  let pending = false;

  // translate(-50%,-50%) 讓圓心對齊游標（比 marvis 的 left/top 更快）
  function render() {
    glow.style.transform =
      'translate(' + (x - 150) + 'px,' + (y - 150) + 'px)';
    glow.classList.add('is-active');
    pending = false;
  }

  document.addEventListener('mousemove', function (event) {
    x = event.clientX;
    y = event.clientY;
    if (!pending) {
      pending = true;
      requestAnimationFrame(render);
    }
  });
}


/* ------------------------------------------------------------
   D 點擊粒子爆炸（桌面限定）
   手法比照 marvis_matrix.html：以 Web Animations API 的 .animate()
   帶動位移與淡出，結束時自動移除節點，不累積 DOM。
   ------------------------------------------------------------ */
function initClickParticles() {
  if (effectsDisabled()) return;
  // 桌機與筆電才啟用；純觸屏裝置沒有游標，啟用也是空轉
  if (!window.matchMedia('(hover: hover)').matches) return;

  const COUNT = 14;
  const MIN_SPEED = 40;
  const MAX_SPEED = 130;
  const COLORS = ['#0f0', '#4efd4e', '#00a000'];

  document.addEventListener('click', function (event) {
    for (let k = 0; k < COUNT; k += 1) {
      const p = document.createElement('span');
      p.className = 'particle';

      const angle = Math.random() * Math.PI * 2;
      const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;

      p.style.left = event.clientX + 'px';
      p.style.top = event.clientY + 'px';
      p.style.backgroundColor = COLORS[k % COLORS.length];

      document.body.appendChild(p);

      // .animate() 的動畫結束回呼會自動移除節點
      p.animate(
        [
          { transform: 'translate(0, 0)', opacity: 1 },
          { transform: 'translate(' + dx + 'px,' + dy + 'px)', opacity: 0 }
        ],
        {
          duration: 500 + Math.random() * 400,
          easing: 'cubic-bezier(.1,.8,.3,1)'
        }
      ).onfinish = function () { p.remove(); };
    }
  });
}




/* ------------------------------------------------------------
   C2 逐字波浪拆分（僅首頁主標）
   ------------------------------------------------------------
   把標題文字拆成三層 span，每層再逐字包成 .gl-char。
   三層使用「相同字序與相同 --i 索引」，因此：
     · clip-path 切片與逐字浮動完全對齊
     · 每個字依 --i 延後 delay，形成由左至右推進的波浪
   打字機效果已移除 —— 它依賴 textContent 逐字重建，
   與拆層結構互斥（無法同時存在）。
   ------------------------------------------------------------ */
function initSplitChars() {
  const target = document.querySelector('[data-split]');
  if (!target || effectsDisabled()) return;

  // 先轉為大寫再拆層。
  // 為何不能用 CSS 的 text-transform：JS 以 charAt() 逐字寫入 span，
  // 這會產生新的文本節點並繞過 text-transform，導致三層仍顯示原始大小寫。
  // 因此大小寫必須在此處處理，CSS 與 JS 兩邊一致。
  const text = (target.getAttribute('data-split') || '').toUpperCase();
  if (!text) return;
  target.textContent = '';

  const LAYERS = [
    'gl-layer--base',
    'gl-layer--lime',
    'gl-layer--dim'
  ];

  LAYERS.forEach(function (layerClass, layerIndex) {
    const layer = document.createElement('span');
    layer.className = 'gl-layer ' + layerClass;
    // 亮綠與暗綠層純裝飾，對讀屏隱藏
    if (layerIndex > 0) layer.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < text.length; i += 1) {
      const char = text.charAt(i);

      // 行分隔符：插入真正的 <br>，讓三層同步斷行。
      // 用「|」而非 \n —— HTML 屬性不處理跳脫序列，
      // \n 會被當成反斜線 + 字母 n 兩個字元。
      // 不占用 --i 索引，因此波浪可連續跨行推進。
      if (char === '|') {
        layer.appendChild(document.createElement('br'));
        continue;
      }

      const ch = document.createElement('span');
      ch.className = 'gl-char';
      ch.style.setProperty('--i', String(i));
      // 空白字元改用不折疊的空格，避免行末被摺疊
      ch.textContent = char === ' ' ? '\u00a0' : char;
      layer.appendChild(ch);
    }
    target.appendChild(layer);
  });
}


/* ------------------------------------------------------------
   A Canvas 代碼雨（全站背景）
   ------------------------------------------------------------
   效能守護：
     1. 字元密度極低（加大欄間距）
     2. 限幀率 30fps（不跟滿 60fps）
     3. 像素比上限 1，避免高 DPI 過繪
     4. 分頁不可見時暫停動畫
     5. 尊重 prefers-reduced-motion
   ------------------------------------------------------------ */
function initCodeRain() {
  if (effectsDisabled()) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'canvas-bg';
  canvas.setAttribute('aria-hidden', 'true');   // 純裝飾，對讀屏隱藏
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;   // 某些環境不支援 2d context，直接放棄

  // 字元集比照 marvis_matrix.html：混合半形片假名、數字與符號，
  // 比純英文字母更有 Matrix 質感。
  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>/\\|=+*#$';
  const FONT_SIZE = 14;
  const COLUMN_GAP = 4;          // 加大 → 密度自然降低
  const MAX_DPR = 1;             // 限制像素比，減少填充量
  const FPS = 30;                // 限幀率
  const FRAME_MS = 1000 / FPS;
  const TAIL = 30;               // 尾跡格數：還原原版的長度（約 420px）

  let width = 0, height = 0, columns = 0;
  let drops = [];
  let lastFrame = 0;
  let running = true;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const step = FONT_SIZE * COLUMN_GAP;
    columns = Math.ceil(width / step);
    drops = [];
    for (let i = 0; i < columns; i += 1) {
      drops[i] = Math.random() * -100;   // 負值 → 從上方落下
    }
  }

  // 字元由「螢幕行號 + 欄位序號」決定，而非每幀隨機。
  // 如此同一位置每幀顯示的是同一個字，尾巴不會閃爍；
  // 畫布每幀被完整清除，所以也永遠不會累積出殘影。
  function charAt(row, column) {
    const idx = (row + column * 7) % CHARS.length;
    return CHARS[(idx + CHARS.length) % CHARS.length];
  }

  function draw(timestamp) {
    if (!running) return;

    // 限幀：未到間隔時間就跳過這一次繪製
    if (timestamp - lastFrame < FRAME_MS) {
      requestAnimationFrame(draw);
      return;
    }
    lastFrame = timestamp;

    // 每幀完整清除 —— 這是「不留痕跡」的關鍵。
    // 先把 transform 歸零再清除，確保整張畫布（含 DPR 區域）都被清乾淨。
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.font = FONT_SIZE + 'px monospace';

    for (let i = 0; i < columns; i += 1) {
      const x = i * FONT_SIZE * COLUMN_GAP;
      const headRow = Math.round(drops[i]);
      const headY = headRow * FONT_SIZE;

      // 頭部最亮，往後逐格變淡。
      // 使用線性衰減（指數 1.0）：讓整條尾跡都有足夠可見度，
      // 不會像 1.6 次方那樣集中在頭部、後段過早消失。
      for (let t = 0; t <= TAIL; t += 1) {
        const row = headRow - t;
        const y = row * FONT_SIZE;
        if (y < -FONT_SIZE) break;

        // 尾巴末端保留約 12% 亮度再淡出，避免看起來被切斷
        const fade = 1 - (t / TAIL) * 0.88;
        ctx.globalAlpha = fade;
        ctx.fillStyle = '#0f0';
        ctx.fillText(charAt(row, i), x, y);
      }
      ctx.globalAlpha = 1;

      // 字頭出畫面底部後從上方重新落下。
      // 尾巴會隨字頭一併下移並淡出，畫面底部自然收尾，不會突然消失。
      if (headY > height) {
        drops[i] = -Math.random() * 20;
      } else {
        drops[i] += 1;
      }
    }

    requestAnimationFrame(draw);
  }

  // 分頁不可見時停止動畫，回到前台再恢復
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) {
      lastFrame = 0;
      requestAnimationFrame(draw);
    }
  });

  window.addEventListener('resize', resize);

  resize();
  requestAnimationFrame(draw);
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

  // 特效層
  initCodeRain();
  initCursorGlow();
  initClickParticles();
  initSplitChars();
});