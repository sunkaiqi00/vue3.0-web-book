<template>
  <transition name="fade">
    <div
      class="shelf-title"
      :class="{'title-shadow' : ifHideTitleShadow}"
      v-show="shelfTitleVisible"
    >
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-left" @click="clearCache" v-show="showClear">
        <span class="shelf-title-btn-text">{{$t('shelf.clearCache')}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-right" v-if="showEdit">
        <span
          class="shelf-title-btn-text"
          @click="onEditClick"
        >{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-left" @click="back" v-show="showBack">
        <span class="icon-back"></span>
      </div>
      <div
        class="shelf-title-btn-text"
        :class="{'shelf-title-left':changeGroupLeft,'shelf-title-right':changeGroupRight}"
        v-if="showChangeGroupLeft"
      >
        <span class="shelf-title-btn-text" @click="changeGroup">{{$t('shelf.editGroup')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import useHomeStore from '../../hooks/useHomeStore'
export default {
  name: 'ShelfTitle',
  props: {
    title: String
  },
  setup() {
    const {
      offsetY,
      shelfCategory,
      isEditMode,
      currentType,
      shelfSelected,
      shelfTitleVisible,
      _setIsEditMode,
      _setShelfSelected,
      _setShelfList,
      shelfList
    } = useHomeStore()
    const instance = ref(null)
    const ifHideTitleShadow = ref(true) // 隐藏阴影
    const emptyCategory = computed(() => {
      return (
        !shelfCategory.value ||
        !shelfCategory.value.itemList ||
        shelfCategory.value.itemList.length === 0
      )
    })
    const showEdit = computed(
      () => currentType.value === 1 || !emptyCategory.value
    )
    const showClear = computed(() => currentType.value === 1)
    const showBack = computed(
      () => currentType.value === 2 && !isEditMode.value
    )
    const showChangeGroupLeft = computed(
      () => currentType.value === 2 && (isEditMode.value || emptyCategory.value)
    )
    const changeGroupLeft = computed(() => emptyCategory.value)
    const changeGroupRight = computed(() => emptyCategory.value)
    const selectedText = computed(() => {
      const selectNumber = shelfSelected.value ? shelfSelected.value.length : 0
      if (instance.value) {
        if (selectNumber <= 0) {
          return instance.value.$t('shelf.selectBook')
        } else if (selectNumber === 1) {
          return instance.value
            .$t('shelf.haveSelectedBook')
            .replace('$1', selectNumber)
        } else {
          return instance.value
            .$t('shelf.haveSelectedBooks')
            .replace('$1', selectNumber)
        }
      }
    })
    const clearCache = () => {
      console.log('clear')
    }
    const onEditClick = () => {
      _setIsEditMode(!isEditMode.value)
      // 取消编辑  选着数组清空 书架选中状态还原
      if (!isEditMode.value) {
        _setShelfSelected([])
        _setShelfList(
          shelfList.value.map(item => {
            item.selected = false
            return item
          })
        )
      }
    }
    const changeGroup = () => {
      console.log('changegroup')
    }
    const back = () => {
      console.log('back')
    }
    watch(offsetY, y => {
      if (y > 0) {
        ifHideTitleShadow.value = false
      } else {
        ifHideTitleShadow.value = true
      }
    })
    onMounted(() => {
      const { ctx } = getCurrentInstance()
      instance.value = ctx
    })
    return {
      ifHideTitleShadow,
      emptyCategory,
      showEdit,
      showClear,
      showBack,
      showChangeGroupLeft,
      changeGroupLeft,
      changeGroupRight,
      selectedText,
      shelfTitleVisible,
      isEditMode,
      clearCache,
      onEditClick,
      changeGroup,
      back
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';

.shelf-title {
  position: relative;
  width: 100%;
  height: px2rem(42);
  z-index: 120;
  background: #fff;
  box-shadow: 0 px2rem(2) px2rem(2) rgba(0, 0, 0, 0.1);
  &.title-shadow {
    box-shadow: none;
  }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    @include columnCenter;
    .shelf-title-text {
      font-size: px2rem(18);
      line-height: px2rem(20);
      color: #333;
      font-weight: bold;
    }
    .shelf-title-sub-text {
      font-size: px2rem(10);
      color: #333;
      margin-top: px2rem(1);
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    top: 0;
    height: 100%;
    box-sizing: border-box;
    cursor: pointer;
    @include center;
    .icon-back {
      font-size: px2rem(20);
      color: #666;
    }
    .shelf-title-btn-text {
      font-size: px2rem(14);
      color: #666;
    }
    &.shelf-left {
      left: 0;
      padding-left: px2rem(15);
    }
    &.shelf-right {
      right: 0;
      padding-right: px2rem(15);
    }
  }
  .shelf-title-left {
    position: absolute;
    padding-left: px2rem(15);
    font-size: px2rem(14);
    color: #666;
    height: 100%;
    @include center;
  }
  .shelf-title-right {
    position: absolute;
    right: 0;
    height: 100%;
    padding-right: px2rem(15);
    font-size: px2rem(14);
    @include center;
  }
}
</style>
