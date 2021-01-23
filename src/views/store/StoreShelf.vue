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
      <shelf-list></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
import { nextTick, onMounted, ref, watch } from 'vue'
import { getShelf } from '@/api/book'
import { getBookShelf, saveBookShelf } from '@/utils/localStorage'
import Scroll from '../../components/common/Scroll.vue'
import ShelfSearch from '../../components/shelf/ShelfSearch.vue'
import ShelfTitle from '../../components/shelf/ShelfTitle.vue'
import useHomeStore from '../../hooks/useHomeStore'
import useTypeThreeAddbookToShelf from '../../hooks/useTypeThreeAddbookToShelf'
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
    const { _setShelfList, _setOffsetY, isEditMode } = useHomeStore()
    const shelfScrollRef = ref(null)
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
    onMounted(async () => {
      let shelf
      const list = getBookShelf()
      if (!list) {
        const data = await getShelf()
        if (data.status === 200 && data.data.bookList) {
          shelf = data.data.bookList
        }
      } else {
        shelf = list
      }
      // 添加 type 为3  添加书的占位
      _setShelfList(useTypeThreeAddbookToShelf(shelf))
      saveBookShelf(shelf)
    })

    return {
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
