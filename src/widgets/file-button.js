/**
 * 文件选择按钮：看得见的控件是库自己的按钮。
 *
 * 浏览器总得弹它自己的系统文件面板才能读到字节，这一步谁也免不了；但触发按钮、
 * 它的标签和焦点态是库的，而不是浏览器画的一个裸 input。
 *
 * 单选给 onFile（一个 File）；multiple 给 onFiles（File 数组）——两个回调并存，
 * 调用方按需取一，input 的 multiple 属性随回调的存在决定。
 */
import { React, h } from '../react.js'

export function FileButton({ label, accept, multiple = false, onFile, onFiles, className, testId }) {
  const inputRef = React.useRef(null)
  return h('span', { className: `fang-file-button${className === undefined ? '' : ` ${className}`}` },
    h('button', {
      type: 'button', className: 'fang-btn',
      onClick: () => { if (inputRef.current !== null && typeof inputRef.current.click === 'function') inputRef.current.click() },
    }, label),
    h('input', {
      ref: inputRef, type: 'file', className: 'fang-file-input', accept,
      multiple: multiple === true || typeof onFiles === 'function',
      tabIndex: -1, 'aria-hidden': 'true', 'data-testid': testId,
      onChange: (event) => {
        const files = Array.from(event?.target?.files ?? [])
        if (files.length === 0) return
        if (typeof onFiles === 'function') onFiles(files)
        else if (typeof onFile === 'function') files.forEach((file) => onFile(file))
        if (event?.target !== undefined) event.target.value = ''
      },
    }))
}
