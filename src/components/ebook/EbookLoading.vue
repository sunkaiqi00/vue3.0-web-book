<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item,index) in line" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem,subIndex) in item" :key="subIndex">
          <div class="ebook-loading-line" :ref="setLineRef"></div>
          <div class="ebook-loading-mask" :ref="setMaskRef"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, onMounted, ref } from 'vue'
import { px2rem } from '@/utils/utils'
export default {
  name: 'EbookLoading',
  setup() {
    const line = [
      [{}, {}, {}],
      [{}, {}, {}]
    ]
    const maskWidthList = [
      { value: 0 },
      { value: 0 },
      { value: 0 },
      { value: 0 },
      { value: 0 },
      { value: 0 }
    ]
    const lineWidthList = [
      { value: 16 },
      { value: 16 },
      { value: 16 },
      { value: 16 },
      { value: 16 },
      { value: 16 }
    ]
    let add = true
    let end = false
    const lineRef = ref([])
    const maskRef = ref([])
    const setLineRef = el => {
      lineRef.value.push(el)
    }
    const setMaskRef = el => {
      maskRef.value.push(el)
    }
    let loadTimer = null
    const ebookLoading = () => {
      loadTimer = setInterval(() => {
        maskRef.value.forEach((item, index) => {
          if (!maskRef.value[index]) return
          const mask = maskRef.value[index]
          const line = lineRef.value[index]
          const maskWidth = maskWidthList[index]
          const lineWidth = lineWidthList[index]
          if (index === 0) {
            if (add && maskWidth.value < 16) {
              maskWidth.value++
              lineWidth.value--
            } else if (!add && lineWidth.value < 16) {
              maskWidth.value--
              lineWidth.value++
            }
          } else {
            if (add && maskWidth.value < 16) {
              const prevMaskWidth = maskWidthList[index - 1]
              if (prevMaskWidth.value >= 8) {
                maskWidth.value++
                lineWidth.value--
              }
            } else if (!add && lineWidth.value < 16) {
              const prevLineWidth = lineWidthList[index - 1]
              if (prevLineWidth.value >= 8) {
                maskWidth.value--
                lineWidth.value++
              }
            }
          }

          mask.style.width = `${px2rem(maskWidth.value)}rem`
          mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`
          line.style.width = `${px2rem(lineWidth.value)}rem`
          line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`

          if (index === maskWidthList.length - 1) {
            if (add) {
              if (maskWidth.value === 16) {
                end = true
              }
            } else {
              if (maskWidth.value === 0) {
                end = true
              }
            }
          }
          if (end) {
            add = !add
            end = false
          }
        })
      }, 17)
    }
    onMounted(() => {
      ebookLoading()
    })
    onBeforeMount(() => {
      if (loadTimer) clearInterval(loadTimer)
    })
    return {
      line,
      setLineRef,
      setMaskRef
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.ebook-loading {
  position: relative;
  z-index: 400;
  width: px2rem(63);
  height: px2rem(40);
  background: transparent;
  border: px2rem(1.5) solid #dfe4ea;
  border-radius: px2rem(5);
  .ebook-loading-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    .ebook-loading-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: px2rem(7) 0;
      box-sizing: border-box;
      .ebook-loading-line-wrapper {
        flex: 1;
        padding: 0 px2rem(7);
        box-sizing: border-box;
        @include left;
        .ebook-loading-line {
          flex: 0 0 px2rem(16);
          width: px2rem(16);
          height: px2rem(2);
          background: #dfe4ea;
        }
        .ebook-loading-mask {
          flex: 0 0 0;
          width: 0;
          height: px2rem(2);
        }
      }
    }
    .ebook-loading-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      width: px2rem(1.5);
      height: 100%;
      background: #dfe4ea;
    }
  }
}
</style>
