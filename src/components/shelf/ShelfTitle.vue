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
        class="shelf-title-btn-wrapper"
        :class="{'shelf-title-left':changeGroupLeft,'shelf-title-right':changeGroupRight}"
        v-if="showChangeGroup"
      >
        <span class="shelf-title-btn-text" @click="changeGroup">{{$t('shelf.editGroup')}}</span>
      </div>
    </div>
  </transition>
  <toast :text="toastText" ref="toastRef"></toast>
  <popup :title="popupTitle" :btn="popupBtn" ref="popupRef"></popup>
  <shelf-group-dialog :showNewGroup="showNewGroup" :groupName="groupName" ref="groupDialongRef"></shelf-group-dialog>
</template>

<script>
/* eslint-disable no-unused-vars */
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  watch
} from 'vue'
import { useRouter } from 'vue-router'
import { clearLocalForage } from '@/utils/localForage'
import { clearLocalStorage, saveBookShelf } from '@/utils/localStorage'
import useHomeStore from '../../hooks/useHomeStore'
import useTypeThreeAddbookToShelf from '../../hooks/useTypeThreeAddbookToShelf'
import useComputedId from '../../hooks/useComputedId'
import Toast from '../common/Toast.vue'
import Popup from '../common/Popup.vue'
import ShelfGroupDialog from './ShelfGroupDialog.vue'
export default {
  name: 'ShelfTitle',
  props: {
    title: String
  },
  components: {
    Toast,
    Popup,
    ShelfGroupDialog
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
    const router = useRouter()
    const groupDialongRef = ref(null) // dialong 组件
    const showNewGroup = ref(false) // dialong  显示输入框
    const groupName = ref('') // 输入框文字
    const popupTitle = ref('') // popup title
    const popupBtn = ref([]) // popup btn数组
    const popupRef = ref(null) // popup 组件
    const instance = ref(null)
    const toastText = ref('')
    const toastRef = ref(null)
    const ifHideTitleShadow = ref(true) // 隐藏阴影

    const showClear = computed(() => currentType.value === 1)
    const showBack = computed(
      () => currentType.value === 2 && !isEditMode.value
    )
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
    const changeGroupLeft = ref(false)
    const changeGroupRight = ref(false)
    const showEdit = ref(true)
    const showChangeGroup = ref(false)
    watch(isEditMode, mode => {
      initData()
    })
    const initData = () => {
      const emptyCategory = computed(() => {
        return (
          !shelfCategory.value ||
          !shelfCategory.value.itemList ||
          shelfCategory.value.itemList.length === 0
        )
      })
      changeGroupLeft.value = !emptyCategory.value
      changeGroupRight.value = emptyCategory.value
      showEdit.value = currentType.value === 1 || !emptyCategory.value
      showChangeGroup.value =
        currentType.value === 2 && (isEditMode.value || emptyCategory.value)
    }
    // -----------------------------------------------------------------
    // 隐藏 底部菜单
    // eslint-disable-next-line no-unused-vars
    const hidePopup = () => {
      popupRef.value.hide()
    }
    // 传入 title 和 按钮 展示 popup组件
    const showPopup = (title, popupBtnList) => {
      popupTitle.value = title
      popupBtn.value = popupBtnList
      popupRef.value.show()
    }
    const showToast = text => {
      toastText.value = text
      toastRef.value.show()
    }
    const clearCache = () => {
      clearLocalForage()
      clearLocalStorage()
      showToast(instance.value.$t('shelf.clearCacheSuccess'))
      _setShelfList(useTypeThreeAddbookToShelf([]))
    }
    const onEditClick = () => {
      _setIsEditMode(!isEditMode.value)
      // 取消编辑  选着数组清空 书架选中状态还原
      if (!isEditMode.value) {
        _setShelfSelected([])
        _setShelfList(
          shelfList.value.map(item => {
            item.selected = false
            if (item.itemList) {
              item.itemList.forEach(item => {
                item.selected = false
              })
            }
            return item
          })
        )
      }
    }
    // ------------------------------------------------------------  修改分组、
    // 修改分组名
    const changeGroupName = () => {
      // console.log(shelfCategory.value)
      hidePopup()
      showNewGroup.value = true
      groupName.value = shelfCategory.value.title
      setTimeout(() => {
        groupDialongRef.value.show()
      }, 17)
    }
    const deleteGroup = () => {
      const list = shelfList.value.filter(item => {
        if (item.type === 2) {
          return item.title !== shelfCategory.value.title
        }
        return item
      })
      const arr = useTypeThreeAddbookToShelf([
        ...list,
        ...shelfCategory.value.itemList
      ])
      _setShelfList(useComputedId(arr)).then(() => {
        showToast(instance.value.$t('shelf.deleteGroup') + '成功')
        hidePopup()
        _setIsEditMode(false)
        saveBookShelf(shelfList.value)
        _setShelfSelected([])
        shelfList.value.map(item => {
          item.selected = false
          return item
        })
        setTimeout(() => {
          router.go(-1)
        }, 1500)
      })
    }
    // 删除分组
    const showDeleteGroup = () => {
      const title = instance.value.$t('shelf.deleteGroupTitle')
      const btnList = [
        {
          text: instance.value.$t('shelf.confirm'),
          click: () => {
            deleteGroup()
          },
          type: 'danger'
        },
        {
          text: instance.value.$t('shelf.cancel'),
          click: () => {
            hidePopup()
          }
        }
      ]
      showPopup(title, btnList)
    }
    // 修改分组
    const changeGroup = () => {
      const btnList = [
        {
          text: instance.value.$t('shelf.editGroupName'),
          click: () => {
            changeGroupName()
          }
        },
        {
          text: instance.value.$t('shelf.deleteGroup'),
          click: () => {
            showDeleteGroup()
          },
          type: 'danger'
        },
        {
          text: instance.value.$t('shelf.cancel'),
          click: () => {
            hidePopup()
          }
        }
      ]
      showPopup('', btnList)
    }
    const back = () => {
      router.go(-1)
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
      nextTick(() => {
        initData()
      })
    })
    return {
      ifHideTitleShadow,
      showEdit,
      showClear,
      showBack,
      showChangeGroup,
      changeGroupLeft,
      changeGroupRight,
      selectedText,
      shelfTitleVisible,
      isEditMode,
      clearCache,
      onEditClick,
      changeGroup,
      back,
      toastText,
      toastRef,
      popupTitle,
      popupBtn,
      popupRef,
      groupDialongRef,
      showNewGroup,
      groupName
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
    @include center;
    .icon-back {
      font-size: px2rem(20);
      color: #666;
    }
    .shelf-title-btn-text {
      font-size: px2rem(14);
      color: #666;
      cursor: pointer;
    }
    &.shelf-left {
      left: 0;
      padding-left: px2rem(15);
      .icon-back {
        z-index: 500;
        cursor: pointer;
      }
    }
    &.shelf-right {
      z-index: 500;
      right: 0;
      padding-right: px2rem(15);
    }
    &.editMode {
      z-index: 500;
      cursor: pointer;
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
