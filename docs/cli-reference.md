# CLI 命令参考

本文档基于 xw-cli 代码仓整理，涵盖所有命令、参数说明及使用示例。

## 前置说明

- **服务依赖**：除 `serve`、`version --client` 外，其余命令均需先启动 xw server（`xw serve`）
- **全局参数**（适用于所有命令）：
    - `--server <URL>`：指定 xw 服务地址（默认 http://localhost:11581，可通过环境变量 XW_SERVER 设置）
    - `-v, --verbose`：详细输出

---

## 服务管理

### xw serve

启动 xw HTTP 服务，用于处理模型拉取、运行等请求。

**用法：**

```bash
xw serve [flags]
```

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `--host <地址>` | 服务监听地址 | localhost |
| `--port <端口>` | 服务监听端口 | 11581 |
| `--data <目录>` | 数据根目录（模型与运行时数据） | ~/.xw/data |
| `--config <目录>` | 配置目录（devices.yaml、models.yaml 等） | ~/.xw |

**示例：**

```bash
# 默认启动（localhost:11581）
xw serve

# 监听所有网络接口
xw serve --host 0.0.0.0

# 自定义端口
xw serve --port 9090

# 开启详细日志
xw serve -v
```

**说明：**
- 主要用于开发和测试，生产环境建议使用 systemd 管理 xw-server 二进制
- 按 Ctrl+C 优雅关闭服务

---

### xw reload

重新加载配置文件，无需重启服务。

**用法：**

```bash
xw reload
```

**说明：**
- 重新加载 devices.yaml、models.yaml、runtime_params.yaml
- 配置更新后立即生效，无需重启服务
- 配合 `xw update` 命令使用

**示例：**

```bash
# 更新配置版本后重新加载
xw update
xw reload
```

---

## 模型管理

### xw pull

从模型仓库下载并安装模型。

**用法：**

```bash
xw pull MODEL
```

**示例：**

```bash
xw pull qwen2-0.5b
xw pull qwen2.5-7b-instruct
xw pull qwen3-8b
xw pull glm-5
```

**说明：**拉取前会检测当前设备是否支持该模型。

---

### xw ls / xw list

列出已下载的模型或当前芯片支持的所有模型。

**用法：**

```bash
xw ls [flags]
```

| 参数 | 说明 |
| --- | --- |
| 无 | 仅列出已下载的模型 |
| `-a, --all` | 列出当前芯片支持的所有模型（含未下载） |

**示例：**

```bash
# 已下载的模型
xw ls

# 展示全部可用模型
xw ls -a
xw list -a
```

---

### xw show

显示模型详细信息，格式兼容 Ollama。

**用法：**

```bash
xw show MODEL [flags]
```

| 参数 | 说明 |
| --- | --- |
| 无 | 显示完整信息（架构、参数、许可等） |
| `--modelfile` | 仅显示 Modelfile |
| `--parameters` | 仅显示参数 |
| `--template` | 仅显示模板 |
| `--system` | 仅显示系统提示 |
| `--license` | 仅显示许可 |
| `--engines` | 仅显示支持的引擎 |

**示例：**

```bash
# 显示完整信息
xw show qwen2.5-7b-instruct

# 显示 Modelfile
xw show qwen2.5-7b-instruct --modelfile

# 显示参数配置
xw show qwen2.5-7b-instruct --parameters

# 显示支持的推理引擎
xw show qwen2.5-7b-instruct --engines

# 显示许可证
xw show qwen2.5-7b-instruct --license
```

**说明：**信息来源于 Modelfile（用户可编辑）或模型规范（内置配置）。

---

## 实例运行与管理

### xw run

运行模型并进入交互式对话。

**用法：**

```bash
xw run MODEL [flags]
```

| 参数 | 说明 |
| --- | --- |
| `--alias <名称>` | 实例别名，默认使用模型 ID |
| `--engine <引擎>` | 推理引擎，格式为 backend:mode（如 vllm:docker、mindie:native） |
| `--device <列表>` | 设备列表，如 0 或 0,1,2,3 |
| `--tp <度数>` | 张量并行度，可选值：1、2、4、8 |

**示例：**

```bash
# 默认配置运行
xw run qwen2.5-7b-instruct

# 指定别名
xw run qwen2.5-7b-instruct --alias my-chat

# 指定引擎
xw run qwen2-7b --engine vllm:docker

# 指定设备
xw run qwen2.5-7b-instruct --device 0,1
```

**说明：**
- 自动检查实例是否运行，未运行则启动
- 等待实例就绪后进入交互式对话
- 对话中输入 `/quit` 退出
- 引擎未指定时自动选择最佳引擎

