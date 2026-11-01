# CIS222 Individual Assignment — 工程日志

项目：求职 E-Portfolio 网站（Matrix 风格 7 页静态站）
仓库：https://github.com/Faixiang/e-portfolio
规则：当日有改动即记录（改动内容 + 日期）；无改动不记；每次上传 GitHub 时日志同步更新。

---

## 2026-10-10

- 项目初始化：确认需求，7 页 HTML 骨架（index / personal / experience / education / portfolio / skills / sitemap）已搭建。
- 设计系统：黑底荧光绿 Matrix 风格；CSS 变量 + 响应式断点；PressStart 点阵字体子集化（woff2 覆盖全部 ASCII）。
- 交互组件：技能筛选器、作品灯箱、导航高亮 3 项 R5 互动元件已实现；含 Canvas 代码雨、打字机、点击粒子、卡片闪光、故障字效等。
- 内容填充：experience 页第一条时间轴「兼職翻新學院網站負責人之一（2026-06 至 2026-08）」已写入。
- 版本管理：创建 GitHub 专属仓库 Faixiang/e-portfolio（private），本日版本首传。
- 资产对齐：7 页 HTML、style.css、main.js、favicon.svg 已与本地真实版本逐一对齐上传。
- 资产补齐：pressstart-full.woff2（21028 B）与 pressstart-subset.woff2（2648 B）已通过 GitHub API 上传至 assets/fonts/，与本地字节校验一致（git push 通道受网络重置，改用 REST API 完成）。

## 2026-10-16

- 视觉改版：黑绿 Matrix → 暗色玻璃拟态（`--bg #0b0d12`、青 `#22d3ee` + 紫 `#a855f7` 渐变、`backdrop-filter` 毛玻璃面板），`:root` 令牌整组替换。
- 主标简化：移除三层 glitch 切片与逐字拆分（`data-split` 属性一并移除），改为单层文字 + CSS 柔和淡入。
- 脚本精简：`main.js` 由 11 个函数缩为 6 个（导航高亮 / hamburger / 技能筛选 / 灯箱 / 卡片闪光 / 3D 轮盘）；Canvas 代码雨、鼠标光晕、点击粒子、打字机一并移除。
- 待清理：`style.css` 仍留有 `.canvas-bg` / `.cursor-glow` / `.particle` / `.gl-layer` 等无对应元素的样式；`assets/fonts/*.woff2` 已无 `@font-face` 引用。
- 文档待同步：`README.md` 仍描述黑绿配色与 Canvas 特效，与现况不符。

## 2026-10-23

- 首頁重做：方向改為「page-is-the-object（頁面即物件）」，整頁做成一份求職申請檔案。廢止 10-16 的暗色玻璃擬態（使用者表明「沒有新意」）。
- 新設計系統 `assets/css/dossier.css`（僅 index 使用，其餘六頁暫留 style.css，待逐頁遷移）：煙草棕 `#472913` 底、骨白 `#e4e0cf` 墨、橄欖綠 `#525e1b` 強調、赭黃 `#c79a3e` 色場；五級字階；無陰影、無漸層、無毛玻璃、無細線。
- 字體改為自架 Big Shoulders 800 與 Public Sans 400–600（latin 子集，共 68 KB），維持零外部請求。
- 首頁結構：申請卡（首屏）→ 職位分頁（互動）→ 一封信（紙張頁，扇貝邊＋撕線存根）→ 三疊檔案夾 → 索引（大字＋可展開橫條）→ 大字地址列 → 頁尾。
- 移除舊首頁的 3D 輪盤、Canvas 特效殘留、01–06 裝飾編號與漸層按鈕。
- 驗收：taste-skill lint 0 FAIL / 0 WARN；inspect 1 FAIL（缺圖片）＋1 WARN（無影片），兩者皆因尚無真實素材。
- 待補：`photo.jpg`、`work-1~3.jpg` 仍缺；`example@email.com` 仍為佔位。

## 2026-10-23（Q1 / Q2 死碼清理）

**Q1 — 清理 `assets/css/style.css` 死碼（1311 → 780 行，-531 行）**

以「六頁 HTML 實際使用的 class + main.js 動態加入的 class」為基準，逐一比對 CSS 選擇器，移除 33 個無對應元素的選擇器：

- 首頁專屬樣式（首頁已改用 `dossier.css`，故全部失效）：`.hero` / `.hero__title` / `.hero__subtitle` / `.hero__desc` / `.hero__eyebrow` / `.btn` / `.section-title` / `.section-lead` / `.section-band` / `.band-grid` / `.band-item*` / `.carousel*`（12 個）/ `.gl-layer*` / `.gl-char`
- 已不存在的特效層：`.canvas-bg` / `.cursor-glow` / `.particle`
- 對應 `@keyframes`：`title-breathe` / `char-wave` / `slice-fade-lime` / `slice-fade-dim` / `particle-fade` / `soft-fade-in` / `soft-float`
- 零引用 CSS 變數：`--grad-accent` / `--subtitle-size` / `--accent-dim` / `--danger` / `--glow` / `--text-faint` / `--surface` / `--glass-bg-strong` / `--glass-glow` / `--font-base`
- 重複宣告：`.nav__brand` 的 `letter-spacing`、`.nav` 與 `.cert` 同時有 `border-bottom` 與 `border`（後者覆蓋前者，已刪多餘者）

**驗證**：改動前後各跑一次 inspect，六頁 × 四張截圖（1440/390 的 fold 與 page-01）共 24 張**逐位元組完全相同**，確認清理未改變任何視覺輸出；FAIL／WARN 計數亦完全一致。CSS 大括號平衡、使用但未定義的變數 = 0。

**Q2 — 刪除孤兒字體**

- `assets/fonts/pressstart-full.woff2`（21028 B）與 `pressstart-subset.woff2`（2648 B）已 `git rm`。理由：全站掃描確認零 `@font-face` 引用、零 HTML/JS 引用，屬純孤兒檔。歷史可由 `eba9db2` 回復。
- 字體目錄現僅留 `big-shoulders-800.woff2` 與 `public-sans-400.woff2`（新系統實際使用）。

**同步**

- `README.md` 全面重寫：改為描述「視覺系統遷移中」的雙系統現況、更正目錄結構與字體清單、補上 4 項首頁互動（職位分頁、檔案夾展開等）、TODO 統計維持 46 處。
- lint 現況：六頁 + style.css + main.js 從 **57 FAIL / 37 WARN 降至 36 FAIL / 28 WARN**（-21 FAIL / -9 WARN）。剩餘 FAIL 皆為舊系統的設計語言（glass 18 / shadow 14 / outlined-box 9 / hairline 5 / gradient 5 / mono 4 / emoji 7 / purple 1 / em-dash 1），將隨六頁遷移至 `dossier.css` 自然消失，不做逐項修補。

