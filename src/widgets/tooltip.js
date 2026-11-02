/**
 * 工具提示层：库自己画的气泡，不用浏览器的 title 原生气泡。
 *
 * 调用方照常写 title 属性——这一层在根节点上监听指针进入带 title 的元素，把
 * 属性先收起来（系统气泡就不出了），在控件下方画一个库样式的气泡：控件上方的
 * 空间常被栏占着，下方多半是空的。移开时属性放回去、气泡收起；一小段延迟免得
 * 扫过一排按钮时闪烁。
 */
import { React, h } from '../react.js'

export function TooltipLayer({ rootRef }) {
  const [tip, setTip] = React.useState(null)
  const held = React.useRef(null)
  React.useEffect(() => {
    const root = rootRef?.current
    if (root === null || root === undefined) return undefined
    let timer = null
    const hide = () => {
      if (timer !== null) { globalThis.clearTimeout(timer); timer = null }
      const heldTip = held.current
      if (heldTip !== null) {
        heldTip.el.setAttribute('title', heldTip.title)
        held.current = null
      }
      setTip(null)
    }
    const show = (el) => {
      const text = el.getAttribute('title')
      if (text === null || text === '') return
      held.current = { el, title: text }
      el.removeAttribute('title')
      timer = globalThis.setTimeout(() => {
        const rect = el.getBoundingClientRect()
        const shellRect = root.getBoundingClientRect()
        setTip({
          text,
          left: Math.max(8, Math.min(rect.left + rect.width / 2 - shellRect.left, shellRect.width - 8)),
          top: rect.bottom - shellRect.top + 6,
        })
      }, 400)
    }
    const onOver = (e) => {
      const el = e.target?.closest?.('[title]')
      if (el === null || el === undefined || el === held.current?.el) return
      hide()
      show(el)
    }
    const onOut = (e) => {
      const heldTip = held.current
      if (heldTip === null) return
      const to = e.relatedTarget
      if (to !== null && to !== undefined && heldTip.el.contains(to)) return
      hide()
    }
    root.addEventListener('pointerover', onOver, true)
    root.addEventListener('pointerout', onOut, true)
    root.addEventListener('pointerdown', hide, true)
    return () => {
      root.removeEventListener('pointerover', onOver, true)
      root.removeEventListener('pointerout', onOut, true)
      root.removeEventListener('pointerdown', hide, true)
      hide()
    }
  }, [rootRef])
  if (tip === null) return null
  return h('div', { className: 'fang-tip', role: 'tooltip', style: { left: tip.left, top: tip.top } }, tip.text)
}
