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

CIS222 Web Design and Development
Individual Assignment — 個人介紹網站（e-portfolio）

**姓名**：彭靖男 PENG Jing Nan
**主題**：求職用途的個人介紹網站（Matrix 風格 7 頁靜態站）
**GitHub**：https://github.com/Faixiang/e-portfolio （private）
**截止日期**：2026-12-13 23:59（佔分 30%）
**課程要求**：≥ 5 個 HTML 頁面，覆蓋 personal / working experience / education background / special skill / other related information 五個指定內容頁 + Site Map，並須包含互動元件、響應式設計、HTML + CSS + JavaScript 三者與適當的圖片使用

---

## 當前狀態

**7 個 HTML 頁面全部建成，導覽無死鏈，互動元件與特效全部可用；部分內容仍為佔位（44 處 TODO 待填）。**

| 頁面 | 內容 | 完成度 |
|---|---|---|
| `index.html` | 首頁：主視覺 + 3D 輪盤 + 技術規格分段 | 完成 |
| `personal.html` | 個人資訊：基本資料 / 語言能力 / 興趣 | 照片與真實聯絡資料待補 |
| `experience.html` | 工作經驗：時間軸 | 第 1 條完成，第 2、3 條待補 |
| `education.html` | 教育背景：學歷 + 課程成績表 | 內容待補 |
| `skills.html` | 專精技能：分類篩選 + 熟練度條 | 7 項技能完成 |
| `portfolio.html` | 作品集與證書：燈箱 | 作品二／三與證書待補 |
| `sitemap.html` | 站點地圖 + 頁面與作業要求對照 | 完成 |

---

## 快速開始

直接雙擊 `index.html` 即可瀏覽，無需伺服器、無需安裝依賴。

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
├── index.html                首頁（主視覺 / 3D 輪盤 / 技術規格）
├── personal.html             個人資訊
├── experience.html           工作經驗（時間軸）
├── education.html            教育背景（學歷 / 課程表）
├── skills.html               專精技能（分類篩選 / 熟練度）
├── portfolio.html            作品集與證書（燈箱）
├── sitemap.html              站點地圖 + 作業要求對照
│
├── assets/
│   ├── css/style.css         全站設計系統（1284 行，CSS 變數統一令牌）
│   ├── js/main.js            全站互動與特效腳本（642 行）
│   ├── fonts/
│   │   ├── pressstart-full.woff2     Press Start 2P（完整字集，21028 B）
│   │   └── pressstart-subset.woff2   子集化版本（2648 B，僅副標所需字元）
│   └── images/
│       └── favicon.svg       網站圖標（手寫 SVG）
│
├── ENGINEERING_LOG.md        每日改動記錄
├── .workbuddy/               本地工作區（規劃與內容對照，已列入 .gitignore）
│   ├── CONTENT_CHECKLIST.md  內容填寫對照表（逐頁待填清單）
│   └── memory/               專案記憶與決策記錄
├── .gitignore
└── README.md
```

> `assets/images/` 目前只有 `favicon.svg`；個人照片與作品圖尚未放入，見「待補內容」。

---

## 頁面鏈路與互動

全站 7 個頁面以同一組導覽列互連（Home / 個人資訊 / 工作經驗 / 教育背景 / 專精技能 / 作品集 / Site Map），無孤兒頁。

**互動元件（R5，共 3 個，分散 3 頁）**

| 元件 | 位置 | 說明 |
|---|---|---|
| 技能分類篩選器 | `skills.html` | 全部 / 前端開發 / 程式語言 / 資料處理 / 設計工具，即時更新顯示數量 |
| 作品燈箱 | `portfolio.html` | 點擊作品放大檢視，可關閉（ESC / 關閉鈕 / 遮罩點擊） |
| 導覽列當前頁高亮 | 全站 | 依當前檔名自動標記，無需逐頁維護 |

**首頁內容導覽：3D 旋轉輪盤**

六張卡片各相隔 60° 環繞圓周，支援拖曳（放開自動吸附）、左右方向鍵與指標點切換；卡片本身是 `<a href>`，仍各自跳轉到六個獨立頁面。

**特效層（全站）**

- Canvas 代碼雨背景（限幀 30fps、像素比上限 1、分頁隱藏時暫停）
- 鼠標跟隨光暈（桌面限定）
- 點擊粒子爆炸（桌面限定，動畫播完自動自 DOM 移除）
- 卡片點擊閃光
- 首頁主標：三層 glitch 切片 + 逐字波浪浮動

觸屏裝置不注冊滑鼠事件，避免無謂運算。

---

## 設計系統

全站視覺為「純黑 + 螢光綠」Matrix 風格，通過 CSS 變數集中管理：

```css
/* 底色 */
--bg: #000000;        --surface: #050805;
--surface-2: rgba(0, 255, 0, 0.06);

