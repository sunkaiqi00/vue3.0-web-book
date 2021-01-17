<template>
  <div class="book-mark" :style="markStyle" ref="bookMark"></div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { px2rem } from '@/utils/utils'
export default {
  name: 'BookMark',
  props: {
    width: Number,
    height: Number,
    color: String
  },
  setup(props) {
    const bookMark = ref(null)
    const markStyle = computed(() => {
      if (props.color) {
        return {
          borderColor: `${props.color} ${props.color} transparent ${props.color}`
        }
      } else {
        return {}
      }
    })

    const resetSize = () => {
      if (props.width && props.height && bookMark.value) {
        bookMark.value.style.borderWidth = `
          ${px2rem(props.height)}rem 
          ${px2rem(props.width)}rem 
          ${px2rem(props.width)}rem 
          ${px2rem(props.width)}rem
        `
      }
    }

    onMounted(() => {
      resetSize()
    })
    return {
      bookMark,
      markStyle
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.book-mark {
  width: 0;
  height: 0;
  border-width: px2rem(40) px2rem(10) px2rem(10) px2rem(10);
  border-style: solid;
  border-color: #bdc3c7 #bdc3c7 transparent #bdc3c7;
}
</style>
