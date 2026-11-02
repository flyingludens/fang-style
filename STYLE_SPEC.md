# fang-style 样式规范

这份文件是**强制性的**：在库内新增或修改组件、在使用方用库搭新界面时，逐条遵守。它回答的问题是「一个新组件从拿到手到成形，按什么规则组装」——每个值都能在 `src/tokens.css.js` 里找到定义，每条解剖学都能在 `src/components.css.js` / `src/frame.css.js` 里找到参考实现。

与 README 的分工：README 讲怎么装怎么用；这份讲怎么**造**。

---

## 1. 总则（违反任何一条即返工）

1. **CSS 里不写裸数字。** 长度、尺寸、间距、圆角、宽度、时长一律读令牌；刻度里没有的，先在 tokens 里新增一个带「是什么、为什么」注释的令牌，再使用。`min()/max()/calc()` 和视口单位里的数字是表达式的一部分，不算裸数字。
2. **模板字符串注释里不许出现反引号。** 提到令牌名直接写 --fang-space-8。
3. **一个量只有一处定义。** 同一个视觉量出现在两条规则里，就是把不一致埋进了下一次改动。
4. **命名**：类 `fang-` 前缀、块_部位 三段式（`fang-dropdown-list`）；状态不加类，用 `data-open` / `data-active`；变量 `--fang-类别-名称[-刻度]`；一个概念一个词——内边距 `padding`（不用 inset/pad）、宽度 `width`（不用 w/h 缩写）、文字色 `ink`、表面 `surface`。不与 HTML/ARIA 撞脸的名字，不模仿宿主（--dsw-*）的构词。名字说它**现在是什么**，不说它过去是什么（布局改了名字跟着改）；**类名跟组件名走**——组件叫 Drawer，类就叫 fang-drawer。
5. **库不认识宿主与业务。** 库内不出现 --dsw-* 等宿主变量；宿主适配在使用方的桥接层做（在 .fang-shell 上覆盖令牌）。
6. **使用方不得重定义库类。** 同特异性的规则后加载者胜——使用方里一条与库同名的声明会静默遮蔽库规则，测试看不见它。定制走令牌覆盖（桥接）与组件的变体类，不走复制规则改一改。
7. **框的尺寸不随内容变化。** 面板、区域、弹窗体的高宽是常量：内容变长只增加滚动量，不许推挤兄弟区域或改变分区边界。标准容器（fang-page / fang-scroll / 弹窗体限高）就是为此存在的。
8. **动作按钮只放两处**：标题行行尾（名称在左、工具在右），或内容流末尾的动作行（fang-dialog-actions）。不许为按钮自造一个区，不许浮在正文中间。
9. **界面上不留说明文字。** 能靠位置、图标、上下文看懂的不写；title 只写看不见的信息（快捷键、后果、与同名控件的区别）；空状态才写一句「还没有 X，去哪里点」；不做承诺式句子、欢迎语和成功表扬。自问：删掉这句，用户会不会不知道下一步？会——才留。
10. **自造类登记制。** 新增页面级类前先查本规范与库有无等价物；确需新类，在使用方项目的登记表里记下「类名 / 它是什么 / 为什么没有现成等价物」，未登记的新类算违规。

## 2. 刻度事实表

**间距** `--fang-space-*`：2 / 4 / 8 / 12 / 16 / 24（4px 基准，按值命名）。语义别名 `--fang-padding-xs/sm/md/xl` = 4 / 8 / 12 / 24。

**圆角** `--fang-radius-*`：xs 4 / sm 8 / md 12 / lg 16 / panel 28；`--fang-radius-pill` 是「全圆」形状不是尺寸。控件胶囊一律 pill，卡片 md，弹窗 panel。

**字号**（各档自带行高，尺寸和行高是一个决定）：sm 12/18 · md 13/20 · lg 16/24 · xl 20/28。界面正文默认 md；徽标、键帽、计数字用 sm；弹窗标题 lg；页标题 xl。字重三档：400 / 500 / 600。

**图标** `--fang-icon-*`：12 / 14 / 16 / 18（行内小记号 → 小动作 → 控件 → 标题行）。

