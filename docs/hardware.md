# 硬件支持

玄武CLI专为国产AI芯片设计，提供统一的跨硬件推理层抽象。

## 支持的平台

<!-- TODO:列出所有的小版本-->
| 硬件平台 | 支持型号| 支持操作系统 | 驱动要求 | 状态 |
|----------|----------|-------|----------|------|
| **华为昇腾 Ascend** | `910B` | `OpenEuler`,`Ubuntu` | Ascend HDK > 25.0.0 | 支持 |
| **华为昇腾 Ascend** | `310P` | `OpenEuler`,`Ubuntu` | Ascend HDK > 25.0.0 | 支持 |
<!-- | **沐曦 MetaX** | `C550` | | 支持 | -->

## 驱动安装与验证

玄武CLI依赖硬件厂商的官方驱动，请参考对应官网完成驱动的安装。通常服务器出厂就已经预装了驱动，您可通过以下命令进行验证：

**验证驱动**

```bash
# 华为昇腾
npu-smi info

# 沐曦
mx-smi
```

看到设备列表即表示驱动正常。

## 多引擎架构

玄武CLI自动为模型和硬件组合选择最佳推理后端，以下是玄武CLI目前支持的推理引擎列表：

<!-- TODO:列出所有的小版本-->
| 引擎 | 支持硬件 | 说明 |
|------|------|------|
| **MindIE** | `Ascend 910B`<br> `Acend 310P` | 华为官方维护的高性能推理引擎 [更多介绍](https://www.hiascend.com/developer/software/mindie) |
| **vLLM-Ascend** | `Ascend 910B`<br> `Ascend 310P` | 来自开源社区的优秀推理引擎，海外vLLM生态社区与华为社区共建 [更多介绍](https://docs.vllm.ai/projects/vllm-ascend-cn/zh-cn/latest/) |
| **MLGuider Community** | `Ascend 310P` | 清昴智能自研引擎社区版 [更多介绍](www.tsingmao.com) |
| **MLGuider Enterprise** | `custom` | 清昴智能自研引擎企业版（需获取单独授权），提供更多芯片、模型的支持与更广的性能支持，更多信息请咨询[清昴智能](mailto:mlguider@tsingmao.com) [更多介绍](www.tsingmao.com) |
<!-- | **vLLM-MetaX** | `MetaX C500` | 来自开源社区的优秀推理引擎，海外vLLM生态社区与沐曦社区共建 [更多介绍](https://vllm-metax.readthedocs.io/en/latest/index.html) | -->

用户无需手动选择引擎，玄武CLI将自动处理引擎的选择。可通过 `xw ls` 或 `xw ps` 查看使用的引擎。

## 多 GPU 支持

玄武CLI原生支持多 GPU 推理和张量并行。

**设备选择**

玄武CLI server启动后，将建立全局资源池，模型运行时的硬件资源将自动从资源池中选择与调度，用户无需关注芯片底层的实现细节。
```bash
# on 910b
xw run qwen2-32b # 将自动寻找两张设备并运行
```
用户仍然可以手动设置模型运行的设备号，来实现对硬件资源的精细化控制：
```bash
# on 910b
xw run qwen2-32b --device 0,1 # 将采用用户指定的设备运行模型
```

<!-- 玄武CLI实现了拓扑感知的硬件资源调度逻辑，将会按照硬件拓扑逻辑连接来进行模型的部署，具体逻辑详见[进阶-架构设计](/architecture)。 -->

**张量并行**

玄武CLI已提前完成大部分模型与机型的适配，会根据显卡型号、显存大小将大模型自动切分到多张卡：

```bash
# on 910b
xw run qwen2-32b  # 无需添加任何参数，即可选用默认推荐的并行方式，在此平台上为tp=2
```

用户仍然可以手动设置模型运行的张量并行数，来实现对硬件资源的精细化控制：

```bash
# 采用tp=1
xw run qwen2-32b --tp 1
# 采用tp=4
xw run qwen2-32b --tp 4
```
