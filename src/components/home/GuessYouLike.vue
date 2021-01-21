<template>
  <div class="guess-you-like" v-if="data.length">
    <title-view :label="$t('home.guessYouLike')" :btn="$t('home.change')" @onClick="randomSwitch"></title-view>
    <div class="guess-you-like-list">
      <div
        class="guess-you-like-item"
        v-for="(item, index) in showBook"
        :key="index"
        @click="useshowBookDetail(item)"
      >
        <div class="img-wrapper">
          <img class="img" :src="item.cover" />
        </div>
        <div class="content-wrapper">
          <div class="title title-big">{{item.title}}</div>
          <div class="author sub-title">{{item.author}}</div>
          <div class="result third-title">{{resultText(item)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleView from './Title'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import useshowBookDetail from '../../hooks/useshowBookDetail'
export default {
  name: 'GuessYouLike',
  components: {
    TitleView
  },
  props: {
    data: Array
  },
  setup(props) {
    const index = ref(0)
    const total = ref(0)
    const showBook = computed(() => {
      if (props.data) {
        return [
          props.data[index.value], // 0  1  2
          props.data[index.value + total.value], // 3  4  5
          props.data[index.value + total.value * 2] // 6  7  8
        ]
      } else {
        return []
      }
    })
    const randomSwitch = () => {
      if (index.value + 1 >= total.value) {
        index.value = 0
      } else {
        index.value++
      }
    }
    const resultText = book => {
      const { ctx } = getCurrentInstance()
      if (book && book.type && book.result) {
        switch (book.type) {
          case 1:
            return ctx.$t('home.sameAuthor').replace('$1', book.result)
          case 2:
            return ctx.$t('home.sameReader').replace('$1', book.result)
          case 3:
            return ctx
              .$t('home.readPercent')
              .replace('$1', book.percent)
              .replace('$2', book.result)
        }
      }
    }
    watch(
      () => props.data,
      v => {
        total.value = v.length / 3
      }
    )
    return {
      randomSwitch,
      showBook,
      useshowBookDetail,
      resultText
    }
  }
}
</script>

<style lang="scss"  scoped>
@import '@/assets/css/global.scss';

.guess-you-like {
  .guess-you-like-list {
    width: 100%;
    padding: 0 px2rem(10);
    box-sizing: border-box;
    .guess-you-like-item {
      display: flex;
      margin-top: px2rem(15);
      cursor: pointer;
      &:first-child {
        margin-top: px2rem(5);
      }
      .img-wrapper {
        flex: 0 0 20%;
        padding: px2rem(10) px2rem(10) px2rem(10) 0;
        box-sizing: border-box;
        .img {
          width: 100%;
        }
      }
      .content-wrapper {
        flex: 1;
        padding: px2rem(10) 0;
        box-sizing: border-box;
        .author {
          margin-top: px2rem(15);
          font-size: px2rem(13);
        }
        .result {
          margin-top: px2rem(5);
          font-size: px2rem(11);
        }
      }
    }
  }
}
</style>
