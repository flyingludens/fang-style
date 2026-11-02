# fang-style

fang 的通用 UI 组件与样式令牌库。纯 ES Modules，无构建步骤，React 是唯一依赖（peer）。

库里没有业务概念：不认识任何具体应用，也不认识任何宿主的变量。组件、hook、设计令牌（--fang-*）、应用框架样式四部分，开一个新项目可以直接拿这层当底。

## 安装

```jsonc
// package.json
"dependencies": {
  "fang-style": "github:flyingludens/fang-style#semver:^0.1.0"
  // 本机开发这个库本身时，用 "file:../Projects/fang-style" 软链更直接
}
```

```bash
npm install
```

要求项目里已有 react >= 18。库不打包 React，由使用方的打包器决定它从哪来（本项目式的 esbuild external、或 Vite 正常打包均可）。

## 接入（三步）

**1. 注入样式表。** 样式是一个导出的字符串，挂载时注入一次：

```jsx
import { FANG_CSS } from 'fang-style'

function FangStyle() {
  return <style dangerouslySetInnerHTML={{ __html: FANG_CSS }} />
}
```

**2. 套框架类。** 令牌与框架样式都声明在 `fang-shell` 上，用到库的界面必须包在它里面：

```jsx
<div className="fang-shell fang-col fang-root">
  {/* 页面 */}
</div>
```

**3. 用组件。** 见下。

不接任何主题也能直接跑：库自带一套完整的深色默认值（近黑底、浅色墨），就是它被设计出来时的那套观感。

## 组件

全部从入口导入：`import { Drawer, Dropdown, … } from 'fang-style'`。

| 组件 | 是什么 | 关键 props |
|---|---|---|
| `Drawer` | 从右缘滑入的侧抽屉 | `title` `onClose` `size` `closeLabel` |
| `Dialog` | 阅读面板弹窗（标题 + 可滚正文 + ✕） | `title` `onClose` `size` `closeLabel` |
| `ConfirmDialog` | 确认弹窗（Escape / 背板 / 取消都可退） | `title` `onConfirm` `onCancel` `confirmLabel` `cancelLabel` `busy` `danger`（默认 true：确认键填 --fang-danger 的 error 红；显式传 `danger={false}` 则用强调色） |
| `Dropdown` | 面板内自绘下拉（原生 select 的选项列表会被裁切，所以自己画） | `label` `value` `options` `onChange` |
| `Segmented` | 分段控件：一条轨道、全部选项可见、单选 | `label` `options` `value` `onChange` `testId` `disabled` |
| `List` / `ListRow` | 一列可比的行：行间发丝线、悬停抬升、选中加强 | `ListRow` 传 `onActivate` 即为按钮行，不传为内容行 |
| `SplitPane` | 主从分栏：左列表右详情 | `list` `detail` `listProps` `detailProps` |
| `FileButton` | 长得像按钮的文件选择（触发仍是浏览器文件表单） | `label` `accept` `onFile` |
| `TooltipLayer` | 全局面板提示：接管容器内所有 title 属性自绘气泡 | `rootRef` |
| `Chevron` | 12px 展开箭头（SVG，随主题色） | `open` `direction` |

弹层的 `size` 是宽度档位，不是像素：`narrow`(340) `compact`(440) `medium`(620) `reading`(720) `wide`(820) `max`(980)。

标签 props（`closeLabel` / `confirmLabel` / `cancelLabel`）有中文兜底，但建议显式传——文案是你的决定，不是库的。

## Hook

| Hook | 是什么 |
|---|---|
| `useDismiss(rootRef, open, onClose)` | 点外面或按 Escape 关闭浮层 |
| `usePersisted(key, decode, encode, forced?)` | localStorage 偏好，读写都吞异常（隐私模式不炸） |
| `useClosingAnimation(value, durationMs?)` | 退出动画期间保持挂载，返回 `{ mounted, closing, shown }` |
| `useSessionState(scope, key, initial)` | 组件卸载后仍在（内存会话仓）的状态；`SESSION_STORE` 是背后的仓 |

## 令牌与主题

全部令牌在 `src/tokens.css.js`，每条带注释说明它是什么、为什么是这个值。速查：

- 间距 `--fang-space-*`：2 / 4 / 8 / 12 / 16 / 24（4px 基准）
- 圆角 `--fang-radius-*`：xs 4 / sm 8 / md 12 / lg 16 / panel 28；`--fang-radius-pill` 是「全圆」形状不是尺寸
- 字号 `--fang-font-size-*`：sm 12 / md 13 / lg 16 / xl 20（各档自带 `--fang-line-height-*`）
- 层级 `--fang-layer-*`：rail 30 / menu 60 / drawer 75 / status 80 / modal 90
- 文字墨色 `--fang-ink-primary/secondary/tertiary` 及浓度分层 `--fang-ink-whisper/hair/edge/faint`
- 表面 `--fang-surface` / `--fang-surface-high`、状态填充 `--fang-hover/selected/active-fill`

**接宿主主题**：在自己的样式里把宿主变量映射到对应令牌（在 `fang-shell` 上覆盖）：

```css
.fang-shell{
  --fang-ink-primary:var(--dsw-alias-label-primary,#f2f2f3);
  --fang-radius-md:var(--dsw-radius-md,12px);
}
```

原则：宿主适配是使用方的事，库里永远只有 --fang-*。反过来，库令牌的默认值改动会落到所有使用方——改前跑一遍下游测试。

## 框架类（写页面直接用的）

`fang-shell`（令牌根）· `fang-root` / `fang-col` / `fang-main`（主内容列）· `fang-scroll`（滚动区）· `fang-titlebar` / `fang-title` · `fang-rail*`（左缘滑入目录）· `fang-gap-under-row` 等四档间距 · `fang-row` / `fang-muted` / `fang-spacer`。组件类（`fang-btn` 及其 `primary / ghost / xl` 变体、`fang-input` 风格字段、`fang-card` 等）随组件文档在源码注释里。

## 开发约定（改库时）

- CSS 写在 JS 模板字符串里：**注释里不许出现反引号**（提及令牌名直接写 --fang-space-8）。
- **CSS 里不写裸数字**：长度、尺寸、间距、圆角一律走令牌；刻度里没有的就新增一个带理由的令牌。
- 命名：类 `fang-` 三段式（块_部位_状态用 data-attr）；变量 `--fang-类别-名称[-刻度]`；状态不加类，用 `data-open` / `data-active`。
- 库无测试基建，验证靠下游：改完到使用方项目跑 `npm test`（本项目模式），产物级回归在那里兜底。值级回归可在使用方测试里钉关键令牌值。
