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
</style>

<div class="model-hero">
  <h1 class="model-title">Qwen2.5-72B</h1>
  <p class="model-subtitle">Qwen2.5 旗舰 Dense 模型，长文本能力强，稳定可靠</p>
  <div class="model-badges">
    <span class="badge badge-arch">Dense</span>
    <span class="badge badge-params">72B</span>
    <span class="badge badge-ctx">128K context</span>
  </div>
</div>

::: code-group

```bash [CLI]
xw run qwen2.5-72b
```

```bash [cURL]
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5-72b",
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
  <a href="https://modelscope.cn/models/Qwen/Qwen2.5-72B/files" style="color: var(--vp-c-text-3);">下载源: ModelScope</a>
</div>