---

### xw start

后台启动模型实例，不进入对话。

**用法：**

```bash
xw start MODEL [flags]
```

| 参数 | 说明 |
| --- | --- |
| `--alias <名称>` | 实例别名，默认使用模型名 |
| `--engine <引擎>` | 推理引擎（vllm:docker、vllm:native、mindie:docker、mindie:native） |
| `--device <列表>` | 设备列表 |
| `--tp <度数>` | 张量并行度（1、2、4、8） |
| `--max-concurrent <N>` | 最大并发请求数，0 表示不限制 |
| `-d, --detach` | 后台运行（默认前台运行并显示日志） |

**示例：**

```bash
# 前台启动（默认，显示日志，Ctrl+C 停止）
xw start qwen2-7b

# 后台启动
xw start qwen2-7b -d

# 指定引擎并后台运行
xw start qwen2-7b --engine vllm:docker -d

# 多卡运行并限制并发
xw start qwen2-72b --device 0,1,2,3 --max-concurrent 4
```

**说明：**
- 默认前台运行并流式输出日志，按 Ctrl+C 停止并移除实例
- 使用 `-d` 后台运行，实例在命令退出后继续运行
- 相同模型多次启动会返回已存在的实例

---

### xw ps

列出所有模型实例（运行中与已停止）。

**用法：**

```bash
xw ps [flags]
```

| 参数 | 说明 |
| --- | --- |
| `-a, --all` | 显示所有实例（默认为 true） |

**示例：**

```bash
# 列出所有实例
xw ps
```

---

### xw stop

停止并移除运行中的模型实例。

**用法：**

```bash
xw stop ALIAS [flags]
```

| 参数 | 说明 |
| --- | --- |
| `-f, --force` | 强制停止（即使正在处理请求） |

**示例：**

```bash
# 停止实例
xw stop qwen2-7b

# 强制停止
xw stop my-model --force
```

**说明：**
- 停止后端进程/容器
- 移除容器并释放资源
- 永久删除实例
- 别名可通过 `xw ps` 查看

---

### xw logs

查看模型实例日志。

**用法：**

```bash
xw logs ALIAS [flags]
```

| 参数 | 说明 |
| --- | --- |
| `-f, --follow` | 持续流式输出日志（Ctrl+C 结束） |

**示例：**

```bash
# 显示现有日志
xw logs my-model

# 实时跟踪日志
xw logs my-model -f
```

---

## 设备管理

### xw device

检测和管理 AI 加速器设备。

**用法：**

```bash
xw device [command]
```

**可用子命令：**

| 命令 | 说明 |
| --- | --- |
| `list` | 列出服务器上检测到的 AI 芯片 |
| `supported` | 显示所有支持的芯片型号 |

**示例：**

```bash
# 列出检测到的设备
xw device list

# 显示支持的芯片型号
xw device supported
```

**说明：**查询服务器以发现已安装的国产 AI 芯片及其能力。

---

## 配置管理

### xw config

管理服务器配置。

**用法：**

```bash
xw config [command]
```

**说明：**用于管理服务器配置，具体子命令请使用 `xw config --help` 查看。

---

### xw update

更新配置到新版本。

**用法：**

```bash
xw update
```

**说明：**
- 更新配置文件到新版本
- 配合 `xw reload` 使配置生效

**示例：**

```bash
# 更新配置并重新加载
xw update
xw reload
```

---

## 版本信息

### xw version

显示客户端和/或服务端版本。

**用法：**

```bash
xw version [flags]
```

| 参数 | 说明 |
| --- | --- |
| 无 | 显示客户端和服务端版本 |
| `--client` | 仅显示客户端版本 |
| `--server` | 仅显示服务端版本 |

**示例：**

```bash
# 显示客户端和服务端版本
xw version

# 仅显示客户端版本
xw version --client

# 仅显示服务端版本
xw version --server
```

---

## 数据目录结构

### 目录说明

- **数据根目录**（`--data`）：默认 `~/.xw/data`
- **配置目录**（`--config`）：默认 `~/.xw`
- **模型目录**：`{--data}/models`

**目录示例：**

```
~/.xw/
├── config/
│   ├── devices.yaml          # 设备配置
│   ├── models.yaml           # 模型定义
│   └── runtime_params.yaml   # 运行时参数
└── data/
    └── models/
        ├── qwen3-8b/
        ├── qwen2.5-7b-instruct/
        └── glm-5/
```

### 使用已有模型目录

若已有模型目录，可通过符号链接或 `--data` 参数指定：

**方法一：符号链接**

