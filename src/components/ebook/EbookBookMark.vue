<template>
  <div class="ebook-bookmark" ref="ebookMark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper">
        <span class="icon-down" ref="iconArrow"></span>
      </div>
      <div class="ebook-bookmark-text">{{markText}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" ref="mark" :style="markIsFixed ? markFixedStyle : {}">
      <book-mark :color="markColor" :width="8" :height="30"></book-mark>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import BookMark from '../common/BookMark.vue'
import useBookStore from '@/hooks/useBookStore'
import { getBookMark, saveBookMark } from '@/utils/localStorage'
const GRAY = '#bdc3c7'
const BLUE = '#3498db'
export default {
  components: { BookMark },
  name: 'EbookBookMark',
  setup() {
    const {
      offsetY,
      isBookmark,
      _setIsBookmark,
      menuVisible,
      bookAvailable,
      settingVisible,
      currentBook,
      bookFileName
    } = useBookStore()
    let instance
    const markColor = ref() // 书签颜色
    const markText = ref() // 书签文字
    const mark = ref() //  书签组件
    const ebookMark = ref() // 当前组件顶级父元素
    const iconArrow = ref() // 书签箭头
    const markIsFixed = ref(false) // 书签是否固定
    // 书签的高度  零界值
    const markHeight = computed(() => {
      if (mark.value) {
        return mark.value.offsetHeight
      }
    })
    const markFixedStyle = computed(() => {
      // 书签固定样式
      return {
        position: 'fixed',
        top: 0,
        height: mark.value.offsetHeight + 'px'
      }
    })
    // 监听滑动距离 设置书签
    watch(offsetY, newOffsetY => {
      if (
        !bookAvailable.value ||
        menuVisible.value ||
        settingVisible.value >= 0
      ) {
        return
      }
      if (isBookmark.value) {
        deleteBookMark(newOffsetY)
      } else {
        addBookMark(newOffsetY)
      }
    })
    // 判断当前页是否为书签页 固定书签
    watch(isBookmark, val => {
      markIsFixed.value = val
      if (val) {
        markColor.value = BLUE
      } else {
        markColor.value = GRAY
      }
    })
    // 缓存书签
    const insertMark = () => {
      let bookMark = getBookMark(bookFileName.value)
      if (!bookMark) {
        bookMark = []
      }
      const currentLocation = currentBook.value.rendition.currentLocation()
      const cfiBase = currentLocation.start.cfi.replace(/!.*/, '')
      const cfiStart = currentLocation.start.cfi
        .replace(/.*!/, '')
        .replace(/\)$/, '')
      const cfiEnd = currentLocation.end.cfi.replace(/.*!/, '')
      const cfiRange = `${cfiBase}!,${cfiStart},${cfiEnd}`
      currentBook.value.getRange(cfiRange).then(range => {
        const text = range.toString().replace(/\s\s/g, '')
        bookMark.push({
          cfi: currentLocation.start.cfi,
          text
        })
        saveBookMark(bookFileName.value, bookMark)
      })
    }
    // 删除缓存中的当前书签
    const removeBookMark = () => {
      let bookMark = getBookMark(bookFileName.value)
      const currentLocation = currentBook.value.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      if (bookMark) {
        bookMark = bookMark.filter(item => item.cfi !== cfi)
        saveBookMark(bookFileName.value, bookMark)
      }
    }

    // 下拉松手 书签重置
    const resetMark = () => {
      setTimeout(() => {
        ebookMark.value.style.top = 0
      }, 200)
      // 滑动屏幕松手 判断当前页是否为书签页 进行设置
      if (markIsFixed.value) {
        _setIsBookmark(true)
        insertMark()
      } else {
        _setIsBookmark(false)
        removeBookMark()
      }
    }
    // 当前页不是书签页  添加书签
    const addBookMark = newOffsetY => {
      // 当前页不是书签也
      if (newOffsetY > 0 && newOffsetY < markHeight.value) {
        // 没有到达零界值
        markText.value = instance.$t('book.pulldownAddMark')
        markColor.value = GRAY
        markIsFixed.value = false
        iconArrow.value.style.transform = 'rotate(0)'
      } else if (newOffsetY >= markHeight.value) {
        // 到达零界值
        ebookMark.value.style.top = `${-newOffsetY + markHeight.value}px`
        markText.value = instance.$t('book.releaseAddMark')
        markColor.value = BLUE
        iconArrow.value.style.transform = 'rotate(180deg)'
        markIsFixed.value = true
      } else if (newOffsetY === 0) {
        resetMark()
      }
    }
    // 当前页是书签页   删除书签
    const deleteBookMark = newOffsetY => {
      // 当前页是书签也
      if (newOffsetY > 0 && newOffsetY < markHeight.value) {
        // 没有到达零界值
        markText.value = instance.$t('book.pulldownDeleteMark')
        markColor.value = BLUE
        iconArrow.value.style.transform = 'rotate(0)'
        markIsFixed.value = true
      } else if (newOffsetY >= markHeight.value) {
        // 到达零界值
        console.log(newOffsetY, markHeight.value)
        console.log(-newOffsetY + markHeight.value)
        ebookMark.value.style.top = `${-newOffsetY + markHeight.value}px`
        markText.value = instance.$t('book.releaseDeleteMark')
        markColor.value = GRAY
        iconArrow.value.style.transform = 'rotate(180deg)'
        markIsFixed.value = false
      } else if (newOffsetY === 0) {
        resetMark()
      }
    }

    onMounted(() => {
      const { ctx } = getCurrentInstance()
      instance = ctx
    })
    return {
      markColor,
      markText,
      mark,
      ebookMark,
      iconArrow,
      markIsFixed,
      markFixedStyle
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.ebook-bookmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: px2rem(45);
    bottom: 0;
    display: flex;
    .ebook-bookmark-down-wrapper {
      font-size: px2rem(16);
      color: #7f8c8d;
      transition: all 0.2s linear;
      @include center;
      .icon-down {
        transition: all 0.2s linear;
      }
    }
    .ebook-bookmark-text {
      font-size: px2rem(12);
      color: #7f8c8d;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: px2rem(15);
  }
}
</style>
