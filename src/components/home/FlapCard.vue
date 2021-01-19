<template>
  <transition name="flap-scale">
    <div class="flap-card-wrapper" v-show="flapCardVisible">
      <div class="flap-card-bg" :class="{'animation-scale':showFlapCardAnimation}">
        <div
          class="flap-card"
          v-for="(item,index) of flapCardList"
          :key="index"
          :style="{zIndex:item.zIndex}"
        >
          <div class="flap-card-circle">
            <div
              class="flap-card-semi-circle flap-card-semi-circle-left"
              :style="semiCircleStyle(item,'left')"
              :ref="setCardLeft"
            ></div>
            <div
              class="flap-card-semi-circle flap-card-semi-circle-right"
              :style="semiCircleStyle(item,'right')"
              :ref="setCardRight"
            ></div>
          </div>
        </div>
        <div class="point-wrapper">
          <div
            class="point"
            v-for="item of pointList"
            :key="item"
            :class="{'animation-move':showPointAnimation}"
          ></div>
        </div>
      </div>
      <div class="close-btn-wrapper" @click="closeFlapCard">
        <span class="icon-close"></span>
      </div>
    </div>
  </transition>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import useHomeStore from '../../hooks/useHomeStore'
import _flapCardList from '../../utils/flapCard'
export default {
  name: 'FlapCard',
  setup() {
    const { flapCardVisible, _setFlapCardVisible } = useHomeStore()
    const flapCardList = ref(_flapCardList)
    const cardLeft = [] // 左半圆dom集合
    const cardRight = [] // 右半圆dom集合
    const frontCard = ref(0) // 前 卡片
    const backCard = ref(1) // 后 卡片
    const showFlapCardAnimation = ref(false) // 卡片放大动画显示
    const showPointAnimation = ref(false) // 烟花移动 动画显示
    const pointList = ref([]) // 小球个数
    let flapCardTimer = null
    watch(flapCardVisible, visible => {
      if (visible) {
        showFlapCardAnimation.value = true
        setTimeout(() => {
          startFlapCardAnimation()
          pointAnimation()
        }, 300)
      }
    })
    // 关闭按钮
    const closeFlapCard = () => {
      _setFlapCardVisible(false)
      showFlapCardAnimation.value = false
      showPointAnimation.value = false
      stopFlapCardAnimation()
    }
    // 烟花动画执行
    const pointAnimation = () => {
      showPointAnimation.value = true
      // 烟花动画执行完毕 清楚动画类样式
      setTimeout(() => {
        showPointAnimation.value = false
      }, 750)
    }

    // 开始卡片旋转动画
    const startFlapCardAnimation = () => {
      prepare()
      flapCardTimer = setInterval(() => {
        flapCardRotate()
      }, 30)
      // 2.5秒 停止卡片动画
      setTimeout(() => {
        stopFlapCardAnimation()
      }, 2500)
    }
    // 停止卡片动画
    const stopFlapCardAnimation = () => {
      showFlapCardAnimation.value = false
      if (flapCardTimer) {
        clearInterval(flapCardTimer)
      }
      resetFlapCard()
    }
    // 重置所有卡片
    const resetFlapCard = () => {
      frontCard.value = 0
      backCard.value = 1
      flapCardList.value.forEach((item, index) => {
        item.zIndex = 100 - index
        item.rotateDegree = 0
        item._g = item.g
        rotate(index, 'front')
        rotate(index, 'back')
      })
    }
    // 左半圆dom集合
    const setCardLeft = el => {
      if (cardLeft.length === 5) return
      cardLeft.push(el)
    }
    // 右半圆dom集合
    const setCardRight = el => {
      if (cardRight.length === 5) return
      cardRight.push(el)
    }
    // 定义 左/右 半圆的 颜色 背景图片 backgroundSize
    const semiCircleStyle = (item, location) => {
      return {
        backgroundColor: `rgba(${item.r},${item.g},${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: location === 'left' ? item.imgLeft : item.imgRight
      }
    }
    // 下一组卡片开始动画
    const next = () => {
      // 将当前这一组的转到角度 _g 还原
      const frontFlapCard = flapCardList.value[frontCard.value]
      const backFlapCard = flapCardList.value[backCard.value]
      frontFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard.rotateDegree = 0
      backFlapCard._g = backFlapCard.g
      // 旋转
      rotate(frontCard.value, 'front')
      rotate(backCard.value, 'back')
      // 切换下一组
      frontCard.value++
      backCard.value++
      // 不能大于
      const len = flapCardList.value.length
      if (frontCard.value >= len) {
        frontCard.value = 0
      }
      if (backCard.value >= len) {
        backCard.value = 0
      }
      // 动态设置zIndex
      // 100 -> 96   100 - (0 - 1 + 5) % 5 = 96
      // 99 -> 100   100 - (1 - 1 + 5) % 5 = 100
      // 98 -> 99    100 - (2 - 1 + 5) % 5 = 99
      // 97 -> 98    100 - (3 - 1 + 5) % 5 = 98
      // 96 -> 97    100 - (4 - 1 + 5) % 5 = 97
      flapCardList.value.forEach((item, index) => {
        item.zIndex = 100 - ((index - frontCard.value + len) % len)
      })
      prepare()
    }
    // 当前一组 前面旋转的卡片后面的卡片先旋转180度 背靠背
    const prepare = () => {
      const backFlapCard = flapCardList.value[backCard.value]
      backFlapCard.rotateDegree = 180
      // 因为在后面转动时他的颜色需要怎加颜色变浅 先让其减少要增加的值(_g每次加5，旋转角度每次改变10度)
      backFlapCard._g = backFlapCard.g - 5 * 9
      rotate(backCard.value, 'back')
    }
    // 当前 frontCard backCard指向的卡片做动画
    const flapCardRotate = () => {
      const frontFlapCard = flapCardList.value[frontCard.value]
      const backFlapCard = flapCardList.value[backCard.value]
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      backFlapCard.rotateDegree -= 10
      // 当后面的转到90度 要显示时再让 _g开始减少颜色变浅
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5
      }
      if (
        frontFlapCard.rotateDegree === 90 &&
        backFlapCard.rotateDegree === 90
      ) {
        backFlapCard.zIndex += 2
      }
      rotate(frontCard.value, 'front')
      rotate(backCard.value, 'back')
      // 上面的卡片的右半圆转到180度  下面卡片的左半圆转到0度(因为他提前转到180 减) 进行下一轮卡片旋转
      if (
        frontFlapCard.rotateDegree === 180 &&
        backFlapCard.rotateDegree === 0
      ) {
        next()
      }
    }
    // 旋转函数
    const rotate = (index, type) => {
      const item = flapCardList.value[index]
      let cardDom
      if (type === 'front') {
        cardDom = cardRight[index]
      } else {
        cardDom = cardLeft[index]
      }
      cardDom.style.transform = `rotateY(${item.rotateDegree}deg)`
      cardDom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`
    }
    onMounted(() => {
      for (let i = 0; i < 18; i++) {
        pointList.value.push(`point${i}`)
      }
    })
    return {
      flapCardVisible,
      setCardLeft,
      setCardRight,
      flapCardList,
      closeFlapCard,
      semiCircleStyle,
      showFlapCardAnimation,
      pointList,
      showPointAnimation
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
@import '@/assets/css/flapCard.scss';
.flap-card-wrapper {
  @include absCenter;
  width: 100%;
  height: 100%;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
  max-width: 640px;
  min-width: 200px;
  @include center;
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: px2rem(100);
    z-index: 210;
    width: 100%;
    cursor: pointer;
    @include center;
    .icon-close {
      width: px2rem(45);
      height: px2rem(45);
      font-size: px2rem(25);
      border-radius: 50%;
      background: #333;
      color: #fff;
      @include center;
    }
  }
  .flap-card-bg {
    position: relative;
    width: px2rem(84);
    height: px2rem(84);
    border-radius: px2rem(10);
    background: #fff;
    transform: scale(0);
    opacity: 0;
    &.animation-scale {
      animation: flap-card-move 0.3s ease-in forwards;
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flap-card {
      width: px2rem(58);
      height: px2rem(58);
      @include absCenter;
      .flap-card-circle {
        width: 100%;
        height: 100%;
        display: flex;
        .flap-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          backface-visibility: hidden;
        }
        .flap-card-semi-circle-left {
          border-radius: px2rem(29) 0 0 px2rem(29);
          background-position: center right;
          transform-origin: right;
        }
        .flap-card-semi-circle-right {
          border-radius: 0 px2rem(29) px2rem(29) 0;
          background-position: center left;
          transform-origin: left;
        }
      }
    }
    .point-wrapper {
      @include absCenter;
      z-index: 200;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation-move {
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
}
</style>
