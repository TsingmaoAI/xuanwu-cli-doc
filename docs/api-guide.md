# API 指南

玄武提供与 OpenAI API 完全兼容的 HTTP 端点，允许无缝迁移现有应用到国产硬件。

## 配置客户端

API 服务器默认监听 `http://localhost:11581`，所有路径以 `/v1` 为前缀。

**Python (OpenAI SDK)**

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11581/v1",
    api_key="not-needed"  # 必填但内容任意
)
```

## Chat Completions

`POST /v1/chat/completions`

**请求示例**

```bash
curl http://localhost:11581/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3-8B",
    "messages": [{"role": "user", "content": "你好！"}],
    "stream": false
  }'
```

**核心参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| `model` | string | 模型名称 (必需) |
| `messages` | array | 对话历史 (必需) |
| `stream` | boolean | 是否流式响应 |
| `temperature` | number | 输出随机性 |
| `max_tokens` | integer | 最大生成长度 |

## 流式响应

设置 `stream: true` 启用流式输出，返回 Server-Sent Events 格式。

**Python 示例**

```python
stream = client.chat.completions.create(
    model="Qwen/Qwen3-8B",
    messages=[{"role": "user", "content": "写一首关于月亮的诗。"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

流以 `data: [DONE]` 结束。

## 工具集成

任何支持配置 OpenAI API Base URL 的工具都可以与玄武集成。详见 [第三方工具集成](/integrations)。
