/**
 * 库的框架：令牌之外、组件之下，每个页面都坐在它里面的那层结构。
 *
 * 壳（shell）是令牌的宿主也是一切的定位基准；标题行、侧栏、主内容列和滚动区
 * 在这里定义，其余规则都布局在它们里面。
 */
export const FANG_FRAME = `
      .fang-root,.fang-root *,.fang-shell *{box-sizing:border-box}
      /* 排版声明在每个规则都坐在里面的那一个元素上：字体族在这里而不是分散到每个
         组件，工作字号也在这里——不设字号的规则继承 13/20。 */
      .fang-shell{font-family:var(--fang-font-family);
        font-size:var(--fang-font-size-md);line-height:var(--fang-line-height-ui);
        display:flex;flex-direction:column;height:100%;min-height:0;min-width:0;
        background:var(--fang-bg);color:var(--fang-ink-primary)}
      /* 标题行。不设固定高：行就是它的内容（一排 36px 的胶囊）加上下内边距，所以
         永远不会裁掉自己的控件。行首内边距取基础一步间距与「安全内缩 + 一步间距」
         的较大者：--fang-frame-inset-leading 是窗口左缘被系统控件（macOS 红绿灯）
         或宿主面板占据的宽度，为 0 时落回基础间距。 */
      .fang-titlebar{display:flex;align-items:center;gap:var(--fang-space-8);flex:none;margin-bottom:var(--fang-space-16);min-width:0;
        padding-top:var(--fang-space-16);padding-bottom:var(--fang-space-8);
        padding-left:max(var(--fang-space-16), calc(var(--fang-frame-inset-leading) + var(--fang-space-8)));padding-right:var(--fang-space-12);
        border-bottom:var(--fang-hairline) solid var(--fang-border-edge)}
      /* 描边画在元素自己的盒子上，元素的内边距嵌不进它——能嵌进的只有容器或外边距。
         壳自己的标题行没有容器，所以把同样的两个内边距声明成外边距，分隔线共用一套
         几何：同样的侧边留白、同样的离顶落差。 */
      .fang-shell>.fang-titlebar{margin-top:var(--fang-space-8);margin-left:var(--fang-frame-gutter);margin-right:var(--fang-frame-gutter)}
      .fang-title{margin:0;font-size:var(--fang-font-size-xl);line-height:var(--fang-line-height-xl);font-weight:var(--fang-font-weight-strong);color:var(--fang-ink-primary);
        overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:0 1 auto}

      /* 框架：侧栏、页面列，和它们里面的滚动区。 */
      .fang-root{display:flex;flex:1 1 auto;min-height:0;min-width:0;width:100%;overflow:hidden}
      .fang-col{display:flex;flex-direction:column;min-height:0;min-width:0}
      /* 侧栏是覆盖层，不是一列：盖住页面左缘，从那里滑入。inset-block 顶到 0 加
         left:0 让卡片贴住面板左缘、上下无缝，只有右侧圆角——另外两个角贴着框架。
         定位上下文是标题行之下的这层：卡片必须够到面板底缘。 */
      .fang-rail-layer{position:absolute;z-index:var(--fang-layer-rail);
        inset:var(--fang-titlebar-height) 0 0 0;
        /* 是一层，不是一块面：不画任何东西也不接点击，收起的侧栏不能吞掉页面
           自己的点击。 */
        pointer-events:none}
      .fang-rail{position:absolute;inset:0 auto 0 0;width:var(--fang-rail-w);pointer-events:auto;
        display:flex;flex-direction:column;min-height:0;
        background:var(--fang-surface);border:none;
        border-radius:0 var(--fang-radius-lg) var(--fang-radius-lg) 0;
        /* 左进卡片的影子：它锚在左框上、从左缘进来，影子甩向右，背离锚点。 */
        box-shadow:var(--fang-panel-rim),var(--fang-panel-shadow-right);
        animation:fang-rail-in var(--fang-duration-open) var(--ds-ease-in-out,ease-in-out) both}
      @keyframes fang-rail-in{from{transform:translateX(-18px);opacity:0}to{transform:none;opacity:1}}
      /* 离场是入场倒放，而且更快：退场只需要让路。收起的覆盖层在时长内保留节点，
         动画才被看见，而不是帧与帧之间凭空消失。 */
      .fang-closing .fang-rail{animation:fang-rail-out var(--fang-duration-close) var(--ds-ease-in-out,ease-in-out) both}
      @keyframes fang-rail-out{from{transform:none;opacity:1}to{transform:translateX(-18px);opacity:0}}
      .fang-rail-collapsed{display:none}
      /* 遮纱是透明的：侧栏开着时页面仍可读，压在手稿上的一层变暗会毁掉瞥一眼目录
         的意义。 */
      .fang-rail-scrim{position:absolute;inset:0;z-index:calc(var(--fang-layer-rail) - 1);background:transparent}
      /* 这几个间距原本是写在个别元素上的行内样式。它们和上面的刻度是同样的档位，
         按用途命名——两行之间的距离、字段下面提示的距离——JSX 说清间距是干什么
         的，数字和所有其他数字住在一起。 */
      .fang-gap-under-row{margin-bottom:var(--fang-space-12)}
      .fang-gap-under-hint{margin-bottom:var(--fang-space-8)}
      .fang-gap-over-row{margin-top:var(--fang-space-8)}
      .fang-gap-over-section{margin-top:var(--fang-space-12)}
      .fang-main{flex:1 1 auto;min-width:0}
      /* 标准页：主列里的一页。吃满剩余空间、竖向排布，四边内边距取 frame-gutter——
         与标题行的左右外边距同一个数，页内容和标题分隔线天然对齐。需要贴边的特殊
         页（编辑器那类）不用它：fang-main 是角色，内边距由页自己决定。 */
      .fang-page{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;min-width:0;
        padding:var(--fang-frame-gutter)}
      /* 底部状态条：一行小字，整条横贯框架底缘。三列网格（左读数、中位、右读数）
         是参考实现给的形状——角落的读数不挤、中间的居中、两侧内容各占其半。 */
      .fang-statusbar{flex:0 0 auto;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);position:relative;
        align-items:center;gap:var(--fang-space-12);
        height:var(--fang-statusbar-height);padding:0 var(--fang-space-16);
        font-size:var(--fang-font-size-sm);line-height:var(--fang-line-height-sm);color:var(--fang-ink-tertiary);
        border:none;background:var(--fang-bg);white-space:nowrap;overflow:visible}
      .fang-rail-toggle{display:inline-flex;align-items:center;justify-content:center;
        /* 命中的是共享目标档，不是紧凑行档：它是标题行的第一个控件，同排按钮都在
           36px，同一档它才和别的东西一样够得着。 */
        width:var(--fang-btn-height-lg);height:var(--fang-btn-height-lg);padding:0;
        border:none;background:transparent;color:var(--fang-ink-primary);cursor:pointer;white-space:nowrap;
        border-radius:var(--fang-radius-pill);flex:none;corner-shape:round}
      /* 侧栏自己的滚动盒填满卡片：章节稍多的书里树都比卡片长，按内容定高的盒子会把
         最后一行推过底缘，而不是滚到它。 */
      .fang-rail .fang-scroll{flex:1 1 auto;min-height:0}
      .fang-scroll{overflow:auto;padding:var(--fang-space-12);min-height:0;min-width:0}
      /* 行与占位。 */
      .fang-row{display:flex;gap:var(--fang-space-8);align-items:center;min-width:0}
      .fang-spacer{flex:1 1 auto;min-width:0}
      .fang-muted{color:var(--fang-ink-tertiary);font-size:var(--fang-font-size-sm);line-height:var(--fang-line-height-sm)}
      /* 共享的主从分栏。 */
      .fang-split{display:flex;gap:var(--fang-space-12);flex:1 1 auto;min-height:var(--fang-split-min-h);min-width:0}
      .fang-split-list{flex:0 0 var(--fang-split-list-w);min-width:0;min-height:0;
        display:flex;flex-direction:column;overflow:hidden;padding:0}
      .fang-split-detail{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;min-height:0;
        overflow:hidden;border:var(--fang-hairline) solid var(--fang-ink-edge);
        border-radius:var(--fang-radius-md);corner-shape:round;background:var(--fang-surface)}
      .fang-split-detail-head{display:flex;align-items:baseline;gap:var(--fang-space-8);flex:none;
        padding:var(--fang-space-12) var(--fang-space-16);
        border-bottom:var(--fang-hairline) solid var(--fang-ink-hair)}
      .fang-split-detail-title{margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
        font-size:var(--fang-font-size-lg);line-height:var(--fang-line-height-lg);font-weight:var(--fang-font-weight-strong);
        color:var(--fang-ink-primary)}
      .fang-split-detail-meta{flex:none;margin-left:auto;font-size:var(--fang-font-size-sm);line-height:var(--fang-line-height-sm);
        color:var(--fang-ink-tertiary)}
      .fang-split-detail-body{flex:1 1 auto;min-height:0;overflow:auto;
        display:flex;flex-direction:column;gap:var(--fang-space-12);padding:var(--fang-space-16)}
      .fang-list-row-meta{min-width:0;font-size:var(--fang-font-size-sm);line-height:var(--fang-line-height-sm);
        color:var(--fang-ink-secondary)}
`
