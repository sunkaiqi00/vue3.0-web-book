<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div
      class="ebook-reader-mask"
      @click.stop="onMaskClick"
      @touchmove.stop="onTouchMove"
      @touchend.stop="onTouchEnd"
    ></div>
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
    const { _setFileName, _setOffsetY } = useBookStore()
    let _prevPage, _nextPage, _toggleTitleAndMenu
    let startOffsetY = 0
    onMounted(() => {
      // 通过动态路由 获取电子书的分类和书名  存储到store
      const fileName = route.params.fileName.split('|').join('/')
      _setFileName(fileName).then(() => {
        // 渲染电子书
        const { prevPage, nextPage, toggleTitleAndMenu } = useInitEpub(
          'read',
          fileName
        )
        _prevPage = prevPage
        _nextPage = nextPage
        _toggleTitleAndMenu = toggleTitleAndMenu
      })
    })
    // 遮罩点击 切换章节与title和菜单
    const onMaskClick = e => {
      const offsetX = e.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        _prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        _nextPage()
      } else {
        _toggleTitleAndMenu()
      }
    }

    const onTouchMove = e => {
      if (startOffsetY) {
        const moveOffsetY = e.changedTouches[0].clientY - startOffsetY
        _setOffsetY(moveOffsetY)
      } else {
        startOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
    }
    const onTouchEnd = e => {
      _setOffsetY(0).then(() => {
        startOffsetY = 0
      })
    }
    return {
      onMaskClick,
      onTouchMove,
      onTouchEnd
    }
  }
}
</script>

<style scoped lang='scss'>
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    z-index: 150;
    width: 100%;
    height: 100%;
  }
}
</style>
