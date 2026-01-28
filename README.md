# 玄武文档站点

基于 VitePress 构建的玄武官方文档。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（支持热更新）
npm run docs:dev

# 构建静态文件
npm run docs:build

# 预览构建结果
npm run docs:preview
```

## 更新内容

| 更新内容 | 编辑文件 |
|---------|---------|
| 文档内容 | `docs/*.md` |
| 导航栏/侧边栏 | `docs/.vitepress/config.mts` |
| 样式主题 | `docs/.vitepress/theme/custom.css` |

## 部署到服务器

### 方式一：GitHub Actions 自动部署（推荐）

1. 在 GitHub 仓库设置 Secrets：
   - `SERVER_HOST` - 服务器 IP
   - `SERVER_USER` - SSH 用户名
   - `SERVER_SSH_KEY` - SSH 私钥

2. 推送代码到 main 分支，自动触发部署

3. 服务器配置 Nginx：
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/xuanwu-docs
   sudo ln -s /etc/nginx/sites-available/xuanwu-docs /etc/nginx/sites-enabled/
   sudo systemctl reload nginx
   ```

### 方式二：Docker 部署

```bash
# 构建镜像
docker build -t xuanwu-docs .

# 运行容器
docker run -d -p 80:80 xuanwu-docs
```

### 方式三：手动部署

```bash
# 本地构建
npm run docs:build

# 上传到服务器
scp -r docs/.vitepress/dist/* user@server:/var/www/xuanwu-docs/
```

## 目录结构

```
docs-site/
├── .github/workflows/
│   └── deploy.yml          # CI/CD 配置
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts      # 站点配置
│   │   └── theme/          # 自定义主题
│   ├── public/             # 静态资源
│   ├── index.md            # 首页
│   ├── getting-started.md  # 快速开始
│   ├── cli-reference.md    # CLI 参考
│   ├── api-guide.md        # API 指南
│   └── ...                 # 其他文档
├── nginx.conf              # Nginx 配置
├── Dockerfile              # Docker 构建
└── package.json
```
