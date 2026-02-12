# 模型库

浏览玄武支持的所有模型。

<style>
.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 14px;
  margin: 24px 0;
}

.model-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 18px 20px;
  background: var(--vp-c-bg);
  transition: all 0.2s ease;
  display: block;
  text-decoration: none;
  color: inherit;
}

.model-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.08);
}

a.model-card,
a.model-card:hover,
a.model-card:focus,
a.model-card:active,
a.model-card:visited {
  text-decoration: none !important;
}

a.model-card * {
  text-decoration: none !important;
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.model-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.model-org {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 4px;
}

.model-badge {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.badge-hot {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.badge-new {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
}

.badge-vl {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.model-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 12px 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.model-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-label {
  color: var(--vp-c-text-3);
}

.model-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
}

.tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.tag-quant {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
}

.tag-engine {
  background: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.tag-default {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
}

.model-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 10px 0 0 0;
  line-height: 1.6;
}

.filter-bar {
  display: flex;
  gap: 8px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--vp-c-text-2);
}

.filter-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.filter-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.dark .tag-engine {
  background: rgba(14, 165, 233, 0.15);
}

.model-grid[data-category] {
  display: grid;
}

.model-grid.hidden {
  display: none;
}

.model-section.hidden {
  display: none;
}

/* 右侧导航项隐藏 */
.VPDocAside .outline-item.filter-hidden,
.VPDocAside li.filter-hidden,
.VPDocAside .outline-link.filter-hidden {
  display: none !important;
  visibility: hidden !important;
}
</style>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 标题和筛选的映射关系
  const headingFilterMap = {
    'Qwen 通义千问系列': ['qwen'],
    'DeepSeek 系列': ['deepseek'],
    'Qwen 多模态系列': ['qwen', 'multimodal'],
    'GLM 智谱系列': ['glm'],
    'Kimi 月之暗面系列': ['kimi'],
    '量化格式说明': [], // 始终显示
    '推理引擎说明': []  // 始终显示
  }

  // 更新右侧导航
  function updateOutline(filter) {
    // 等待一下确保 DOM 已更新
    requestAnimationFrame(() => {
      // 查找右侧导航 - 尝试多种选择器
      const aside = document.querySelector('.VPDocAside') || 
                    document.querySelector('aside') ||
                    document.querySelector('[class*="Aside"]')
      
      if (!aside) {
        setTimeout(() => updateOutline(filter), 300)
        return
      }
      
      // 查找所有可能的导航项 - 使用更宽泛的选择器
      const allNavItems = aside.querySelectorAll('li, [class*="outline"], [class*="nav"], a[href*="#"]')
      
      if (allNavItems.length === 0) {
        setTimeout(() => updateOutline(filter), 300)
        return
      }
      
      // 遍历所有导航项
      allNavItems.forEach(navItem => {
        // 查找导航项内的文本（可能是链接或直接文本）
        const link = navItem.querySelector('a') || navItem
        const linkText = (link.textContent || '').trim()
        const href = link.getAttribute('href') || ''
        
        // 跳过空项
        if (!linkText) return
        
        // 遍历标题映射，查找匹配项
        let matchedHeading = null
        let matchedCategories = []
        
        for (const [headingText, categories] of Object.entries(headingFilterMap)) {
          // 跳过"快速筛选"
          if (headingText === '快速筛选') continue
          
          // 精确匹配或包含匹配
          if (linkText === headingText || 
              linkText.includes(headingText) || 
              headingText.includes(linkText)) {
            matchedHeading = headingText
            matchedCategories = categories
            break
          }
          
          // 通过 href 匹配（如果包含标题关键词）
          if (href && (href.includes(headingText) || href.includes(encodeURIComponent(headingText)))) {
            matchedHeading = headingText
            matchedCategories = categories
            break
          }
        }
        
        if (matchedHeading) {
          // 判断是否应该显示
          let shouldShow = false
          
          if (matchedCategories.length === 0) {
            // 说明类标题始终显示
            shouldShow = true
          } else {
            // 模型类标题根据筛选条件
            if (filter === 'all') {
              shouldShow = true
            } else if (filter === 'qwen') {
              shouldShow = matchedCategories.includes('qwen')
            } else {
              shouldShow = matchedCategories.includes(filter)
            }
          }
          
          // 应用显示/隐藏
          if (shouldShow) {
            navItem.style.display = ''
            navItem.style.visibility = 'visible'
            navItem.style.opacity = '1'
            navItem.classList.remove('filter-hidden')
          } else {
            navItem.style.display = 'none'
            navItem.style.visibility = 'hidden'
            navItem.style.opacity = '0'
            navItem.classList.add('filter-hidden')
          }
        }
      })
    })
  }

  function initFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn')
    const modelGrids = document.querySelectorAll('.model-grid[data-category]')
    const modelSections = document.querySelectorAll('h2')

    if (filterButtons.length === 0) return

    filterButtons.forEach(btn => {
      // Remove existing listeners by cloning
      const newBtn = btn.cloneNode(true)
      btn.parentNode.replaceChild(newBtn, btn)
      
      newBtn.addEventListener('click', () => {
        const filter = newBtn.getAttribute('data-filter')
        const wasActive = newBtn.classList.contains('active')
        
        // If clicking the active button (except "all"), toggle it off
        if (wasActive && filter !== 'all') {
          // Remove active from current button
          newBtn.classList.remove('active')
          
          // Activate "all" button instead
          const allButtons = document.querySelectorAll('.filter-btn')
          allButtons.forEach(b => {
            if (b.getAttribute('data-filter') === 'all') {
              b.classList.add('active')
            }
          })
          
          // Show all content
          modelGrids.forEach(grid => {
            grid.classList.remove('hidden')
            grid.style.display = ''
          })
          
          modelSections.forEach(section => {
            section.classList.remove('hidden')
            section.style.display = ''
            const hr = section.previousElementSibling
            if (hr && hr.tagName === 'HR') {
              hr.style.display = ''
            }
          })
          
          // 更新右侧导航 - 显示全部（延迟执行确保 DOM 更新完成）
          setTimeout(() => updateOutline('all'), 300)
          // 再次尝试，确保导航已渲染
          setTimeout(() => updateOutline('all'), 600)
        } else {
          // Normal filter behavior
          const allButtons = document.querySelectorAll('.filter-btn')
          allButtons.forEach(b => b.classList.remove('active'))
          newBtn.classList.add('active')

          // Filter model grids
          modelGrids.forEach(grid => {
            const categoryAttr = grid.getAttribute('data-category')
            if (!categoryAttr) return
            
            const categories = categoryAttr.split(' ')
            // Qwen 筛选需要特殊处理：显示 qwen 和 multimodal
            if (filter === 'all' || categories.includes(filter) || (filter === 'qwen' && categories.includes('qwen'))) {
              grid.classList.remove('hidden')
              grid.style.display = ''
            } else {
              grid.classList.add('hidden')
              grid.style.display = 'none'
            }
          })

          // Filter sections (h2 headings and their hr separators)
          modelSections.forEach(section => {
            const nextElement = section.nextElementSibling
            if (nextElement && nextElement.classList.contains('model-grid')) {
              const categoryAttr = nextElement.getAttribute('data-category')
              if (!categoryAttr) return
              
              const categories = categoryAttr.split(' ')
              // Qwen 筛选需要特殊处理
              if (filter === 'all' || categories.includes(filter) || (filter === 'qwen' && categories.includes('qwen'))) {
                section.classList.remove('hidden')
                section.style.display = ''
                // Show hr separator if exists
                const hr = section.previousElementSibling
                if (hr && hr.tagName === 'HR') {
                  hr.style.display = ''
                }
              } else {
                section.classList.add('hidden')
                section.style.display = 'none'
                // Hide hr separator if exists
                const hr = section.previousElementSibling
                if (hr && hr.tagName === 'HR') {
                  hr.style.display = 'none'
                }
              }
            }
          })
          
          // 更新右侧导航（延迟执行确保 DOM 更新完成）
          setTimeout(() => updateOutline(filter), 300)
          // 再次尝试，确保导航已渲染
          setTimeout(() => updateOutline(filter), 600)
        }
      })
    })
  }

  // Initialize when DOM is ready
  function tryInit() {
    if (document.querySelector('.filter-btn')) {
      initFilter()
      // 初始化时更新导航（显示全部）
      updateOutline('all')
    } else {
      setTimeout(tryInit, 100)
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit)
  } else {
    tryInit()
  }
  
  // 监听路由变化，重新更新导航
  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', () => {
      setTimeout(() => {
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all'
        updateOutline(activeFilter)
      }, 200)
    })
  }
})
</script>

