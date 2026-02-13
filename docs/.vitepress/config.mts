import { defineConfig } from 'vitepress'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  title: "玄武CLI",
  description: "高性能国产 AI 芯片推理框架",
  lang: 'zh-CN',
  
  // 确保 base 路径正确
  base: '/',

  // 启用 cleanUrls 去掉 .html 后缀
  cleanUrls: true,

  // 路由说明：
  // - 根路径 / 已释放，供静态 HTML 文件使用
  // - /home 访问原首页（home.md）
  // - /doc 访问快速开始文档（doc.md）
  // - /models 访问模型库（models.md）
  // - /model-management 访问模型管理（model-management.md）

  vite: {
    server: {
      allowedHosts: ['mount-initially-element-strength.trycloudflare.com']
    },
    // 配置开发服务器，确保 public/index.html 优先
    plugins: [
      {
        name: 'serve-public-index',
        enforce: 'pre',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // 如果是根路径请求，优先返回 public/index.html；不存在则重定向到 /home 避免空白
            if (req.url === '/' || req.url === '/index.html') {
              const indexPath = resolve(__dirname, '../public/index.html')
              if (existsSync(indexPath)) {
                try {
                  const content = readFileSync(indexPath, 'utf-8')
                  res.setHeader('Content-Type', 'text/html')
                  res.end(content)
                  return
                } catch (_e) {
                  // 读取失败则重定向
                }
              }
              res.writeHead(302, { Location: '/home' })
              res.end()
              return
            }
            // 分版本 Release Notes：/release-notes/<version>/ 或 /release-notes/<version> 提供 public/release-notes/<version>/index.html
            const releaseNoteMatch = req.url && req.url.match(/^\/release-notes\/([^/]+)\/?(\?.*)?$/)
            if (releaseNoteMatch) {
              const version = releaseNoteMatch[1]
              const htmlPath = resolve(__dirname, '../public/release-notes', version, 'index.html')
              if (existsSync(htmlPath)) {
                try {
                  const content = readFileSync(htmlPath, 'utf-8')
                  res.setHeader('Content-Type', 'text/html')
                  res.end(content)
                  return
                } catch (_e) {
                  // 读取失败继续往下
                }
            }
            }
            next()
          })
        }
      }
    ]
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/ico.png' }],
    ['meta', { name: 'theme-color', content: '#0ea5e9' }],
    // 在页面加载的最早阶段立即修复 URL，防止 VitePress 路由生成 .html URL
    // 这个脚本必须在 VitePress 路由初始化之前执行
    ['script', {}, `
      (function() {
        'use strict';
        
        // 只在确实需要时才修复 URL（带 .html 的 URL），避免干扰 VitePress 的正常加载
        // 这个脚本只做一件事：如果 URL 带 .html 后缀，重定向到 clean URL
        // 不拦截任何 history API，让 VitePress 完全控制路由
        var path = window.location.pathname;
        if (path && path.endsWith('.html') && path !== '/index.html') {
          var cleanPath = path.replace(/\\.html$/, '');
          // 立即使用 replace 重定向，不留下历史记录
          window.location.replace(cleanPath + window.location.search + window.location.hash);
        }
      })();
    `],
  ],

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  themeConfig: {
    logo: {
      // 开发模式下，public 目录的文件直接映射到根路径
      // 构建后，构建脚本会将文件移动到 assets 目录
      // 使用 /logo-light.png 在开发和生产环境都能工作
      light: '/logo-light.png',
      dark: '/logo-dark.png'
      // 注意：VitePress 的 logo 配置不支持 link 属性
      // 通过自定义组件 VPNavBarTitle.vue 实现点击跳转到 /home
    },

    nav: [
      { text: '文档', link: '/doc' },
      { text: '模型库', link: '/models' },
      { text: 'API', link: '/api-guide' },
      { text: '更新日志', link: '/release-notes/' },
      { text: 'GitHub', link: 'https://github.com/TsingmaoAI/xw-cli' }
    ],

    sidebar: [
      {
        text: '入门',
        items: [
          { text: '快速开始', link: '/doc' },
          { text: '硬件支持', link: '/hardware' },
        ]
      },
      {
        text: '使用指南',
        items: [
          { text: 'CLI 命令参考', link: '/cli-reference' },
          { text: 'API 指南', link: '/api-guide' },
        ]
      },
      {
        text: '模型',
        items: [
          { text: '模型库', link: '/models' },
          { text: '模型管理', link: '/model-management' },
        ]
      },
      {
        text: '进阶',
        items: [
          { text: '架构设计', link: '/architecture' },
          { text: '离线安装与部署', link: '/offline-deployment' },
          // { text: '模型仓库', link: '/model-registry' },
          { text: '第三方工具集成', link: '/integrations' },
          // { text: '性能优化', link: '/performance' },
        ]
      },
      {
        text: '帮助',
        items: [
          { text: 'FAQ', link: '/faq' },
        ]
      },
      {
        text: '更新日志',
        items: [
          { text: '总览', link: '/release-notes/' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TsingmaoAI/xw-cli' }
    ],

    footer: {
      message: '基于 Apache 2.0 许可发布',
      copyright: 'Copyright © 2024-present Xuanwu AI'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于',
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
  }
})
