# CLI 命令参考

玄武命令行工具 `xw` 的完整参考。

## xw serve

启动 API 服务器。

```bash
xw serve [flags]
```

**标志**
| 标志 | 默认值 | 说明 |
|------|--------|------|
| `--host` | `0.0.0.0` | 绑定的主机地址 |
| `--port` | `11581` | 监听端口 |

**示例**
```bash
xw serve &              # 默认端口启动
xw serve --port 8000 &  # 指定端口
```

## xw run

下载并运行模型，进入交互式聊天。

```bash
xw run <model_name>[:tag] [flags]
```

**标志**
| 标志 | 说明 |
|------|------|
| `--device` | 指定 GPU 设备 ID，逗号分隔 |

**示例**
```bash
xw run Qwen/Qwen3-8B
xw run Qwen/Qwen2-72B --device 0,1,2,3
```

## xw pull

仅下载模型，不运行。

```bash
xw pull <model_name>[:tag]
```

**示例**
```bash
xw pull deepseek-ai/DeepSeek-V3.2
```

## xw list / xw ls

显示本地已下载的模型。

```bash
xw list
```

**输出列**
- `REPOSITORY` - 模型名称
- `TAG` - 模型标签
- `SIZE` - 磁盘大小
- `ENGINE` - 推荐引擎
- `MODIFIED` - 最后修改时间

## xw ps

显示当前运行中的模型。

```bash
xw ps
```

**输出列**
- `MODEL` - 模型名称
- `STATUS` - 运行状态
- `VRAM` - 显存占用
- `TP` - 张量并行度 (GPU 数量)
- `ENGINE` - 使用的引擎
- `DEVICES` - GPU 设备 ID
- `UPTIME` - 运行时长

## xw stop

停止模型并释放显存。

```bash
xw stop <model_name>[:tag]
```

## xw show

显示模型详细信息。

```bash
xw show <model_name>[:tag] [flag]
```

**标志**
| 标志 | 说明 |
|------|------|
| `--template` | 显示对话模板 |
| `--system` | 显示默认系统提示词 |
| `--parameters` | 显示生成参数 |
| `--modelfile` | 显示完整 Modelfile |

## xw doctor

运行环境诊断。

```bash
xw doctor
```

检查驱动、依赖项和 GPU 状态。
