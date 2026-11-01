---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: c6eb62ba6ec5a28db2139adf23a2fe4b_f4155dddc6c911f19063525400393706
    ReservedCode1: yyt9TX4olAc3nktQG8nVY/1Yp7zmcKRNn94HNz01Hjs7PbkblyZU28arPRhQg8Kn7nQcTZOVfuoExhhhnhFWp6/TMVDDxlfGIRCH33PnJrgnQ8YOPbUd4oDUC5qJlHK8fg/F1kNFSPSrNzW0926EY9e7iY7yYEcJbsD7XpkwGcINGQKACrbTC/udqz4=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: c6eb62ba6ec5a28db2139adf23a2fe4b_f4155dddc6c911f19063525400393706
    ReservedCode2: yyt9TX4olAc3nktQG8nVY/1Yp7zmcKRNn94HNz01Hjs7PbkblyZU28arPRhQg8Kn7nQcTZOVfuoExhhhnhFWp6/TMVDDxlfGIRCH33PnJrgnQ8YOPbUd4oDUC5qJlHK8fg/F1kNFSPSrNzW0926EY9e7iY7yYEcJbsD7XpkwGcINGQKACrbTC/udqz4=
---

# Myself E-Portfolio

CIS222 Web Design and Development — Individual Assignment
個人求職網站，7 頁靜態站，零框架、零外部依賴。

**姓名**：彭靖男 PENG Jing Nan
**GitHub**：https://github.com/Faixiang/e-portfolio
**截止日期**：2026-12-13 23:59（佔分 30%）
**課程要求**：≥ 5 個 HTML 頁面，覆蓋 personal / working experience / education background / special skill / other related information，加 Site Map；須包含互動元件、響應式設計、HTML + CSS + JavaScript 三者，以及適當的圖片使用。

---

## 現況（2026-11-01）

**七頁全部完成視覺系統遷移，全站單一設計系統。** 舊的暗色玻璃擬態已完全退場。

| 頁面 | 樣式 | 腳本 | 狀態 |
|---|---|---|---|
| `index.html` | `dossier.css` | `index.js` | ✅ |
| `personal.html` | `dossier.css` | `site.js` | ✅ |
| `experience.html` | `dossier.css` | `site.js` | ✅ |
| `education.html` | `dossier.css` | `site.js` | ✅ |
| `skills.html` | `dossier.css` | `site.js` + `main.js` | ✅ |
| `portfolio.html` | `dossier.css` | `site.js` + `main.js` | ✅ |
| `sitemap.html` | `dossier.css` | `site.js` | ✅ |

版面容許範圍內已完成；**剩下的是內容，不是程式**。待補項目見文末。

---

## 快速開始

直接雙擊 `index.html` 即可瀏覽。無需伺服器、無需安裝依賴、無建置流程。

如需本地伺服器（推薦，便於開發者工具除錯）：

```bash
python -m http.server 8000
# 或
npx serve .
```

然後訪問 `http://localhost:8000`。

---

## 目錄結構

```
Individual Assignment/
├── index.html                首頁（申請卡 / 職位分頁 / 一封信 / 檔案夾 / 索引 / 聯絡）
├── personal.html             個人資訊
├── experience.html           工作經驗（時間軸）
├── education.html            教育背景（學歷 / 課程表）
├── skills.html               專精技能（分類篩選 / 熟練度）
├── portfolio.html            作品集與證書（燈箱）
├── sitemap.html              站點地圖 + 作業要求對照
│
├── assets/
│   ├── css/
│   │   ├── dossier.css       ★ 全站設計系統（1,625 行，24 項權杖）
│   │   └── style.css         舊系統（779 行，已無任何頁面引用）
│   ├── js/
│   │   ├── index.js          首頁：職位分頁 / 進場觀察器 / canvas 紙材 / 指標傾斜（343 行）
│   │   ├── site.js           六頁共用：導覽標記 / 進場觀察器（80 行）
│   │   └── main.js           技能篩選 / 燈箱 / 卡片閃光 / 游標（250 行）
│   ├── fonts/
│   │   ├── big-shoulders-800.woff2   Big Shoulders 800（展示字，15 KB）
│   │   └── public-sans-400.woff2     Public Sans 400–600（內文，27 KB）
│   ├── video/
│   │   └── field.mp4         全站背景引力場（960×574 · 48s · 7.2 MB · 無音軌）
│   └── images/
│       └── favicon.svg       網站圖標（手寫 SVG）
│
├── ENGINEERING_LOG.md        改動記錄
├── README.md                 本檔
└── .gitignore
```

> `style.css` 已無任何頁面引用，屬孤兒檔，可整份刪除；保留是為了留下舊系統的對照。

---

## 頁面鏈路與互動

七頁以同一組導覽列互連，無孤兒頁、無死鏈。

