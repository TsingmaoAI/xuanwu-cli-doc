import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "玄武CLI",
  description: "高性能国产 AI 芯片推理框架",
  lang: 'zh-CN',

  vite: {
    server: {
      allowedHosts: ['mount-initially-element-strength.trycloudflare.com']
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/ico.png' }],
    ['meta', { name: 'theme-color', content: '#0ea5e9' }],
  ],

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  themeConfig: {
    logo: {
      light: '/logo-light.png',
      dark: '/logo-dark.png'
    },

    nav: [
      { text: '文档', link: '/getting-started' },
      { text: '模型库', link: '/model-library' },
      { text: 'API', link: '/api-guide' },
      { text: 'GitHub', link: 'https://github.com/TsingmaoAI/xw-cli' }
    ],

    sidebar: [
      {
        text: '入门',
        items: [
          { text: '快速开始', link: '/getting-started' },
          { text: '硬件支持', link: '/hardware' },
        ]
      },
      {
        text: '使用指南',
        items: [
          { text: 'CLI 命令参考', link: '/cli-reference' },
          { text: 'API 指南', link: '/api-guide' },
          { text: '模型管理', link: '/models' },
        ]
      },
      {
        text: '模型仓库',
        link: '/model-library',
        items: [
          {
            text: '内置模型',
            items: [
              { text: 'Qwen3-235B', link: '/models/qwen3-235b' },
              { text: 'Qwen3-Next-80B', link: '/models/qwen3-next-80b' },
              { text: 'Qwen3-32B', link: '/models/qwen3-32b' },
              { text: 'Qwen3-30B', link: '/models/qwen3-30b' },
              { text: 'Qwen2.5-72B', link: '/models/qwen2.5-72b' },
            ]
          },
        ]
      },
      {
        text: '进阶',
        items: [
          { text: '架构设计', link: '/architecture' },
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