```bash
mkdir -p ~/.xw/data/models
ln -s /path/to/your/model ~/.xw/data/models/qwen3-8b
xw serve
```

**方法二：指定数据目录**

```bash
# 模型在 /data/models/qwen3-8b
xw serve --data /data
```

---

## 支持的模型

当前共支持 **25 个模型**（Qwen 15 个、GLM 4 个、DeepSeek 4 个、MiniMax 2 个），涵盖文本生成、视觉理解、代码生成等能力。

### 模型-设备支持矩阵

下表列出每个模型在不同芯片上的支持情况及可用推理引擎：

| 模型 ID | 参数量 | 上下文 | 910B | 310P | C550 | 能力标签 |
|---------|--------|--------|------|------|------|----------|
| **Qwen 系列** |
| qwen2.5-7b-instruct | 7.6B | 131K | ✅ vllm, mindie | ✅ vllm, mindie, mlguider | ✅ vllm | completion |
| qwen2.5-14b-instruct | 14B | 131K | ✅ vllm, mindie, mlguider | ✅ vllm, mindie, mlguider | ✅ vllm | completion |
| qwen2.5-72b-instruct | 72B | 131K | ✅ vllm, mindie, mlguider | ✅ vllm, mindie, mlguider | ✅ vllm | completion |
| qwen3-8b | 8B | 131K | ✅ vllm, mindie | ✅ vllm, mindie, mlguider | ✅ vllm | completion |
| qwen3-32b | 32B | 131K | ✅ vllm, mindie | ✅ vllm, mindie, mlguider | ✅ vllm | completion |
| qwq-32b | 32B | 131K | ✅ vllm, mindie, mlguider | ✅ vllm, mindie, mlguider | ✅ vllm | completion |
| qwen3-235b-a22b-w8a8 | 235B | 40K | ❌ | ❌ | ✅ vllm | completion |
| qwen3-235b-a22b-w4a8 | 235B | 40K | ✅ vllm | ❌ | ❌ | completion |
| qwen3-next-80b-a3b-instruct-w8a8 | 80B | 131K | ✅ vllm, mindie | ❌ | ❌ | completion |
| qwen3-32b-w8a8 | 32B | 131K | ✅ vllm, mindie | ❌ | ❌ | completion |
| qwen3-30b-a3b-instruct-2507-w4a8 | 30B | 131K | ✅ vllm, mindie | ❌ | ❌ | completion |
| qwen2.5-vl-7b-instruct | 7B | 32K | ✅ vllm, mindie, mlguider | ✅ vllm, mindie | ✅ vllm | vision |
| qwen3-vl-8b-instruct | 8B | 32K | ✅ vllm, mindie, mlguider | ✅ vllm, mindie | ✅ vllm | vision |
| qwen3-vl-30b-a3b-instruct | 30B | 32K | ✅ vllm, mindie | ✅ vllm, mindie | ✅ vllm | vision |
| qwen3-coder-next | 80B | 131K | ❌ | ✅ mlguider | ❌ | coding, tool_use |
| **GLM 系列** |
| glm-4.5-w8a8 | - | 131K | ✅ vllm | ❌ | ✅ vllm | completion |
| glm-4.7-w8a8 | - | 131K | ❌ | ❌ | ✅ vllm | completion |
| glm-5 | - | 131K | ✅ vllm | ❌ | ❌ | completion |
| glm-ocr | 10B | 66K | ❌ | ✅ mlguider | ❌ | vision, OCR |
| **DeepSeek 系列** |
| deepseek-ocr | - | 32K | ❌ | ❌ | ✅ vllm | vision, OCR |
| deepseek-r1-distill-qwen-7b | 7B | 131K | ✅ vllm, mindie, mlguider | ✅ vllm, mindie, mlguider | ✅ vllm | completion |
| deepseek-r1-distill-qwen-32b | 32B | 131K | ✅ vllm, mindie, mlguider | ✅ vllm, mindie, mlguider | ✅ vllm | completion |
| deepseek-r1-distill-llama-70b | 70B | 32K | ✅ vllm, mindie, mlguider | ✅ vllm, mindie, mlguider | ✅ vllm | completion |
| **MiniMax 系列** |
| minimax-m2.1-w4a8 | - | 131K | ✅ vllm | ❌ | ❌ | completion |
| minimax-m2.5-w4a8 | - | 131K | ✅ vllm | ❌ | ❌ | completion |

**图例：**
- ✅ = 支持（后跟可用引擎：vllm/mindie/mlguider）
- ❌ = 不支持
- **910B** = Ascend 910B
- **310P** = Ascend 310P
- **C550** = Metax C550

