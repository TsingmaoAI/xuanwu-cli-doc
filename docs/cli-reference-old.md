# xw-cli 使用手册

本文档基于代码仓整理，涵盖 xw 常用命令、参数说明及模型与数据目录的用法。
 


## 一、前置说明

- **服务依赖**：除 `serve`、`version --client` 外，其余命令均需先启动 xw server（`xw serve`）。
- **全局参数**（可选）：
    - `-server <URL>`：指定 xw 服务地址（默认见环境变量或 localhost:11581）。
    - `v, --verbose`：详细输出。

---

## 二、服务管理

### 2.1 启动服务 `xw serve`

启动 xw HTTP 服务，用于处理拉取、运行模型等请求。

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `--host` | 监听地址 | localhost |
| `--port` | 监听端口 | 11581 |
| `--data` | **数据根目录**（模型与运行时数据所在根目录） | ~/.xw/data |
| `--config` | 配置目录（devices.yaml、models.yaml 等） | ~/.xw |

**模型目录约定**：模型根目录为 `{--data}/models`，单个模型路径为 `{--data}/models/{模型ID}/{tag}`，默认 tag 为 `latest`。

例如 `--data ~/.xw` 时，qwen2-7b 的路径为 `~/.xw/models/qwen2-7b/latest`。

**示例：**

```bash
# 默认启动（localhost:11581，数据目录 ~/.xw/data）
xw serve

# 使用已有模型目录 ~/.xw/models（即数据根为 ~/.xw）
xw serve --data ~/.xw

# 指定端口与监听地址
xw serve --host 0.0.0.0 --port 11581

# 自定义数据目录并开启详细日志
xw serve --data /path/to/data -v
```

---

## 三、模型管理

### 3.1 拉取模型 `xw pull`

从仓库下载并安装模型，拉取完成后方可使用 `xw run`。

```bash
xw pull <MODEL>
```

**示例：**

```bash
xw pull qwen2-0.5b
xw pull qwen2-7b
xw pull qwen3-8b
```

拉取前若检测到当前设备不支持该模型，会提示确认是否继续。

---

### 3.2 列出模型 `xw ls` / `xw list`

查看本地已下载模型或仓库中支持的模型。

| 参数 | 说明 |
| --- | --- |
| 无 | 仅列出已下载的模型 |
| `-a, --all` | 列出当前芯片支持的所有模型（含未下载） |

**示例：**

```bash
# 已下载的模型
xw ls

# 展示全部模型
xw ls -a
xw list -a
```

---

### 3.3 查看模型详情 `xw show`

查看指定模型的详细信息（架构、参数、许可等），格式兼容 Ollama。

| 参数 | 说明 |
| --- | --- |
| `--modelfile` | 仅显示 Modelfile |
| `--parameters` | 仅显示参数 |
| `--template` | 仅显示模板 |
| `--system` | 仅显示系统提示 |
| `--license` | 仅显示许可 |

**示例：**

```bash
xw show qwen2.5-7b-instruct
xw show qwen2-7b --modelfile
xw show qwen2-7b --parameters
xw show qwen2-7b --license
```

---

## 四、实例运行与运维

### 4.1 运行模型（交互式）`xw run`

拉取模型并启动实例，进入交互式对话；若实例已存在则直接复用。

```bash
xw run <MODEL> [选项]
```

| 参数 | 说明 |
| --- | --- |
| `--alias <名称>` | 实例别名，默认使用模型 ID |
| `--engine <引擎>` | 推理引擎，格式为 backend:mode，如 vllm:docker、mindie:docker |
| `--device <列表>` | 设备列表，如 0 或 0,1,2,3 |
| `--tp <度数>` | 张量并行度，如 1、2、4、8 |

**示例：**

```bash
# 默认引擎与设备
xw run qwen2-7b

# 指定引擎与设备
xw run qwen2-7b --engine mindie:docker
xw run qwen2-7b --device 0,1
xw run qwen2-7b --alias my-chat --engine vllm:docker
```

对话中可输入 `/quit` 退出，`/h` 或 `/?` 查看帮助。

---

### 4.2 启动实例（后台）`xw start`

仅启动模型实例，不进入对话；可用于后台服务或配合日志查看。

```bash
xw start <MODEL> [选项]
```

| 参数 | 说明 |
| --- | --- |
| `--alias <名称>` | 实例别名 |
| `--engine <引擎>` | 推理引擎，如 vllm:docker、mindie:docker |
| `--device <列表>` | 设备列表 |
| `--tp <度数>` | 张量并行度 |
| `--max-concurrent <N>` | 最大并发请求数，0 表示不限制 |
| `-d, --detach` | 后台运行，不流式输出日志 |

**示例：**

```bash
xw start qwen2-7b
xw start qwen2-7b --engine mindie:docker -d
xw start qwen2-72b --device 0,1,2,3 --max-concurrent 4
```

---

### 4.3 查看实例 `xw ps`

列出所有模型实例（运行中与已停止）。

```bash
xw ps
```

默认即显示全部实例（`-a/--all` 默认为 true）。

---

