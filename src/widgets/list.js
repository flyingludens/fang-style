/**
 * 清单与主从分栏。
 *
 * List 是一列可比较的行：行与行之间没有缝，每行自带发丝描边，指针下的行浮起，
 * 选中是同一个浮起加更重的填充。ListRow 是其中一行：传 onActivate 就是按钮
 * （导航行），不传就是 div——按钮套按钮不合法，浏览器解决的办法是吞掉其中一个
 * 的点击，所以只装内容的行必须是 div。
 *
 * SplitPane 是左侧导航列加右侧阅读格的主从布局。页面自己造行和正文，这里只决定
 * 两者的关系，几个用它的页面不会各自漂成三副模样。
 */
import { React, h } from '../react.js'

export function SplitPane({ list, detail, listProps, detailProps }) {
  const rows = Array.isArray(list) ? list : list === undefined ? [] : [list]
  const body = Array.isArray(detail) ? detail : detail === undefined ? [] : [detail]
  return h('div', { className: 'fang-split' },
    h('div', { className: 'fang-split-list', ...(listProps ?? {}) }, ...rows),
    h('section', { className: 'fang-split-detail', ...(detailProps ?? {}) }, ...body))
}

export function List({ className, children, ...rest }) {
  const rows = Array.isArray(children) ? children : children === undefined ? [] : [children]
  return h('div', {
    className: `fang-list${className === undefined ? '' : ` ${className}`}`,
    ...rest,
  }, ...rows)
}

export function ListRow({ className, active, onActivate, children, ...rest }) {
  const rows = Array.isArray(children) ? children : children === undefined ? [] : [children]
  const interactive = typeof onActivate === 'function'
  return h(interactive ? 'button' : 'div', {
    ...(interactive ? { type: 'button', onClick: onActivate } : {}),
    ...rest,
    className: `fang-list-row${className === undefined ? '' : ` ${className}`}`,
    'data-active': active === true ? 'true' : undefined,
  }, ...rows)
}
