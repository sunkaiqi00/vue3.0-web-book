<template>
  <transition name="fade">
    <div class="toast-bg-wrapper" v-if="visible" @click.prevent ref="toast">
      <div class="toast-bg">
        <div class="toast-wrapper">
          <div class="toast">{{showText}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, ref } from 'vue'
export default {
  name: 'Toast',
  props: {
    text: [String, Number],
    timeout: {
      type: Number,
      default: 1500
    }
  },
  setup(props) {
    const visible = ref(false)
    let timer = null
    const showText = computed(() => props.text)
    const hide = () => {
      visible.value = false
    }

    const show = () => {
      clearTimeout(timer)
      visible.value = true
      timer = setTimeout(() => {
        visible.value = false
      }, props.timeout)
    }
    return {
      visible,
      hide,
      show,
      showText
    }
  }
}
</script>

<style lang="scss"  scoped>
@import '@/assets/css/global.scss';

.toast-bg-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 500;
  background: transparent;
  .toast-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2500;
    width: 100%;
    max-width: 500px;
    @include center;
    .toast-wrapper {
      width: 60%;
      line-height: px2rem(20);
      padding: px2rem(10) px2rem(20);
      box-sizing: border-box;
      background: #ecf0f1;
      border-radius: px2rem(10);
      font-size: px2rem(14);
      color: #2c3e50;
      box-shadow: 0 0 px2rem(10) rgba(0, 0, 0, 0.2);
      .toast {
        text-align: center;
        word-break: break-all;
      }
    }
  }
}
</style>
