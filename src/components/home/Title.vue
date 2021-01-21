<template>
  <div class="home-title-wrapper">
    <div class="label">{{label}}</div>
    <div class="btn" @click="btnClick">{{btn}}</div>
  </div>
</template>

<script >
export default {
  props: {
    label: String,
    btn: String
  },
  emits: ['onClick'],
  setup(props, ctx) {
    const btnClick = () => {
      ctx.emit('onClick')
    }
    return {
      btnClick
    }
  }
}
</script>

<style lang="scss"  scoped>
@import '@/assets/css/global.scss';
.home-title-wrapper {
  width: 100%;
  padding: px2rem(15) px2rem(10);
  box-sizing: border-box;
  @include top;
  .label {
    flex: 1;
    font-size: px2rem(16);
    color: #333;
    font-weight: bold;
  }
  .btn {
    font-size: px2rem(12);
    color: rgba(64, 158, 255, 1);
    cursor: pointer;
    &:active {
      color: rgba(64, 158, 255, 0.5);
    }
  }
}
</style>
