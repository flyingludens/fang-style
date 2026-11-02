/**
 * 库的 hooks：每个负责一件完整的事，不绑某个控件。
 *
 * useSessionState 是会话内存活的状态——宿主把面板换下再换上也不丢，一次还在
 * 途的请求也不会丢。usePersisted 记一个跨刷新的偏好。useClosingAnimation 让
 * 覆盖层收起时把退场动画演完。useDismiss 是所有浮层共用的「点外面或按 Escape
 * 就收起」。
 */
import { React } from './react.js'
import { readStored, writeStored } from './storage.js'

/**
 * 会话内存活的状态仓。
 *
 * 宿主会在切换显示内容、窗口失焦又回焦时卸载并重建面板，组件里的 useState 全部
 * 随之死亡：正在思考的一行消失了，别处回来才抵达的回答被写进一个已经不存在的
 * 组件，就那么丢了。这里是一个极小的外部 store，按作用域分键：组件挂载时从它
 * 取初值，每次写入都镜像回它，重建的面板于是能找到前一个留下的东西——包括
 * 一次还在途的请求。请求本身继续跑：它的闭包握着旧的 setter，那个 setter 仍
 * 写进这个 store，通知现在挂载着的组件。
 *
 * 刻意不用「把 React 状态提升到父组件」：没有父组件可提升。挂载由宿主掌握，
 * 面板是它树上的叶子。
 */
function createStateStore() {
  const values = new Map()
  const listeners = new Map()
  return {
    read(key, initial) { return values.has(key) ? values.get(key) : initial },
    write(key, value) {
      if (Object.is(values.get(key), value)) return
      values.set(key, value)
      for (const listener of [...(listeners.get(key) ?? [])]) listener(value)
    },
    subscribe(key, listener) {
      if (!listeners.has(key)) listeners.set(key, new Set())
      listeners.get(key).add(listener)
      return () => { listeners.get(key)?.delete(listener) }
    },
  }
}
export const SESSION_STORE = createStateStore()

/**
 * 在面板被卸载之后还活着的 useState，按作用域分开存。
 *
 * 两件事让它不同于普通 state，都是承重的：
 *
 *  - 每次渲染都从 store 读值，不只是首次。作用域是打开对象的名字，它可能在面板
 *    的一生中变一次（还没选定对象时是 undefined）——useState 的初始值会把这个
 *    变化漏掉，从此再不往回看。
 *  - 更新函数从 store 取基准。面板重建后，旧闭包的 setter 还会写进来，它本地的
 *    previous 属于一个死掉的组件；store 是两边共享的唯一事实。
 */
export function useSessionState(scope, key, initial) {
  const storeKey = `${scope}::${key}`
  const [, forceRender] = React.useState(0)
  React.useEffect(() => SESSION_STORE.subscribe(storeKey, () => forceRender((n) => n + 1)), [storeKey])
  const value = SESSION_STORE.read(storeKey, initial)
  const set = (next) => {
    const current = SESSION_STORE.read(storeKey, initial)
    const resolved = typeof next === 'function' ? next(current) : next
    // write 会通知订阅者，本组件也在其中，重渲染由 store 驱动，陈旧的 setter
    // 也能落到还在挂载的面板上。
    SESSION_STORE.write(storeKey, resolved)
  }
  return [value, set]
}

/**
 * 跨刷新存活的偏好，按浏览器存。
 *
 * 读一次要试一次、写一次也要试一次：隐私模式两头都抛错，而那绝不能弄坏面板。
 * 这三步原来在每个偏好里各写一遍，这里收成一处。
 *
 * @param key    - 存储键
 * @param decode - 把存下的字符串（null 表示没存过）变成可用的值
 * @param encode - 把值变成要存的字符串
 * @param forced - 定义时压过存储值，写入也被跳过：值已被外部决定，设置页只负责
 *                 报告它
 */
export function usePersisted(key, decode, encode, forced) {
  const locked = forced !== undefined
  const [value, setValue] = React.useState(() => {
    if (locked) return forced
    try { return decode(readStored(key)) } catch { return decode(null) }
  })
  const update = (next) => {
    const resolved = typeof next === 'function' ? next(value) : next
    setValue(resolved)
    if (locked) return
    writeStored(key, encode(resolved))
  }
  return [value, update]
}

/**
 * 让覆盖层多挂一会儿，把退场动画演完。
 *
 * open 是调用方的状态；返回的 mounted 是渲染用的，closing 是放在覆盖层最外层
 * 节点上的类。没有它，收起就是一帧消失：入场有动画，退场只有闪一下。
 *
 * 时长由调用方传入，默认 140ms，与样式表的 --fang-duration-close（140ms）一致；
 * 退出速度的出处只有一个，另起的计时器不会和它时着的动画漂开。
 */
export function useClosingAnimation(value, durationMs = 140) {
  // value 是正在显示的东西——抽屉的键，没有就传 null。布尔值只告诉覆盖层「开着」，
  // 不告诉它开在什么上，而收起中的面板必须继续渲染它当时显示的内容。
  const open = value !== null && value !== undefined && value !== false
  // 没有动画的渲染器没什么可等。Node 渲染环境根本没有 window，一个赖在计时器上
  // 的无头挂载会让「抽屉已消失」的测试去依赖真实时间。检查的是环境，不是要调用
  // 方记得传的旗标。
  const animated = typeof window !== 'undefined'
  const [mounted, setMounted] = React.useState(open === true)
  const [closing, setClosing] = React.useState(false)
  React.useEffect(() => {
    if (open === true) {
      // 退场途中重新打开要取消退场：覆盖层回来了，不能被上一次收起安排的计时器
      // 摘掉。
      setClosing(false)
      setMounted(true)
      return undefined
    }
    if (!mounted) return undefined
    if (!animated) { setMounted(false); return undefined }
    setClosing(true)
    const timer = globalThis.setTimeout(() => { setClosing(false); setMounted(false) }, durationMs)
    return () => clearTimeout(timer)
  }, [open, mounted, durationMs, animated])
  /**
   * 覆盖层在屏幕上时应该渲染什么。
   *
   * 不是调用方的 open：退场途中状态已经变了（抽屉是 null，或另一个抽屉的键），
   * 按实时状态渲染的覆盖层会把新内容装进旧框里。所以在这里握住覆盖层最后一次
   * 真正开着时的值，卸载前一直用它。
   */
  const shown = React.useRef(open ? value : null)
  if (open) shown.current = value
  return { mounted, closing, shown: shown.current }
}

/**
 * 浮层的收起方式：点它盒子外面，或按 Escape。调用方自己选中后的收起先发生，
 * 轮不到这个 hook。
 *
 * ref 是浮层自己的盒子——盒内的点击属于浮层（可能正是开关它的按钮），盒外才算
 * 「收起来」。Escape 不再传给宿主，免得宿主的快捷键在菜单合上时在背后触发。
 */
export function useDismiss(rootRef, open, onClose) {
  React.useEffect(() => {
    if (!open) return undefined
    if (typeof document === 'undefined' || typeof document.addEventListener !== 'function') return undefined
    const onDown = (event) => {
      const root = rootRef?.current
      if (root !== null && root !== undefined && typeof root.contains === 'function' && root.contains(event.target)) return
      onClose()
    }
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
    // onClose 刻意不进依赖：它在每个调用点都是 state setter，每次渲染重绑监听
    // 什么也买不来。
  }, [rootRef, open])
}
