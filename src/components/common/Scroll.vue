<template>
  <div
    class="scroll-wrapper"
    :class="{'no-scroll': ifScroll}"
    @scroll.passive="handleScroll"
    ref="scrollWrapper"
  >
    <slot></slot>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { realPx } from '@/utils/utils'
export default {
  name: 'Scroll',
  props: {
    top: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: 0
    },
    ifScroll: {
      type: Boolean,
      default: false
    }
  },
  emits: ['onScroll'],
  setup(props, ctx) {
    const scrollWrapper = ref(null)
    const handleScroll = e => {
      const offsetY =
        e.target.scrollTop || window.pageYOffset || document.body.scrollTop
      ctx.emit('onScroll', offsetY)
    }
    const scrollTo = (x, y) => {
      scrollWrapper.value.scrollTo(x, y)
    }
    const refresh = () => {
      if (scrollWrapper.value) {
        scrollWrapper.value.style.height =
          window.innerHeight - realPx(props.top) - realPx(props.bottom) + 'px'
        scrollWrapper.value.addEventListener('scroll', handleScroll)
      }
    }
    onMounted(() => {
      refresh()
    })
    return {
      handleScroll,
      scrollTo,
      scrollWrapper,
      refresh
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.scroll-wrapper {
  position: relative;
  z-index: 100;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  &.no-scroll {
    overflow: hidden;
  }
}
</style>
