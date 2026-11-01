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
Individual Assignment — 個人求職網站（7 頁靜態站）

**姓名**：彭靖男 PENG Jing Nan
**GitHub**：https://github.com/Faixiang/e-portfolio （private）
**截止日期**：2026-12-13 23:59（佔分 30%）
**課程要求**：≥ 5 個 HTML 頁面，覆蓋 personal / working experience / education background / special skill / other related information 五個指定內容頁 + Site Map，並須包含互動元件、響應式設計、HTML + CSS + JavaScript 三者與適當的圖片使用

---

## ⚠️ 當前狀態：視覺系統遷移中（2026-10-23）

**首頁已改用新設計系統，其餘六頁仍在舊系統。兩套視覺並存，全站尚未統一。**

| 頁面 | 使用樣式 | 狀態 |
|---|---|---|
| `index.html` | `assets/css/dossier.css` | ✅ 已改版（lint 0 FAIL / 0 WARN） |
| `personal.html` | `assets/css/style.css` | ⬜ 待遷移 |
| `experience.html` | `assets/css/style.css` | ⬜ 待遷移 |
| `education.html` | `assets/css/style.css` | ⬜ 待遷移 |
| `skills.html` | `assets/css/style.css` | ⬜ 待遷移 |
| `portfolio.html` | `assets/css/style.css` | ⬜ 待遷移 |
| `sitemap.html` | `assets/css/style.css` | ⬜ 待遷移 |

**新設計系統**：`page-is-the-object`（頁面即物件）—— 整頁做成一份求職申請檔案。煙草棕 `#472913` 底、骨白 `#e4e0cf` 墨、橄欖綠 `#525e1b` 強調、赭黃 `#c79a3e` 色場；Big Shoulders 800（展示字）+ Public Sans 400–600（內文），皆為自架 woff2。

**舊設計系統**：`assets/css/style.css` —— 暗色玻璃擬態（`--bg #0b0d12`、青 `#22d3ee` + 紫 `#a855f7` 漸層、`backdrop-filter` 毛玻璃）。六頁遷移完成後此檔將不再被引用，可整份刪除。

