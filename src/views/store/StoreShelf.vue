<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/ShelfTitle.vue'
export default {
  name: 'StoreShelf',
  components: {
    ShelfTitle
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';

.store-shelf {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 100;
  min-width: 200px;
  max-width: 640px;
  margin: 0 auto;
  .shelf-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 110;
  }
}
</style>
