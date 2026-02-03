#!/usr/bin/env node

/**
 * 清理构建目录中的 HTML 文件（除了 index.html）
 * 这个脚本确保只有 index.html 存在，其他路由都由 VitePress SPA 处理
 */

const { resolve } = require('path')
const { readdirSync, statSync, unlinkSync, existsSync } = require('fs')

const distDir = resolve(__dirname, '../docs/.vitepress/dist')

if (!existsSync(distDir)) {
  console.error('错误: dist目录不存在')
  process.exit(1)
}

console.log('开始清理 HTML 文件...')

function cleanupHtmlFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name)
    
    if (entry.isDirectory()) {
      // 递归处理子目录
      cleanupHtmlFiles(fullPath)
    } else if (entry.name.endsWith('.html')) {
      // 删除所有 .html 文件，除了根目录的 index.html
      // 注意：move-assets.js 会在最后复制 public/index.html 到根目录
      // 所以这里只删除 VitePress 生成的 HTML 文件
      const isRootIndex = entry.name === 'index.html' && dir === distDir
      if (isRootIndex) {
        // 检查是否是自定义的 index.html（来自 public/index.html）
        // 如果是 VitePress 生成的，会在 move-assets.js 中被删除
        console.log(`  跳过 ${entry.name} (将在 move-assets.js 中处理)`)
      } else {
        console.log(`  删除 ${entry.name}`)
        unlinkSync(fullPath)
      }
    }
  }
}

cleanupHtmlFiles(distDir)

console.log('完成! 所有 HTML 文件已清理（除了 index.html）')
console.log('注意: VitePress SPA 将通过 index.html 处理所有路由')
