<template>
  <div
    class="shelf-search-wrapper"
    :class="{'search-top' : ifInputClicked,'title-shadow' : ifHideTitleShadow}"
  >
    <div class="shelf-search" :class="{'search-top' : ifInputClicked}">
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input
            type="text"
            class="search-input"
            :placeholder="$t('shelf.search')"
            @focus="onSearchClick"
            v-model.trim="searchText"
          />
        </div>
        <div class="icon-clear-wrapper" v-show="searchText.length > 0" @click="clearSearchText">
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <div class="icon-locale-wrapper" v-if="!ifInputClicked" @click="switchLocale">
        <span class="icon-cn icon" v-if="lang === 'zh'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <div class="cancel-btn-wrapper" @click="onCancel" v-else>
        <span class="cancel-text">{{$t('shelf.cancel')}}</span>
      </div>
    </div>
    <transition name="hot-search-move">
      <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
        <div
          class="shelf-search-tab-item"
          v-for="item in tabs"
          :key="item.id"
          @click="onTabClick(item.id)"
        >
          <span
            class="shelf-search-tab-text"
            :class="{'tab-is-selected' : item.id === selectTab}"
          >{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import useHomeStore from '../../hooks/useHomeStore'
import { saveLanguage } from '@/utils/localStorage'
export default {
  name: 'ShelfSearch',
  setup() {
    const { offsetY, _setShelfTitleVisible } = useHomeStore()
    const instance = ref(null)
    const ifInputClicked = ref(false) // 是否点击搜索框
    const searchText = ref('') // 搜索关键字
    const selectTab = ref(1)
    const ifHideTitleShadow = ref(true) // 隐藏阴影
    const lang = ref('') // 语言
    const tabs = computed(() => {
      // tab 名字
      return [
        {
          id: 1,
          text: instance.value.$t('shelf.default')
        },
        {
          id: 2,
          text: instance.value.$t('shelf.progress')
        },
        {
          id: 3,
          text: instance.value.$t('shelf.purchase')
        }
      ]
    })
    // 切换tab
    const onTabClick = id => {
      selectTab.value = id
    }
    // 清楚搜索关键字
    const clearSearchText = () => {
      searchText.value = ''
    }
    // 切换中英文
    const switchLocale = () => {
      if (lang.value === 'zh') {
        instance.value.$i18n.locale = 'en'
      } else {
        instance.value.$i18n.locale = 'zh'
      }
      lang.value = instance.value.$i18n.locale
      saveLanguage(instance.value.$i18n.locale)
    }
    // 点击搜索框
    const onSearchClick = () => {
      ifInputClicked.value = true
      _setShelfTitleVisible(false)
    }
    // 点击取消
    const onCancel = () => {
      ifInputClicked.value = false
      _setShelfTitleVisible(true)
    }
    watch(offsetY, y => {
      // 搜索组件的阴影显示 列表高度且点击了搜索框
      if (y > 0 && ifInputClicked.value) {
        ifHideTitleShadow.value = false // 显示
      } else {
        ifHideTitleShadow.value = true // 隐藏
      }
    })
    onMounted(() => {
      const { ctx } = getCurrentInstance()
      instance.value = ctx
      lang.value = instance.value.$i18n.locale
    })
    return {
      ifInputClicked,
      searchText,
      selectTab,
      ifHideTitleShadow,
      lang,
      tabs,
      onTabClick,
      clearSearchText,
      switchLocale,
      onSearchClick,
      onCancel
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';

.shelf-search-wrapper {
  position: relative;
  width: 100%;
  height: px2rem(94);
  z-index: 105;
  font-size: px2rem(16);
  background: #fff;
  box-shadow: 0 px2rem(2) px2rem(2) rgba(0, 0, 0, 0.1);
  &.search-top {
    position: fixed;
    left: 0;
    top: 0;
  }
  &.title-shadow {
    box-shadow: none;
  }
  .shelf-search {
    position: absolute;
    top: px2rem(42);
    left: 0;
    z-index: 105;
    width: 100%;
    height: px2rem(52);
    display: flex;
    transition: top $animationTime linear;
    &.search-top {
      top: 0;
    }
    .search-wrapper {
      flex: 1;
      display: flex;
      margin: px2rem(8) 0 px2rem(8) 0;
      border: px2rem(1) solid #ccc;
      margin-left: px2rem(20);
      border-radius: px2rem(5);
      .icon-search-wrapper {
        flex: 0 0 px2rem(22);
        @include right;
        .icon-search {
          font-size: px2rem(12);
        }
      }
      .search-input-wrapper {
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        @include center;
        .search-input {
          width: 100%;
          font-size: px2rem(14);
          border: none;
          color: #333;
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-clear-wrapper {
        flex: 0 0 px2rem(24);
        @include left;
        .icon-close-circle-fill {
          font-size: px2rem(14);
          color: #ccc;
          cursor: pointer;
        }
      }
    }
    .icon-locale-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .icon-cn,
      .icon-en {
        font-size: px2rem(22);
        color: #666;
      }
    }
    .cancel-btn-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .cancel-text {
        font-size: px2rem(14);
        color: $color-blue;
        cursor: pointer;
      }
    }
  }
  .shelf-search-tab-wrapper {
    position: absolute;
    top: px2rem(52);
    left: 0;
    z-index: 105;
    display: flex;
    width: 100%;
    height: px2rem(42);
    .shelf-search-tab-item {
      flex: 1;
      @include center;
      .shelf-search-tab-text {
        font-size: px2rem(12);
        color: #999;
        cursor: pointer;
        &.tab-is-selected {
          color: $color-blue;
        }
      }
    }
  }
}
</style>
