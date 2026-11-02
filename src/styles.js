/**
 * 库的整张样式表，一个模板字符串。
 *
 * 顺序即层叠：令牌最先（一切规则读它），框架其次（其余规则布局在它里面），
 * 组件最后。调用方把 FANG_CSS 注入一个 style 元素即可，位置在它自己的
 * 样式之前，让宿主样式能覆盖库的默认值。
 */
import { FANG_TOKENS } from './tokens.css.js'
import { FANG_FRAME } from './frame.css.js'
import { FANG_COMPONENTS } from './components.css.js'

export const FANG_CSS = `${FANG_TOKENS}
${FANG_FRAME}
${FANG_COMPONENTS}`
