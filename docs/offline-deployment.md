# 离线安装部署文档
本文档说明 xw-cli在离线或无外网环境下的安装与部署流程，便于复现与排查。

## 一、概述

- **项目**：xw / xw-cli
- **安装方式**：
    1. **快速安装**：在线下载包 + 调用 `install.sh --user`
    2. **本地安装**：在已解压的发行包内执行 `scripts/install.sh`（支持系统安装 / 用户安装）
    3. **离线安装**：在有网环境预先下载安装包与运行时镜像，拷贝到无网环境后安装（见下文「离线下载与安装」）。

---

## 二、离线下载与安装

适用于无外网或需在内网复现安装的场景：先在可访问互联网的机器上完成下载，再拷贝到目标离线环境执行安装。

### 2.1 离线下载安装包

在有网络的机器上，按目标架构下载 xw 发行包（与官方在线安装使用的地址一致）：

| 变量 | 说明 |
| --- | --- |
| `VERSION` | 版本号，以官方发布为准  |
| `BASE_URL` | `https://xw.tsingmao.com` |
| `arch` | 目标 CPU 架构：`amd64`（x86_64）或 `arm64`（aarch64） |

**下载命令示例**

1. **确定目标机器架构**（在目标机或同架构机上执行）：

```bash
uname -m
```

xw 支持的架构与安装包对应关系：

| `uname -m` 输出 | 使用安装包 |
| --- | --- |
| x86_64 / amd64 | amd64 包 |
| aarch64 / arm64 | arm64 包 |
2. **确认安装包版本号**（与官方 install.sh 一致）：

```bash
curl -sL https://xw.tsingmao.com/install.sh | sed -n 's/^VERSION="\(.*\)"/\1/p'
```

输出即为当前发布的版本号（如 `0.0.1`），记为 `VERSION`，用于下面下载与离线步骤中的 `xw-${VERSION}-${arch}.tar.gz`。

3. **按架构选择并执行下载命令**（将上一步得到的版本号代入，二选一）：

```bash
# arm64 包
curl -fSL https://xw.tsingmao.com/xw-0.0.1-arm64.tar.gz -o xw-0.0.1-arm64.tar.gz

# amd64 包
curl -fSL https://xw.tsingmao.com/xw-0.0.1-amd64.tar.gz -o xw-0.0.1-amd64.tar.gz
```

若版本号非 `0.0.1`，将上述命令中的版本号替换为第 2 步得到的 `VERSION`。

**离线环境安装步骤**

1. 将下载得到的 `xw-${VERSION}-${arch}.tar.gz` 拷贝到离线机器（`VERSION`、`arch` 与上面一致）。
2. 解压并进入目录，执行本地安装脚本（系统安装或用户安装二选一）：

```bash
tar -xzf xw-${VERSION}-${arch}.tar.gz
cd xw-${VERSION}-${arch}

# 系统安装（需 root）
sudo bash scripts/install.sh

# 或用户安装（无需 root）
bash scripts/install.sh --user
```

### 2.2 离线下载运行时镜像与模型权重

### 2.2.1 离线下载运行时镜像（Docker 镜像）

xw 在运行模型推理时会拉取 Docker 镜像，镜像地址由配置文件中的 **runtime_images** 定义。离线环境需提前在有网机器上拉取并导出，再在离线机上导入。

**镜像配置位置**：

- 安装后：系统安装为 `/etc/xw/devices.yaml`，用户安装为 `~/.xw/devices.yaml`。
- 发行包内：`configs/devices.yaml`。

**镜像结构**：在 `devices.yaml` 中，每个芯片型号（如 `ascend-910b`、`ascend-310p`、`metax-c550`）下有 `runtime_images`，按推理引擎（如 `vllm`、`mindie`、`mlguider`）和 CPU 架构（`arm64` / `amd64`）指定镜像地址；值为 `NONE` 表示该架构不支持，无需下载。

**步骤一：在有网环境导出镜像**

1. 根据实际使用的芯片与架构，从 `configs/devices.yaml`（或已安装的 `devices.yaml`）中列出需要使用的镜像（忽略值为 `NONE` 的项）。
2. 对每个镜像执行拉取并导出（示例）：

```bash
# 示例：根据 devices.yaml 中 ascend-910b 的配置
docker pull harbor.tsingmao.com/xw-cli/vllm-ascend:v0.14.0rc1-arm64
docker pull harbor.tsingmao.com/xw-cli/mindie:2.2.RC1-800I-A2-py311-openeuler24.03-lts-arm64

# 导出为 tar 文件（便于拷贝）
docker save -o vllm-ascend-arm64.tar harbor.tsingmao.com/xw-cli/vllm-ascend:v0.14.0rc1-arm64
docker save -o mindie-arm64.tar harbor.tsingmao.com/xw-cli/mindie:2.2.RC1-800I-A2-py311-openeuler24.03-lts-arm64
```

3. 将生成的 `.tar` 文件拷贝到离线机器。

**步骤二：在离线环境导入镜像**

```bash
docker load -i vllm-ascend-arm64.tar
docker load -i mindie-arm64.tar
```

**说明**：

- 实际需下载的镜像列表以你当前使用的 `devices.yaml` 为准（不同芯片/引擎/架构组合不同）。
- 若使用私有 Harbor（如 `harbor.tsingmao.com`），有网环境需先 `docker login` 再 `pull`；离线环境只需 `docker load`，无需登录镜像仓库。

