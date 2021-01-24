<template>
  <transition name="fade">
    <div class="dialog" v-show="visible">
      <div class="dialog-wrapper">
        <div class="dialog-title-wrapper">
          <span class="dialog-title-text">{{title}}</span>
        </div>
        <slot></slot>
        <div class="dialog-btn-wrapper">
          <slot name="btn">
            <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
            <div class="dialog-btn">{{$t('shelf.confirm')}}</div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue'
export default {
  props: {
    title: String
  },
  setup() {
    const visible = ref(false)
    const show = () => {
      visible.value = true
    }
    const hide = () => {
      visible.value = false
    }
    return {
      visible,
      show,
      hide
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/global.scss';

.dialog {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  font-size: px2rem(16);
  color: #333;
  @include center;
  .dialog-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 50%;
    max-height: 60%;
    background: white;
    border-radius: px2rem(10);
    .dialog-title-wrapper {
      font-size: px2rem(18);
      font-weight: bold;
      text-align: center;
      padding: px2rem(20) 0 0;
    }
    .dialog-btn-wrapper {
      display: flex;
      width: 100%;
      background: $color-blue;
      font-size: px2rem(14);
      font-weight: bold;
      color: white;
      text-align: center;
      padding: px2rem(15) 0;
      letter-spacing: px2rem(6);
      box-sizing: border-box;
      border-radius: 0 0 px2rem(10) px2rem(10);
      cursor: pointer;
      .dialog-btn {
        flex: 1;
        &.is-empty {
          color: rgba(255, 255, 255, 0.5);
        }
        &:active {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}
</style>