## 快速筛选

<div class="filter-bar">
  <span class="filter-btn active" data-filter="all">全部</span>
  <span class="filter-btn" data-filter="qwen">Qwen</span>
  <span class="filter-btn" data-filter="deepseek">DeepSeek</span>
  <span class="filter-btn" data-filter="glm">GLM</span>
  <span class="filter-btn" data-filter="kimi">Kimi</span>
  <span class="filter-btn" data-filter="multimodal">多模态</span>
</div>

---

## Qwen 通义千问系列

<div class="model-grid" data-category="qwen">

<a href="/models/qwen3-235b" class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Qwen3-235B</p>
      <p class="model-org">Qwen (阿里云)</p>
    </div>
    <span class="model-badge badge-hot">HOT</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>235B MoE</span>
    <span><span class="meta-label">大小：</span>~470GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">W4A8</span>
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
  </div>
  <p class="model-desc">Qwen3 旗舰模型，235B MoE 架构，22B 激活参数，多语言能力出色</p>
</a>

<a href="/models/qwen3-next-80b" class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Qwen3-Next-80B</p>
      <p class="model-org">Qwen (阿里云)</p>
    </div>
    <span class="model-badge badge-new">NEW</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>80B MoE</span>
    <span><span class="meta-label">大小：</span>~160GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">W8A8</span>
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">下一代 Qwen，Hybrid Transformer-Mamba 架构，3.9B 激活参数，百万上下文</p>
</a>