/* 四階綠（對黑底對比） */
--primary: #0f0;      /* 主色・螢光綠（≈18.4:1） */
--accent: #4efd4e;    /* hover 與強調 */
--accent-dim: #00a000;/* 進度條底、邊框 */
--text: #9f9;         /* 內文（≈10.4:1） */
--text-dim: #4a4;     /* 頁尾與裝飾字（≈2.9:1，不承載重要內容） */

/* 斷點與版面 */
--breakpoint-md: 768px;   --breakpoint-lg: 1024px;
--content-max: 60rem;     --font-base, --font-mono
```

改主題只需改變量值，無需改動組件樣式。

### 字體

副標使用真正的像素點陣字體 **Press Start 2P**，以 `fontTools` 子集化後自帶（`assets/fonts/*.woff2`），維持**零外部依賴**；載入失敗時回退 monospace，不阻塞頁面。

---

## 技術說明

- **無框架**：原生 HTML5 + CSS3 + JavaScript（語義化標籤、`aria-*` 標註）
- **無後端**：純靜態站；本作業不含登入 / 會員 / 購買流程與表單
- **零外部依賴**：字體自帶 woff2，無 CDN、無外部請求
- **相對路徑**：全站連結與資源皆為相對路徑，可整包搬移（R9）
- **響應式**：mobile-first，基礎即窄螢幕版，`min-width: 768px` / `1024px` 逐層放寬；768px 以下導覽列改用 hamburger

### 特效為強制執行（刻意取捨）

`main.js` 中以 `FORCE_EFFECTS = false` 控制，特效**不因系統「減少動態效果」設定而降級** —— Canvas 代碼雨是本站視覺主題核心，而非裝飾性動畫。CSS 中保留 `prefers-reduced-motion` 區塊，但未用於隱藏 canvas / glow / glitch。詳見 `assets/js/main.js` 開頭註解。

### 深色主題與 R9 的偏離

教材要求「淺色背景 + 良好對比」，本站採純黑 + 螢光綠（`--text-dim` 對比僅约 2.9:1，只用在頁尾與裝飾字）。全部變數集中於 `:root`，若要切回淺底，只需改動該區塊。

---

## 每日工作流程

1. **改動** — 寫頁面 / 樣式 / 腳本 / 素材
2. **記錄** — 更新 `ENGINEERING_LOG.md`（無改動的日子不記錄）
3. **上傳** — commit + push 到 GitHub

內容素材的填寫對照表見 `.workbuddy/CONTENT_CHECKLIST.md`，逐頁列出還缺什麼。

---

## 待補內容

**44 處 TODO 佔位尚未填寫**（內容素材須由本人提供，不代為編造）：

| 頁面 | 待補項目 | 處數 |
|---|---|---|
| `personal.html` | 個人照片、真實電郵（現為 `example@email.com`）、電話（現為 `0000 0000`） | 5 |
| `experience.html` | 第 2、3 條經歷（期間 / 職位 / 職責） | 8 |
| `education.html` | 學歷（期間 / 學位 / 說明）與課程成績表（課程 / 學分 / 成績） | 17 |
| `skills.html` | 技能清單微調 | 1 |
| `portfolio.html` | 作品一至三的圖片與說明、證書三條 | 13 |

**圖片缺口**（`assets/images/` 內不存在，燈箱開啟會是空白）：

| 檔案 | 用途 | 必要性 |
|---|---|---|
| `photo.jpg` | `personal.html` 個人照片 | 選用 |
| `work-1.jpg` / `work-2.jpg` / `work-3.jpg` | `portfolio.html` 作品燈箱 | 建議 |

**待辦**：內容補齊後，跑一遍驗收檢查清單並做 zip 解壓實測，再提交至 assignment box。
*（内容由AI生成，仅供参考）*