| 元件 | 位置 | 說明 |
|---|---|---|
| 職位分頁 | `index.html` | 按「前端實作 / 資料處理 / AI 應用」切換同一份檔案的不同閱讀面向 |
| 檔案夾展開 | `index.html` | 作品集以 `<details>` 展開顯示詳情 |
| 卡片傾斜 | `index.html` | 指標靠近時卡片 ±2° 跟隨，`lerp` 阻尼，離開歸零 |
| 進場動效 | 全站 | `data-rise` 元素由 `IntersectionObserver` 觸發，依 `data-rise-as` 分流四型 |
| 技能分類篩選 | `skills.html` | 全部 / 前端開發 / 程式語言 / 資料處理 / 設計工具，即時更新數量 |
| 作品燈箱 | `portfolio.html` | 點擊作品放大，ESC / 關閉鈕 / 遮罩點擊皆可關閉 |
| 導覽列當前頁高亮 | 全站 | 依當前檔名自動標記，無需逐頁維護 |
| 卡片點擊閃光 | 全站 | 點擊技能列或作品格時的一次性邊框閃光 |

**首頁結構**：申請卡（首屏）→ 職位分頁 → 一封信 → 三疊檔案夾 → 索引 → 大字地址列 → 頁尾。

---

## 設計系統

**概念**：`page-is-the-object` —— 整頁是一份放在桌上的求職申請檔案。桌面是石墨，文件是紙，強調只有一種顏色：黃銅。

```css
--bg: #14161a;        /* 石墨桌面 */
--surface: #1d2025;   /* 色階一階：檔案夾、頁首 */
--ink: #f0efe9;       /* 主文字 */
--paper: #edece6;     /* 紙：文件本體 */
--accent: #c9a227;    /* 黃銅：深底上 7.49:1 */
--accent-paper: #7a5d0e;  /* 紙面上的深銅：5.22:1 */
```

黃銅在紙面上只有 2.04:1，所以紙面另備一階深銅。**這個分工不可混用。**

規則：無陰影、無裝飾漸層、無毛玻璃、無細線分隔（表格與表單欄位除外）、無等寬字（真代碼區除外）、無 emoji 當圖示、直角。分隔靠**色階與空間**，不靠線。

字體自架：Big Shoulders 800（展示字）+ Public Sans 400–600（內文，可變字體）。

---

## 背景層

全站背景是一段 48 秒無縫循環的影片：一篇文章上有一個看不見的引力場，字進入範圍就被換成亂碼，形成同心環。

**實作要點**

- `position: fixed` 固定層，`z-index: 0`，`pointer-events: none`，`aria-hidden="true"`
- 影片 `opacity: 0.20`，上面壓一層石墨漸層（首尾 0.88 / 0.90，中段 0.64）
- 紙面卡片維持**完全不透明**——影片只在石墨桌面上透出來，任何位置的字都可讀
- `prefers-reduced-motion` 時影片收掉，退回 `.bgfield` 自身的石墨底色，不留白
- 無 poster 圖：影片未載入時就是一片乾淨的石墨，不需要額外檔案

這是**材質**，不是內容。它不承載資訊、不進無障礙樹、不接受互動。

---

## 技術說明

- **無框架**：原生 HTML5 + CSS3 + JavaScript，語義化標籤與 `aria-*` 標註
- **無後端**：純靜態站；本作業不含登入 / 會員 / 購買流程
- **零外部依賴**：字體與影片自帶，無 CDN、無外部請求
- **相對路徑**：全站連結與資源皆為相對路徑，可整包搬移
- **響應式**：mobile-first，`min-width: 768px` / `1024px` 逐層放寬
- **無 JS 可讀**：進場動效靠 `.js` 類別把關，腳本失效時內容直接顯示
- **canvas 只畫材質**：紙張紋理、打孔邊、接觸陰影都在 canvas；所有文字留在 DOM，可選取、可搜尋、螢幕閱讀器讀得到

---

## 待補內容

**46 處 `TODO` 佔位**（內容素材須由本人提供，不代為編造）：

| 頁面 | 待補項目 | 處數 |
|---|---|---|
| `education.html` | 學歷（期間 / 學位 / 說明）與課程成績表 | 17 |
| `portfolio.html` | 作品一至三的圖片與說明、證書三條 | 14 |
| `experience.html` | 第 2、3 條經歷（期間 / 職位 / 職責） | 8 |
| `personal.html` | 個人照片、真實電郵、電話 | 6 |
| `skills.html` | 技能清單微調 | 1 |

**圖片缺口**（`assets/images/` 內不存在，引用處會是破圖）：

| 檔案 | 用途 | 必要性 |
|---|---|---|
| `photo.jpg` | `personal.html` 個人照片 | 選用 |
| `work-1.jpg` / `work-2.jpg` / `work-3.jpg` | `portfolio.html` 作品圖 | 建議 |

**其他**：電郵仍是 `example@email.com` 佔位。

---

## 已知隱患

首頁申請卡的可見性目前掛在 CSS 動畫完成上：

```css
.js .card { opacity: 0; animation: card-draw ... forwards; }
```

若瀏覽器節流、暫停動畫（省電模式、背景分頁），卡片可能停在 `opacity: 0`，首頁看起來是空的。正解是把隱形寫進 `@keyframes` 的 `from` 並用 `animation-fill-mode: both`，讓「動畫沒跑」時元素仍可見。

---

*（内容由AI生成，仅供参考）*