> 詳細排程見 `.workbuddy-ai/SCHEDULE_2026-10-23.md`。

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
├── index.html                首頁（求職申請卡 / 職位分頁 / 一封信 / 檔案夾 / 索引 / 聯絡）
├── personal.html             個人資訊
├── experience.html           工作經驗（時間軸）
├── education.html            教育背景（學歷 / 課程表）
├── skills.html               專精技能（分類篩選 / 熟練度）
├── portfolio.html            作品集與證書（燈箱）
├── sitemap.html              站點地圖 + 作業要求對照
│
├── assets/
│   ├── css/
│   │   ├── dossier.css       ★ 新設計系統（首頁使用中，695 行，24 項設計權杖）
│   │   └── style.css         舊設計系統（六頁使用中，780 行，2026-10-23 已清死碼）
│   ├── js/
│   │   ├── index.js          首頁互動（職位分頁 + 進場動態，77 行）
│   │   └── main.js           六頁共用互動（技能篩選 / 燈箱 / 導覽高亮 / 卡片閃光，332 行）
│   ├── fonts/
│   │   ├── big-shoulders-800.woff2   Big Shoulders 800（展示字，14.6 KB）
│   │   └── public-sans-400.woff2     Public Sans 400–600（內文，26.8 KB）
│   └── images/
│       └── favicon.svg       網站圖標（手寫 SVG）
│
├── ENGINEERING_LOG.md        每日改動記錄
├── README.md                 本檔
├── .workbuddy/               早期工作區（內容對照表，已列入 .gitignore）
├── .workbuddy-ai/            決策層工作區（決策台帳、排程、提示詞，已列入 .gitignore）
└── .gitignore
```

> `assets/images/` 目前只有 `favicon.svg`；個人照片與作品圖尚未放入，見「待補內容」。

---

## 頁面鏈路與互動

全站 7 個頁面以同一組導覽列互連（Home / 個人資訊 / 工作經驗 / 教育背景 / 專精技能 / 作品集 / Site Map），無孤兒頁、無死鏈。

**互動元件（R5）**

| 元件 | 位置 | 說明 |
|---|---|---|
| 技能分類篩選器 | `skills.html` | 全部 / 前端開發 / 程式語言 / 資料處理 / 設計工具，即時更新顯示數量 |
| 作品燈箱 | `portfolio.html` | 點擊作品放大檢視，可關閉（ESC / 關閉鈕 / 遮罩點擊） |
| 導覽列當前頁高亮 | 全站 | 依當前檔名自動標記，無需逐頁維護 |
| 卡片點擊閃光 | 全站 | 點擊技能列或作品格時的一次性邊框閃光 |
| 職位分頁 | `index.html` | 按「前端實作 / 資料處理 / AI 應用」切換同一份檔案的不同閱讀面向 |
| 檔案夾展開 | `index.html` | 作品集以 `<details>` 展開顯示詳情 |

**首頁結構**（page-is-the-object）

申請卡（首屏）→ 職位分頁 → 一封信（紙張頁，扇貝邊 + 撕線存根）→ 三疊檔案夾 → 索引（大字 + 可展開橫條）→ 大字地址列 → 頁尾。

---

## 設計系統

### 新系統 `dossier.css`（首頁）

```css
--bg: #472913;        /* 煙草棕 */
--ink: #e4e0cf;       /* 骨白 */
--accent: #525e1b;    /* 橄欖綠 */
--field-1: #c79a3e;   /* 赭黃 */
```

規則：無陰影、無漸層、無毛玻璃、無細線分隔（表格與表單欄位除外）、無等寬字（除真代碼區）、無 emoji 當圖示、無裝飾編號、直角。分隔靠**色階與空間**，不靠線。

### 舊系統 `style.css`（六頁）

暗色玻璃擬態。全部變數集中於 `:root`，改主題只需改該區塊。

---

## 技術說明

- **無框架**：原生 HTML5 + CSS3 + JavaScript（語義化標籤、`aria-*` 標註）
- **無後端**：純靜態站；本作業不含登入 / 會員 / 購買流程與表單
- **零外部依賴**：字體自帶 woff2，無 CDN、無外部請求
- **相對路徑**：全站連結與資源皆為相對路徑，可整包搬移（R9）
- **響應式**：mobile-first，基礎即窄螢幕版，`min-width: 768px` / `1024px` 逐層放寬；768px 以下導覽列改用 hamburger

---

## 每日工作流程

1. **改動** — 寫頁面 / 樣式 / 腳本 / 素材
2. **實測** — lint + 三視口截圖
3. **記錄** — 更新 `ENGINEERING_LOG.md`（無改動的日子不記錄）
4. **上傳** — commit + push 到 GitHub

**流程紅線**：本地改 → 本地實測驗收 → 確認 → 才可 git 提交／推送。

---

## 待補內容

**46 處 TODO 佔位尚未填寫**（內容素材須由本人提供，不代為編造）：

| 頁面 | 待補項目 | 處數 |
|---|---|---|
| `education.html` | 學歷（期間 / 學位 / 說明）與課程成績表（課程 / 學分 / 成績） | 17 |
| `portfolio.html` | 作品一至三的圖片與說明、證書三條 | 14 |
| `experience.html` | 第 2、3 條經歷（期間 / 職位 / 職責） | 8 |
| `personal.html` | 個人照片、真實電郵（現為 `example@email.com`）、電話（現為 `0000 0000`） | 6 |
| `skills.html` | 技能清單微調 | 1 |

**圖片缺口**（`assets/images/` 內不存在，燈箱開啟會是空白）：

| 檔案 | 用途 | 必要性 |
|---|---|---|
| `photo.jpg` | `personal.html` 個人照片 | 選用 |
| `work-1.jpg` / `work-2.jpg` / `work-3.jpg` | `portfolio.html` 作品燈箱 | 建議 |

**待辦**：六頁遷移至 `dossier.css` → 內容補齊 → 跑驗收檢查清單 → zip 解壓實測 → 提交至 assignment box。

*（内容由AI生成，仅供参考）*
