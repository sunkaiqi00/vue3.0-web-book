<template>
  <transition name="slide-up">
    <div
      class="menu-wrapper"
      :class="{'hide-box-shadow': !menuVisible || settingVisible >= 0}"
      v-show="menuVisible"
    >
      <div class="icon-wrapper">
        <div class="icon-menu icon" @click="showSetting(3)"></div>
      </div>
      <div class="icon-wrapper">
        <div class="icon-progress icon" @click="showSetting(2)"></div>
      </div>
      <div class="icon-wrapper">
        <div class="icon-bright icon" @click="showSetting(1)"></div>
      </div>
      <div class="icon-wrapper">
        <div class="icon-A icon" @click="showSetting(0)"></div>
      </div>
    </div>
  </transition>
  <ebook-setting-font></ebook-setting-font>
  <ebook-setting-font-popup></ebook-setting-font-popup>
  <ebook-setting-theme></ebook-setting-theme>
  <ebook-setting-progress></ebook-setting-progress>
  <ebook-slide></ebook-slide>
</template>

<script>
import useBookStore from '@/hooks/useBookStore'
import EbookSettingFont from './EbookSettingFont.vue'
import EbookSettingFontPopup from './EbookSettingFontPopup.vue'
import EbookSettingTheme from './EbookSettingTheme.vue'
import EbookSettingProgress from './EbookSettingProgress.vue'
import EbookSlide from './EbookSlide.vue'
export default {
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  },
  name: 'EbookMenu',
  setup() {
    const { menuVisible, settingVisible, _setSettingVisible } = useBookStore()
    // 显示对应设置控件面板
    const showSetting = key => {
      _setSettingVisible(key)
    }
    return {
      showSetting,
      menuVisible,
      settingVisible
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.menu-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: px2rem(48);
  z-index: 170;
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  display: flex;
  &.hide-box-shadow {
    box-shadow: none;
  }
  .icon-wrapper {
    flex: 1;
    @include center;
    font-size: px2rem(21);
    .icon-progress {
      font-size: px2rem(24);
    }
  }
}
</style>
