/**
 * 下拉选择：库自己的 select，和配它的小箭头。
 *
 * 原生 select 的选项列表画在系统弹层里，不理会库的叠放次序，还会被它打开所在的
 * 抽屉裁掉。这个组件把选项列表开在库的内部、压在菜单层上，点外面或按 Escape
 * 收起，ArrowDown/ArrowUp 也能换选项。
 *
 * Chevron 是画出来的而不是字符：字符字形和图标不在同一条基线上。direction 为
 * right 时画向右指的那个，其余画向下开合的那个，张开时翻转半圈。
 */
import { React, h } from '../react.js'
import { useDismiss } from '../hooks.js'

export function Chevron({ open, direction }) {
  const down = direction !== 'right'
  return h('svg', {
    className: down ? 'fang-chevron' : 'fang-chevron-right',
    viewBox: '0 0 16 16', width: 12, height: 12, 'aria-hidden': true,
    ...(down ? { 'data-open': open === true ? 'true' : 'false' } : {}),
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
  }, h('path', { d: down ? 'M4 6.5 8 10.5 12 6.5' : 'M6.5 4 10.5 8 6.5 12' }))
}

export function Dropdown({ label, value, options, onChange, testId, className }) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef(null)
  useDismiss(rootRef, open, () => setOpen(false))
  const rows = Array.isArray(options) ? options : []
  const current = rows.find((option) => option.value === value) ?? rows[0]
  const pick = (next) => { setOpen(false); onChange(next) }
  return h('div', {
    className: `fang-dropdown${className === undefined ? '' : ` ${className}`}`,
    ref: rootRef, 'data-testid': testId,
  },
    h('button', {
      type: 'button', className: 'fang-dropdown-button',
      'aria-haspopup': 'listbox', 'aria-expanded': open ? 'true' : 'false', 'aria-label': label,
      onClick: () => setOpen((was) => !was),
      onKeyDown: (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
        event.preventDefault()
        const at = rows.findIndex((option) => option.value === value)
        const step = event.key === 'ArrowDown' ? 1 : -1
        const next = rows[Math.min(rows.length - 1, Math.max(0, (at < 0 ? 0 : at) + step))]
        if (next !== undefined) pick(next.value)
      },
    },
      h('span', { className: 'fang-dropdown-value' }, current === undefined ? '' : current.label),
      h(Chevron, { open })),
    open ? h('div', { className: 'fang-dropdown-list', role: 'listbox', 'aria-label': label },
      rows.map((option) => h('button', {
        key: option.value, type: 'button', className: 'fang-dropdown-option', role: 'option',
        'aria-selected': option.value === value ? 'true' : 'false',
        onClick: () => pick(option.value),
      }, option.label))) : null)
}
