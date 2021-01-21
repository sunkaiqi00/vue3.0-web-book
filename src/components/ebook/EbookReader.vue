<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div
      class="ebook-reader-mask"
      @click.stop="onMaskClick"
      @touchmove.stop="onTouchMove"
      @touchend.stop="onTouchEnd"
      @mousedown.left="onMouseDown"
      @mousemove.left="onMouseMove"
      @mouseup.left="onMouseUp"
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
    let startOffsetY = 0 // 移动端 手指移动 最开始点击的offsetY
    let mouseState = 0 // pc 点击状态
    let mouseDownTime = 0 // pc 点击时间
    // 1 - 鼠标进入
    // 2 - 鼠标进入后移动
    // 3 - 鼠标在移动状态松手
    // 4 -鼠标还原
    const onMouseDown = e => {
      mouseState = 1
      mouseDownTime = e.timeStamp
      e.stopPropagation()
      e.preventDefault()
    }
    const onMouseMove = e => {
      if (mouseState === 1) {
        mouseState = 2
      } else if (mouseState === 2) {
        if (startOffsetY) {
          const moveOffsetY = e.clientY - startOffsetY
          _setOffsetY(moveOffsetY)
        } else {
          startOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    }
    const onMouseUp = e => {
      if (mouseState === 2) {
        _setOffsetY(0).then(() => {
          startOffsetY = 0
        })
        mouseState = 3
      } else {
        // 鼠标点击并没有移动 可以触发click事件
        mouseState = 4
      }
      const time = e.timeStamp - mouseDownTime
      if (time < 60) {
        mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    }
    // 遮罩点击 切换章节与title和菜单
    const onMaskClick = e => {
      if (mouseState && (mouseState === 2 || mouseState === 3)) {
        return
      }
      const offsetX = e.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        _prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        _nextPage()
      } else {
        _toggleTitleAndMenu()
      }
      e.preventDefault()
      e.stopPropagation()
    }
    const onTouchMove = e => {
      if (startOffsetY) {
        const moveOffsetY = e.changedTouches[0].clientY - startOffsetY
        _setOffsetY(moveOffsetY)
      } else {
        startOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    }
    const onTouchEnd = e => {
      _setOffsetY(0).then(() => {
        startOffsetY = 0
      })
    }

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
    return {
      onMaskClick,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      onMouseMove,
      onMouseUp
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
