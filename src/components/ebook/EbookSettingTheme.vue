<template>
  <transition name="slide-up">
    <!-- 设置主题 -->
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
      <div class="setting-theme">
        <div
          class="setting-theme-item"
          v-for="(item,index) in themesList"
          :key="index"
          @click="setTheme(index)"
        >
          <div
            class="previw"
            :style="{background: item.style.body.background}"
            :class="{'select-border': item.name === defaultTheme}"
          ></div>
          <div class="text" :class="{'selected': item.name === defaultTheme}">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import useBookStore from '@/hooks/useBookStore'
import { saveTheme } from '@/utils/localStorage'
import useInitGlobalStyle from '@/hooks/useInitGlobalStyle'
export default {
  name: 'EbookSettingTheme',
  setup() {
    const {
      menuVisible,
      settingVisible,
      defaultTheme,
      _setDefaultTheme,
      themesList,
      bookFileName,
      currentBook
    } = useBookStore()
    const setTheme = index => {
      const theme = themesList.value[index]
      _setDefaultTheme(theme.name).then(() => {
        // 阅读器选择主题
        currentBook.value.rendition.themes.select(defaultTheme.value)
      })
      saveTheme(bookFileName.value, theme.name)
      // 全局主题切换
      useInitGlobalStyle()
    }
    return {
      themesList,
      menuVisible,
      settingVisible,
      setTheme,
      defaultTheme
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  width: 100%;
  height: px2rem(90);
  z-index: 165;
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  .setting-theme {
    height: 100%;
    display: flex;
    .setting-theme-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: px2rem(8);
      box-sizing: border-box;
      .previw {
        flex: 1;
        box-sizing: border-box;
        transition: all 0.1s linear;
        box-shadow: 0 0 px2rem(2) rgba(0, 0, 0, 0.1);
        cursor: pointer;
        &.select-border {
          box-shadow: 0 px2rem(2) px2rem(8) rgba(0, 0, 0, 0.2);
        }
      }
      .text {
        flex: 0 0 px2rem(22);
        font-size: px2rem(14);
        color: #ccc;
        @include center;
        transition: all 0.1s linear;
        &.selected {
          color: #333;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
