/**
 * 库的令牌表：颜色、间距、圆角、字号、宽度、层级与动效，库里一切的取值都从这里读。
 *
 * 令牌声明在 .fang-shell 上，库内其余规则都是它的后代，因此都能读到。默认值取深色
 * 主题：面板实际运行在近黑的底上，宿主主题缺失时库依然完整可见。宿主想换肤，就在
 * 自己的样式里覆盖这些令牌（本项目的桥接把 dsh 的变量映射到这里）。
 *
 * 引用规则：这份表里的 var() 只指向 --fang-* 或字面量，不认识任何宿主变量；原来
 * 写在令牌里的宿主回退值已并入这里，不再二级回退。
 */
export const FANG_TOKENS = `
      .fang-shell{
        /* 强调色只有一个出处：焦点环、选中态、卡片描边、主按钮都读这一个变量。
           朱红 #c3272b 是库自己的颜色，不是宿主的品牌色——宿主品牌在深色主题上
           近白，用它画的一切都会消失在近黑的页面上。写字面量而不是 var() 回退：
           回退值是另一个 var() 时不是回退，无主题环境下整条声明失效，一切安静地
           什么都不画。 */
        --fang-accent:#c3272b;
        --fang-on-accent:#ffffff;
        /* 危险动作色：菜单里「删除」一类的文字与填充。默认值是搬进库之前项目回退
           链最终解析到的 #ec1313，不是猜测值。 */
        --fang-danger:#ec1313;
        /* 页面地色：纯黑是决定，不是沿用宿主的 bg——宿主的基色在运行的深色主题上
           是一种灰。分层表面在它上面读作浮起的一层。 */
        --fang-bg:#000;
        /* 文字墨色三层：标题与数值（primary）、正文与控件（secondary）、标签、元数据
           和禁用文案（tertiary）。默认值直接取深色主题的墨色，宿主缺失时库仍可读。 */
        --fang-ink-primary:#f2f2f3;
        --fang-ink-secondary:#b8b8bd;
        --fang-ink-tertiary:#8e8e93;
        /* 两个表面层与三档描边。描边是白色的低透明度而不是黑色的——黑色的低透明度
           描边画在近黑底上等于没有。宿主接入时在桥接里覆盖这几个令牌。 */
        --fang-bg-layer-1:#1c1c1e;
        --fang-bg-layer-2:#2c2c2e;
        --fang-border-hair:#ffffff14;
        --fang-border-edge:#ffffff1f;
        --fang-border-strong:#ffffff29;
        --fang-focus-ring-width:2px;
        /* 间距刻度：六档，4px 基准。2px 是发丝级的一步，其余布局距离都在 4/8/12/16/24
           里。刻度按值命名而不是按大小（sm/md/lg）——名字是观点，数字是事实。 */
        --fang-space-2:2px;
        --fang-space-4:4px;
        --fang-space-8:8px;
        --fang-space-12:12px;
        --fang-space-16:16px;
        --fang-space-24:24px;
        /* 内边距刻度：控件的内部留白只有这四档，不写一次性数值。 */
        --fang-padding-xs:var(--fang-space-4);
        --fang-padding-sm:var(--fang-space-8);
        --fang-padding-md:var(--fang-space-12);
        --fang-padding-xl:var(--fang-space-24);
        /* 圆角刻度：五档加一个 pill。pill 不是尺寸，是「圆到盒子允许为止」的形状，
           4px 的点和 30px 的胶囊靠它同样成立。 */
        --fang-radius-xs:4px;
        --fang-radius-sm:8px;
        --fang-radius-md:12px;
        --fang-radius-lg:16px;
        --fang-radius-panel:28px;
        --fang-radius-pill:999px;
        /* 画深度用的两种墨：阴影是某个透明度的黑，浮起卡片顶缘的高光是白。 */
        --fang-shade:0,0,0;
        --fang-highlight:#fff;
        /* 键盘焦点墨色：不是宿主的焦点色（有的主题把它设成透明，焦点就不可见了）。
           从主墨色调出来，在纯黑地、灰色层和强调色填充上都读得出；每条规则自带
           自己的环几何。 */
        --fang-focus-ink:color-mix(in srgb, var(--fang-ink-primary) 45%, transparent);
        /* 两个浮起表面：从层色向地色调 72%，一步可见的分离，而不是整段落差。卡片、
           侧栏、菜单和气泡落在 surface；输入框、选中胶囊和抽屉落在 surface-high。 */
        --fang-surface:color-mix(in srgb, var(--fang-bg-layer-1) 72%, var(--fang-bg));
        --fang-surface-high:color-mix(in srgb, var(--fang-bg-layer-2) 72%, var(--fang-bg));
        /* 选中、悬停、按下三态填充。选中把墨色调进表面，在两种主题下都比「没选中」
           明显；悬停刻意比选中安静——悬停说「指针在这儿」，选中说「开着的就是这个」；
           按下在两者之间。 */
        --fang-selected-fill:color-mix(in srgb, var(--fang-ink-primary) 18%, var(--fang-surface));
        --fang-hover-fill:color-mix(in srgb, var(--fang-ink-primary) 9%, var(--fang-surface));
        --fang-active-fill:color-mix(in srgb, var(--fang-ink-primary) 14%, var(--fang-surface));
        --fang-list-hover:var(--fang-hover-fill);
        /* 墨色浓度四档，由淡到浓：whisper 3%（几乎不在场的记号）、hair 8%（内衬
           分隔线）、edge 14%（所有可见描边与环）、faint 45%（仍要读得出字符的占位
           字形）。写成整段 color-mix，规则声明的是它要的那一档，不是百分比。 */
        --fang-ink-whisper:color-mix(in srgb, var(--fang-ink-primary) 3%, transparent);
        --fang-ink-hair:color-mix(in srgb, var(--fang-ink-primary) 8%, transparent);
        --fang-ink-edge:color-mix(in srgb, var(--fang-ink-primary) 14%, transparent);
        --fang-ink-faint:color-mix(in srgb, var(--fang-ink-primary) 45%, transparent);
        /* 字号四档，按角色挑的：sm 12/18 给徽标、计数、键帽；md 13/20 是工作字号，
           几乎每个控件都继承它；lg 16/24 给分区与弹窗标题；xl 20/28 给页面标题。
           每一档自带行高——字号和行高是一个决定，拆开写两边就会漂。 */
        --fang-font-size-sm:12px;
        --fang-line-height-sm:18px;
        --fang-font-size-md:13px;
        --fang-line-height-md:20px;
        --fang-font-size-lg:16px;
        --fang-line-height-lg:24px;
        --fang-font-size-xl:20px;
        --fang-line-height-xl:28px;
        /* 两种行距节奏：1.6 给卡片和抽屉里的界面散文，1.65 给手稿本身。 */
        --fang-line-height-ui:1.6;
        --fang-line-height-reading:1.65;
        /* 字体族只声明一次。CJK 字体逐个点名：不点名时 CJK 回退按平台挑，同一份文档
           在两台机器上宽度不同。栈写成字面量而不是读宿主变量：库的文字度量是自己的。 */
        --fang-font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans CJK SC",Roboto,sans-serif;
        /* 三个字重：规则声明意图，不写数字。 */
        --fang-font-weight-normal:400;
        --fang-font-weight-medium:500;
        --fang-font-weight-strong:600;
        /* 等宽栈：键帽与模型 id。 */
        --fang-font-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
        /* 图标四档：12 行内、14 小动作、16 控件、18 标题行与侧栏。 */
        --fang-icon-xs:12px;
        --fang-icon-sm:14px;
        --fang-icon-md:16px;
        --fang-icon-lg:18px;
        /* 宽度阶梯：弹窗与抽屉报角色名（narrow/compact/...）而不是背数字，两个装
           同类内容的弹窗因此不会差出两百像素。 */
        --fang-width-narrow:340px;
        --fang-width-compact:440px;
        --fang-width-medium:620px;
        --fang-width-reading:720px;
        --fang-width-wide:820px;
        --fang-width-max:980px;

        /* ---- 组件几何 ---- */
        /* 标题行的高度：抽屉从它下面开始，这个数不能和它描述的那一行漂开。 */
        --fang-titlebar-height:68px;
        /* 按钮高度阶梯：独立按钮一档，文本行内的记号一档。行与输入框读上面的行高
           刻度——按钮和行是两架梯子。 */
        --fang-btn-height-xl:48px;
        --fang-btn-height-lg:36px;
        --fang-btn-height-sm:26px;
        /* 默认档：规则可以直接读 --fang-btn-height，不必各自背着回退链；要变档的
           变体在元素上覆盖它（xl 就是这么做的）。 */
        --fang-btn-height:var(--fang-btn-height-lg);
        /* 控件行高：菜单行是一行文字加它的内边距，两个回答同一个问题的菜单不能一个
           34 一个 32。 */
        --fang-row-height:34px;
        --fang-row-height-compact:26px;
        --fang-hit-target:44px;
        /* 卡片描边的那根发丝：1x 下半像素、2x 下一像素，浏览器自己取整；样式表里
           每层阴影的第一层都读它，描边和压在描边上的阴影不会漂开。 */
        --fang-hairline:.5px;
        /* 卡片阴影两种状态：贴地与浮起。存的是配方本身——发丝接触层、近距环境层、
           远距软层——颜色都是墨色的 color-mix，随令牌走。 */
        --fang-card-shadow:
          0 0 0 var(--fang-hairline) color-mix(in srgb, var(--fang-ink-primary) 6%, transparent),
          0 1px 2px color-mix(in srgb, var(--fang-ink-primary) 7%, transparent),
          0 6px 16px color-mix(in srgb, var(--fang-ink-primary) 6%, transparent);
        --fang-card-shadow-lift:
          0 0 0 var(--fang-hairline) color-mix(in srgb, var(--fang-ink-primary) 8%, transparent),
          0 2px 4px color-mix(in srgb, var(--fang-ink-primary) 9%, transparent),
          0 12px 26px color-mix(in srgb, var(--fang-ink-primary) 10%, transparent);
        /* 两个浮层阴影：下拉清单和弹窗。同一个配方——发丝接触层加一层远距软环境
           层——环境层比卡片阴影铺得更宽（12px 32px 对 6px 16px），浮在正文之上
           的东西影子也甩得更远。颜色仍是墨色的 mix：写死的黑在近黑地面上看不见，
           换主题时也不用宿主另配海拔。 */
        --fang-menu-shadow:
          0 0 0 var(--fang-hairline) color-mix(in srgb, var(--fang-ink-primary) 8%, transparent),
          0 12px 32px color-mix(in srgb, var(--fang-ink-primary) 16%, transparent);
        --fang-dialog-shadow:
          0 0 0 var(--fang-hairline) color-mix(in srgb, var(--fang-ink-primary) 8%, transparent),
          0 12px 32px color-mix(in srgb, var(--fang-ink-primary) 20%, transparent);
        /* 卡片的状态动效：阴影、位移、描边同一个时长。 */
        --fang-card-motion:box-shadow 140ms ease-in-out,
          transform 140ms ease-in-out,
          border-color 140ms ease-in-out;
        /* 面板阴影：给从页面滑入的整块表面用。方向不能共用一个令牌——从右进的把影子
           甩向左，从左进的甩向右。落点刻意短：6px 偏移加 20px 模糊刚好把表面托离
           页面，再宽就读作悬空。颜色永远是墨色的 mix，不是写死的黑。 */
        --fang-panel-shadow-left:
          0 0 0 var(--fang-hairline) color-mix(in srgb, var(--fang-ink-primary) 8%, transparent),
          -6px 0 20px color-mix(in srgb, var(--fang-ink-primary) 10%, transparent);
        --fang-panel-shadow-right:
          0 0 0 var(--fang-hairline) color-mix(in srgb, var(--fang-ink-primary) 8%, transparent),
          6px 0 20px color-mix(in srgb, var(--fang-ink-primary) 10%, transparent);
        /* 面板的内缘光：顶缘一道细亮线，让表面读得出厚度，而不是一块漆。inset，
           因为真实的光会擦亮这条边而不是它的外侧。 */
        --fang-panel-rim:
          inset 0 1px 0 0 color-mix(in srgb, var(--fang-ink-primary) 6%, transparent);
        /* 层级表：所有覆盖层的 z 都从这里取，顺序即规则——侧栏最低，菜单其上，
           抽屉更高，状态浮层在一切之上。 */
        --fang-layer-rail:30;
        --fang-layer-menu:60;
        --fang-layer-drawer:75;
        --fang-layer-status:80;
        --fang-layer-modal:90;
        /* 覆盖层动效对：开合共用一个时长，关门比开门快——入场要读，退场只需让路。 */
        --fang-duration-open:180ms;
        --fang-duration-close:140ms;
        /* 侧栏的宽度。 */
        --fang-rail-w:264px;
        /* 页面留白：框架两侧的内边距，宽于任何间距档，边上的空气要够画布读作画布。 */
        --fang-frame-gutter:28px;
        /* 抽屉与弹窗的默认尺寸。 */
        --fang-drawer-max:var(--fang-width-wide);
        --fang-dialog-width:var(--fang-width-compact);
        --fang-dialog-max-h:760px;
        /* 主从分栏：左列的宽，和分栏不再缩小的地板（再小就改为滚动）。 */
        --fang-split-list-w:220px;
        --fang-split-min-h:320px;
        /* 分段控件的轨道高度。同一名下曾有过 28 与 26 两个值，这里修成一个。 */
        --fang-segmented-height:28px;
        /* 清单行的竖向内边距：一直以来的实际值。间距刻度刻意没有 10 这一档，
           所以给它一个自己的名字，而不是让它变成规则里的裸数字。 */
        --fang-list-row-padding-y:10px;
      }
`
