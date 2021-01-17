<template>
  <div class="ebook" ref="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-book-mark></ebook-book-mark>
  </div>
</template>

<script>
import { onMounted, onBeforeMount, ref, watch } from 'vue'
import EbookMenu from '../../components/ebook/EbookMenu.vue'
import EbookReader from '../../components/ebook/EbookReader.vue'
import EbookTitle from '../../components/ebook/EbookTitle.vue'
import { getReadTime, saveReadTime } from '@/utils/localStorage'
import useBookStore from '@/hooks/useBookStore'
import EbookBookMark from '../../components/ebook/EbookBookMark.vue'

export default {
  name: 'Ebook',
  components: { EbookReader, EbookTitle, EbookMenu, EbookBookMark },
  setup() {
    const { bookFileName, offsetY, menuVisible, bookAvailable } = useBookStore()
    const ebook = ref(null)
    let timer = null
    // 每30秒在浏览器缓存中写入一次阅读时长
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
    watch(offsetY, val => {
      // 书加载完毕 菜单不显示 可以下拉
      if (!menuVisible.value && bookAvailable.value) {
        if (val > 0) {
          ebookMove(val)
        }
        if (val === 0) {
          reset()
        }
      }
    })
    const ebookMove = offsetY => {
      if (ebook.value) {
        ebook.value.style.top = offsetY + 'px'
      }
    }
    const reset = () => {
      ebook.value.style.top = 0
      ebook.value.style.transition = 'all .2s linear'
      setTimeout(() => {
        ebook.value.style.transition = ''
      }, 200)
    }
    onMounted(() => {
      startLoopReadTime()
    })

    onBeforeMount(() => {
      if (timer) {
        clearInterval(timer)
      }
    })

    return {
      ebook
    }
  }
}
</script>

<style scoped lang='scss'>
.ebook {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // overflow: hidden;
}
</style>
