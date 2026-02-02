# 快速开始

本指南将引导您完成玄武CLI的安装，并通过玄武CLI运行您的第一个大语言模型。

## 系统要求

- **操作系统**: Linux (推荐 Ubuntu 20.04+)
- **硬件**: 至少一张受支持的国产 GPU ([查看硬件支持](/hardware))
- **驱动**: 已安装相应硬件的官方驱动程序

开始前，请确保可以使用 `npu-smi` (昇腾) 或 `mx-smi` (沐曦) 等命令查询到您的 GPU 设备。

## 安装

运行一键安装脚本：

```bash
curl -o- http://xw.tsingmao.com/install.sh | bash
```

脚本会自动检测系统环境和机器架构并安装。

验证安装：

```bash
xw --version
```

## 启动玄武CLI服务端

玄武CLI采用前后端分离架构设计，在运行玄武CLI的客户端指令之前，请先启动玄武CLI的服务端服务。您可通过如下指令启动玄武CLI的服务端：
```bash
xw serve
```
默认服务端运行在`http://localhost:11581`。

> 想要了解更多架构信息，可以访问[进阶-架构设计](/architecture)。

## 运行模型

使用 `xw run` 下载并运行模型：

```bash
xw run qwen3-8b
```

首次运行需要下载模型与推理引擎，完成后进入交互式对话：

```
>>> 你好，介绍一下自己。

你好！我是一个由通义千问团队训练的大语言模型，很高兴能为您服务。

>>>
```

输入 `/bye` 退出会话。

## 通过OpenAI兼容的API访问模型

模型运行后，即可在服务端通过OpenAI兼容的格式进行访问。对应的endpoint为：
```url
http://localhost:11581/v1/chat/completions
```

可通过以下方式测试 API：

```bash
curl http://localhost:11581/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-8b",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

## 下一步

- [CLI 命令参考](/cli-reference) - 了解所有命令
- [API 指南](/api-guide) - 集成到您的应用
- [硬件支持](/hardware) - 查看支持的硬件列表