**统计：**
- Ascend 910B：支持 23 个模型
- Ascend 310P：支持 20 个模型
- Metax C550：支持 17 个模型

**能力标签：**
- **completion**：文本生成（全部 25 个模型）
- **vision**：视觉理解（7 个模型：qwen2.5-vl-7b-instruct, qwen3-vl-8b-instruct, qwen3-vl-30b-a3b-instruct, glm-ocr, deepseek-ocr 等）
- **coding**：代码生成（qwen3-coder-next）
- **tool_use**：工具调用（qwen3-coder-next）

---

**查看完整列表：**
```bash
# 查看所有可用模型
xw ls -a

# 查看已下载模型
xw ls

# 查看模型支持的引擎
xw show <模型ID> --engines
```

---

## 支持的推理引擎

| 引擎 | 格式 | 说明 | 支持设备 |
| --- | --- | --- | --- |
| **vLLM** | vllm:docker | vLLM Docker 容器（推荐） | 昇腾 910B/310P, 沐曦 C550 |
| **vLLM** | vllm:native | vLLM 原生安装 | 昇腾 910B/310P |
| **MindIE** | mindie:docker | MindIE Docker 容器 | 昇腾 910B/310P |
| **MindIE** | mindie:native | MindIE 原生安装 | 昇腾 910B/310P |
| **MLGuider** | mlguider:docker | MLGuider Docker 容器 | 昇腾 310P |
| **Omni-Infer** | omni-infer:docker | Omni-Infer Docker 容器 | 昇腾 910B |

### 引擎选择说明

**自动选择（推荐）：**
```bash
# 不指定引擎，xw 自动选择最优引擎
xw run qwen3-8b
```

**手动指定：**
```bash
# 使用 vLLM Docker（推荐，兼容性最好）
xw run qwen3-8b --engine vllm:docker

# 使用 MindIE Docker（某些模型性能更好）
xw run qwen3-8b --engine mindie:docker

# 使用 MLGuider（仅 310P，特定模型优化）
xw run qwen3-coder-next --engine mlguider:docker
```

**引擎优先级：**

xw 会根据模型配置自动选择引擎，优先级顺序在 `models.yaml` 中定义。例如：
- qwen2.5-7b-instruct 在 910B 上优先使用 vllm:docker
- glm-ocr 在 310P 上仅支持 mlguider:docker

查看模型支持的引擎：
```bash
xw show qwen3-8b --engines
```

---

## 支持的设备

### 华为昇腾

**Ascend 910B 系列：**
- 芯片型号：ascend-910b
- 变体：910B1、910B4
- 支持引擎：vllm:docker, mindie:docker, omni-infer:docker
- 拓扑：8 卡，分为 2 组，每组 4 卡高速互联
- 支持模型：22 个（包括大部分 Qwen、GLM、DeepSeek-R1 系列）

**Ascend 310P 系列：**
- 芯片型号：ascend-310p
- 特点：双芯片卡（每张物理卡包含 2 个 AI 芯片）
- 支持引擎：vllm:docker, mindie:docker, mlguider:docker
- 支持模型：20 个（包括 Qwen、Qwen-Coder、GLM-OCR 等）

### 沐曦

**Metax C550：**
- 芯片型号：metax-c550
- 支持引擎：vllm:docker
- 支持模型：17 个（包括 Qwen、GLM-4.5/4.7、DeepSeek 系列）

---

**查看设备信息：**
```bash
# 列出检测到的设备
xw device list

# 查看支持的芯片型号
xw device supported
```

---

## 快速参考

| 功能 | 命令 |
| --- | --- |
| 启动服务 | `xw serve` |
| 指定数据目录启动 | `xw serve --data ~/.xw` |
| 拉取模型 | `xw pull <MODEL>` |
| 列出已下载模型 | `xw ls` |
| 列出所有可用模型 | `xw ls -a` |
| 查看模型详情 | `xw show <MODEL>` |
| 运行模型（交互） | `xw run <MODEL>` |
| 后台启动模型 | `xw start <MODEL> -d` |
| 查看运行实例 | `xw ps` |
| 停止实例 | `xw stop <ALIAS>` |
| 查看日志 | `xw logs <ALIAS>` |
| 实时跟踪日志 | `xw logs <ALIAS> -f` |
| 列出设备 | `xw device list` |
| 重新加载配置 | `xw reload` |
| 查看版本 | `xw version` |

---

*手册内容基于 xw-cli 代码仓整理。如有疑问，请使用 `xw [command] --help` 查看最新帮助信息。*
