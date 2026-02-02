# FAQ

## 安装与环境

### 如何验证玄武CLI安装是否成功？

```bash
xw --version
```

它会输出xw当前安装的版本。

### 支持哪些操作系统？

目前xw只支持Linux系统，具体操作系统要求见[入门-硬件支持](/hardware.md)

### 需要安装 CANN 吗？

不需要。玄武CLI直接使用国产硬件的原生驱动，CANN 由玄武CLI 自己维护。

## 模型

### 可以使用 Ollama 的模型吗？

不能直接使用。玄武CLI和 Ollama 使用不同的模型格式。如需特定模型支持，请提交 Issue。

### 如何加速首次加载？

提前下载模型：

```bash
xw pull qwen3-8b
```

### 可以在 CPU 上运行吗？

当前版本不支持 CPU 推理。玄武CLI专为国产加速卡设计。

### 如何查看支持哪些模型？

可通过以下指令查看本地模型：

```bash
xw list           # 本地模型
xw show <model>   # 模型详情
```

所有支持的模型可以看[模型仓库](/model-library.md)。

## 多 GPU

### 如何处理超大模型？

玄武CLI自动使用张量并行：

```bash
xw run minimax-m2.1         # 自动选择并行策略
xw run minimax-m2.1 --tp 4  # 显式指定
```

### 如何选择 GPU 设备？

```bash
xw run <model> --device 0,1
```


## API

### API 与 OpenAI 有什么区别？

完全兼容 OpenAI API，但：

- 不需要 API Key (设置任意值即可)
- 本地运行，无网络延迟
- 支持国产硬件

### 可以同时运行多个模型吗？

可以。每个请求指定不同 `model` 参数，玄武CLI自动管理模型加载和切换。

## 性能

### 模型启动时间长

根据不同的模型和引擎，启动时间有差异，一般在 10 分钟以内。

### 模型运行很慢

检查使用的引擎：

```bash
xw ps
```

检查该模型服务对应的logs:

```bash
xw logs <model>
```

不同引擎在不同硬件组合下表现有差异，可尝试手工更换引擎。

**排查步骤：**

1. 确认驱动正常：`npu-smi info` (昇腾)
2. 检查 GPU 是否被其他进程占用


## 功能

### 支持量化模型吗？

支持 FP16/BF16/INT8/W8A8/W4A8 量化格式。各模型支持的量化种类不一样，详见[模型列表](/model-library.md)。

### 支持多模态吗？

支持 LLM、VLM 等模型推理，文生图/文生视频正在开发中。


## 社区与支持

### 如何报告 Bug？

GitHub Issues: [github.com/TsingmaoAI/xw-cli](https://github.com/TsingmaoAI/xw-cli)

请包含：
- 玄武CLI版本：`xw version`
- 系统版本与驱动版本：`uname -r`, `npu-smi info`
- 复现步骤

<!-- ### 如何贡献？ -->

<!-- 查看 [CONTRIBUTING.md](https://github.com/xuanwu-ai/xuanwu/blob/main/CONTRIBUTING.md) -->

## 了解更多？

- 关注清昴智能公众号：微信搜索「清昴智能」
- 加入讨论群：
<figure class="half" style="display: flex">
<img src="/public/wechat-1.jpeg" width="33%"/><img src="/public/wechat-2.jpeg" width="33%"/><img src="/public/wechat-3.jpeg" width="33%"/>
</figure>

- 联系团队：mlguider@tsingmao.com