### 4.4 停止并移除实例 `xw stop`

按实例别名停止并移除对应实例，释放资源。

```bash
xw stop <ALIAS> [-f|--force]
```

| 参数 | 说明 |
| --- | --- |
| `-f, --force` | 强制停止（即使正在处理请求） |

**示例：**

```bash
xw stop qwen2-7b
xw stop my-model --force
```

别名可通过 `xw ps` 查看。

---

### 4.5 查看实例日志 `xw logs`

查看指定实例的日志，用于排查启动失败或运行异常。

```bash
xw logs <ALIAS> [-f|--follow]
```

| 参数 | 说明 |
| --- | --- |
| `-f, --follow` | 持续流式输出日志（Ctrl+C 结束） |

**示例：**

```bash
xw logs qwen2-7b
xw logs qwen2-7b -f
```

---

## 五、设备与版本

### 5.1 设备 `xw device`

**列出设备：**

```bash
xw device list
```

**查看支持的芯片型号：**

```bash
xw device supported
```

可选：`--type <类型>` 按设备类型过滤。

---

### 5.2 版本 `xw version`

查看客户端与/或服务端版本。

```bash
xw version              # 客户端 + 服务端
xw version --client     # 仅客户端
xw version --server     # 仅服务端
```

---

## 六、数据目录与模型路径

### 6.1 目录结构

- **数据根目录**（`-data`）：默认 `~/.xw/data`，可设为 `~/.xw` 以使用 `~/.xw/models` 作为模型根。
- **模型根目录**：`{--data}/models`。
- **单个模型**：`{--data}/models/{模型ID}/{tag}`，默认 tag 为 `latest`。

示例（`--data ~/.xw`）：

- 模型根：`~/.xw/models`
- qwen2-7b：`~/.xw/models/qwen2-7b/latest`

### 6.2 使用已有权重目录

若你已有完整权重目录（如 `~/my_models/qwen2-7b/latest`），需要让 xw 使用该路径：

1. **通过数据目录挂载**（推荐）：将数据根设为包含 `models` 的父目录，并保证结构为 `models/qwen2-7b/latest`。

```bash
# 例如权重在 /home/user/.xw/models/qwen2-7b/latest
xw serve --data ~/.xw
```

1. **通过符号链接对齐结构**：若权重在其他路径，可建链接到 xw 期望的路径：

```bash
mkdir -p ~/.xw/models/qwen2-7b
ln -sf /path/to/your/Qwen2-7B ~/.xw/models/qwen2-7b/latest
xw serve --data ~/.xw
```

注意：路径中请使用 `~/.xw`（波浪号后为斜杠），不要写成 `~./xw`，否则 shell 会报错。

---

## 七、常用运维与排查

### 7.1 检查模型目录大小

```bash
du -sh ~/.xw/data/models/qwen2-7b/latest
du -sh ~/.xw/data/models/*/
```

### 7.2 查找 safetensors 权重文件

```bash
find ~/.xw/data/models/qwen2-7b -name "*.safetensors" -exec ls -lh {} \;
find -L ~/.xw/data/models/qwen2-7b -name "*.safetensors"
```

### 7.3 校验模型是否完整（必备文件）

Qwen2 等模型通常需要：`config.json`、`tokenizer_config.json`、词表文件（如 `qwen2.tiktoken` 或 `tokenizer.json`）、`.safetensors` 权重。

```bash
MODEL_DIR=~/.xw/data/models/qwen2-7b/latest
ls -la "$MODEL_DIR/config.json" "$MODEL_DIR/tokenizer_config.json"
ls "$MODEL_DIR"/qwen2.tiktoken "$MODEL_DIR"/tokenizer.json 2>/dev/null
ls "$MODEL_DIR"/*.safetensors 2>/dev/null
```

### 7.4 本机查找某模型（含其他用户 home）

```bash
find /home -maxdepth 5 -type d -path "*/.xw/data/models/qwen2-7b" 2>/dev/null
find /home -maxdepth 5 -type d -path "*/.xw/data/models/*qwen2*7b*" 2>/dev/null
```

### 7.5 重启服务并指定数据目录

```bash
pkill -f "xw serve" 2>/dev/null || true
xw serve --data ~/.xw
```

---

## 八、快速索引

| 目的 | 命令 |
| --- | --- |
| 启动服务（默认数据目录） | `xw serve` |
| 使用已有模型目录启动 | `xw serve --data ~/.xw` |
| 拉取模型 | `xw pull <MODEL>` |
| 查看已下载模型 | `xw ls` |
| 运行模型并对话 | `xw run <MODEL>` |
| 指定引擎运行 | `xw run <MODEL> --engine mindie:docker` |
| 查看运行实例 | `xw ps` |
| 停止实例 | `xw stop <ALIAS>` |
| 查看实例日志 | `xw logs <ALIAS>` |
| 查看模型详情 | `xw show <MODEL>` |
| 查看设备 | `xw device list` |
| 查看版本 | `xw version` |

---

*手册内容基于当前代码仓整理，若与 `xw --help` 或各子命令 `--help` 不一致，以实际帮助输出为准。*