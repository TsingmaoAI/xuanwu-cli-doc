#!/usr/bin/env node

const { resolve } = require('path')
const { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync, unlinkSync } = require('fs')

const distDir = resolve(__dirname, '../docs/.vitepress/dist')
const assetsDir = resolve(distDir, 'assets')

if (!existsSync(distDir)) {
  console.error('错误: dist目录不存在')
  process.exit(1)
}

// 确保 assets 目录存在
if (!existsSync(assetsDir)) {
  mkdirSync(assetsDir, { recursive: true })
}

// 需要移动到assets的文件列表
const publicFiles = ['ico.png', 'logo-light.png', 'logo-dark.png', 'logo.png', 'logo.svg', 'architecture.jpeg', 'wechat-1.jpeg', 'wechat-2.jpeg', 'wechat-3.jpeg', 'vp-icons.css']

console.log('开始移动文件到assets目录...')

// 将dist根目录下的public文件移动到assets目录
for (const file of publicFiles) {
  const srcPath = resolve(distDir, file)
  const destPath = resolve(assetsDir, file)
  
  if (existsSync(srcPath) && statSync(srcPath).isFile()) {
    console.log(`  移动 ${file} 到 assets/`)
    // 如果assets中已存在同名文件，先删除
    if (existsSync(destPath)) {
      unlinkSync(destPath)
    }
    // 移动到assets目录
    copyFileSync(srcPath, destPath)
    unlinkSync(srcPath)
  } else {
    console.log(`  跳过 ${file} (文件不存在)`)
  }
}

