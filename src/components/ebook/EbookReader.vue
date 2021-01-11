<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useInitEpub from '@/hooks/useInitEpub'
import useBookStore from '@/hooks/useBookStore'
export default {
  name: 'EbookReader',
  setup() {
    const route = useRoute()
    const { _setFileName } = useBookStore()
    onMounted(() => {
      // 通过动态路由 获取电子书的分类和书名  存储到store
      const fileName = route.params.fileName.split('|').join('/')
      _setFileName(fileName).then(() => {
        // 渲染电子书
        useInitEpub('read', fileName)
      })
    })
    return {
      route
    }
  }
}
</script>

<style scoped>
</style>
