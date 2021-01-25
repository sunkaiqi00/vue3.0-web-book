<template>
  <div class="popup" v-if="popupVisible">
    <transition name="fade">
      <div class="popup-bg" @click.prevent="hide" v-if="popupVisible"></div>
    </transition>
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-show="visible">
        <div class="popup-title" v-if="title">{{title}}</div>
        <div
          class="popup-btn"
          v-for="(item,index) in btn"
          :key="index"
          :class="{'danger' : item.type === 'danger'}"
          @click="item.click"
        >{{item.text}}</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'Popup',
  props: {
    title: String,
    btn: Array
  },
  setup() {
    const popupVisible = ref(false) // popup 组件隐藏
    const visible = ref(false) // popup 底部控件隐藏
    const hide = () => {
      visible.value = false
      setTimeout(() => {
        popupVisible.value = false
      }, 200)
    }
    const show = () => {
      popupVisible.value = true
      setTimeout(() => {
        visible.value = true
      }, 17)
    }
    return {
      popupVisible,
      visible,
      hide,
      show
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';

.popup {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  margin: auto;
  .popup-bg {
    width: 100%;
    height: 100%;
  }
  .popup-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 500;
    width: 100%;
    background: #fff;
    .popup-title {
      width: 100%;
      padding: px2rem(20) 0;
      border-bottom: pz2rem(1) soli #eee;
      font-size: px2rem(12);
      line-height: px2rem(16);
      box-sizing: border-box;
      color: #999;
      text-align: center;
      @include center;
    }
    .popup-btn {
      width: 100%;
      height: px2rem(60);
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(16);
      color: #666;
      font-weight: bold;
      cursor: pointer;
      @include center;
      &.danger {
        color: #e74c3c;
      }
    }
  }
}
</style>
