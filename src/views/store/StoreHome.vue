<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flap-card :randomBook="randomBook"></flap-card>
    <scroll @onScroll="onScroll" :top="scrollTop" ref="homeScroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="{background:`url('${banner}')`}"></div>
      </div>
      <guess-you-like :data="guessLikeBook"></guess-you-like>
      <recommend :data="recommendBook"></recommend>
      <featured :data="featureBook" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')"></featured>
      <div class="category-list-wrapper" v-for="(item,index) in categoryBookList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <category :data="categoryList"></category>
    </scroll>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import SearchBar from '../../components/home/SearchBar.vue'
import Scroll from '../../components/common/Scroll.vue'
import useHomeStore from '../../hooks/useHomeStore'
import FlapCard from '../../components/home/FlapCard.vue'
import { home } from '../../api/book'
import GuessYouLike from '../../components/home/GuessYouLike.vue'
import Recommend from '../../components/home/Recommend.vue'
import Featured from '../../components/home/Featured.vue'
import CategoryBook from '../../components/home/CategoryBook.vue'
import Category from '../../components/home/Category.vue'

export default {
  name: 'StoreHome',
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
  },
  setup() {
    const { _setOffsetY } = useHomeStore()
    const scrollTop = ref(94) // 滚动组件距离顶部距离
    const homeScroll = ref() // scroll组件
    const randomBook = ref({}) // 随机推荐电子书
    const banner = ref('') // banner图
    const guessLikeBook = ref([]) // 随机推荐
    const recommendBook = ref([]) // 推荐
    const featureBook = ref([]) // 精选
    const categoryBookList = ref([]) // 部分 分类
    const categoryList = ref([]) // 全部分类
    const onScroll = offsetY => {
      _setOffsetY(offsetY)
      if (offsetY > 0) {
        scrollTop.value = 52
      } else if (offsetY === 0) {
        scrollTop.value = 94
      }
      homeScroll.value.refresh()
    }
    onMounted(() => {
      home().then(res => {
        if (res && res.status === 200) {
          const { data } = res
          const randomIndex = Math.floor(Math.random() * data.random.length)
          randomBook.value = res.data.random[randomIndex]
          banner.value = data.banner
          guessLikeBook.value = data.guessYouLike
          recommendBook.value = data.recommend
          featureBook.value = data.featured
          categoryBookList.value = data.categoryList
          categoryList.value = data.categories
        }
      })
    })
    return {
      onScroll,
      scrollTop,
      homeScroll,
      randomBook,
      banner,
      guessLikeBook,
      recommendBook,
      featureBook,
      categoryBookList,
      categoryList
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.store-home {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  .banner-wrapper {
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: px2rem(150);
      background-repeat: no-repeat !important;
      background-size: 100% 100% !important;
    }
  }
}
</style>
