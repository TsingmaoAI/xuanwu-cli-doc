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
| `VERSION` | 版本号，以官方发布为准（例如 `1.0.0`） |
| `BASE_URL` | `https://xw.tsingmao.com` |
| `arch` | 目标 CPU 架构：`amd64`（x86_64）或 `arm64`（aarch64） |

**版本号从哪里读**：

- **已下载的发行包**：解压后目录内有一份 `VERSION` 文件（由打包脚本生成），内容含 `VERSION=...`、`ARCH=...` 等，可直接查看：`cat VERSION` 或 `source VERSION` 后使用 `$VERSION`。下载 URL 中的文件名也包含版本号，如 `xw-1.0.0-amd64.tar.gz`。
- **本仓库自行打包时**：版本号来自环境变量 `VERSION`（如 `VERSION=1.0.0 make package`）；未设置时在 `scripts/package.sh` 中默认为 `1.0.0`，在 `Makefile` 中默认为 `0.0.1`（`make package` 会传入 `VERSION` 给 package.sh）。
- **已安装的二进制**：运行 `xw version --client` 可查看当前安装的 CLI 版本（编译时通过 ldflags 注入）。

**下载命令示例**（按实际架构二选一）：

```bash
# 确定架构（在目标机或同架构机上执行）
arch=$(uname -m)
case "$arch" in
  x86_64|amd64) arch=amd64 ;;
  aarch64|arm64) arch=arm64 ;;
  *) echo "Unsupported:$arch"; exit 1 ;;
esac

VERSION="1.0.0"
BASE_URL="https://xw.tsingmao.com"
curl -fSL "${BASE_URL}/xw-${VERSION}-${arch}.tar.gz" -o "xw-${VERSION}-${arch}.tar.gz"
```

**离线环境安装步骤**：

1. 将 `xw-${VERSION}-${arch}.tar.gz` 拷贝到离线机器。
2. 解压并进入目录，执行本地安装脚本（系统安装或用户安装二选一）：

```bash
tar -xzf xw-${VERSION}-${arch}.tar.gz
cd xw-${VERSION}-${arch}

# 系统安装（需 root）
sudo bash scripts/install.sh

# 或用户安装（无需 root）
bash scripts/install.sh --user
```

后续步骤与本文档「四、本地安装脚本（install.sh）」一致。

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

1. 将生成的 `.tar` 文件拷贝到离线机器。

**步骤二：在离线环境导入镜像**

```bash
docker load -i vllm-ascend-arm64.tar
docker load -i mindie-arm64.tar
```

**说明**：

- 实际需下载的镜像列表以你当前使用的 `devices.yaml` 为准（不同芯片/引擎/架构组合不同）。
- 若使用私有 Harbor（如 `harbor.tsingmao.com`），有网环境需先 `docker login` 再 `pull`；离线环境只需 `docker load`，无需登录镜像仓库。

### 2.2.2 离线拷贝模型权重（可选）

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

# 将完整模型目录拷贝为 latest
cp -r /mnt/offlinetest/latest /home/离线机器username/.xw/data/models/qwen2-7b/latest
```

1. 启动服务与运行模型（与数据目录一致）：
    - 默认数据目录：`xw serve`，另开终端执行 `xw run qwen2-7b`；

**小结**：只要源目录是完整模型、且拷贝到上述 `{数据目录}/models/qwen2-7b/latest`，即可在离线环境用 xw 直接运行该模型，无需在线拉取。

### 2.3 离线安装流程小结与执行步骤

**阶段与有网/离线分工**：

| 阶段 | 有网环境 | 离线环境 |
| --- | --- | --- |
| 安装包 | 下载 `xw-${VERSION}-${arch}.tar.gz` | 解压后执行 `scripts/install.sh` 或 `scripts/install.sh --user` |
| 运行时镜像 | 从 `devices.yaml` 读取镜像列表，`docker pull` 后 `docker save` 为 tar | 将 tar 拷贝到离线机后 `docker load` |
| 模型权重（可选） | 在有模型的环境准备好完整模型目录，或从模型介质拷贝 | 将完整模型目录拷贝到 `{数据目录}/models/{模型ID}/latest`（如 `~/.xw/data/models/qwen2-7b/latest`），再 `xw serve` 与 `xw run` |

**安装包阶段执行步骤**（快速安装与离线安装共用同一套动作，仅“有网/离线”执行的步骤范围不同）：

| 步骤 | 动作 | 有网（快速安装） | 离线 |
| --- | --- | --- | --- |
| 1 | 检测架构：`uname -m` → amd64 / arm64（仅支持 x86_64、aarch64） | ✓ | 已按目标机架构准备包，可跳过 |
| 3 | 检查依赖：必须存在 `curl`、`tar` | ✓ | 仅需 `tar`（解压与执行脚本） |
| 4 | 创建/进入目录：有网为临时目录，离线为已拷贝的发行包目录 | ✓ 临时目录 | ✓ 解压所在目录 |
| 5 | 下载：`BASE_URL/xw-${VERSION}-${arch}.tar.gz` | ✓ | 跳过（使用已拷贝的 tar） |
| 6 | 解压：`tar -xzf`，进入 `xw-${VERSION}-${arch}` 目录 | ✓ | ✓ |
| 7 | 执行安装脚本：`chmod +x scripts/install.sh`，然后 `./scripts/install.sh` 或 `./scripts/install.sh --user` | ✓ 固定 `--user` | ✓ 二选一 |
| 8 | 提示 PATH：若 `xw` 不在 PATH，提示 source ~/.bashrc / ~/.zshrc 或把 `~/.local/bin` 加入 PATH | ✓ | ✓（用户安装时） |

有网环境下**快速安装**即执行步骤 1～8（含下载）；**离线安装**安装包阶段仅需在已有 tar 上执行步骤 6～7（解压、执行 install.sh），其余步骤按需（如检查依赖、提示 PATH）。

---

## **三、小结**

| **安装方式** | **实际执行的核心操作** |
| --- | --- |
| **快速安装** | 下载 xw-${VERSION}-${arch}.tar.gz → 解压 → 执行 ./scripts/install.sh --user |
| **离线安装** | 有网：下载安装包 + 从 devices.yaml 提取镜像并 docker pull、docker save；离线：解压包执行 install.sh + docker load 导入镜像；**可选**：将完整模型目录拷贝到 {数据目录}/models/{模型ID}/latest 以便离线运行模型 |

以上即为 xw 离线安装与部署的完整说明。