<a href="/models/qwen3-32b" class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Qwen3-32B</p>
      <p class="model-org">Qwen (阿里云)</p>
    </div>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>32B Dense</span>
    <span><span class="meta-label">大小：</span>~64GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">W8A8</span>
    <span class="tag tag-quant">INT4</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">平衡性能与效率的主力模型，适合大多数场景</p>
</a>

<a href="/models/qwen3-30b" class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Qwen3-30B</p>
      <p class="model-org">Qwen (阿里云)</p>
    </div>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>30B MoE</span>
    <span><span class="meta-label">大小：</span>~60GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-quant">INT4</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">轻量 MoE 模型，30B 参数仅 3B 激活，高效推理</p>
</a>

<a href="/models/qwen2.5-72b" class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Qwen2.5-72B</p>
      <p class="model-org">Qwen (阿里云)</p>
    </div>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>72B Dense</span>
    <span><span class="meta-label">大小：</span>~144GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">W8A8</span>
    <span class="tag tag-quant">INT4</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">Qwen2.5 旗舰 Dense 模型，长文本能力强，稳定可靠</p>
</a>

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">QwQ</p>
      <p class="model-org">Qwen (阿里云)</p>
    </div>
    <span class="model-badge badge-hot">HOT</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>32B Dense</span>
    <span><span class="meta-label">大小：</span>~64GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-quant">W4A8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">专注推理的思考模型，擅长数学和代码</p>
</div>

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Qwen3-Coder</p>
      <p class="model-org">Qwen (阿里云)</p>
    </div>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>32B Dense</span>
    <span><span class="meta-label">大小：</span>~64GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-quant">W8A8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">代码专用模型，支持多种编程语言</p>
</div>

</div>

---

## DeepSeek 系列

<div class="model-grid" data-category="deepseek">

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">DeepSeek-V3.2</p>
      <p class="model-org">deepseek-ai</p>
    </div>
    <span class="model-badge badge-hot">HOT</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>685B MoE</span>
    <span><span class="meta-label">大小：</span>~1.3TB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">FP8</span>
    <span class="tag tag-quant">W8A8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">DeepSeek 最新旗舰模型，685B MoE 架构，性能对标 GPT-4o</p>
</div>

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">DeepSeek-V3.2-Exp</p>
      <p class="model-org">deepseek-ai</p>
    </div>
    <span class="model-badge badge-new">NEW</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>685B MoE</span>
    <span><span class="meta-label">大小：</span>~1.3TB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">FP8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">V3.2 实验版本，包含最新优化，推理速度更快</p>
</div>

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">DeepSeek-V3.1</p>
      <p class="model-org">deepseek-ai</p>
    </div>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>671B MoE</span>
    <span><span class="meta-label">大小：</span>~1.2TB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-quant">W8A8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">稳定版本，经过大规模生产验证</p>
</div>

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">DeepSeek-Distill-Qwen-32B</p>
      <p class="model-org">deepseek-ai</p>
    </div>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>32B Dense</span>
    <span><span class="meta-label">大小：</span>~64GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-quant">W4A8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">基于 Qwen 架构的蒸馏模型，继承 DeepSeek 能力，推理更高效</p>
</div>

</div>

---

## Qwen 多模态系列

<div class="model-grid" data-category="qwen multimodal">

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Qwen3-VL-MoE</p>
      <p class="model-org">Qwen (阿里云)</p>
    </div>
    <span class="model-badge badge-vl">VL</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>72B MoE</span>
    <span><span class="meta-label">大小：</span>~144GB</span>
    <span><span class="meta-label">类型：</span>Vision</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">视觉语言 MoE 模型，支持图像理解和 OCR</p>
