<template>
  <div class="shelf-list" :style="{top: shelfListTop}">
    <transition-group name="list" tag="div" id="shelf-list">
      <div
        class="shelf-list-item-wrapper"
        v-for="item in bookList"
        :key="item.id"
        :class="{'f-start':item.type===3}"
      >
        <div class="shelf-item-wrapper">
          <shelf-item :data="item"></shelf-item>
          <div class="shelf-list-title-wrapper">
            <span class="shelf-list-title title-small">{{item.title}}</span>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { computed } from 'vue'
import { px2rem } from '@/utils/utils'
import ShelfItem from './ShelfItem.vue'
export default {
  name: 'ShelfList',
  props: {
    top: {
      type: Number,
      default: 94
    },
    bookList: Array
  },
  components: {
    ShelfItem
  },
  setup(props) {
    const shelfListTop = computed(() => px2rem(props.top) + 'rem')

    return {
      shelfListTop
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';

.shelf-list {
  position: absolute;
  // top: px2rem(94);
  left: 0;
  z-index: 100;
  width: 100%;
  #shelf-list {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .shelf-list-item-wrapper {
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: px2rem(15);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      &.f-start {
        // @include top;
        padding-bottom: px2rem(40);
        box-sizing: border-box;
      }
      &.list-leave-active {
        display: none;
      }
      &.list-move {
        transition: transform 0.5s;
      }
      .shelf-item-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .shelf-list-title-wrapper {
        margin-top: px2rem(10);
        text-align: center;
      }
    }
  }
}
</style>
