import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { onMounted } from 'vue'
import { fixCopyButtonIcons } from './copy-button-fix.js'

export default {
  ...DefaultTheme,
  setup() {
    onMounted(() => {
      fixCopyButtonIcons()
    })
  }
}
