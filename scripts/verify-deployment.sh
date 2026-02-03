#!/bin/bash

# 服务器部署验证脚本
# 使用方法: 在服务器上运行此脚本

echo "=========================================="
echo "服务器部署验证"
echo "=========================================="
echo ""

DEPLOY_DIR="/var/www/xuanwu-docs"

# 检查目录是否存在
if [ ! -d "$DEPLOY_DIR" ]; then
  echo "❌ 错误: 部署目录不存在: $DEPLOY_DIR"
  exit 1
fi

echo "📁 检查目录: $DEPLOY_DIR"
echo ""

# 1. 检查 HTML 文件
echo "1️⃣ 检查 HTML 文件..."
HTML_FILES=$(find "$DEPLOY_DIR" -name "*.html" ! -name "index.html" -type f)
HTML_COUNT=$(echo "$HTML_FILES" | grep -c . || echo "0")

if [ "$HTML_COUNT" -gt 0 ]; then
  echo "❌ 发现 $HTML_COUNT 个多余的 HTML 文件:"
  echo "$HTML_FILES" | sed 's/^/   - /'
  echo ""
  echo "⚠️  这些文件会导致路由问题，应该删除！"
  echo "   运行以下命令删除:"
  echo "   find $DEPLOY_DIR -name '*.html' ! -name 'index.html' -delete"
else
  echo "✅ 没有多余的 HTML 文件"
fi
echo ""

# 2. 检查 index.html
echo "2️⃣ 检查 index.html..."
if [ -f "$DEPLOY_DIR/index.html" ]; then
  echo "✅ index.html 存在"
  FILE_SIZE=$(stat -f%z "$DEPLOY_DIR/index.html" 2>/dev/null || stat -c%s "$DEPLOY_DIR/index.html" 2>/dev/null)
  echo "   文件大小: $FILE_SIZE 字节"
else
  echo "❌ index.html 不存在！"
fi
echo ""

# 3. 检查 assets 目录
echo "3️⃣ 检查 assets 目录..."
if [ -d "$DEPLOY_DIR/assets" ]; then
  echo "✅ assets 目录存在"
  ASSET_COUNT=$(find "$DEPLOY_DIR/assets" -type f | wc -l | tr -d ' ')
  echo "   文件数量: $ASSET_COUNT"
  
  # 检查 logo 文件
  LOGO_LIGHT="$DEPLOY_DIR/assets/logo-light.png"
  LOGO_DARK="$DEPLOY_DIR/assets/logo-dark.png"
  if [ -f "$LOGO_LIGHT" ]; then
    echo "✅ logo-light.png 存在"
  else
    echo "❌ logo-light.png 不存在"
  fi
  if [ -f "$LOGO_DARK" ]; then
    echo "✅ logo-dark.png 存在"
  else
    echo "❌ logo-dark.png 不存在"
  fi
else
  echo "❌ assets 目录不存在"
fi
echo ""

# 4. 检查文件权限
echo "4️⃣ 检查文件权限..."
if [ -r "$DEPLOY_DIR/index.html" ]; then
  echo "✅ index.html 可读"
else
  echo "❌ index.html 不可读"
fi

if [ -d "$DEPLOY_DIR/assets" ]; then
  if [ -r "$DEPLOY_DIR/assets" ]; then
    echo "✅ assets 目录可读"
  else
    echo "❌ assets 目录不可读"
  fi
fi
echo ""

# 5. 检查 Nginx 配置
echo "5️⃣ 检查 Nginx 配置..."
if command -v nginx >/dev/null 2>&1; then
  if sudo nginx -t 2>&1 | grep -q "successful"; then
    echo "✅ Nginx 配置正确"
  else
    echo "❌ Nginx 配置有错误:"
    sudo nginx -t 2>&1 | sed 's/^/   /'
  fi
else
  echo "⚠️  Nginx 未安装或不在 PATH 中"
fi
echo ""

# 6. 检查是否有旧文件残留
echo "6️⃣ 检查可能的旧文件残留..."
OLD_FILES=$(find "$DEPLOY_DIR" -name "*.html" -o -name "doc.html" -o -name "models.html" -o -name "home.html" 2>/dev/null | grep -v "index.html")
if [ -n "$OLD_FILES" ]; then
  echo "⚠️  发现可能的旧文件:"
  echo "$OLD_FILES" | sed 's/^/   - /'
else
  echo "✅ 没有发现旧文件"
fi
echo ""

# 总结
echo "=========================================="
echo "验证完成"
echo "=========================================="
echo ""
if [ "$HTML_COUNT" -gt 0 ]; then
  echo "⚠️  发现问题: 有多余的 HTML 文件"
  echo "   建议运行清理命令后再部署"
  exit 1
else
  echo "✅ 所有检查通过"
  exit 0
fi
