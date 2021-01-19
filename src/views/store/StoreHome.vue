<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flap-card></flap-card>
    <scroll @onScroll="onScroll" :top="scrollTop" ref="homeScroll">
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
    </scroll>
  </div>
</template>

<script>
import { ref } from 'vue'
import SearchBar from '../../components/home/SearchBar.vue'
import Scroll from '../../components/common/Scroll.vue'
import useHomeStore from '../../hooks/useHomeStore'
import FlapCard from '../../components/home/FlapCard.vue'

export default {
  name: 'StoreHome',
  components: {
    SearchBar,
    Scroll,
    FlapCard
  },
  setup() {
    const { _setOffsetY } = useHomeStore()
    const scrollTop = ref(94) // 滚动组件距离顶部距离
    const homeScroll = ref()
    const onScroll = offsetY => {
      _setOffsetY(offsetY)
      if (offsetY > 0) {
        scrollTop.value = 52
      } else if (offsetY === 0) {
        scrollTop.value = 94
      }
      homeScroll.value.refresh()
    }

    return {
      onScroll,
      scrollTop,
      homeScroll
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.store-home {
  width: 100%;
  height: 100%;
  min-width: 320px;
  max-width: 640px;
  margin: 0 auto;
}
</style>
