<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
import { onMounted, onBeforeMount } from 'vue'
import EbookMenu from '../../components/ebook/EbookMenu.vue'
import EbookReader from '../../components/ebook/EbookReader.vue'
import EbookTitle from '../../components/ebook/EbookTitle.vue'
import { getReadTime, saveReadTime } from '@/utils/localStorage'
import useBookStore from '@/hooks/useBookStore'

export default {
  name: 'Ebook',
  components: { EbookReader, EbookTitle, EbookMenu },
  setup() {
    const { bookFileName } = useBookStore()
    let timer = null
    const startLoopReadTime = () => {
      let readTime = getReadTime(bookFileName.value)
      if (!readTime) {
        readTime = 0
      }
      timer = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(bookFileName.value, readTime)
        }
      }, 1000)
    }

    onMounted(() => {
      startLoopReadTime()
    })

    onBeforeMount(() => {
      if (timer) {
        clearInterval(timer)
      }
    })
  }
}
</script>

<style scoped>
</style>
