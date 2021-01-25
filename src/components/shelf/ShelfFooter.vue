<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div
      class="shelf-footer-tab-wrapper"
      v-for="item in tab"
      :key="item.index"
      @click="onTabClick(item)"
    >
      <div class="shelf-footer-tab" :class="{'is-selected' : isSelected}">
        <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
        <div class="icon-download tab-icon" v-if="item.index === 2"></div>
        <!-- <div class="icon-download-remove tab-icon" v-if="item.index===2"></div> -->
        <div class="icon-move tab-icon" v-if="item.index === 3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{'remove-text': item.index === 4}">{{label(item)}}</div>
      </div>
    </div>
  </div>
  <popup :title="popupTitle" :btn="popupBtn" ref="popupRef"></popup>
  <toast :text="toastText" ref="toastRef"></toast>
  <shelf-group-dialog ref="groupDialongRef"></shelf-group-dialog>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { downloadBook } from '@/api/book'
import { saveBookShelf, removeLocalStorage } from '@/utils/localStorage'
import { support, removeLocalForage } from '@/utils/localForage'
import useHomeStore from '../../hooks/useHomeStore'
import Popup from '../common/Popup.vue'
import Toast from '../common/Toast.vue'
import ShelfGroupDialog from './ShelfGroupDialog.vue'
export default {
  name: 'ShelfFooter',
  components: { Popup, Toast, ShelfGroupDialog },
  setup() {
    const {
      isEditMode,
      shelfSelected,
      _setIsEditMode,
      shelfList,
      _setShelfSelected,
      _setShelfList
    } = useHomeStore()
    const instance = ref(null)
    const groupDialongRef = ref(null)
    const popupTitle = ref('') // popup title
    const popupBtn = ref([]) // popup btn数组
    const popupRef = ref(null) // popup 组件
    const toastText = ref('') // toast 提示信息
    const toastRef = ref(null) // toast 组件
    // 底部按钮文字
    const tab = computed(() => {
      if (instance.value) {
        return [
          {
            label: instance.value.$t('shelf.private'),
            label2: instance.value.$t('shelf.noPrivate'),
            index: 1
          },
          {
            label: instance.value.$t('shelf.download'),
            label2: instance.value.$t('shelf.delete'),
            index: 2
          },
          {
            label: instance.value.$t('shelf.move'),
            index: 3
          },
          {
            label: instance.value.$t('shelf.remove'),
            index: 4
          }
        ]
      }
    })
    // 根据是否有选中书 更改按钮文字
    const label = item => {
      switch (item.index) {
        case 1:
          return isPrivate.value ? item.label2 : item.label
        case 2:
          return isDownload.value ? item.label2 : item.label
        default:
          return item.label
      }
    }
    // 是否有书被选中
    const isSelected = computed(
      () => shelfSelected.value && shelfSelected.value.length > 0
    )

    // ------------------------------------------------- toast 组件 显示隐藏
    const showToast = text => {
      toastText.value = text
      toastRef.value.show()
    }

    // ------------------------------------------------- popup 组件 显示隐藏
    // 隐藏 底部菜单
    const hidePopup = () => {
      popupRef.value.hide()
    }
    // 传入 title 和 按钮 展示 popup组件
    const showPopup = (title, popupBtnList) => {
      popupTitle.value = title
      popupBtn.value = popupBtnList
      popupRef.value.show()
    }
    // 私密阅读与否  缓存与否  移动分组 移除书架 这些功能操作之后 重置操作
    const publicReset = () => {
      hidePopup()
      _setIsEditMode(false)
      _setShelfSelected([])
      _setShelfList(
        shelfList.value.map(item => {
          item.selected = false
          return item
        })
      )
      saveBookShelf(shelfList.value)
    }
    // --------------------------------------------------  私密阅读部分
    // 选中的书是否为私密阅读  图标随着改变
    const isPrivate = computed(() => {
      if (!isSelected.value) {
        return false
      } else {
        return shelfSelected.value.every(item => item.private)
      }
    })
    // 设置私密阅读
    const setPrivate = () => {
      let privateStatus
      if (isPrivate.value) {
        privateStatus = false
      } else {
        privateStatus = true
      }
      shelfSelected.value.forEach(item => {
        item.private = privateStatus
      })
      if (privateStatus) {
        showToast(instance.value.$t('shelf.setPrivateSuccess'))
      } else {
        showToast(instance.value.$t('shelf.closePrivateSuccess'))
      }
      publicReset()
    }
    // 私密阅读 popup弹出框
    const showPrivatePopup = () => {
      const title = isPrivate.value
        ? instance.value.$t('shelf.closePrivateTitle')
        : instance.value.$t('shelf.setPrivateTitle')
      const btnList = [
        {
          text: isPrivate.value
            ? instance.value.$t('shelf.close')
            : instance.value.$t('shelf.open'),
          click: () => {
            setPrivate() // 设置是否私密阅读
          }
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

    // -------------------------------------------------- 下载部分
    // 选中的书是否为下载  图标随着改变
    const isDownload = computed(() => {
      if (!isSelected.value) {
        return false
      } else {
        return shelfSelected.value.every(item => item.cache)
      }
    })
    // 下载选中的书
    const downloadSelectedBook = () => {
      for (let i = 0; i < shelfSelected.value.length; i++) {
        if (!shelfSelected.value[i].cache) {
          download(shelfSelected.value[i]).then(books => {
            books.cache = true
            showToast(instance.value.$t('shelf.downloadCompleted'))
          })
        }
      }
    }
    const download = book => {
      return new Promise((resolve, reject) => {
        downloadBook(
          book,
          book => {
            // console.log('下载完毕', book)
            resolve(book)
          },
          err => {
            console.log(err)
            reject(err)
          },
          progressEvent => {
            // const progress =
            //   Math.floor((progressEvent.loaded / progressEvent.total) * 100) +
            //   '%'
            // const text = instance.value
            //   .$t('shelf.progressDownload')
            //   .replace('$1', `${book.fileName}.epub(${progress})`)
            // console.log(text)
          }
        )
      })
    }
    const removeSelectedCacheBook = () => {
      for (let i = 0; i < shelfSelected.value.length; i++) {
        shelfSelected.value[i].cache = false
        removeCacheBook(shelfSelected.value[i])
      }
    }
    const removeCacheBook = book => {
      return new Promise((resolve, reject) => {
        removeLocalStorage(`${book.categoryText}/${book.fileName}`)
        removeLocalForage(`${book.fileName}`, resolve, reject)
        resolve(book)
      })
    }
    // 缓存电子书
    const setDownload = async () => {
      // 不支持下载
      const supportIndexDB = support()
      if (!supportIndexDB) {
        const text = instance.value.$t('shelf.noSupportIndexDB')
        showToast(text)
        publicReset()
        return
      }

      if (isDownload.value) {
        showToast(instance.value.$t('shelf.removeDownloadSuccess'))
        removeSelectedCacheBook()
      } else {
        showToast(instance.value.$t('shelf.setDownloadSuccess'))
        await downloadSelectedBook()
      }
      publicReset()
    }
    // 下载 popup弹出框
    const showDownloadPopup = () => {
      const title = isDownload.value
        ? instance.value.$t('shelf.removeDownloadTitle')
        : instance.value.$t('shelf.setDownloadTitle')
      const btnList = [
        {
          text: isDownload.value
            ? instance.value.$t('shelf.delete')
            : instance.value.$t('shelf.open'),
          click: () => {
            setDownload()
          }
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

    // --------------------------------------------------- 移除书架
    // 选中的书 移除书架
    const removeSelectedBook = () => {
      shelfSelected.value.forEach(book => {
        _setShelfList(
          shelfList.value.filter(item => {
            if (item.itemList) {
              item.itemList = item.itemList.filter(item => item !== book)
            }
            return item !== book
          })
        )
      })
      let text
      if (shelfSelected.value.length === 1) {
        text = instance.value
          .$t('shelf.moveBookOutShelf')
          .replace('$1', `《${shelfSelected.value[0].title}》`)
      } else {
        text = instance.value
          .$t('shelf.moveBookOutShelf')
          .replace('$1', instance.value.$t('shelf.selectedBooks'))
      }
      showToast(text)
      publicReset()
    }
    // 移除书架 popup弹出层
    const showRemoveBookPopup = () => {
      let title
      if (shelfSelected.value.length === 1) {
        title = instance.value
          .$t('shelf.removeBookTitle')
          .replace('$1', `《${shelfSelected.value[0].title}》`)
      } else {
        title = instance.value
          .$t('shelf.removeBookTitle')
          .replace('$1', instance.value.$t('shelf.selectedBooks'))
      }
      const btnList = [
        {
          text: instance.value.$t('shelf.removeBook'),
          type: 'danger',
          click: () => {
            removeSelectedBook()
          }
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

    // ------------------------------------------------- 移动分组
    const showGroupDialong = () => {
      groupDialongRef.value.show()
    }
    const onTabClick = item => {
      if (isSelected.value) {
        switch (item.index) {
          case 1:
            showPrivatePopup() // 设置是否私密阅读
            break
          case 2:
            showDownloadPopup() // 下再载
            break
          case 3:
            showGroupDialong()
            break
          case 4:
            showRemoveBookPopup()
            break
          default:
            break
        }
      }
    }
    onMounted(() => {
      const { ctx } = getCurrentInstance()
      instance.value = ctx
    })

    return {
      tab,
      isSelected,
      isEditMode,
      onTabClick,
      popupTitle,
      popupBtn,
      popupRef,
      toastText,
      toastRef,
      isPrivate,
      label,
      groupDialongRef
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';

.shelf-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 120;
  display: flex;
  width: 100%;
  height: px2rem(48);
  box-shadow: 0 px2rem(-2) px2rem(4) rgba(0, 0, 0, 0.1);
  background: #fff;
  .shelf-footer-tab-wrapper {
    flex: 1;
    width: 25%;
    height: 100%;

    .shelf-footer-tab {
      width: 100%;
      height: 100%;
      opacity: 0.5;
      @include columnCenter;
      &.is-selected {
        opacity: 1;
      }
      .tab-icon {
        font-size: px2rem(20);
        color: #666;
        cursor: pointer;
      }
      .icon-shelf {
        color: #e74c3c;
      }
      .tab-text {
        margin-top: px2rem(5);
        font-size: px2rem(12);
        color: #666;
        cursor: pointer;
      }
      .remove-text {
        color: #e74c3c;
        cursor: pointer;
      }
    }
  }
}
</style>
