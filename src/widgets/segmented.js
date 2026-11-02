/**
 * 分段选择：一条轨道，所有选项可见，恰有一个选中。
 *
 * props 是 label/options/value/onChange/testId/disabled。options 是
 * { value, label } 对，label 的文案由调用方定稿；testId 给出时会加在每个选项的
 * data-testid 前缀上，测试好按名字点某一个档位。
 */
import { React, h } from '../react.js'

export function Segmented({ label, options, value, onChange, testId, disabled = false }) {
  return h('div', { className: 'fang-segmented', role: 'group', 'aria-label': label },
    options.map((option) => h('button', {
      key: option.value, type: 'button', className: 'fang-segmented-item',
      'data-testid': testId === undefined ? undefined : `${testId}-${option.value}`,
      'aria-pressed': option.value === value ? 'true' : 'false',
      disabled: disabled === true,
      onClick: () => onChange(option.value),
    }, option.label)))
}
