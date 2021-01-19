<template>
  <div class="search-bar" :class="{ 'hide-title' : !titleVisible,'hide-shadow ' : !shadowVisible }">
    <transition name="title-move">
      <div class="search-bar-title-wrapper" v-show="titleVisible">
        <div class="title-text-wrapper">
          <span class="title-text title">{{$t('home.title')}}</span>
        </div>
        <div class="title-icon-shake-wrapper" @click="showFlapCard">
          <span class="icon-shake icon"></span>
        </div>
      </div>
    </transition>
    <div
      class="title-icon-back-wrapper"
      :class="{'hide-title':!titleVisible}"
      @click="hideHotSearch"
    >
      <span class="icon-back icon"></span>
    </div>
    <div class="search-bar-input-wrapper" :class="{'hide-title':!titleVisible}">
      <div class="search-bar-blank" :class="{'hide-title':!titleVisible}"></div>
      <div class="search-bar-input">
        <span class="icon-search icon"></span>
        <input type="text" class="input" :placeholder="$t('home.hint')" @focus="showHotSearch" />
      </div>
    </div>
  </div>
  <hot-search-list v-show="hotSearchVisible" ref="searcgRef"></hot-search-list>
</template>

<script>
import { ref, watch } from 'vue'
import useHomeStore from '../../hooks/useHomeStore'
import HotSearchList from './HotSearchList.vue'
export default {
  name: 'SearchBar',
  components: { HotSearchList },
  setup() {
    const { offsetY, hotSearchOffsetY, _setFlapCardVisible } = useHomeStore()
    const titleVisible = ref(true)
    const shadowVisible = ref(false)
    const hotSearchVisible = ref(false)
    const searcgRef = ref()
    const hideTitle = () => {
      titleVisible.value = false
    }
    const showTitle = () => {
      titleVisible.value = true
    }
    const hideShadow = () => {
      shadowVisible.value = false
    }
    const showShadow = () => {
      shadowVisible.value = true
    }
    const hideSearch = () => {
      hotSearchVisible.value = false
    }
    const showSearch = () => {
      hotSearchVisible.value = true
    }

    const showHotSearch = () => {
      hideTitle()
      showSearch()
      hideShadow()
    }
    // 搜索列表返回按钮
    const hideHotSearch = () => {
      if (!hotSearchVisible.value && titleVisible.value) return
      if (offsetY.value > 0) {
        showShadow()
      } else {
        hideShadow()
        showTitle()
      }
      hideSearch()
      searcgRef.value.reset()
    }
    // 显示随机推荐
    const showFlapCard = () => {
      _setFlapCardVisible(true)
    }
    watch(offsetY, y => {
      if (y > 0) {
        hideTitle()
        showShadow()
      } else if (y === 0) {
        showTitle()
        hideShadow()
      }
    })
    watch(hotSearchOffsetY, y => {
      if (y > 0) {
        showShadow()
      } else {
        hideShadow()
      }
    })
    return {
      titleVisible,
      shadowVisible,
      hotSearchVisible,
      showHotSearch,
      hideHotSearch,
      searcgRef,
      showFlapCard
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.search-bar {
  position: relative;
  width: 100%;
  height: px2rem(94);
  z-index: 150;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-title {
    height: px2rem(52);
  }
  &.hide-shadow {
    box-shadow: none;
  }
  .search-bar-title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);

    .title-text-wrapper {
      width: 100%;
      height: px2rem(42);
      @include center;
    }
    .title-icon-shake-wrapper {
      position: absolute;
      right: px2rem(15);
      top: 0;
      height: px2rem(42);
      @include center;
      cursor: pointer;
    }
  }
  .title-icon-back-wrapper {
    position: absolute;
    left: px2rem(15);
    top: 0;
    height: px2rem(42);
    z-index: 160;
    cursor: pointer;
    @include center;
    transition: height $animationTime $animationType;
    &.hide-title {
      height: px2rem(52);
    }
  }
  .search-bar-input-wrapper {
    position: absolute;
    right: 0;
    top: px2rem(42);
    width: 100%;
    height: px2rem(52);
    padding: px2rem(10) px2rem(15);
    display: flex;
    box-sizing: border-box;
    transition: top $animationTime $animationType;
    &.hide-title {
      top: 0;
    }
    .search-bar-blank {
      flex: 0 0 0;
      width: 0;
      transition: all $animationTime $animationType;
      &.hide-title {
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input {
      flex: 1;
      width: 100%;
      background: #f4f4f4;
      border-radius: px2rem(20);
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      border: px2rem(1) solid #eee;
      @include left;
      .icon-search {
        color: #999;
      }
      .input {
        width: 100%;
        height: px2rem(22);
        border: none;
        background: transparent;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        color: #666;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
  }
}
</style>
