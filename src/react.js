/**
 * React 与 createElement 别名。
 *
 * 库用标准 ESM import 取 React，宿主决定 React 从哪来（打包器 external、
 * 或宿主自己的模块表）。本项目在 esbuild 里把 react 列为 external，
 * 恰好落在宿主交给 factory 的 require 上。
 */
import React from 'react'

export const h = React.createElement
export { React }
