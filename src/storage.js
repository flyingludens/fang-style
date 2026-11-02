/**
 * 浏览器里小巧的持久键值：安全地读写 localStorage。
 *
 * localStorage 在 Node 渲染环境缺失、在隐私模式抛错，两者都是普通情况：
 * 读不到是默认值，写失败留给本次会话的内存值。
 */
export function storageAvailable() {
  try {
    return typeof window !== 'undefined' && window.localStorage !== undefined && window.localStorage !== null
  } catch { return false }
}

/** The stored string, or null when there is none or storage cannot be reached. */
export function readStored(key) {
  try {
    if (typeof window === 'undefined' || window.localStorage === undefined) return null
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/** Store a string. A failure is swallowed: private mode must not break the panel. */
export function writeStored(key, value) {
  try {
    if (typeof window === 'undefined' || window.localStorage === undefined) return false
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}
