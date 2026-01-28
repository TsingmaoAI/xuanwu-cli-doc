# 模型管理

## 命名规范

玄武采用标准命名格式：

```
{namespace}/{model_name}[:tag]
```

- `namespace` - 发布者 (如 `Qwen`, `deepseek-ai`)
- `model_name` - 模型名 (如 `Qwen3-8B`)
- `tag` - 版本标签，默认 `latest`

**示例**
- `Qwen/Qwen3-8B`
- `deepseek-ai/DeepSeek-V3.2`
- `THUDM/glm-4-9b:fp16`

## 存储位置

模型存储在 `~/.xuanwu/models`，可通过环境变量修改：

```bash
export XUANWU_HOME="/data/xuanwu"
```

## 白名单机制

玄武采用模型白名单确保最佳性能：

| Tier | 说明 | 示例 |
|------|------|------|
| **Tier 1** | 深度优化，最佳性能 | Qwen3-*, DeepSeek-V3* |
| **Tier 2** | 兼容性支持，稳定运行 | 其他验证模型 |
| **Tier 3** | 不支持 | 未验证模型将被拒绝 |

## 常用命令

```bash
# 列出本地模型
xw list

# 查看模型详情
xw show Qwen/Qwen3-8B

# 查看对话模板
xw show Qwen/Qwen3-8B --template

# 查看运行状态
xw ps

# 下载模型
xw pull Qwen/Qwen3-8B

# 删除模型
xw rm Qwen/Qwen3-8B
```

## 支持的模型

- Qwen 系列 (通义千问)
- DeepSeek 系列
- GLM 系列 (智谱)
- 更多模型持续扩展中
