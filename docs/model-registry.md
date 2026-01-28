# 模型仓库

玄武的模型仓库系统记录了每个模型的兼容性和性能信息。

## 模型仓库功能

模型仓库维护每个模型的：

- 支持的硬件平台
- 默认推理引擎 (基于实测性能)
- 所有可用的推理框架
- 性能基准数据

## 推理引擎

每个模型可能支持多个推理引擎：

| 引擎 | 类型 | 硬件支持 | 特点 |
|------|------|----------|------|
| MLGuider | 深度优化 | 昇腾 | 最高性能，闭源 |
| MindIE | 华为原生 | 昇腾 | 官方支持 |
| vLLM | 开源社区 | 昇腾、沐曦 | 开源，功能丰富 |

## 自动引擎选择

默认情况下，玄武根据硬件和模型自动选择最优引擎：

```bash
xw run Qwen/Qwen3-8B  # 自动选择
```

玄武会：

1. 检测当前硬件平台
2. 查询模型仓库
3. 使用该硬件上的默认引擎

## 手动指定引擎

可以通过 `--engine` 标志手动指定：

```bash
xw run Qwen/Qwen3-8B --engine vllm
xw run Qwen/Qwen3-8B --engine mindie  # 仅昇腾
```

**适用场景**

- 性能测试和对比
- 调试特定引擎问题
- 利用引擎特有功能

> 只能指定模型支持的引擎，不支持的引擎会报错。

## 查看引擎信息

```bash
# 查看本地模型及其引擎
xw list

# 输出示例
REPOSITORY              TAG     SIZE    ENGINE      MODIFIED
Qwen/Qwen3-8B           latest  8.5GB   mlguider    2 days ago
deepseek-ai/DeepSeek-V  latest  685GB   vllm        1 week ago
```

```bash
# 查看运行中模型的引擎
xw ps

# 输出示例
MODEL              STATUS   VRAM    TP  ENGINE     DEVICES  UPTIME
Qwen/Qwen3-8B     Running  15GB    1   mlguider   0        2h15m
Qwen/Qwen2-72B    Running  140GB   4   vllm       0,1,2,3  30m
```

## 常见问题

**Q: 为什么有些模型不支持某个引擎？**

A: 不同引擎对模型架构的支持程度不同。模型仓库只展示已验证的组合。

**Q: 如何知道哪个引擎最快？**

A: `xw list` 的 `ENGINE` 列显示的默认引擎是基于实测数据的最优选择。
