<template>
  <div class="ebook-header">
    <span class="ebook-header-text">{{useGetSectionName}}</span>
  </div>
</template>

<script>
import useGetSectionName from '@/hooks/useGetSectionName'
export default {
  name: 'EbookHeader',
  setup() {
    return {
      useGetSectionName
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.ebook-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: px2rem(48);
  padding: 0 px2rem(15);
  box-sizing: border-box;
  overflow: hidden;
  @include left;
  .ebook-header-text {
    font-size: px2rem(12);
    color: #6d7178;
    @include ellipsis();
  }
}
</style>
