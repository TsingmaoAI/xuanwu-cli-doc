<script setup>
import { Terminal, MessageSquare, Settings, Box, Layers, Server } from 'lucide-vue-next';
</script>

<template>
  <div class="arch-container">
    <div class="arch-card">
      
      <div class="arch-header">
        <h1 class="arch-title">玄武 CLI</h1>
        <p class="arch-subtitle">国产芯片快速启动器</p>
      </div>

      <div class="arch-body">
        
        <div class="arch-layer">
          <div class="layer-header">
            <Terminal class="icon" />
            <span>用户界面层</span>
          </div>
          <div class="layer-content flex-center">
            <div class="pill">CLI: xw</div>
            <div class="pill">API: /v1/chat</div>
          </div>
        </div>

        <div class="arch-layer">
          <div class="layer-header">
            <Settings class="icon" />
            <span>调度与管理层</span>
          </div>
          <div class="layer-content grid-4">
            <div class="box">模型路由</div>
            <div class="box">资源管理</div>
            <div class="box">生命周期</div>
            <div class="box">请求队列</div>
          </div>
        </div>

        <div class="arch-layer highlight-layer">
          <div class="layer-header blue-text">
            <Box class="icon-blue" />
            <span>推理引擎层</span>
          </div>
          
          <div class="layer-content grid-3 mb-2">
            <div class="engine-box">
              <div class="eng-title">MLGuider</div>
              <div class="eng-sub">深度优化</div>
            </div>
            <div class="engine-box">
              <div class="eng-title">MindIE</div>
              <div class="eng-sub">原厂原生</div>
            </div>
            <div class="engine-box">
              <div class="eng-title">vLLM</div>
              <div class="eng-sub">社区标准</div>
            </div>
          </div>
          
          <div class="footer-row">
            <span class="dot"></span>进程隔离
            <span class="sep">|</span>
            <span class="dot"></span>自动路由
          </div>
        </div>

        <div class="arch-layer">
          <div class="layer-header">
            <Layers class="icon" />
            <span>硬件抽象层</span>
          </div>
          <div class="layer-content">
            <div class="bar-box">
              <span>驱动接口</span>
              <span class="v-line"></span>
              <span>内存管理</span>
              <span class="v-line"></span>
              <span>通信库</span>
            </div>
          </div>
        </div>

        <div class="arch-layer bg-gray">
           <div class="layer-header">
            <Server class="icon" />
            <span>物理硬件层</span>
          </div>
          <div class="layer-content grid-3">
            <div class="hw-box">昇腾 Ascend</div>
            <div class="hw-box">沐曦 Metax</div>
            <div class="hw-box">摩尔线程</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 核心策略：
   1. 使用 em/rem 相对单位，基准设小
   2. 减少所有 padding/margin
   3. 移除多余装饰
*/

.arch-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0; /* 极小的外边距 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #334155;
}

.arch-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  /* 宽度限制在 420px - 600px 之间，类似手机或侧边栏卡片 */
  width: 100%;
  max-width: 38rem; 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* 头部 */
.arch-header {
  background: #f8fafc;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  text-align: center;
}

.arch-title {
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
}

.arch-subtitle {
  font-size: 0.75rem; /* 12px - 类似侧边栏说明文字 */
  color: #64748b;
  margin: 0;
}

/* 主体 */
.arch-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 紧凑间距 */
}

/* 层级通用 */
.arch-layer {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.625rem; /* 10px padding */
  background: white;
}

.layer-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem; /* 13px - 侧边栏正文大小 */
  font-weight: 600;
  color: #1e293b;
}

.icon { width: 0.875rem; height: 0.875rem; color: #475569; }
.icon-blue { width: 1rem; height: 1rem; color: #1e40af; }

/* 布局工具 */
.flex-center { display: flex; justify-content: center; gap: 0.75rem; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
.mb-2 { margin-bottom: 0.5rem; }

/* 元素样式 - 极简药丸/方块 */
.pill {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem; /* 12px */
  font-family: monospace;
  color: #334155;
}

.box {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 0.25rem;
  padding: 0.375rem 0;
  text-align: center;
  font-size: 0.75rem; /* 12px */
  color: #475569;
}

/* 高亮层特别样式 */
.highlight-layer {
  background: #eff6ff; /* blue-50 */
  border-color: #dbeafe;
}
.blue-text { color: #1e3a8a; }

.engine-box {
  background: white;
  border: 1px solid #bfdbfe;
  border-radius: 0.375rem;
  padding: 0.375rem;
  text-align: center;
}
.eng-title { font-size: 0.8125rem; font-weight: 700; color: #1e3a8a; }
.eng-sub { font-size: 0.625rem; color: #60a5fa; margin-top: 1px; }

.footer-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.625rem; /* 10px */
  color: #64748b;
}
.dot { width: 4px; height: 4px; background: #94a3b8; border-radius: 50%; }
.sep { color: #cbd5e1; }

/* 硬件层 */
.bar-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 0.25rem;
  padding: 0.375rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
}
.v-line { width: 1px; height: 0.75rem; background: #cbd5e1; }

.bg-gray { background: #f8fafc; }
.hw-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  padding: 0.375rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #334155;
}
</style>