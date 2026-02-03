/**
 * VitePress 路由工具函数
 * 提供程序化的路由跳转功能
 */

import { useRouter as useVitePressRouter, useRoute as useVitePressRoute } from 'vitepress'

/**
 * 获取 VitePress 路由实例
 * 用于程序化导航
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useRouter } from '../.vitepress/theme/router'
 * 
 * const router = useRouter()
 * 
 * function goToDoc() {
 *   router.push('/doc')
 * }
 * </script>
 * ```
 */
export function useRouter() {
  return useVitePressRouter()
}

/**
 * 获取当前路由信息
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useRoute } from '../.vitepress/theme/router'
 * 
 * const route = useRoute()
 * console.log(route.path) // 当前路径
 * </script>
 * ```
 */
export function useRoute() {
  return useVitePressRoute()
}

/**
 * 路由跳转辅助函数
 */
export const routerUtils = {
  /**
   * 跳转到文档首页
   */
  goToDoc: () => {
    const router = useVitePressRouter()
    router.push('/doc')
  },

  /**
   * 跳转到模型库
   */
  goToModels: () => {
    const router = useVitePressRouter()
    router.push('/models')
  },

  /**
   * 跳转到 API 指南
   */
  goToAPI: () => {
    const router = useVitePressRouter()
    router.push('/api-guide')
  },

  /**
   * 跳转到指定路径
   */
  goTo: (path: string) => {
    const router = useVitePressRouter()
    router.push(path)
  }
}