</div>

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Qwen3-VL-32B</p>
      <p class="model-org">Qwen (阿里云)</p>
    </div>
    <span class="model-badge badge-vl">VL</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>32B Dense</span>
    <span><span class="meta-label">大小：</span>~64GB</span>
    <span><span class="meta-label">类型：</span>Vision</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-quant">W8A8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">32B 视觉语言模型，平衡效果与效率</p>
</div>

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Qwen2.5-VL</p>
      <p class="model-org">Qwen (阿里云)</p>
    </div>
    <span class="model-badge badge-vl">VL</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>72B Dense</span>
    <span><span class="meta-label">大小：</span>~144GB</span>
    <span><span class="meta-label">类型：</span>Vision</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">Qwen2.5 视觉语言模型，图像理解能力强</p>
</div>

</div>

---

## GLM 智谱系列

<div class="model-grid" data-category="glm">

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">GLM-5</p>
      <p class="model-org">智谱 AI (ZhipuAI)</p>
    </div>
    <span class="model-badge badge-hot">HOT</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>745B MoE</span>
    <span><span class="meta-label">大小：</span>~419.94GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-quant">W4A8</span>
    <span class="tag tag-engine">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-default">VLLM</span>
  </div>
  <p class="model-desc">是智谱新一代的旗舰基座模型，面向 Agentic Engineering 打造，能够在复杂系统工程与长程 Agent 任务中提供可靠生产力。</p>
</div>

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">GLM-4.5</p>
      <p class="model-org">智谱 AI (ZhipuAI)</p>
    </div>
    <span class="model-badge badge-new">NEW</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>358B Dense</span>
    <span><span class="meta-label">大小：</span>~64GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-quant">W8A8</span>
    <span class="tag tag-engine">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-default">VLLM</span>
  </div>
  <p class="model-desc">智谱最新一代基座模型，综合能力出色</p>
</div>

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">GLM-4.7-Flash</p>
      <p class="model-org">智谱 AI (ZhipuAI)</p>
    </div>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>31B MoE</span>
    <span><span class="meta-label">大小：</span>~18GB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-quant">W4A8</span>
    <span class="tag tag-engine">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-default">VLLM</span>
  </div>
  <p class="model-desc">轻量快速版本，适合低延迟场景</p>
</div>

</div>

---

## Kimi 月之暗面系列

<div class="model-grid" data-category="kimi">

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Kimi-K2-0905</p>
      <p class="model-org">月之暗面 (Moonshot AI)</p>
    </div>
    <span class="model-badge badge-hot">HOT</span>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>1T MoE</span>
    <span><span class="meta-label">大小：</span>~2TB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">FP8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">Kimi 旗舰模型，万亿参数 MoE，长文本能力顶尖</p>
</div>

<div class="model-card">
  <div class="model-header">
    <div>
      <p class="model-name">Kimi-K2.5</p>
      <p class="model-org">月之暗面 (Moonshot AI)</p>
    </div>
  </div>
  <div class="model-meta">
    <span><span class="meta-label">参数：</span>MoE</span>
    <span><span class="meta-label">大小：</span>~1TB</span>
  </div>
  <div class="model-tags">
    <span class="tag tag-quant">BF16</span>
    <span class="tag tag-quant">INT8</span>
    <span class="tag tag-default">MindIE</span>
    <span class="tag tag-engine">MLGuider</span>
    <span class="tag tag-engine">VLLM</span>
  </div>
  <p class="model-desc">K2 系列优化版，推理效率提升</p>
</div>

</div>

---

## 量化格式说明

| 格式 | 精度 | 显存占用 | 适用场景 |
|------|------|----------|----------|
| **BF16** | 高 | 100% | 最佳效果，显存充足时首选 |
| **FP8** | 较高 | ~50% | 大模型推荐，精度损失小 |
| **INT8 / I8** | 中 | ~50% | 通用量化，平衡效果和效率 |
| **W8A8** | 中 | ~50% | 权重和激活都量化 |
| **INT4 / I4** | 较低 | ~25% | 极致压缩，适合资源受限场景 |

---

## 推理引擎说明

| 引擎 | 类型 | 说明 |
|------|------|------|
| **MindIE** | 华为原生 | 默认引擎，昇腾硬件官方支持，稳定性最佳 |
| **MLGuider** | 玄武自研 | 深度优化引擎，部分模型性能最优 |
| **VLLM** | 开源社区 | 功能丰富，支持多种优化技术 |
| **SGLang** | 开源社区 | 高性能推理引擎，支持结构化生成 |
