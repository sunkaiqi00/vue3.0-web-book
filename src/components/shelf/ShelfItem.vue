
<template>
  <div
    class="shelf-item"
    :class="{'item-shadow' : data.type === 1 || data.type === 2}"
    @click="onItemClick"
  >
    <component
      :is="isComponent"
      :data="bookObj"
      :class="{'is-edit' : isEditMode && data.type === 2}"
    ></component>
    <div
      :class="{'icon-selected' : data.type === 1,'is-selected' : data.selected}"
      v-show="isEditMode"
    ></div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import useshowBookDetail from '../../hooks/useshowBookDetail'
import useHomeStore from '../../hooks/useHomeStore'
import ShelfItemBook from './ShelfItemBook.vue'
import ShelfItemCategory from './ShelfItemCategory.vue'
import ShelfItemAdd from './ShelfItemAdd.vue'

export default {
  name: 'ShelfItem',
  props: {
    data: Object
  },
  setup(props) {
    const router = useRouter()
    // eslint-disable-next-line no-unused-vars
    const { isEditMode, shelfSelected, _setShelfSelected } = useHomeStore()
    const bookObj = ref(props.data) // 书架每一本书或一个分类的信息
    const BookImage = ShelfItemBook // ShelfItemBook 组件
    const BookCategory = ShelfItemCategory // ShelfItemCategory 组件
    const BookAdd = ShelfItemAdd // ShelfItemAdd 组件
    // 根据type渲染到对应的组件(1.图书封面  2.分类  3.添加)
    const isComponent = computed(() => {
      if (bookObj.value.type === 1) {
        return BookImage
      } else if (bookObj.value.type === 2) {
        return BookCategory
      } else {
        return BookAdd
      }
    })

    const onItemClick = () => {
      let shelfBookSelecred = shelfSelected.value
      if (isEditMode.value) {
        if (bookObj.value.type === 1) {
          bookObj.value.selected = !bookObj.value.selected
          if (bookObj.value.selected) {
            shelfBookSelecred.push(bookObj.value)
          } else {
            shelfBookSelecred = shelfBookSelecred.filter(
              book => book.id !== bookObj.value.id
            )
          }
        }
        _setShelfSelected(shelfBookSelecred)
      } else {
        if (bookObj.value.type === 1) {
          useshowBookDetail(bookObj.value)
        } else if (bookObj.value.type === 2) {
          console.log(bookObj.value)
        } else {
          router.push('/store/home')
        }
      }
    }
    return {
      bookObj,
      isEditMode,
      isComponent,
      onItemClick
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';

.shelf-item {
  position: relative;
  width: px2rem(93);
  height: px2rem(132);
  background: #fff;
  cursor: pointer;
  &.item-shadow {
    box-shadow: 0 0 px2rem(10) rgba(0, 0, 0, 0.3);
  }
  .is-edit {
    opacity: 0.5;
  }
  .icon-selected {
    position: absolute;
    right: px2rem(2);
    bottom: px2rem(2);
    font-size: px2rem(16);
    color: rgba(255, 255, 255, 0.3);
    &.is-selected {
      color: $color-blue;
    }
  }
}
</style>
