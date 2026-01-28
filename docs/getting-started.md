# 快速开始

本指南将引导您完成玄武的安装，并运行您的第一个大语言模型。

## 系统要求

- **操作系统**: Linux (推荐 Ubuntu 20.04+)
- **硬件**: 至少一张受支持的国产 GPU ([查看硬件支持](/hardware))
- **驱动**: 已安装相应硬件的官方驱动程序

开始前，请确保可以使用 `npu-smi` (昇腾) 或 `musa-smi` (沐曦) 等命令查询到您的 GPU 设备。

## 安装

运行一键安装脚本：

```bash
/bin/bash -c "$(curl -fsSL https://xuanwu.ai/install.sh)"
```

脚本会自动检测系统环境，下载并安装玄武到 `/usr/local/bin/xw`。

验证安装：

```bash
xw doctor
```

## 运行模型

使用 `xw run` 下载并运行模型：

```bash
xw run Qwen/Qwen3-8B
```

首次运行需要下载模型，完成后进入交互式对话：

```
>>> 你好，介绍一下自己。

你好！我是一个由通义千问团队训练的大语言模型，很高兴能为您服务。

>>>
```

输入 `/bye` 退出会话。

## 启动 API 服务

启动与 OpenAI 兼容的 API 服务器：

```bash
xw serve &
```

服务默认运行在 `http://localhost:11581`。

测试 API：

```bash
curl http://localhost:11581/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3-8B",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

## 下一步

- [CLI 命令参考](/cli-reference) - 了解所有命令
- [API 指南](/api-guide) - 集成到您的应用
- [硬件支持](/hardware) - 查看支持的硬件列表
