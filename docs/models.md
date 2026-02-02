# 模型管理

## 命名规范

玄武CLI采用标准命名格式：

```
{model}[:tag][/engine]
```

- `model` - 模型名，采用全小写格式 (如 `qwen3-8b`)
- `tag` - 版本标签，默认 `latest`
- `engine` - 推理引擎，不同的推理引擎可能会采用不同的存储格式，所以通过engine字段区分不同引擎需要的格式，每个模型有自己的默认引擎，不指定时将由玄武CLI自动决定。

> 您可以通过`xw ls -a`获得所有可以下载的模型。

> 当不同引擎所需权重相同时，权重将会被复用，而不是重新下载。

**示例**
- `qwen3-8b`
- `minimax-m2.1:i8`
- `glm-4.5:i4/mindie`

## 存储位置

<!--确认模型存储具体位置以及HOME目录如何指定-->
模型存储在 `~/.xw/data/models`，可通过环境变量修改：

```bash
export XUANWU_HOME="/data/xuanwu"
```

## 常用命令

```bash
# 列出本地模型
xw ls

# 列出所有支持的模型
xw ls -a

# 查看模型详情
xw show qwen3-8b

# 查看对话模板
xw show qwen3-8b --template

# 查看运行状态
xw ps

# 下载模型
xw pull qwen3-8b

# 删除模型
xw rm qwen3-8b
```

## 支持的模型

- Qwen 系列 (通义千问)
- DeepSeek 系列
- GLM 系列 (智谱)
- Minimax 系列
- Kimi 系列
- 更多模型持续扩展中

详细内容见[模型仓库](/model-library)。
