# 模型管理

## xw ls

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

## xw pull

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

## xw show

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

> 更多 CLI 命令请参考 [CLI 命令参考](/cli-reference)
