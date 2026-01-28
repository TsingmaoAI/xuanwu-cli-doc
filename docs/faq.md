# FAQ

## 安装与环境

### 如何验证安装是否成功？

```bash
xw doctor
```

它会检查驱动、依赖、GPU 等，并报告问题。

### 支持哪些操作系统？

当前支持 Linux (推荐 Ubuntu 20.04+)。

### 需要安装 CANN 吗？

不需要。玄武直接使用国产硬件的原生驱动，CANN 由玄武自动安装。

---

## 模型

### 可以使用 Ollama 的模型吗？

不能直接使用。玄武和 Ollama 使用不同的模型格式。如需特定模型支持，请提交 Issue。

### 如何加速首次加载？

提前下载模型：

```bash
xw pull Qwen/Qwen3-8B
```

### 可以在 CPU 上运行吗？

当前版本不支持 CPU 推理。玄武专为国产 GPU 加速设计。

### 如何查看支持哪些模型？

```bash
xw list           # 本地模型
xw show <model>   # 模型详情
```

---

## 多 GPU

### 如何处理超大模型？

玄武自动使用张量并行：

```bash
xw run Qwen/Qwen2-72B                   # 自动选择 GPU
xw run Qwen/Qwen2-72B --device 0,1,2,3  # 显式指定
```

### 如何选择 GPU 设备？

```bash
xw run <model> --device 0,1

# 或设置环境变量
export XUANWU_DEVICE="0,1"
```

### 张量并行的通信开销大吗？

玄武使用高效通信库 (如昇腾的 HCCL)，开销很低。

---

## API

### API 与 OpenAI 有什么区别？

完全兼容 OpenAI API，但：

- 不需要 API Key (设置任意值即可)
- 本地运行，无网络延迟
- 支持国产硬件

### 可以同时运行多个模型吗？

可以。每个请求指定不同 `model` 参数，玄武自动管理模型加载和切换。

---

## 性能

### 模型启动时间长

根据不同的模型和引擎，启动时间有差异，一般在 10 分钟以内。

### 模型运行很慢

检查使用的引擎：

```bash
xw ps
```

不同引擎在不同硬件组合下表现有差异，可尝试手工更换引擎。

**排查步骤：**

1. 确认驱动正常：`npu-smi info` (昇腾) 或 `musa-smi` (沐曦)
2. 检查 GPU 是否被其他进程占用

---

## 功能

### 支持量化模型吗？

支持 FP16/BF16/INT8/W8A8/W4A8 量化格式。

### 支持多模态吗？

支持 LLM、VLM 等模型推理，文生图/文生视频正在开发中。

---

## 与 Ollama 对比

| 特性 | 玄武 | Ollama |
|------|------|--------|
| 硬件支持 | 国产 GPU | 通用 GPU |
| API 兼容性 | OpenAI | Ollama 专有 |
| 多引擎 | 支持 | 不支持 |
| 张量并行 | 自动 | 不支持 |
| 多卡管理 | 算力显存并行 | 算力串行 |

---

## 社区与支持

### 如何报告 Bug？

GitHub Issues: [github.com/xuanwu-ai/xuanwu](https://github.com/xuanwu-ai/xuanwu)

请包含：
- 玄武版本：`xw version`
- 系统信息：`xw doctor` 输出
- 复现步骤

### 如何贡献？

查看 [CONTRIBUTING.md](https://github.com/xuanwu-ai/xuanwu/blob/main/CONTRIBUTING.md)

---

## 更多问题？

- 查看完整文档：[docs.xuanwu.ai](https://docs.xuanwu.ai/)
- 加入讨论群：微信搜索「玄武 AI」
- 联系团队：support@xuanwu.ai
