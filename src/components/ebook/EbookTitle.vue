<template>
  <!-- 顶部菜单 -->
  <transition name="slide-down">
    <div class="title-wrapper" v-show="menuVisible">
      <div class="left">
        <div class="icon-back icon" @click="back"></div>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <router-link @click.stop to="/store/shelf" class="icon-shelf icon"></router-link>
        </div>
        <div class="icon-wrapper">
          <div class="icon-cart icon"></div>
        </div>
        <div class="icon-wrapper">
          <div class="icon-more icon"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import useBookStore from '@/hooks/useBookStore'
import { useRouter } from 'vue-router'
export default {
  name: 'EbookTitle',
  setup() {
    const { menuVisible } = useBookStore()
    const router = useRouter()
    const back = () => {
      router.go(-1)
    }

    return {
      back,
      menuVisible
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.title-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: px2rem(48);
  z-index: 160;
  background: white;
  box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, 0.15);
  display: flex;
  .left {
    flex: 0 0 px2rem(60);
    @include center;
    .icon-back {
      font-size: px2rem(20);
      margin-left: px2rem(-5);
    }
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .icon-wrapper {
      flex: 0 0 px2rem(40);
      font-size: px2rem(20);
    }
  }
}
.icon-shelf {
  text-decoration: none;
}
</style>
