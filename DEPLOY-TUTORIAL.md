# 玄武文档部署教程

## 目录

1. [临时预览（给老板看）](#一临时预览给老板看)
2. [正式部署到服务器](#二正式部署到服务器)
3. [日常更新流程](#三日常更新流程)

---

## 一、临时预览（给老板看）

适合快速演示，链接在你电脑开机时有效。

### 步骤 1：进入项目目录

```bash
cd "/Users/clairesun/Downloads/md/user guide/docs-site"
```

### 步骤 2：构建静态文件

```bash
npm run docs:build
```

构建产物在 `docs/.vitepress/dist` 目录。

### 步骤 3：启动本地服务器

```bash
cd docs/.vitepress/dist
python3 -m http.server 8080
```

此时本地可以访问：http://localhost:8080

### 步骤 4：生成公网链接

新开一个终端窗口，执行：

```bash
npx localtunnel --port 8080 --subdomain xuanwu-docs
```

输出：
```
your url is: https://xuanwu-docs.loca.lt
```

### 步骤 5：发给老板

把链接 **https://xuanwu-docs.loca.lt** 发给老板。

> 首次打开会有验证页面，点击 "Click to Continue" 即可。

### 注意事项

- 两个终端窗口都不能关闭
- 电脑休眠/关机后链接失效
- 仅用于临时演示，不适合长期使用

### 一键脚本（可选）

创建 `preview.sh`：

```bash
#!/bin/bash
cd "/Users/clairesun/Downloads/md/user guide/docs-site"
npm run docs:build
cd docs/.vitepress/dist
python3 -m http.server 8080 &
sleep 2
npx localtunnel --port 8080 --subdomain xuanwu-docs
```

运行：
```bash
chmod +x preview.sh
./preview.sh
```

---

## 二、正式部署到服务器

### 方案 A：GitHub Actions 自动部署（推荐）

每次 `git push` 自动更新网站。

#### 1. 创建 Git 仓库

```bash
cd "/Users/clairesun/Downloads/md/user guide/docs-site"

git init
git add .
git commit -m "Initial commit"
```

#### 2. 推送到 GitHub

```bash
# 在 GitHub 上创建仓库后执行
git remote add origin git@github.com:你的组织/xuanwu-docs.git
git branch -M main
git push -u origin main
```

#### 3. 配置服务器

SSH 登录到你的服务器：

```bash
ssh root@你的服务器IP
```

创建目录并配置 Nginx：

```bash
# 创建网站目录
mkdir -p /var/www/xuanwu-docs
chown -R www-data:www-data /var/www/xuanwu-docs

# 创建 Nginx 配置
cat > /etc/nginx/sites-available/xuanwu-docs << 'EOF'
server {
    listen 80;
    server_name docs.xuanwu.ai;  # 改成你的域名

    root /var/www/xuanwu-docs;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
}
EOF

# 启用站点
ln -s /etc/nginx/sites-available/xuanwu-docs /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### 4. 配置 GitHub Secrets

在 GitHub 仓库页面：Settings → Secrets and variables → Actions → New repository secret

添加以下三个 Secret：

| 名称 | 值 | 获取方式 |
|-----|-----|---------|
| `SERVER_HOST` | 服务器 IP | 如 `1.2.3.4` |
| `SERVER_USER` | SSH 用户名 | 如 `root` |
| `SERVER_SSH_KEY` | SSH 私钥 | 见下方说明 |

**获取 SSH 私钥：**

在你的 Mac 上执行：
```bash
cat ~/.ssh/id_rsa
```

如果没有，先生成：
```bash
ssh-keygen -t rsa -b 4096
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys  # 添加到服务器
```

把私钥内容（包括 `-----BEGIN` 和 `-----END` 行）复制到 `SERVER_SSH_KEY`。

#### 5. CI/CD 配置文件

项目中已包含 `.github/workflows/deploy.yml`，内容如下：

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install & Build
        run: |
          npm ci
          npm run docs:build

      - name: Deploy to Server
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          source: "docs/.vitepress/dist/*"
          target: "/var/www/xuanwu-docs"
          strip_components: 3
```

#### 6. 测试部署

```bash
git add .
git commit -m "Test deployment"
git push
```

去 GitHub 仓库 → Actions 页面查看部署进度。

---

### 方案 B：Docker 部署

适合有 Docker 环境的服务器。

#### 1. 构建镜像

```bash
cd "/Users/clairesun/Downloads/md/user guide/docs-site"
docker build -t xuanwu-docs .
```

#### 2. 导出镜像（可选）

```bash
docker save xuanwu-docs > xuanwu-docs.tar
scp xuanwu-docs.tar root@服务器IP:/root/
```

#### 3. 在服务器上运行

```bash
# 如果是传输的镜像
docker load < xuanwu-docs.tar

# 运行容器
docker run -d \
  --name xuanwu-docs \
  --restart always \
  -p 80:80 \
  xuanwu-docs
```

---

### 方案 C：手动部署

最简单，适合偶尔更新。

#### 1. 本地构建

```bash
cd "/Users/clairesun/Downloads/md/user guide/docs-site"
npm run docs:build
```

#### 2. 上传到服务器

```bash
scp -r docs/.vitepress/dist/* root@服务器IP:/var/www/xuanwu-docs/
```

---

## 三、日常更新流程

### 更新文档内容

1. 编辑 `docs/` 下的 `.md` 文件
2. 本地预览：
   ```bash
   npm run docs:dev
   ```
3. 确认无误后提交：
   ```bash
   git add .
   git commit -m "更新xxx文档"
   git push
   ```
4. GitHub Actions 自动部署（约1-2分钟）

### 新增文档页面

1. 在 `docs/` 下创建新的 `.md` 文件，如 `docs/new-feature.md`

2. 编辑 `docs/.vitepress/config.mts`，在 `sidebar` 中添加：
   ```ts
   {
     text: '进阶',
     items: [
       { text: '架构设计', link: '/architecture' },
       { text: '新功能', link: '/new-feature' },  // 新增这行
     ]
   }
   ```

3. 提交并推送

### 修改导航栏

编辑 `docs/.vitepress/config.mts` 中的 `nav` 部分：

```ts
nav: [
  { text: '文档', link: '/getting-started' },
  { text: 'API', link: '/api-guide' },
  { text: '新菜单', link: '/new-page' },  // 新增
  { text: 'GitHub', link: 'https://github.com/xuanwu-ai/xuanwu' }
],
```

### 修改样式

编辑 `docs/.vitepress/theme/custom.css`

常用修改：
```css
:root {
  --vp-c-brand-1: #0ea5e9;      /* 主题色 */
  --vp-code-block-bg: #f8fafc;   /* 代码块背景 */
}
```

---

## 附录：常用命令速查

```bash
# 进入项目
cd "/Users/clairesun/Downloads/md/user guide/docs-site"

# 安装依赖（首次或 package.json 变更后）
npm install

# 开发预览（支持热更新）
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览构建结果
npm run docs:preview

# Git 提交
git add .
git commit -m "提交信息"
git push

# 临时公网预览
cd docs/.vitepress/dist
python3 -m http.server 8080 &
npx localtunnel --port 8080 --subdomain xuanwu-docs
```

---

## 附录：项目文件说明

| 文件/目录 | 作用 |
|----------|------|
| `docs/*.md` | 文档内容 |
| `docs/.vitepress/config.mts` | 站点配置（导航、侧边栏） |
| `docs/.vitepress/theme/custom.css` | 自定义样式 |
| `docs/public/` | 静态资源（图片、logo） |
| `.github/workflows/deploy.yml` | CI/CD 配置 |
| `nginx.conf` | Nginx 服务器配置 |
| `Dockerfile` | Docker 构建配置 |
| `package.json` | 项目依赖 |
