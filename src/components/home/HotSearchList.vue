<template>
  <transition name="hot-search-move" mode="out-in">
    <scroll class="hot-search-wrapper" :top="52" @onScroll="onScroll" ref="searchScroll">
      <hot-search
        :label="$t('home.hotSearch')"
        :btn="$t('home.change')"
        :searchHistory="hotSearchList"
      ></hot-search>
      <div class="line"></div>
      <hot-search
        :label="$t('home.historySearch')"
        :btn="$t('home.clear')"
        :searchHistory="historySearchList"
        @onClick="removeSearchHistory"
      ></hot-search>
    </scroll>
  </transition>
</template>

<script>
import useHomeStore from '../../hooks/useHomeStore'
import Scroll from '@/components/common/Scroll'
import HotSearch from './HotSearch'
import { ref } from 'vue'
import { getSearchHistory, removeLocalStorage } from '@/utils/localStorage'
export default {
  name: 'HotSearchList',
  components: {
    Scroll,
    HotSearch
  },
  setup() {
    const { _setHotSearchOffsetY } = useHomeStore()
    const searchScroll = ref(null)

    const hotSearchList = [
      {
        type: 1,
        text: 'Self-Reported Population Health',
        num: '1.8万'
      },
      {
        type: 1,
        text: 'Library and Information Sciences',
        num: '1.1万'
      },
      {
        type: 1,
        text: 'Global Business Strategy',
        num: '1.3万'
      },
      {
        type: 1,
        text: 'Corporate Data Quality',
        num: '1.0万'
      },
      {
        type: 1,
        text: 'Verrechnungspreise',
        num: '3.9万'
      }
    ]
    const historySearchList = ref(getSearchHistory())

    const onScroll = offsetY => {
      _setHotSearchOffsetY(offsetY)
    }
    const reset = () => {
      searchScroll.value.scrollTo(0, 0)
    }
    const removeSearchHistory = () => {
      removeLocalStorage('search')
      historySearchList.value = []
    }

    return {
      searchScroll,
      hotSearchList,
      historySearchList,
      onScroll,
      reset,
      removeSearchHistory
    }
  }
}
</script>

<style lang="scss"  scoped>
@import '@/assets/css/global.scss';

.hot-search-wrapper {
  width: 100%;
  height: 100%;
  background: white;
  .line {
    width: 100%;
    height: 0;
    border-top: px2rem(1) solid #eee;
    margin: px2rem(10) 0;
  }
}
</style>
