Qwen3-Next-80B-A3B 是 Qwen3-Next 系列的首个模型，采用创新的 Hybrid Transformer-Mamba 架构。总参数量 80B，每个 token 仅激活 3.9B 参数，实现了 10 倍的推理吞吐量提升。原生支持 262K 上下文，通过 YaRN 扩展可达 100 万 tokens。

### 核心特性

- **混合注意力**：Gated DeltaNet + Gated Attention，超长上下文高效建模
- **高稀疏 MoE**：极低激活率，大幅降低 FLOPs，保持模型容量
- **多 Token 预测 (MTP)**：加速预训练和推理
- **稳定性优化**：零中心 LayerNorm 等技术，训练更稳定

### 性能亮点

- 在下游任务上超越 Qwen3-32B，训练成本仅 10%
- 32K+ 上下文推理吞吐量提升 10 倍
- RULER 基准测试：100 万 tokens 下达到 91.8% 准确率
- 复杂推理任务超越 Gemini-2.5-Flash-Thinking
