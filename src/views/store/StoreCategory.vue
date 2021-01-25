<template>
  <div class="store-shelf">
    <shelf-title :title="title"></shelf-title>
    <scroll
      class="shelf-scroll-wrapper"
      :top="0"
      :bottom="scrollBottom"
      ref="scrollRef"
      @onScroll="onScroll"
      v-if="isShowList"
    >
      <shelf-list :top="42" :bookList="categoryList"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>{{$t('shelf.groupNone')}}</div>
    <shelf-footer></shelf-footer>
  </div>
</template>
<script>
import ShelfTitle from '../../components/shelf/ShelfTitle'
import Scroll from '@/components/common/Scroll'
import ShelfFooter from '@/components/shelf/ShelfFooter'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import useHomeStore from '../../hooks/useHomeStore'
import { useRoute } from 'vue-router'
import useGetBookShelf from '../../hooks/useGetBookShelf'
import ShelfList from '../../components/shelf/ShelfList.vue'
export default {
  name: 'StoreCategory',
  components: {
    ShelfTitle,
    Scroll,
    ShelfFooter,
    ShelfList
  },
  setup() {
    const {
      isEditMode,
      _setOffsetY,
      _setCurrentType,
      shelfList,
      _setShelfCategory
    } = useHomeStore()
    const route = useRoute()
    const scrollRef = ref(null)
    const scrollBottom = ref(0)
    const categoryList = ref([])
    const title = ref('')
    const isShowList = computed(
      () => categoryList.value && categoryList.value.length > 0
    )
    const onScroll = offsetY => {
      _setOffsetY(offsetY)
    }
    watch(isEditMode, mode => {
      scrollBottom.value = mode ? 48 : 0
      nextTick(() => {
        scrollRef.value && scrollRef.value.refresh()
      })
    })
    onMounted(() => {
      const category = route.query.title
      useGetBookShelf()
      const result = shelfList.value.filter(
        book => book.type === 2 && book.title === category
      )[0]
      _setShelfCategory(result)
      title.value = result.title
      categoryList.value = result.itemList
      _setCurrentType(2)
    })
    return {
      scrollRef,
      scrollBottom,
      isShowList,
      onScroll,
      categoryList,
      title
    }
  }
}
</script>
<style scoped lang='scss'>
@import '@/assets/css/global.scss';

.store-shelf {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 100;
  margin: 0 auto;
  .shelf-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 110;
  }
  .store-shelf-empty-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: px2rem(14);
    color: #333;
    @include center;
  }
}
</style>
