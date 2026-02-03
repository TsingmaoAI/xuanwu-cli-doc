<template>
  <div :class="['VPNavBarTitle', { 'has-sidebar': hasSidebar }]">
    <a class="title" href="/home" @click.prevent="goToHome">
      <img
        v-if="logoUrl"
        class="logo"
        :src="logoUrl"
        alt="Logo"
      />
      <span v-if="theme.siteTitle" ref="siteName" class="text">{{ theme.siteTitle }}</span>
    </a>
  </div>
</template>

<script setup>
import { useData, useRouter, withBase, useRoute } from 'vitepress'
import { computed } from 'vue'

const { theme, isDark } = useData()
const router = useRouter()
const route = useRoute()

// 检查是否有侧边栏
const hasSidebar = computed(() => {
  return route.data?.frontmatter?.sidebar !== false
})

// 根据主题模式选择对应的 logo
const logoUrl = computed(() => {
  const logo = theme.value.logo
  if (typeof logo === 'string') {
    // 配置中的路径已经是绝对路径（/assets/logo-light.png），直接使用
    // withBase 主要用于处理相对路径，对于绝对路径不需要处理
    return logo
  } else if (logo && typeof logo === 'object') {
    const selectedLogo = isDark.value ? (logo.dark || logo.light) : (logo.light || logo.dark)
    if (selectedLogo) {
      // 配置中的路径已经是绝对路径，直接使用
      return selectedLogo
    }
  }
  return null
})

function goToHome(e) {
  e.preventDefault()
  // 如果当前URL包含.html，跳转到home.html，否则跳转到/home
  const currentPath = window.location.pathname
  if (currentPath.includes('.html')) {
    window.location.href = '/home.html'
  } else {
    router.push('/home')
  }
}
</script>

<style scoped>
.title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: opacity 0.25s;
}

.title:hover {
  opacity: 0.6;
}

.logo {
  height: 24px;
  margin-right: 8px;
}
</style>