**高度梯子**（按钮和行是两架梯子，不通用）：
- 按钮：`--fang-btn-height` xl 48 / lg 36（默认）/ sm 26
- 行：`--fang-row-height` 34 / compact 26
- 触达目标：`--fang-hit-target` 44（孤立的第一控件用这档）
- 框架：`--fang-titlebar-height` 68 · `--fang-statusbar-height` 30 · `--fang-rail-w` 264

**宽度档**（`size` 属性取角色，不传像素）：narrow 340 / compact 440 / medium 620 / reading 720 / wide 820 / max 980。

**层级** `--fang-layer-*`：rail 30 / menu 60 / drawer 75 / status 80 / modal 90。任何覆盖层的 z-index 从这张表取，不许写整数。

**动效**：开 180ms（`--fang-duration-open`）、关 140ms（close）。关闭比打开快——入场被阅读，离场只需让路。

**框架几何**：`--fang-frame-gutter` 28（标题行与标准页的侧边留白，同一个数保证分隔线与内容对齐）· `--fang-frame-inset-leading`（窗口左缘安全内缩，macOS 红绿灯设 80px）。

## 3. 布局骨架

```text
fang-shell（令牌根，竖排，吃满）
├─ fang-titlebar        行首控件 + fang-title + fang-spacer + 行尾工具
├─ fang-root（横排，占满剩余）
│  ├─ fang-page         标准页：四边 gutter，竖排
│  │  └─ fang-scroll    要滚动的长内容包这一层
│  └─ fang-rail-layer   左缘滑入目录（覆盖层，非列）
└─ fang-statusbar       底部状态条，横贯底缘
```

职责一句话：`fang-shell` 是令牌根与竖排骨架；`fang-root` 是横排画布；`fang-main` 只声明「主列角色」（内边距归页自己，贴边页用它）；`fang-page` 是标准页（四边 gutter）；`fang-scroll` 提供滚动与最小尺寸；`fang-titlebar` 行首内边距自动避让 `--fang-frame-inset-leading`。

## 4. 组件解剖学

**按钮 `fang-btn`**：等高胶囊。高度读 `--fang-btn-height`（默认 lg 36），`min-width` 同高（图标-only 自动成圆）；padding `0 12`；radius pill；默认透明底 + ink-secondary，hover/active 用状态填充三档，`disabled` 透明度 .45 + not-allowed。变体：`primary`（accent 填充 + padding `0 16`——胶囊两端的弧要靠直段撑出）；`danger`（复合 `fang-btn.fang-danger`，danger 红填充）；`ghost`（透明 + ink-tertiary）；`xl`（在元素上覆盖 `--fang-btn-height` 为 xl 档）。焦点环代替描边。

**字段**：边框less的井。surface 填充、无描边、radius-sm、padding `4 8`、inherit 字体与 md 字号；**焦点环即边界**（`0 0 0 var(--fang-focus-ring-width) var(--fang-focus-ink)`），不许出现可拖拽的 resize 手柄；placeholder 读 ink-faint。

**弹窗族**（Dialog / ConfirmDialog / Drawer 三件，不许手写背板）：
- 背板：`fang-backdrop` absolute 覆盖、flex 居中、`--fang-bg` 调暗 62% + blur(2px)；抽屉变体（`:has(> .fang-drawer)`）：透明、无 blur、贴右、标题行以下。
- 弹窗体：radius-panel、border-edge 发丝描边、`--fang-dialog-shadow`、padding-xl、内部 gap-md、限高（panel 档 `min(84vh, --fang-dialog-max-h)`）、头部固定正文滚。
- 动作行 `fang-dialog-actions`：`justify-content:flex-end`、gap 8——动作按钮放内容流末尾，不许浮在正文中间。
- 关闭三路：Escape、点背板、✕，一个都不能少；动画退出期间保持挂载（关闭 140ms）。
- 宽度用 `size` 档位（第 2 节宽度表），元素内联写 `--fang-dialog-width` / `--fang-drawer-max`。

