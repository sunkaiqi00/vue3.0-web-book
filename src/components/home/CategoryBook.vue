<template>
  <div class="category-book">
    <title-view
      :label="categoryText(book.category)"
      :btn="$t('home.seeAll')"
      @onClick="viewAllCategoryBook"
    ></title-view>
    <div class="category-book-list">
      <div
        class="category-book-item"
        v-for="(item, index) in book.list"
        :key="index"
        @click="useshowBookDetail(item)"
      >
        <div class="img-wrapper">
          <img class="img" :src="item.cover" />
        </div>
        <div class="content-wrapper">
          <div class="title title-small">{{item.title}}</div>
          <div class="num sub-title-tiny">{{item.author}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleView from './Title'
import useGetCategoryText from '../../hooks/useGetCategoryText'
import useshowBookDetail from '../../hooks/useshowBookDetail'
import useShowAllCategoryBook from '../../hooks/useShowAllCategoryBook'
import { getCurrentInstance, computed } from 'vue'

export default {
  name: 'CategoryBook',
  components: {
    TitleView
  },
  props: {
    data: Object
  },
  setup(props) {
    const book = computed(() => props.data)
    let instance = null
    const categoryText = category => {
      const { ctx } = getCurrentInstance()
      instance = ctx
      return useGetCategoryText(category, ctx)
    }
    const viewAllCategoryBook = () => {
      useShowAllCategoryBook(props.data.category, instance)
    }
    return {
      book,
      categoryText,
      useshowBookDetail,
      viewAllCategoryBook
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/global.scss';

.category-book {
  margin-top: px2rem(20);
  .category-book-list {
    width: 100%;
    @include top;
    padding: 0 px2rem(5);
    box-sizing: border-box;
    .category-book-item {
      flex: 0 0 25%;
      width: 25%;
      padding: 0 px2rem(5);
      box-sizing: border-box;
      cursor: pointer;
      .img-wrapper {
        @include center;
        .img {
          width: 100%;
        }
      }
      .content-wrapper {
        width: 100%;
        margin-top: px2rem(10);
        .num {
          margin-top: px2rem(5);
        }
      }
    }
  }
}
</style>
