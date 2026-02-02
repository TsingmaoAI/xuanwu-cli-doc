---
prev:
  link: /models/qwen3-235b
  text: Qwen3-235B
next:
  link: /models/qwen3-32b
  text: Qwen3-32B
---

<style>
.model-hero {
  padding: 24px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 24px;
}
.model-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
}
.model-subtitle {
  color: var(--vp-c-text-2);
  font-size: 16px;
  margin: 0 0 16px 0;
}
.model-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
}
.badge-arch { background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); }
.badge-params { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
.badge-ctx { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.badge-new { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; }
</style>

<div class="model-hero">
  <h1 class="model-title">Qwen3-Next-80B</h1>
  <p class="model-subtitle">下一代 Qwen 模型，Hybrid Transformer-Mamba 架构，极致推理效率</p>
  <div class="model-badges">
    <span class="badge badge-new">NEW</span>
    <span class="badge badge-arch">Hybrid MoE</span>
    <span class="badge badge-params">80B / 3.9B active</span>
    <span class="badge badge-ctx">1M context</span>
  </div>
</div>

::: code-group

```bash [CLI]
xw run qwen3-next-80b
```

```bash [cURL]
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-next-80b",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

:::

## Models

<!--@include: ./variants.md-->

---

## 简介

<!--@include: ./readme.md-->

<div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--vp-c-divider); font-size: 13px; color: var(--vp-c-text-3);">
  <a href="https://modelscope.cn/models/Qwen/Qwen3-Next-80B/files" style="color: var(--vp-c-text-3);">下载源: ModelScope</a>
</div>
