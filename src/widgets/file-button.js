/**
 * 文件选择按钮：看得见的控件是库自己的按钮。
 *
 * 浏览器总得弹它自己的系统文件面板才能读到字节，这一步谁也免不了；但触发按钮、
 * 它的标签和焦点态是库的，而不是浏览器画的一个裸 input。
 */
import { React, h } from '../react.js'

export function FileButton({ label, accept, onFile, className, testId }) {
  const inputRef = React.useRef(null)
  return h('span', { className: `fang-file-button${className === undefined ? '' : ` ${className}`}` },
    h('button', {
      type: 'button', className: 'fang-btn',
      onClick: () => { if (inputRef.current !== null && typeof inputRef.current.click === 'function') inputRef.current.click() },
    }, label),
    h('input', {
      ref: inputRef, type: 'file', className: 'fang-file-input', accept,
      tabIndex: -1, 'aria-hidden': 'true', 'data-testid': testId,
      onChange: (event) => {
        const file = event?.target?.files?.[0]
        if (file !== undefined && typeof onFile === 'function') onFile(file)
        if (event?.target !== undefined) event.target.value = ''
      },
    }))
}