### 2.2.2 离线拷贝模型权重

离线环境无法执行 `xw pull` 拉取模型时，可将**已准备好的完整模型目录**拷贝到 xw 的数据目录下，达到“本地已有模型、直接运行”的效果。

**路径约定**：

- xw 模型目录结构为：`{数据目录}/models/{模型ID}/{tag}`，默认 tag 为 `latest`。
- **默认数据目录**（`xw serve` 不加 `-data`）：
    - 用户安装：`~/.xw/data` → 模型根目录为 `~/.xw/data/models`；
    - 系统安装：`/var/lib/xw` → 模型根目录为 `/var/lib/xw/models`。

因此，例如要使用 **qwen2-7b**，拷贝目标应为：

- 默认数据目录（用户安装）：`/home/<用户>/.xw/data/models/qwen2-7b/latest`

**操作步骤**：

1. 在有网环境或已有完整模型的介质上，确认源目录为**完整模型**（至少包含：`config.json`、`tokenizer_config.json`、词表文件如 `qwen2.tiktoken` 或 `tokenizer.json`、权重文件如 `.safetensors`）。缺文件会导致推理时报错（如 tokenizer 的 `vocab_file` 为 None）。
2. 在离线环境创建父目录并拷贝（示例为用户安装、默认数据目录）：

```bash
# 创建父目录（避免目标路径不存在）
mkdir -p /home/离线机器username/.xw/data/models/qwen2-7b

# 例如，模型权重文件离线下载的位置在mnt/qwen2-7b
# 将完整模型目录拷贝为 latest 
cp -r /mnt/qwen2-7b /home/离线机器username/.xw/data/models/qwen2-7b/latest
```

3. 启动服务与运行模型（与数据目录一致）：
    - 默认数据目录：`xw serve`，另开终端执行 `xw run qwen2-7b`；

**小结**：只要源目录是完整模型、且拷贝到上述 `{数据目录}/models/qwen2-7b/latest`，即可在离线环境用 xw 直接运行该模型，无需在线拉取。

### 2.3 安装后检查与文件位置核对

安装完成后，可按下列项核对是否就绪；完整路径说明见本文档三、安装涉及的文件与目录汇总。

**1. CLI 与配置（安装包阶段）**

| 安装方式 | 建议核对项 |
| --- | --- |
| 用户安装 | 执行 `xw version --client` 能输出版本；二进制在 `~/.local/bin/xw`；配置在 `~/.xw/`（`devices.yaml`、`models.yaml` 等）；数据目录为 `~/.xw/data`，模型目录为 `~/.xw/data/models`。若提示找不到 `xw`，执行 `source ~/.bashrc` 或 `source ~/.zshrc` 后重试。 |
| 系统安装 | 执行 `xw version --client` 能输出版本；二进制在 `/usr/local/bin/xw`；配置在 `/etc/xw/`；数据目录为 `/var/lib/xw`，模型目录为 `/var/lib/xw/models`。服务：`systemctl status xw-server`。 |

**2. 运行时镜像（Docker）**

若已按 2.2.1 在离线机执行过 `docker load`，可用下面命令确认镜像已在本地：

```bash
docker images
```

列表中应包含你在有网环境导出并拷贝过来的镜像（如 `harbor.tsingmao.com/xw-cli/...`）。未看到则需重新执行 `docker load -i <对应.tar>`。

**3. 模型权重（可选）**

若已按 2.2.2 拷贝模型，请核对「数据目录」下是否存在对应模型目录，且内含完整文件（如 `config.json`、词表、权重等）。例如用户安装、默认数据目录下 qwen2-7b：

- 路径：`~/.xw/data/models/qwen2-7b/latest/`
- 可执行：`ls ~/.xw/data/models/qwen2-7b/latest` 查看是否含 `config.json`、`.safetensors` 等。

**4. 快速检查命令汇总**

```bash
xw version --client          # CLI 版本
xw ls -a                     # 已注册模型（依赖配置与数据目录）
docker images                # 已加载的运行时镜像（若使用 Docker）
# 用户安装时
ls ~/.xw/
ls ~/.xw/data/models/
# 系统安装时
ls /etc/xw/
systemctl status xw-server
```

---

## 三、安装涉及的文件与目录汇总

### 3.1 用户安装

| 类型 | 路径 |
| --- | --- |
| 二进制 | `~/.local/bin/xw` |
| 配置 | `~/.xw/devices.yaml`，`~/.xw/models.yaml`，`~/.xw/runtime_params.yaml`（可选） |
| 数据 | `~/.xw/data/`，`~/.xw/data/models/` |
| 可能修改 | `~/.bashrc` 或 `~/.zshrc`（追加 PATH） |

### 3.2 系统安装

| 类型 | 路径 |
| --- | --- |
| 二进制 | `/usr/local/bin/xw` |
| 配置 | `/etc/xw/devices.yaml`，`/etc/xw/models.yaml`，`/etc/xw/runtime_params.yaml`（可选） |
| 数据 | `/var/lib/xw/`，`/var/lib/xw/models/` |
| 日志 | `/var/log/xw/` |
| 服务 | `/etc/systemd/system/xw-server.service` |
| 系统用户 | `xw`（–system –no-create-home –shell /bin/false） |