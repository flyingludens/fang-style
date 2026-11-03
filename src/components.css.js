/**
 * 库的组件样式：清单、下拉、文件按钮、按钮族、工具提示、抽屉与弹窗、分段控件，
 * 以及行内的小记号（chevron）。
 *
 * 顺序即层叠：背板的公共规则在前，抽屉的变体紧随其后覆盖它。
 */
export const FANG_COMPONENTS = `
      /* 背板。弹窗与抽屉共用一个类：公共骨架是弹窗的——居中、调暗、模糊，压在
         modal 层；抽屉的背板不是模态，由下面一条按子元素区分的规则接管几何。 */
      .fang-backdrop{position:absolute;inset:0;z-index:var(--fang-layer-modal);display:flex;align-items:center;justify-content:center;
        padding:var(--fang-space-24);background:color-mix(in srgb, var(--fang-bg) 62%, transparent);
        backdrop-filter:blur(2px)}
      /* 抽屉的背板不调暗：滑入的面板不是模态，旁边的正文保持可读、仍是正在工作的
         表面。变暗说了「关掉之前不许用」，而抽屉是写作时查阅的参考——它的分离靠
         面板自己的飞出阴影。这层保留是因为它是点击收起的目标和定位上下文。 */
      .fang-backdrop:has(> .fang-drawer){inset:var(--fang-titlebar-height) 0 0 0;z-index:var(--fang-layer-drawer);
        align-items:stretch;justify-content:flex-end;padding:0;background:transparent;backdrop-filter:none}
      /* 抽屉：从右缘进来的面板，全高，只在内侧圆角——贴框的两个角保持直角。
         深度是两件事：飞出阴影（甩向左，来的方向）加顶缘的内缘光。 */
      .fang-drawer{display:flex;flex-direction:column;
        height:100%;max-height:none;overflow:hidden;
        border:none;border-radius:var(--fang-radius-panel) 0 0 var(--fang-radius-panel);
        background:var(--fang-surface-high);
        box-shadow:var(--fang-panel-rim),var(--fang-panel-shadow-left);
        font-family:var(--fang-font-family);font-size:var(--fang-font-size-md);line-height:var(--fang-line-height-ui);
        color:var(--fang-ink-primary);animation:fang-drawer-in var(--fang-duration-open) var(--ds-ease-in-out,ease-in-out) both;
        /* 宽度跟随内容，而不是档位：内容要多宽就取多宽，有地板让单行面板不成条，
           有上限可被页面抬高，再被窗口封顶。报了宽度档的面板保持档宽。 */
        width:fit-content;min-width:min(320px,100%);
        max-width:min(var(--fang-drawer-max),100%)}
      .fang-drawer[data-size]{width:var(--fang-drawer-max)}
      @keyframes fang-drawer-in{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}
      .fang-closing .fang-drawer{animation:fang-drawer-out var(--fang-duration-close) var(--ds-ease-in-out,ease-in-out) both}
      @keyframes fang-drawer-out{from{transform:none;opacity:1}to{transform:translateX(24px);opacity:0}}
      .fang-closing .fang-backdrop:has(> .fang-drawer){animation:fang-scrim-out var(--fang-duration-close) ease both}
      @keyframes fang-scrim-out{from{opacity:1}to{opacity:0}}
      @media (max-width: 640px){
        /* 这个宽度以下内容无法在比窗口窄的列里排开自己，面板占满全宽、去掉内侧
           圆角。 */
        .fang-drawer{width:100%;min-width:0;border-radius:0}
      }
      .fang-drawer-head{display:flex;align-items:center;gap:var(--fang-space-8);padding:var(--fang-space-16) var(--fang-space-16) var(--fang-space-12);flex:none;
        border-bottom:var(--fang-hairline) solid var(--fang-border-edge)}
      .fang-drawer-title{margin:0;font-size:var(--fang-font-size-lg);line-height:var(--fang-line-height-lg);font-weight:var(--fang-font-weight-strong)}
      .fang-drawer-body{flex:1 1 auto;min-height:0;overflow:auto;padding:var(--fang-space-16)}

      /* 弹窗：面板上居中的一张圆角卡。absolute 而不是 fixed——fixed 是「对着视口」，
         而库挂在宿主会裁剪内容的列里，被裁的祖先之上放 fixed 覆盖层只会切边、偏位。 */
      .fang-dialog{width:min(var(--fang-dialog-width),100%);display:flex;flex-direction:column;gap:var(--fang-padding-md);padding:var(--fang-padding-xl);
        border-radius:var(--fang-radius-panel);corner-shape:round;border:var(--fang-hairline) solid var(--fang-border-edge);
        background:var(--fang-surface-high);box-shadow:var(--fang-dialog-shadow);
        font-family:var(--fang-font-family);font-size:var(--fang-font-size-md);line-height:var(--fang-line-height-ui);color:var(--fang-ink-primary)}
      .fang-dialog-title{font-size:var(--fang-font-size-lg);line-height:var(--fang-line-height-lg);font-weight:var(--fang-font-weight-strong)}
      /* 阅读型弹窗：头部固定（带关闭钮），正文滚动。面板限高，长文保持一个弹窗
         而不是长成一页。 */
      .fang-dialog-panel{max-height:min(84vh,var(--fang-dialog-max-h))}
      .fang-dialog-head{display:flex;align-items:center;gap:var(--fang-space-8);flex:none}
      .fang-dialog-scroll{flex:1 1 auto;min-height:0;overflow:auto}
      .fang-dialog-body{display:flex;flex-direction:column;gap:var(--fang-space-8);color:var(--fang-ink-secondary)}
      .fang-dialog-actions{display:flex;justify-content:flex-end;gap:var(--fang-space-8);margin-top:var(--fang-space-4)}

      /* 清单：章节、提案、快照都是「一列可比较的行」——每行自带发丝描边，行间无缝，
         指针下的行浮起，选中是同一个浮起加更重的填充。 */
      .fang-list{display:flex;flex-direction:column;gap:var(--fang-space-2);min-width:0;min-height:0;flex:1 1 auto;overflow:auto;
        padding:var(--fang-space-4);
        border:var(--fang-hairline) solid var(--fang-ink-edge);border-radius:var(--fang-radius-md);corner-shape:round;
        background:var(--fang-surface)}
      .fang-list-row{position:relative;display:flex;flex-direction:column;gap:var(--fang-space-2);
        width:100%;min-width:0;box-sizing:border-box;
        padding:var(--fang-list-row-padding-y) var(--fang-space-12);
        border:none;background:transparent;text-align:left;font-family:inherit;
        color:var(--fang-ink-primary);
        border-radius:var(--fang-radius-sm);corner-shape:round;
        transition:background var(--ds-transition-duration-fast,140ms) var(--ds-ease-in-out,ease-in-out)}
      .fang-list-row:hover{background:var(--fang-list-hover)}
      .fang-list-row[data-active="true"]{background:var(--fang-selected-fill);
        color:var(--fang-ink-primary)}
      button.fang-list-row{cursor:pointer}

      /* 下拉：原生的选项列表画在系统弹层里，不理会面板的叠放次序还会被抽屉裁掉；
         这个列表是面板的子元素，永远在它上面。 */
      .fang-dropdown{position:relative;display:inline-flex;min-width:0;max-width:100%}
      .fang-dropdown-button{box-sizing:border-box;display:inline-flex;align-items:center;gap:var(--fang-space-8);
        width:100%;height:var(--fang-row-height);padding:0 var(--fang-space-12);
        border:none;border-radius:var(--fang-radius-sm);background:var(--fang-surface);
        color:var(--fang-ink-primary);font-family:inherit;
        font-size:var(--fang-font-size-md);line-height:var(--fang-line-height-md);text-align:left;
        cursor:pointer;outline:none;white-space:nowrap}
      .fang-dropdown-button:hover{background:var(--fang-hover-fill)}
      .fang-dropdown-button:focus-visible{box-shadow:0 0 0 var(--fang-focus-ring-width) var(--fang-focus-ink)}
      .fang-dropdown-value{min-width:0;overflow:hidden;text-overflow:ellipsis}
      .fang-dropdown-list{position:absolute;z-index:var(--fang-layer-menu);top:calc(100% + 4px);left:0;
        display:flex;flex-direction:column;min-width:100%;max-width:min(320px,calc(100vw - 48px));
        max-height:min(46vh,320px);overflow:auto;padding:var(--fang-space-4);
        border-radius:var(--fang-radius-md);corner-shape:round;background:var(--fang-surface-high);
        box-shadow:var(--fang-menu-shadow);
        scrollbar-width:thin}
      .fang-dropdown-option{display:block;width:100%;padding:var(--fang-space-8) var(--fang-space-12);
        border:none;border-radius:var(--fang-radius-sm);corner-shape:round;background:transparent;
        color:var(--fang-ink-primary);font-family:inherit;
        font-size:var(--fang-font-size-md);line-height:var(--fang-line-height-md);text-align:left;
        cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .fang-dropdown-option:hover{background:var(--fang-hover-fill)}
      .fang-dropdown-option[aria-selected="true"]{background:var(--fang-selected-fill);
        color:var(--fang-ink-primary);font-weight:var(--fang-font-weight-strong)}
      /* 文件选择：可见的控件是库的按钮，input 本体藏起来。 */
      .fang-file-button{display:inline-flex;align-items:center;min-width:0}
      .fang-file-input{position:absolute;width:0;height:0;opacity:0;pointer-events:none}

      /* 按钮：带悬停水洗的文字，不是描边小胶囊——环着描边的写作面读作表单。
         等高胶囊：一个高度令牌，形状由 pill 半径闭合，只装图标的圆按钮从等宽等高
         自然得出。 */
      .fang-btn{font-family:inherit;font-size:var(--fang-font-size-md);line-height:var(--fang-line-height-md);
        height:var(--fang-btn-height,var(--fang-btn-height-lg));min-width:var(--fang-btn-height,var(--fang-btn-height-lg));
        padding:0 var(--fang-space-12);
        display:inline-flex;align-items:center;justify-content:center;
        border-radius:var(--fang-radius-pill);border:none;corner-shape:round;
        background:transparent;color:var(--fang-ink-secondary);cursor:pointer;white-space:nowrap;flex:none}
      .fang-btn:hover:not(:disabled){background:var(--fang-hover-fill);color:var(--fang-ink-primary)}
      .fang-btn:active:not(:disabled){background:var(--fang-active-fill);color:var(--fang-ink-primary)}
      .fang-btn:focus-visible{box-shadow:0 0 0 var(--fang-focus-ring-width) var(--fang-focus-ink);outline:none}
      .fang-btn:disabled{opacity:.45;cursor:not-allowed}
      /* 肯定按钮填强调色，像其他一切「就是它」的东西。横向内边距比别的按钮高一步：
         胶囊两端的弧是形状里最宽的东西，端点之间那段直的跑起来才读作胶囊，短标签
         需要这点余量把它亮出来。 */
      .fang-btn-primary{background:var(--fang-accent);color:var(--fang-on-accent);
        padding:0 var(--fang-space-16)}
      .fang-btn-primary:hover:not(:disabled){background:color-mix(in srgb, var(--fang-accent) 86%, #000000);color:var(--fang-on-accent)}
      /* 危险按钮：ConfirmDialog 的 danger=true 用它。复合在 fang-btn 上而不是单类——
         单类会被后加载的 fang-btn 基色盖成死规则。填充从强调色换成 --fang-danger
         （error 红），悬停加深与主按钮同一配方。 */
      .fang-btn.fang-danger{background:var(--fang-danger);color:var(--fang-on-accent)}
      .fang-btn.fang-danger:hover:not(:disabled){background:color-mix(in srgb, var(--fang-danger) 86%, #000000);color:var(--fang-on-accent)}
      /* 一页只有一个动作时的主按钮尺寸：同一架梯子上的一档，高、字距、内边距一起动。 */
      .fang-btn.fang-btn-xl{--fang-btn-height:var(--fang-btn-height-xl);font-size:var(--fang-font-size-lg);line-height:var(--fang-line-height-lg);
        padding:0 var(--fang-space-24)}
      .fang-btn-ghost{background:transparent;padding:0 var(--fang-space-8);color:var(--fang-ink-tertiary)}
      .fang-btn-ghost:hover:not(:disabled){background:var(--fang-hover-fill);color:var(--fang-ink-primary)}
      .fang-btn-ghost:active:not(:disabled){background:var(--fang-active-fill);color:var(--fang-ink-primary)}
      /* 只装图标的按钮和其他按钮是同一个 36px 控件：一个高度令牌、一个 pill 半径、
         没有文字内边距，加一圈发丝内描边让它浮出底色。 */
      .fang-btn-ghost.fang-btn-icon{padding:0;background:var(--fang-bg);
        box-shadow:inset 0 0 0 var(--fang-hairline) var(--fang-ink-edge)}
      /* 按下态（aria-pressed）：选中填充。 */
      .fang-btn[aria-pressed="true"]:not(:disabled),.fang-btn[aria-pressed="true"]:hover:not(:disabled){background:var(--fang-selected-fill);color:var(--fang-ink-primary)}

      /* 工具提示：从控件向下的深色气泡，带一个指回它的小尖。坐在所有浮层共用的
         灰层上——一张浮起的卡，而不是比页面更暗的混色。 */
      .fang-tip{position:absolute;z-index:var(--fang-layer-menu);transform:translateX(-50%);
        pointer-events:none;padding:var(--fang-space-4) var(--fang-space-12);
        border:var(--fang-hairline) solid color-mix(in srgb, var(--fang-highlight) 14%, transparent);border-radius:var(--fang-radius-sm);corner-shape:round;
        background:var(--fang-surface);
        color:var(--fang-highlight);font-size:var(--fang-font-size-sm);line-height:var(--fang-line-height-sm);
        white-space:nowrap;box-shadow:0 2px 8px color-mix(in srgb, var(--fang-shade) 30%, transparent)}
      .fang-tip::after{content:'';position:absolute;top:calc(-1 * var(--fang-space-4));left:calc(50% - var(--fang-space-4));
        width:var(--fang-space-8);height:var(--fang-space-8);background:inherit;
        transform:rotate(45deg);border-radius:var(--fang-hairline)}

      /* 行内小记号：行尾的开合箭头。 */
      .fang-chevron{flex:0 0 auto;width:var(--fang-icon-xs);height:var(--fang-icon-xs);color:var(--fang-ink-tertiary);
        transition:transform 120ms ease}
      .fang-chevron[data-open="true"]{transform:rotate(180deg)}
      .fang-chevron-right{flex:0 0 auto;width:var(--fang-icon-xs);height:var(--fang-icon-xs);color:var(--fang-ink-tertiary)}

      /* 分段选择：一条轨道，选中的档位浮在轨内。轨道有确定的高度。 */
      .fang-segmented{display:inline-flex;align-items:center;gap:var(--fang-space-2);min-width:0;padding:var(--fang-space-2);
        height:var(--fang-segmented-height);
        border-radius:var(--fang-radius-pill);corner-shape:round;background:var(--fang-surface);
        box-shadow:inset 0 0 0 var(--fang-hairline) var(--fang-border-hair)}
      .fang-segmented-item{font-family:inherit;font-size:var(--fang-font-size-sm);line-height:var(--fang-line-height-sm);padding:var(--fang-space-2) var(--fang-space-12);
        border:none;border-radius:var(--fang-radius-pill);background:transparent;corner-shape:round;
        color:var(--fang-ink-secondary);cursor:pointer;white-space:nowrap}
      .fang-segmented-item:hover{background:var(--fang-hover-fill);color:var(--fang-ink-primary)}
      .fang-segmented-item:active{background:var(--fang-active-fill)}
      .fang-segmented-item:focus-visible{outline:none;
        box-shadow:0 0 0 var(--fang-focus-ring-width) var(--fang-focus-ink)}
      .fang-segmented-item[aria-pressed="true"]{background:var(--fang-selected-fill);
        color:var(--fang-ink-primary);
        box-shadow:inset 0 0 0 var(--fang-hairline) var(--fang-border-strong)}
`
