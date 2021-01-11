<template>
  <router-view />
</template>
<script>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { themeList } from '@/utils/book'
import useBookStore from '@/hooks/useBookStore'
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
})
export default {
  name: 'App',
  setup() {
    const { _setThemeList } = useBookStore()
    const themesList = ref([])
    onMounted(() => {
      // 获取主题名称
      const { ctx } = getCurrentInstance()
      themesList.value = themeList(ctx)
      _setThemeList(themesList.value)
    })
  }
}
</script>
<style lang="scss" socped>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
