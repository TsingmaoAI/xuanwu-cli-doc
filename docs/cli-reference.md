# XW CLI 命令参考手册

# XW CLI 命令参考手册

> XW - 国产芯片AI推理平台命令行工具完整参考
> 

---

## 目录

1. [服务管理](#服务管理)
2. [模型管理](#模型管理)
3. [实例管理](#实例管理)
4. [设备管理](#设备管理)
5. [交互命令](#交互命令)
6. [环境变量](#环境变量)
7. [快速参考](#快速参考)

---

## 服务管理

### xw serve

启动 XW 服务器

```
xw serve [flags]

```

**参数：**

- `-host string` - 监听地址（默认："localhost"）
- `-port int` - 监听端口（默认：11581）
- `v, --verbose` - 详细日志输出

**示例：**

```
xw serve                          # 默认配置启动
xw serve --port 11719             # 指定端口
xw serve --host 0.0.0.0           # 允许远程访问
xw serve -v                       # 开启详细日志

```

**使用 systemd 管理：**

```
sudo systemctl start xw-server    # 启动服务
sudo systemctl stop xw-server     # 停止服务
sudo systemctl enable xw-server   # 开机自启
sudo systemctl status xw-server   # 查看状态

```

---

### xw version

显示版本信息

```
xw version

```

---

## 模型管理

### xw ls

列出模型

```
xw ls

```

**参数：**

- `a` - 列出所有可用模型

**示例：**

```
xw ls a                           # 列出已下载的模型

```

---

### xw pull

下载模型

```
xw pull MODEL

```

**参数：**

- `MODEL` - 模型ID（必需）

**示例：**

```
xw pull qwen2-0.5b                # 下载 Qwen2 0.5B
xw pull qwen2.5-7b-instruct       # 下载 Qwen2.5 7B Instruct
xw pull qwen2-7b                  # 下载 Qwen2 7B
xw pull qwen2-72b                 # 下载 Qwen2 72B

```

**支持的模型：**

- `qwen2-0.5b` - Qwen2 0.5B 基础模型
- `qwen2-7b` - Qwen2 7B 基础模型
- `qwen2.5-7b-instruct` - Qwen2.5 7B 指令微调模型
- `qwen2-72b` - Qwen2 72B 大模型

---

### xw show

查看模型详细信息

```
xw show MODEL

```

**参数：**

- `MODEL` - 模型ID（必需）

**示例：**

```
xw show qwen2-0.5b                # 查看模型详情

```

**输出格式：** Ollama 兼容的模型信息格式

---

## 实例管理

### xw run

运行模型（交互模式）

```
xw run MODEL [flags]

```

**参数：**

- `MODEL` - 模型ID（必需）
- `-alias string` - 实例别名（默认：模型ID）
- `-backend string` - 推理引擎（vllm, mindie）
- `-mode string` - 部署模式（docker, native）
- `-engine string` - 引擎规格，格式 "backend:mode"（如 vllm:docker）

**示例：**

```
# 基础用法
xw run qwen2-0.5b                              # 使用默认配置运行

# 指定别名
xw run qwen2.5-7b-instruct --alias my-chat     # 使用自定义别名

# 指定推理引擎
xw run qwen2-7b --backend mindie --mode docker # 使用 MindIE Docker 引擎
xw run qwen2-7b --backend vllm --mode docker   # 使用 vLLM Docker 引擎

# 使用引擎规格
xw run qwen2-7b --engine vllm:docker           # 简化指定方式

```

**交互模式命令：**

- 输入文本：直接输入提示词
- `/help` - 显示帮助
- `/clear` - 清除对话上下文
- `/exit` 或 `/quit` - 退出交互模式
- `Ctrl+C` - 退出交互模式

---

### xw start

启动模型（后台模式）

```
xw start MODEL [flags]

```

**参数：**

- 参数与 `xw run` 相同

**示例：**

```
xw start qwen2-0.5b                            # 后台启动
xw start qwen2-7b --alias backend-model        # 指定别名后台启动

```

**区别：**

- `xw run` - 启动后进入交互模式
- `xw start` - 后台启动，不进入交互模式

---

### xw ps

查看运行中的实例

```
xw ps

```

**示例：**

```
xw ps                                          # 列出所有运行中的实例

```

**输出信息：**

- 实例别名
- 模型ID
- 使用的推理引擎
- 端口号
- 状态
- 占用的设备

---

### xw stop

停止实例

```
xw stop ALIAS

```

**参数：**

- `ALIAS` - 实例别名（必需）

**示例：**

```
xw stop qwen2-0.5b                            # 停止实例
xw stop my-chat                               # 停止自定义别名的实例

```

---

### xw rm / xw rmi

删除实例

```
xw rm ALIAS
xw rmi ALIAS

```

**参数：**

- `ALIAS` - 实例别名（必需）

**示例：**

```
xw rm qwen2-0.5b                              # 删除实例
xw rmi my-chat                                # 删除实例（别名）

```

**注意：** 删除前需要先停止实例

---

### xw logs

查看实例日志

```
xw logs ALIAS [flags]

```

**参数：**

- `ALIAS` - 实例别名（必需）
- `-follow, -f` - 持续输出日志（类似 tail -f）

**示例：**

```
xw logs qwen2-0.5b                            # 查看日志
xw logs qwen2-0.5b -f                         # 持续跟踪日志
xw logs my-chat --follow                      # 持续跟踪日志（长选项）

```

---

## 设备管理

### xw device list

列出AI芯片设备

```
xw device list [flags]

```

**参数：**

- `-all` - 显示所有PCI设备，不仅是AI芯片
- `-type string` - 按类型过滤（ascend, muxi）

**示例：**

```
xw device list                                # 列出AI芯片
xw device list --all                          # 列出所有PCI设备
xw device list --type ascend                  # 仅显示昇腾设备
                  # 仅显示昆仑设备

```

**支持的设备类型：**

- `ascend` - 华为昇腾 NPU（910B, 800I-A2, 300I-A2等）
- `~~longxin` - 龙芯芯片~~

---

### xw device models

查看支持的芯片型号

```
xw device models

```

**示例：**

```
xw device models                              # 列出所有支持的芯片型号

```

---

## 交互命令

在 `xw run` 交互模式中可用的命令：

### /help

显示交互模式帮助信息

```
/help

```

---

### /clear

清除对话上下文

```
/clear

```

清除后将开始新的对话，之前的上下文不再保留。

---

### /exit, /quit

退出交互模式

```
/exit
/quit

```

或使用 `Ctrl+C` 快捷键退出。

---

## 环境变量

### XW_SERVER

CLI连接的服务器地址

**默认值：** `http://localhost:11581`

**设置方法：**

```
# 临时设置（当前会话）
export XW_SERVER=http://localhost:11719

# 永久设置（添加到 .bashrc）
echo 'export XW_SERVER=http://localhost:11719' >> ~/.bashrc
source ~/.bashrc

# 永久设置（添加到 .zshrc）
echo 'export XW_SERVER=http://localhost:11719' >> ~/.zshrc
source ~/.zshrc

```

**使用场景：**

- 连接到非默认端口的服务器
- 连接到远程服务器

---

### ~~XW_HOME~~

XW数据目录

**默认值：** `/opt/xw`

**设置方法：**

```
export XW_HOME=/custom/path/to/xw

```

**目录结构：**

```
$XW_HOME/
├── models/          # 下载的模型文件
├── logs/            # XW日志
└── config/          # 配置文件

```

---

### ~~XW_LOG_LEVEL~~

日志级别

**默认值：** `info`

**可选值：** `debug`, `info`, `warn`, `error`

**设置方法：**

```
export XW_LOG_LEVEL=debug      # 调试模式
export XW_LOG_LEVEL=error      # 仅显示错误

```

---

## 快速参考

### 完整工作流程

```
# 1. 启动服务
xw serve --port 11719

# 2. 配置客户端（如果使用非默认端口）
export XW_SERVER=http://localhost:11719

# 3. 查看可用模型
xw ls -a

# 4. 下载模型
xw pull qwen2.5-7b-instruct

# 5. 运行模型（交互模式）
xw run qwen2.5-7b-instruct

# 6. 或后台启动
xw start qwen2.5-7b-instruct --alias my-model

# 7. 查看运行实例
xw ps

# 8. 查看日志
xw logs my-model -f

# 9. 停止实例
xw stop my-model

# 10. 删除实例
xw rm my-model

```

---

### 常用命令速查

| 功能 | 命令 |
| --- | --- |
| 启动服务 | `xw serve` |
| 列出模型 | `xw ls -a` |
| 下载模型 | `xw pull MODEL` |
| 运行模型 | `xw run MODEL` |
| 后台运行 | `xw start MODEL` |
| 查看实例 | `xw ps` |
| 停止实例 | `xw stop ALIAS` |
| 查看日志 | `xw logs ALIAS -f` |
| 查看设备 | `xw device list` |
| 查看版本 | `xw version` |

---

### 故障排查命令

```
# 检查服务状态
sudo systemctl status xw-server

# 查看服务日志
sudo journalctl -u xw-server -f

# 检查设备
xw device list
npu-smi info                       # 华为昇腾设备

# 查看运行实例
xw ps

# 查看实例日志
xw logs ALIAS -f

# 检查环境变量
echo $XW_SERVER
echo $XW_HOME
echo $XW_LOG_LEVEL

# 检查磁盘空间
df -h /opt/xw

# 检查Docker
docker info
docker ps -a

```

---

### 调试模式

```
# 详细日志启动服务
xw serve -v

# 设置调试级别日志
export XW_LOG_LEVEL=debug
xw serve

# 查看详细错误信息
xw logs ALIAS -f

```

---

## 附录

### 推理引擎选择

| 引擎 | 模式 | 适用场景 |
| --- | --- | --- |
| vLLM Docker | `--backend vllm --mode docker` | 高吞吐推理（推荐） |
| MindIE Docker | `--backend mindie --mode docker` | 华为昇腾优化 |
| Native 模式 | `--mode native` | 本地安装（开发中） |

---

### 模型参数配置

在API调用或交互模式中可配置的参数：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `temperature` | 0.7 | 生成随机性（0-2） |
| `top_p` | 0.8 | 核采样概率 |
| `max_tokens` | 2048 | 最大生成长度 |
| `max_new_tokens` | - | 最大新生成token数 |

---

**文档版本：** 1.0.0

**更新日期：** 2026-01-29

**项目地址：** github.com/tsingmao/xw