# 第三方工具集成

任何支持配置 OpenAI API Base URL 的工具都可以与玄武集成。

## LangChain

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="http://localhost:11581/v1",
    api_key="not-needed",
    model="Qwen/Qwen3-8B"
)

response = llm.invoke("你好")
print(response.content)
```

## LlamaIndex

```python
from llama_index.llms.openai_like import OpenAILike

llm = OpenAILike(
    api_base="http://localhost:11581/v1",
    api_key="not-needed",
    model="Qwen/Qwen3-8B"
)

response = llm.complete("你好")
print(response.text)
```

## VS Code (Continue)

编辑 `~/.continue/config.json`：

```json
{
  "models": [
    {
      "title": "Xuanwu Local",
      "provider": "openai",
      "model": "Qwen/Qwen3-8B",
      "apiBase": "http://localhost:11581/v1",
      "apiKey": "not-needed"
    }
  ]
}
```

## LobeChat

在设置中添加自定义模型：

| 配置项 | 值 |
|--------|-----|
| API 端点 | `http://localhost:11581/v1` |
| API Key | 任意值 |
| 模型名 | `Qwen/Qwen3-8B` |

## 通用配置

对于其他支持 OpenAI API 的工具，通常只需配置：

```
Base URL: http://localhost:11581/v1
API Key: not-needed (或任意值)
Model: Qwen/Qwen3-8B (或其他本地模型)
```

玄武完全兼容 OpenAI API 规范，无需额外适配。
