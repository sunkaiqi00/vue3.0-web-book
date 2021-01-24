<template>
  <ebook-dialog :title="title" ref="dialongRef">
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <template v-for="(item, index) in categoryList">
        <div
          class="dialog-list-item"
          :class="{'is-add': item.edit  ? item.edit === 1 : false}"
          :key="index"
          @click="onGroupClick(item)"
          v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit"
        >
          <div class="dialog-list-item-text">{{item.title}}</div>
          <div class="dialog-list-icon-wrapper" v-if="isInGroup">
            <span class="icon-check"></span>
          </div>
        </div>
      </template>
    </div>
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{$t('shelf.groupName')}}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput" />
          <div
            class="dialog-input-clear-wrapper"
            @click="clear"
            v-show="newGroupName && newGroupName.length > 0"
          >
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <template v-slot:btn>
      <div class="group-dialog-btn-wrapper">
        <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
        <div
          class="dialog-btn"
          @click="createNewGroup"
          :class="{'is-empty':!newGroupName}"
          :disabled="!newGroupName"
          v-if="ifNewGroup"
        >{{$t('shelf.confirm')}}</div>
      </div>
    </template>
  </ebook-dialog>
  <toast :text="toastText" ref="toastRef"></toast>
</template>

<script>
/* eslint-disable no-unused-vars */

import { saveBookShelf } from '@/utils/localStorage'
import useTypeThreeAddbookToShelf from '../../hooks/useTypeThreeAddbookToShelf'
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import useHomeStore from '../../hooks/useHomeStore'
import EbookDialog from '@/components/common/Dialog'
import Toast from '../common/Toast.vue'

export default {
  name: 'ShelfGroupDialog',
  components: {
    EbookDialog,
    Toast
  },
  props: {
    showNewGroup: {
      type: Boolean,
      default: false
    },
    groupName: String
  },
  setup(props) {
    // eslint-disable-next-line comma-spacing
    const {
      currentType,
      shelfList,
      _setIsEditMode,
      shelfSelected,
      _setShelfList,
      _setShelfSelected
    } = useHomeStore()
    const toastText = ref('') // toast 提示信息
    const toastRef = ref(null) // toast 组件
    const dialongRef = ref(null)
    const instance = ref(null)
    const ifNewGroup = ref(false)
    const newGroupName = ref('')
    const category = ref()
    const categoryList = ref()
    const defaultCategory = ref()
    const title = ref()
    const isInGroup = computed(() => currentType.value === 2)
    const initData = () => {
      category.value = shelfList.value.filter(item => item.type === 2)
      /* eslint-disable indent */
      defaultCategory.value = instance.value
        ? [
            {
              title: instance.value.$t('shelf.newGroup'),
              edit: 1
            },
            {
              title: instance.value.$t('shelf.groupOut'),
              edit: 2
            }
          ]
        : []

      title.value = ifNewGroup.value
        ? instance.value.$t('shelf.newGroup')
        : instance.value.$t('shelf.moveBook')
      categoryList.value = [...defaultCategory.value, ...category.value]
    }
    const showToast = text => {
      toastText.value = text
      toastRef.value.show()
    }
    const publicReset = () => {
      newGroupName.value = ''
      saveBookShelf(shelfList.value)
      hide()
      _setIsEditMode(false)
      _setShelfSelected([])
      _setShelfList(
        shelfList.value.map(item => {
          item.selected = false
          return item
        })
      )
    }
    const show = () => {
      dialongRef.value.show()
    }
    const hide = () => {
      dialongRef.value.hide()
      setTimeout(() => {
        ifNewGroup.value = false
      }, 200)
    }
    const clear = () => {
      newGroupName.value = ''
    }
    const onGroupClick = item => {
      if (item.edit && item.edit === 1) {
        // 新建分组
        ifNewGroup.value = true
      } else if (item.edit && item.edit === 2) {
        // 移出分组
        console.log(item)
      } else {
        // 移入某个分组
        selectedBookMoveToCategoryGroup(item)
      }
    }
    // 移动到其他分组
    const selectedBookMoveToCategoryGroup = group => {
      _setShelfList(
        shelfList.value.filter(book => {
          if (book.itemList) {
            book.itemList = book.itemList.filter(subBook => {
              return shelfSelected.value.indexOf(subBook) < 0
            })
          }
          return shelfSelected.value.indexOf(book) < 0
        })
      ).then(() => {
        if (group && group.itemList) {
          group.itemList = [...group.itemList, ...shelfSelected.value]
        }
        group.itemList.forEach((item, index) => {
          item.id = index + 1
        })
        showToast(
          instance.value
            .$t('shelf.moveBookInSuccess')
            .replace('$1', group.title)
        )
        publicReset()
      })
    }
    // 移除分组
    const moveOutFromGroup = item => {
      console.log(item)
    }
    // 创建分组
    const createNewGroup = () => {
      if (!newGroupName.value || newGroupName.value.length === 0) return
      const group = {
        id: shelfList.value[shelfList.value.length - 2].id + 1,
        itemList: [],
        selected: false,
        title: newGroupName.value,
        type: 2
      }
      let list = shelfList.value
      list.push(group)
      list = useTypeThreeAddbookToShelf(list)
      _setShelfList(list)
      selectedBookMoveToCategoryGroup(group)
      initData()
    }
    onMounted(() => {
      const { ctx } = getCurrentInstance()
      instance.value = ctx
      setTimeout(() => {
        initData()
      }, 17)
    })
    return {
      ifNewGroup,
      newGroupName,
      isInGroup,
      categoryList,
      title,
      dialongRef,
      onGroupClick,
      clear,
      hide,
      show,
      createNewGroup,
      toastText,
      toastRef
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/global.scss';

.dialog-list-wrapper {
  width: 100%;
  padding: px2rem(10) px2rem(20);
  box-sizing: border-box;
  font-size: px2rem(14);
  @include scroll;
  .dialog-list-item {
    display: flex;
    line-height: px2rem(35);
    box-sizing: border-box;
    color: #666;
    cursor: pointer;
    &.is-add {
      color: $color-blue;
      &:active {
        color: $color-blue-transparent;
      }
    }
    &:active {
      color: rgba(102, 102, 102, 0.5);
    }
    .dialog-list-item-text {
      flex: 1;
    }
    .dialog-list-icon-wrapper {
      flex: 0 0 px2rem(30);
      color: $color-blue;
      @include right;
    }
  }
}

.dialog-new-group-wrapper {
  width: 100%;
  padding: 0 px2rem(20);
  box-sizing: border-box;
  .dialog-input-title-wrapper {
    font-size: px2rem(15);
    margin-top: px2rem(10);
  }
  .dialog-input-wrapper {
    width: 100%;
    padding: 0 0 px2rem(24) 0;
    box-sizing: border-box;
    .dialog-input-inner-wrapper {
      display: flex;
      width: 100%;
      padding: px2rem(16) 0 0;
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #ccc;
      font-size: px2rem(14);
      color: #666;
      .dialog-input {
        flex: 1;
        font-size: px2rem(13);
        line-height: px2rem(26);
        border: none;
        color: #333;
        &:focus {
          outline: none;
        }
      }
      .dialog-input-clear-wrapper {
        flex: 0 0 px2rem(30);
        color: #ccc;
        @include center;
        &:active {
          color: #999;
        }
      }
    }
  }
}

.group-dialog-btn-wrapper {
  width: 100%;
  @include center;
}
.dialog-btn {
  flex: 1;
  cursor: pointer;
  &.is-empty {
    color: rgba(255, 255, 255, 0.5);
  }
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
