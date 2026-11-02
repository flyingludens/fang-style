/**
 * 覆盖层三件套：右侧滑入的抽屉、居中的弹窗、模态确认框。
 *
 * 抽屉给「写的时候要查阅」的参考面板用：一次一个，Escape、点背板或关闭按钮收起，
 * 入场从边缘滑入、贴边、只在内侧圆角——和从左缘进来的侧栏是同一套动作。size 报
 * 宽度档，不报像素。
 *
 * 弹窗给阅读面用（合并稿、风格档案这类要摊开读的东西），三种关法与抽屉一致。
 *
 * 确认框默认 danger：调用方里除了建书都是确认删除，默认红省得每个调用点记得把
 * 按钮画红。Escape 和背板点击都算取消，和一切宿主弹窗一致。
 *
 * 文案是普通字符串 props（closeLabel/confirmLabel/cancelLabel），由调用方决定。
 */
import { React, h } from '../react.js'

export function Drawer({ title, children, onClose, size, bodyClassName, closing = false, closeLabel = '关闭' }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); onClose() } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  return h('div', {
    className: `fang-backdrop${closing ? ' fang-closing' : ''}`, role: 'presentation',
    onMouseDown: (e) => { if (e.target === e.currentTarget) onClose() },
  },
    h('div', {
      className: 'fang-drawer', role: 'dialog', 'aria-label': title,
      // 宽度档，不是像素数：要给图示留地方的面板在宽度阶梯上报一档，样式表把档位
      // 变成确定宽度。不报档就随内容伸缩，适合只有两行的清单。
      'data-size': size,
      style: size === undefined ? undefined : { '--fang-drawer-max': `var(--fang-width-${size})` },
    },
      h('div', { className: 'fang-drawer-head' },
        h('h2', { className: 'fang-drawer-title' }, title),
        h('span', { className: 'fang-spacer' }),
        h('button', {
          type: 'button', className: 'fang-btn fang-btn-ghost', title: closeLabel,
          onClick: onClose,
        }, '✕')),
      h('div', { className: `fang-drawer-body${bodyClassName === undefined ? '' : ` ${bodyClassName}`}` }, children)))
}

export function ConfirmDialog({ title, children, confirmLabel = '确定', cancelLabel = '取消', onConfirm, onCancel, busy, danger = true }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); onCancel() } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])
  return h('div', {
    className: 'fang-backdrop', role: 'presentation',
    onMouseDown: (e) => { if (e.target === e.currentTarget) onCancel() },
  },
    h('div', {
      className: 'fang-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': title,
    },
      h('div', { className: 'fang-dialog-title' }, title),
      h('div', { className: 'fang-dialog-body' }, ...(children ?? [])),
      h('div', { className: 'fang-dialog-actions' },
        h('button', { type: 'button', className: 'fang-btn', onClick: onCancel }, cancelLabel),
        h('button', {
          type: 'button', className: `fang-btn fang-btn-primary${danger ? ' fang-danger' : ''}`, disabled: busy === true,
          onClick: onConfirm,
        }, confirmLabel))))
}

export function Dialog({ title, children, onClose, size, bodyClassName, panelClassName, backdropClassName, closeLabel = '关闭' }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); onClose() } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  const body = Array.isArray(children) ? children : children === undefined ? [] : [children]
  return h('div', {
    className: `fang-backdrop${backdropClassName === undefined ? '' : ` ${backdropClassName}`}`, role: 'presentation',
    onMouseDown: (e) => { if (e.target === e.currentTarget) onClose() },
  },
    h('div', {
      className: `fang-dialog fang-dialog-panel${panelClassName === undefined ? '' : ` ${panelClassName}`}`, role: 'dialog', 'aria-modal': 'true', 'aria-label': title,
      style: size === undefined ? undefined : { '--fang-dialog-width': `var(--fang-width-${size})` },
    },
      h('div', { className: 'fang-dialog-head' },
        h('h2', { className: 'fang-dialog-title' }, title),
        h('span', { className: 'fang-spacer' }),
        h('button', { type: 'button', className: 'fang-btn fang-btn-ghost', title: closeLabel, onClick: onClose }, '✕')),
      h('div', { className: `fang-dialog-body fang-dialog-scroll${bodyClassName === undefined ? '' : ` ${bodyClassName}`}` }, ...body)))
}
