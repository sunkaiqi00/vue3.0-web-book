<template>
  <div class="recommend" v-if="data.length">
    <title-view :label="$t('home.recommend')"></title-view>
    <div class="recommend-list">
      <div
        class="recommend-item"
        v-for="(item, index) in data"
        :key="index"
        @click="useshowBookDetail(item)"
      >
        <div class="img-wrapper">
          <img class="img" :src="item.cover" />
        </div>
        <div class="content-wrapper">
          <div class="title title-medium">{{item.title}}</div>
          <div class="num sub-title">{{$t('home.readers').replace('$1', item.readers)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import TitleView from './Title'
import useshowBookDetail from '../../hooks/useshowBookDetail'
export default {
  name: 'Recommend',
  components: {
    TitleView
  },
  props: {
    data: Array
  },
  setup(props) {
    const recommendBook = computed(() => props.data)
    return {
      recommendBook,
      useshowBookDetail
    }
  }
}
</script>

<style lang="scss"  scoped>
@import '@/assets/css/global.scss';

.recommend {
  .recommend-list {
    width: 100%;
    @include top;
    box-sizing: border-box;
    .recommend-item {
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: 0 px2rem(5);
      box-sizing: border-box;
      cursor: pointer;
      .img-wrapper {
        @include center;
        .img {
          width: 80%;
        }
      }
      .content-wrapper {
        width: 100%;
        margin-top: px2rem(10);
        @include columnCenter;
        .title {
          text-align: center;
        }
        .num {
          margin-top: px2rem(5);
        }
      }
    }
  }
}
</style>
