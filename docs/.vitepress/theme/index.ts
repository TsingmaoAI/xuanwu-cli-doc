import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { onMounted } from 'vue'
import { fixCopyButtonIcons } from './copy-button-fix.js'

export default {
  ...DefaultTheme,
  setup() {
    onMounted(() => {
      fixCopyButtonIcons()
      // 修复 logo 链接：将所有指向 / 的 logo 链接改为 /home
      fixLogoLinks()
    })
  },
  // 导出路由工具函数，供文档页面使用
  enhanceApp({ app, router }) {
    // 路由工具已通过独立的 router.ts 文件导出
    // 文档页面可以通过 import { useRouter } from '../.vitepress/theme/router' 使用
    
    // 注意：不再拦截 router 方法，让 VitePress 完全控制路由
    // 只在必要时（如点击 logo）才进行路由跳转
    if (router) {
      // 只处理根路径跳转到 /home，其他让 VitePress 自己处理
      const originalPush = router.push
      if (originalPush) {
        router.push = function(to: string) {
          if (typeof to === 'string' && to === '/') {
            return originalPush.call(this, '/home')
          }
          // 其他情况完全交给 VitePress 处理
          return originalPush.call(this, to as any)
        }
      }
    }
  }
}

// 修复所有 logo 链接
function fixLogoLinks() {
  // 查找所有包含 VPNavBarTitle 的容器内的 title 类链接
  const logoLinks = document.querySelectorAll('.VPNavBarTitle .title, .VPNavBarTitle a.title')
  
  logoLinks.forEach((link) => {
    if (link instanceof HTMLAnchorElement) {
      const href = link.getAttribute('href')
      const currentPath = window.location.pathname
      
      // 如果当前页面是 .html 文件，跳转到 home.html，否则跳转到 /home
      const targetHref = currentPath.includes('.html') ? '/home.html' : '/home'
      
      // 如果链接指向 /、/doc、/doc.html 或其他错误路径，改为指向正确的路径
      if (href === '/' || href === '/doc' || href === '/doc.html' || href?.endsWith('/')) {
        link.setAttribute('href', targetHref)
        // 移除旧的事件监听器，添加新的
        const newLink = link.cloneNode(true) as HTMLAnchorElement
        link.parentNode?.replaceChild(newLink, link)
        newLink.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          window.location.href = targetHref
          return false
        })
      }
    }
  })
  
  // 全局拦截所有 logo 点击事件
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const titleLink = target.closest('.VPNavBarTitle .title, .VPNavBarTitle a.title')
    if (titleLink instanceof HTMLAnchorElement) {
      const href = titleLink.getAttribute('href')
      const currentPath = window.location.pathname
      const targetHref = currentPath.includes('.html') ? '/home.html' : '/home'
      
      // 如果链接指向 /、/doc、/doc.html 或其他错误路径，拦截并跳转到正确路径
      if (href === '/' || href === '/doc' || href === '/doc.html' || href?.endsWith('/')) {
        e.preventDefault()
        e.stopPropagation()
        window.location.href = targetHref
        return false
      }
    }
  }, true) // 使用捕获阶段，确保优先处理
}

// 注意：已完全移除 ensureCleanUrls 函数
// 不再拦截任何 history API，让 VitePress 完全控制路由
// 内联脚本已经处理了 .html URL 的重定向（在页面加载时）
