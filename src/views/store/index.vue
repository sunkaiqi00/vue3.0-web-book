<template>
  <div class="store">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Store'
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.store {
  width: 100%;
  height: 100%;
  background: #ffffff;
  @include max_min_width_abscenter;
}
</style>