**列表** `fang-list` / `fang-list-row`：容器自带发丝描边 + radius-md + surface，行间 gap 2 无缝；行 padding `10 12`；hover 抬起（list-hover）、`data-active="true"` 选中（selected-fill）。可激活的行是 `<button>`，纯内容行是 `<div>`——按钮套按钮非法且吞点击。

**分段** `fang-segmented`：28px 定高轨道（`--fang-segmented-height`），所有选项可见、`aria-pressed` 标选中、`data-testid` 前缀给测试。

**下拉** `fang-dropdown`：锚点内自绘选项列表（原生 select 的选项被裁切），`z-index` 取 menu 层，`max-width:min(320px,…)`、`max-height:min(46vh,320px)` 内滚；键盘 ↑↓ 可换值。

**状态条** `fang-statusbar`：三列网格（minmax(0,1fr) auto minmax(0,1fr)），30px，sm 字号，ink-tertiary，横贯底缘不随页滚。

## 5. 交互状态

- **三档填充的语义**：hover 9%（「指针在它上面」）< active 14%（「按下」）< selected 18%（「就开的是它」）。三个词不许混用一档。
- **焦点**：`box-shadow:0 0 0 var(--fang-focus-ring-width) var(--fang-focus-ink)`；焦点环代替一切可换色的描边——边界不动，才不抖。
- **墨色分层**（描边与分隔从这四档取，不写 rgba）：whisper 3%（hover 幽灵、几乎不在的记号）/ hair 8%（内部分隔线）/ edge 14%（一切可见边框）/ faint 45%（必须仍可读的占位符）。
- **阴影**：读配方令牌——`--fang-card-shadow`（卡片，触地层 + 近距 + 远距三层）、`--fang-menu-shadow` / `--fang-dialog-shadow`（浮面）。每层颜色是 ink 的 color-mix，**禁止黑色字面量**——深色底上等于没有。
- **深色可见性**：每个颜色自问一遍「在近黑底上看得见吗」。回退值不许回退成黑。
- **动效**：进 180 出 140；抽屉/弹窗用 `data-closing` + 退出动画保持挂载，不许一帧消失。

## 6. 新组件核对单

创建组件时逐条过，全过才算成形：

1. 每个长度/尺寸/间距都读令牌，无裸数字？
2. 类名 `fang-` 三段式，状态用 data-attr，无与系统撞脸的名字？
3. 高度走的梯子对吗（按钮 ≠ 行 ≠ 触达目标）？
4. 焦点是环不是描边？hover/active/selected 三档用对语义？
5. 描边与阴影读 ink 分层/配方令牌，无黑色字面量？
6. z-index 从层级表取？
7. 可关闭的浮层三路关闭齐了吗？退出动画保持挂载了吗？
8. 模板字符串注释里无反引号？令牌注释写清「是什么、为什么」？
9. 组件不认识业务与宿主（外部值一律 props / 令牌进）？
10. **同一声明块无重复属性**（后声明静默覆盖先声明，工具查不出来）——交付前跑一次逐属性扫描？
11. 新增类登记了吗？界面文案按第 9 条三问删过一轮吗？
12. 使用方项目跑过全量测试（npm test 一类）吗？

## 7. 重构与切换纪律（改库或大规模改样式时）

- **批量替换**：先保护后缀同名（st-btn-flow 类），最长名先替换，一次一条，**每条跑完看 diff**——子串误伤和吃空格都不会报错。
- **搬移对照**：把规则搬到另一个文件/库之后，做一次声明级对照（旧声明集合 vs 新声明集合的差集）。「看起来没少」不是证据——一条规则丢失可以六轮评审都看不见。
- **统一前对比行为**：把两个名字合成一个之前，逐条对比它们的规则；几何不同的合并成一个类名，变体必须补全差异（教训：统一背板后丢了 padding:0，抽屉矮了 48px）。
- **切换原子化**：类名、令牌、组件不要分批换到一半长期停留——过渡态里令牌未定义、副本遮蔽，都是静默失效。必须分步时，写显式回退并在任务单里记下收尾项。
- **悬空值了断**：改名或搬移后，每个失去定义的引用（悬空 var、死键、死白名单条目）当场了断——指向既有刻度、或删除，不留「没人定义它也不报错」的中间态。
