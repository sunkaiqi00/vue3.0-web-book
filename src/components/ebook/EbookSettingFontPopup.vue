<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2 icon"></span>
        </div>
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div
          class="ebook-popup-item"
          v-for="(item,index) in fontFamiltList"
          :key="index"
          @click="setFontFamily(item.font)"
        >
          <div class="ebook-popup-item-text" :class="{'isSelected': isSelected(item)}">{{item.font}}</div>
          <div class="ebook-popup-item-check">
            <span class="icon-check" v-if="isSelected(item)"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { fontFamiltList } from '@/utils/book.js'
import useBookStore from '@/hooks/useBookStore'
import { saveFontFamily } from '@/utils/localStorage'
export default {
  name: 'EbookSettingFontPopup',
  setup() {
    const {
      bookFileName,
      defaultFontFamily,
      fontFamilyVisible,
      _setFontFamilyVisible,
      _setDefaultFontFamily,
      currentBook
    } = useBookStore()
    // 隐藏字体选择框
    const hide = () => {
      _setFontFamilyVisible(false)
    }
    // 设置字体类型
    const setFontFamily = fontFamily => {
      if (fontFamily === 'Default') {
        currentBook.value.rendition.themes.font('Courier New')
      } else {
        currentBook.value.rendition.themes.font(fontFamily)
      }
      // 字体类型保存到store ，localStorage 中
      _setDefaultFontFamily(fontFamily)
      saveFontFamily(bookFileName.value, fontFamily)
    }
    // 字体类型 选中判断
    const isSelected = item => {
      return defaultFontFamily.value === item.font
    }
    return {
      fontFamiltList,
      hide,
      setFontFamily,
      fontFamilyVisible,
      isSelected
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.ebook-popup-list {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  background: #fff;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, 0.15);
  .ebook-popup-title {
    position: relative;
    padding: px2rem(16);
    box-sizing: border-box;
    border-bottom: px2rem(1) solid #b8b9bb;
    text-align: center;
    .ebook-popup-title-icon {
      position: absolute;
      left: px2rem(16);
      top: 0;
      height: 100%;
      font-weight: bold;
      @include center;
      font-size: px2rem(18);
    }
    .ebook-popup-title-text {
      @include center;
      font-size: px2rem(14);
      font-weight: 500;
    }
  }
  .ebook-popup-list-wrapper {
    .ebook-popup-item {
      display: flex;
      padding: px2rem(12) px2rem(15);
      color: #95a5a6;
      cursor: pointer;
      .ebook-popup-item-text {
        flex: 1;
        font-size: px2rem(14);
        text-align: left;
        &.isSelected {
          color: #3498db;
          font-weight: 600;
        }
      }
    }
    .ebook-popup-item-check {
      flex: 1;
      font-size: px2rem(14);
      text-align: right;
      .icon-check {
        color: #3498db;
        font-weight: bold;
      }
    }
  }
}
</style>
