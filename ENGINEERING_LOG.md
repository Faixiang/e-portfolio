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
