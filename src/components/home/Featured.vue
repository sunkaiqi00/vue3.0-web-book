<template>
  <div class="featured" v-if="data.length">
    <title-view :label="titleText"></title-view>
    <div class="featured-list">
      <div class="featured-item-wrapper">
        <div
          class="featured-item"
          v-for="(item, index) in data"
          :key="index"
          @click="useshowBookDetail(item)"
        >
          <div class="img-wrapper">
            <img class="img" v-lazy="item.cover" />
          </div>
          <div class="content-wrapper">
            <div class="title title-small">{{item.title}}</div>
            <div class="author sub-title-tiny">{{item.author}}</div>
            <div class="category third-title-tiny">{{categoryText(item.category)}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleView from './Title'
import useGetCategoryText from '../../hooks/useGetCategoryText'
import useshowBookDetail from '../../hooks/useshowBookDetail'
import { getCurrentInstance } from 'vue'
export default {
  name: 'Featured',
  components: {
    TitleView
  },
  props: {
    data: Array,
    titleText: {
      type: String
    },
    btnText: {
      type: String
    }
  },
  setup(props) {
    const categoryText = category => {
      const { ctx } = getCurrentInstance()
      return useGetCategoryText(category, ctx)
    }
    return {
      useshowBookDetail,
      categoryText
    }
  }
}
</script>

<style lang="scss"  scoped>
@import '@/assets/css/global.scss';

.featured {
  margin-top: px2rem(20);
  .featured-list {
    width: 100%;
    padding: 0 px2rem(10);
    box-sizing: border-box;
    .featured-item-wrapper {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: flex-start;
      .featured-item {
        flex: 0 0 50%;
        width: 50%;
        padding: px2rem(5) 0;
        cursor: pointer;
        @include top;
        .img-wrapper {
          flex: 0 0 30%;
          width: 30%;
          .img {
            width: 100%;
            // width: px2rem(50);
            // height: px2rem(75);
          }
        }
        .content-wrapper {
          flex: 1;
          width: px2rem(117.5);
          padding: 0 px2rem(5);
          box-sizing: border-box;
          .author {
            margin-top: px2rem(15);
          }
          .category {
            margin-top: px2rem(5);
          }
        }
      }
    }
  }
}
</style>
