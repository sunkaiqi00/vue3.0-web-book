<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll
      class="shelf-scroll-wrapper"
      ref="shelfScrollRef"
      :top="0"
      :bottom="scrollBottom"
      @onScroll="onScroll"
    >
      <shelf-search></shelf-search>
      <shelf-list :top="94" :bookList="bookList"></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
import { nextTick, onMounted, ref, watch } from 'vue'
import useGetBookShelf from '../../hooks/useGetBookShelf'
import Scroll from '../../components/common/Scroll.vue'
import ShelfSearch from '../../components/shelf/ShelfSearch.vue'
import ShelfTitle from '../../components/shelf/ShelfTitle.vue'
import useHomeStore from '../../hooks/useHomeStore'
import ShelfList from '../../components/shelf/ShelfList.vue'
import ShelfFooter from '../../components/shelf/ShelfFooter.vue'

export default {
  name: 'StoreShelf',
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFooter
  },
  setup() {
    const { _setOffsetY, isEditMode, _setCurrentType } = useHomeStore()
    const shelfScrollRef = ref(null)
    const bookList = ref(null)
    const scrollBottom = ref(0)
    const onScroll = offsetY => {
      _setOffsetY(offsetY)
    }
    watch(isEditMode, val => {
      if (val) {
        scrollBottom.value = 48
      } else {
        scrollBottom.value = 0
      }
      nextTick(() => {
        shelfScrollRef.value.refresh()
      })
    })
    onMounted(() => {
      useGetBookShelf().then(res => {
        bookList.value = res
      })
      _setCurrentType(1)
    })

    return {
      bookList,
      onScroll,
      scrollBottom,
      shelfScrollRef
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';

.store-shelf {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 100;
  .shelf-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 110;
  }
}
</style>
