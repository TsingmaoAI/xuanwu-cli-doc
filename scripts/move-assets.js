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

// 重命名 index.html 为 docs.html
const indexPath = resolve(distDir, 'index.html')
const docPath = resolve(distDir, 'docs.html')

if (existsSync(indexPath)) {
  console.log('重命名 index.html 为 docs.html...')
  
  // 读取 index.html 内容
  let indexContent = readFileSync(indexPath, 'utf-8')
  
  // 更新 index.html 内部对根路径的引用
  indexContent = indexContent.replace(/href=["']\/["']/g, 'href="/docs.html"')
  
  // 写入新文件
  writeFileSync(docPath, indexContent, 'utf-8')
  
  // 删除原文件
  unlinkSync(indexPath)
  
  console.log('  已重命名 index.html 为 docs.html')
  
  // 更新所有其他HTML文件中对根路径 "/" 的引用
  console.log('更新所有HTML文件中的根路径引用...')
  function updateRootLinks(dir) {
    const entries = readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name)
      
      if (entry.isDirectory()) {
        updateRootLinks(fullPath)
      } else if (entry.name.endsWith('.html') && entry.name !== 'docs.html') {
        let content = readFileSync(fullPath, 'utf-8')
        let modified = false
        
        // 将 href="/" 替换为 href="/docs.html"
        if (content.includes('href="/"')) {
          content = content.replace(/href=["']\/["']/g, 'href="/docs.html"')
          modified = true
        }
        
        if (modified) {
          writeFileSync(fullPath, content, 'utf-8')
          console.log(`  已更新 ${entry.name}`)
        }
      }
    }
  }
  
  updateRootLinks(distDir)
}

console.log('完成!')