// 更新所有HTML文件中的引用路径
function updateHtmlFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name)
    
    if (entry.isDirectory()) {
      updateHtmlFiles(fullPath)
    } else if (entry.name.endsWith('.html')) {
      let content = readFileSync(fullPath, 'utf-8')
      let modified = false
      
      // 更新所有文件引用：从 /filename 改为 /assets/filename
      for (const fileName of publicFiles) {
        // 匹配各种可能的引用格式
        const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const patterns = [
          // href="/logo.png" 或 src="/logo.png"
          new RegExp(`(href|src)=["']/${escapedFileName}["']`, 'g'),
          // url('/logo.png') 或 url("/logo.png")
          new RegExp(`url\\(["']?/${escapedFileName}["']?\\)`, 'g')
        ]
        
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            content = content.replace(pattern, (match) => {
              return match.replace(`/${fileName}`, `/assets/${fileName}`)
            })
            modified = true
          }
        }
      }
      
      // 修复文档页面 logo 链接：将 VPNavBarTitle 组件中的 href 改为 href="/home.html"
      // 匹配格式：在包含 VPNavBarTitle 的区域内，找到 <a class="title" href
      if (content.includes('VPNavBarTitle')) {
        // 替换 href="/" 或 href="/home" 为 href="/home.html"
        content = content.replace(
          /(<div[^>]*VPNavBarTitle[^>]*>[\s\S]*?<a[^>]*class="[^"]*title[^"]*"[^>]*href=["'])(\/|\/home)(["'])/g,
          '$1/home.html$3'
        )
        // 也替换可能的 href="/doc" 或其他错误链接
        content = content.replace(
          /(<div[^>]*VPNavBarTitle[^>]*>[\s\S]*?<a[^>]*class="[^"]*title[^"]*"[^>]*href=["'])(\/doc)(["'])/g,
          '$1/home.html$3'
        )
        modified = true
      }
      
      // 更新 logo 图片路径：从 /logo-light.png 和 /logo-dark.png 改为 /assets/logo-light.png 和 /assets/logo-dark.png
      // 开发模式下使用 /logo-light.png，构建后需要改为 /assets/logo-light.png
      // 需要更新 HTML 标签中的路径和 JSON 数据中的路径
      
      // 1. 更新 HTML 标签中的路径（更全面的匹配）
      // 匹配所有可能的 logo 路径引用
      const htmlLogoPatterns = [
        /(src|href)=["']\/logo-light\.png["']/g,
        /(src|href)=["']\/logo-dark\.png["']/g,
        /url\(["']?\/logo-light\.png["']?\)/g,
        /url\(["']?\/logo-dark\.png["']?\)/g
      ]
      for (const pattern of htmlLogoPatterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, (match) => {
            return match.replace('/logo-', '/assets/logo-')
          })
          modified = true
        }
      }
      
      // 2. 更新 JSON 数据中的路径（在 __VP_SITE_DATA__ 中）
      // JSON 数据是转义的字符串，需要匹配转义后的格式
      // 格式：\"\/logo-light.png\" 或 \"/logo-light.png\"
      // 注意：使用简单的字符串替换，只替换 logo 路径，不会破坏 JSON 结构
      if (content.includes('__VP_SITE_DATA__')) {
        const beforeReplace = content
        // 使用简单的字符串替换，只替换 logo 路径字符串
        // 这些替换是安全的，因为只是替换路径字符串，不会影响 JSON 结构
        content = content.replace(/\\"\/logo-light\.png\\"/g, '\\"/assets/logo-light.png\\"')
        content = content.replace(/\\"\/logo-dark\.png\\"/g, '\\"/assets/logo-dark.png\\"')
        // 也匹配未转义的格式（如果存在）
        content = content.replace(/"\/logo-light\.png"/g, '"/assets/logo-light.png"')
        content = content.replace(/"\/logo-dark\.png"/g, '"/assets/logo-dark.png"')
        
        // 检查是否有变化
        if (content !== beforeReplace) {
          modified = true
        }
      }
      
      // 注意：不要移除 .html 后缀，因为现在保留 HTML 文件
      // 带 .html 和不带 .html 的 URL 都应该能正常工作
      // 只在 JavaScript 路由调用中移除 .html，确保客户端路由使用 clean URLs
      const beforeCleanUrls = content
      // 只处理 JavaScript 中的路由调用（如 router.push('/xxx.html')），确保客户端路由使用 clean URLs
      content = content.replace(/(router\.(push|go|replace)\(["'])(\/[^"']+)\.html(["']\))/g, '$1$3$4')
      // 匹配 location.href = '/xxx.html'（在 JavaScript 中）
      content = content.replace(/(location\.(href|pathname)\s*=\s*["'])(\/[^"']+)\.html(["'])/g, '$1$3$4')
      // 匹配 window.location = '/xxx.html'（在 JavaScript 中）
      content = content.replace(/(window\.location\s*=\s*["'])(\/[^"']+)\.html(["'])/g, '$1$2$3')
      // 注意：保留 HTML 中的 href="/xxx.html"，这样直接访问 .html 文件时能正常工作
      if (content !== beforeCleanUrls) {
        modified = true
      }
      
      if (modified) {
        writeFileSync(fullPath, content, 'utf-8')
        console.log(`  已更新 ${entry.name}`)
      }
    }
  }
}

// 更新所有HTML文件
console.log('开始更新HTML文件引用...')
updateHtmlFiles(distDir)

// 处理根路径 index.html
const indexPath = resolve(distDir, 'index.html')
const publicIndexPath = resolve(__dirname, '../docs/public/index.html')

// 如果 VitePress 生成了 index.html（来自 home.md），先删除它
if (existsSync(indexPath)) {
  console.log('删除 VitePress 生成的 index.html（根路径已由自定义 index.html 占用）...')
  unlinkSync(indexPath)
}

// 将 public/index.html 复制到 dist 根目录作为根路径页面
if (existsSync(publicIndexPath)) {
  console.log('复制自定义 index.html 到根路径...')
  copyFileSync(publicIndexPath, indexPath)
  console.log('  已设置根路径 index.html')
} else {
  console.log('  警告: docs/public/index.html 不存在，根路径将没有页面')
}

// 保留所有 HTML 文件（不再删除），但确保它们都使用最新内容
// 这样带 .html 和不带 .html 的 URL 都能正常工作
console.log('保留所有 HTML 文件，确保使用最新内容...')

// 注意：不要用 index.html（自定义静态页面）替换其他 HTML 文件
// VitePress 生成的 HTML 文件已经包含了正确的内容和路由信息
// 我们只需要确保它们不包含旧的内置模型配置即可

// 更新所有 HTML 文件，移除旧的内置模型相关内容
function updateAllHtmlFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name)
    
    if (entry.isDirectory()) {
      // 递归处理子目录
      updateAllHtmlFiles(fullPath)
    } else if (entry.name.endsWith('.html')) {
      // 跳过根目录的 index.html（这是自定义的静态页面）
      const isRootIndex = entry.name === 'index.html' && dir === distDir
      if (!isRootIndex) {
        let content = readFileSync(fullPath, 'utf-8')
        let modified = false
        
        // 检查是否包含旧的内置模型相关内容（在 JSON 配置中）
        // 如果包含，需要从 __VP_SITE_DATA__ 中移除
        if (content.includes('__VP_SITE_DATA__') && content.includes('内置模型')) {
          // 尝试从 JSON 数据中移除内置模型相关的配置
          // 这是一个复杂的操作，但我们可以通过替换 JSON 字符串来实现
          // 注意：VitePress 的配置已经在 config.mts 中移除了内置模型
          // 所以新构建的文件应该不会有这个问题
          // 这里主要是为了处理可能存在的旧文件
          
          // 如果文件包含旧的内置模型配置，说明是旧版本
          // 但不要替换整个文件，因为 VitePress 生成的 HTML 文件包含了正确的路由和内容
          // 只需要记录警告
          console.log(`  警告: ${entry.name} 可能包含旧的内置模型配置，建议重新构建`)
        }
        
        // 确保所有 HTML 文件都正确更新了链接和路径
        // 这些已经在 updateHtmlFiles 函数中处理过了
        
        if (modified) {
          writeFileSync(fullPath, content, 'utf-8')
        }
      }
    }
  }
}

// 更新所有 HTML 文件
updateAllHtmlFiles(distDir)
console.log('  所有 HTML 文件已处理完成（保留文件，确保使用最新内容）')

// 为对象存储部署创建目录结构
// 对象存储不支持 try_files，需要为每个路由创建对应的目录和 index.html
console.log('为对象存储部署创建目录结构...')

// 需要创建目录结构的路由列表（对应 VitePress 生成的路由）
// 从 config.mts 中的 nav 和 sidebar 配置中提取所有路由
const routes = [
  'doc',              // 快速开始
  'models',           // 模型库
  'api-guide',        // API 指南
  'home',             // 首页
  'hardware',         // 硬件支持
  'cli-reference',    // CLI 命令参考
  'model-management', // 模型管理
  'architecture',     // 架构设计
  'integrations',     // 第三方工具集成
  'faq',              // FAQ
  'getting-started',  // 可能的路由
  'model-library',    // 可能的路由
  'model-registry',   // 可能的路由
  'performance'       // 可能的路由
]

// 自动发现所有 HTML 文件（除了 index.html 和 404.html）
// 为每个 HTML 文件创建对应的目录结构
function autoDiscoverRoutes() {
  const discoveredRoutes = []
  const entries = readdirSync(distDir, { withFileTypes: true })
  
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      const routeName = entry.name.replace(/\.html$/, '')
      // 排除 index.html 和 404.html（这些需要特殊处理）
      if (routeName !== 'index' && routeName !== '404') {
        discoveredRoutes.push(routeName)
      }
    }
  }
  
  return discoveredRoutes
}

// 合并手动配置的路由和自动发现的路由
const allRoutes = [...new Set([...routes, ...autoDiscoverRoutes()])]

// 为每个路由创建目录和 index.html
for (const route of allRoutes) {
  const routeHtmlFile = resolve(distDir, `${route}.html`)
  const routeDir = resolve(distDir, route)
  const routeIndexFile = resolve(routeDir, 'index.html')
  
  // 如果对应的 HTML 文件存在
  if (existsSync(routeHtmlFile)) {
    // 创建目录
    if (!existsSync(routeDir)) {
      mkdirSync(routeDir, { recursive: true })
      console.log(`  创建目录: ${route}/`)
    }
    
    // 复制 HTML 文件到目录下的 index.html
    if (!existsSync(routeIndexFile)) {
      copyFileSync(routeHtmlFile, routeIndexFile)
      console.log(`  创建 ${route}/index.html`)
    }
  }
}

console.log('  目录结构创建完成')

// 更新新创建的目录中的 HTML 文件（确保路径正确）
console.log('更新新创建的目录中的 HTML 文件...')
updateHtmlFiles(distDir)

console.log('完成!')
