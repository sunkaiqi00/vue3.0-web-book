<template>
  <div class="book-detail">
    <detail-title @back="back" :showShelf="true" ref="titleRef"></detail-title>
    <scroll class="content-wrapper" :top="42" :bottom="52" @onScroll="onScroll" ref="scrollRef">
      <book-info :cover="cover" :title="title" :author="author" :desc="desc"></book-info>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.copyright')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.publisher')}}</div>
            <div class="book-detail-content-text">{{publisher}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.category')}}</div>
            <div class="book-detail-content-text">{{categoryText}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.lang')}}</div>
            <div class="book-detail-content-text">{{lang}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.ISBN')}}</div>
            <div class="book-detail-content-text">{{isbn}}</div>
          </div>
        </div>
      </div>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.navigation')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!navigation">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <div
              class="book-detail-content-item"
              v-for="(item, index) in flatNavigation"
              :key="index"
            >
              <div
                class="book-detail-content-navigation-text"
                :class="{'is-sub': item.deep> 1}"
                :style="itemStyle(item)"
                v-if="item.label"
              >{{item.label}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.trial')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!displayed">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
        </div>
        <div id="preview" v-show="displayed" ref="previewRef"></div>
      </div>
    </scroll>
    <div class="bottom-wrapper">
      <div class="bottom-btn" @click.stop.prevent="readBook">
        <span>{{$t('detail.read')}}</span>
      </div>
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf">
        <span class="icon-check" v-if="inBookShelf"></span>
        <span>{{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}</span>
      </div>
    </div>
    <toast :text="toastText" ref="toastRef"></toast>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBookDetail } from '../../api/book'
import { px2rem } from '@/utils/utils'
import { getBookShelf, saveBookShelf } from '../../utils/localStorage'
import useTypeThreeAddbookToShelf from '../../hooks/useTypeThreeAddbookToShelf'
import Epub from 'epubjs'
import DetailTitle from '@/components/detail/DetaiTitle'
import BookInfo from '@/components/detail/BookInfo'
import Scroll from '@/components/common/Scroll'
import Toast from '@/components/common/Toast'
import useGetCategoryName from '../../hooks/useGetCategoryName'
import useHomeStore from '../../hooks/useHomeStore'
global.ePub = Epub
export default {
  name: 'BookDetail',
  components: {
    DetailTitle,
    Scroll,
    BookInfo,
    Toast
  },
  setup() {
    const { shelfList, _setShelfList } = useHomeStore()
    const route = useRoute()
    const router = useRouter()
    // ------
    const scrollRef = ref()
    const previewRef = ref()
    const titleRef = ref()
    const toastRef = ref()
    // ----
    const bookItem = ref(null)
    const fileName = ref('')
    const category = ref()
    const cover = ref('')
    const opf = ref('')
    const toastText = ref('')
    const book = ref(null)
    const navigation = ref(null)
    const displayed = ref(false)
    const description = ref('')
    const rendition = ref(null)
    const desc = computed(() => {
      if (description.value) {
        return description.value.substring(0, 100) + '...'
      } else {
        return ''
      }
    })
    const flatNavigation = computed(() => {
      if (navigation.value) {
        return Array.prototype.concat.apply(
          [],
          Array.prototype.concat.apply(
            [],
            doFlatNavigation(navigation.value.toc)
          )
        )
      } else {
        return []
      }
    })
    const lang = ref('')
    const isbn = ref('')
    const publisher = ref('')
    const categoryText = ref('')
    const title = ref('')
    const author = ref('')
    const inBookShelf = ref(false)
    const display = href => {
      if (previewRef.value) {
        if (!rendition.value) {
          rendition.value = book.value.renderTo('preview', {
            width: window.innerWidth > 640 ? 640 : window.innerWidth,
            height: window.innerHeight,
            method: 'default'
          })
        }
        if (!href) {
          return rendition.value.display()
        } else {
          return rendition.value.display(href)
        }
      }
    }
    const parseBook = url => {
      book.value = new Epub(url)
      book.value.loaded.metadata.then(metadata => {
        lang.value = metadata.language
        isbn.value = metadata.identifier
        publisher.value = metadata.publisher
        title.value = metadata.title
        author.value = metadata.creator
        categoryText.value = useGetCategoryName(Number(category.value))
      })

      book.value.loaded.navigation.then(nav => {
        navigation.value = nav
        if (navigation.value.toc && navigation.value.toc.length > 1) {
          const candisplay = display(navigation.value.toc[1].href)
          if (candisplay) {
            candisplay.then(section => {
              if (scroll.value) {
                scroll.value.refresh()
              }
              displayed.value = true
              const reg = new RegExp('<.+?>', 'g')
              const text = section.output.replace(reg, '').replace(/\s\s/g, '')
              description.value = text
            })
          }
        }
      })
    }
    const init = async () => {
      fileName.value = route.query.fileName
      category.value = route.query.category
      if (fileName.value) {
        await getBookDetail({
          fileName: fileName.value
        }).then(response => {
          if (
            response.status === 200 &&
            response.data.error_code === 0 &&
            response.data.data
          ) {
            const data = response.data.data
            bookItem.value = data
            cover.value = bookItem.value.cover
            let rootFile = data.rootFile
            if (rootFile.startsWith('/')) {
              rootFile = rootFile.substring(1, rootFile.length)
            }
            opf.value = `${process.env.VUE_APP_EPUB_OPF_URL}/${fileName.value}/${rootFile}`
            parseBook(opf.value)
          } else {
            showToast(response.data.msg)
          }
        })
      }
      const shelf = getShelf()
      if (shelf.length === 1) {
        inBookShelf.value = false
      } else {
        const book = shelf.find(item => {
          if (item.itemList) {
            return item.itemList.find(
              item => item.title === bookItem.value.ttile
            )
          }
          return item.title === bookItem.value.title
        })
        if (book) {
          inBookShelf.value = true
        } else {
          inBookShelf.value = false
        }
      }
    }
    const onScroll = offsetY => {
      if (offsetY > 0) {
        titleRef.value.showShadow()
      } else {
        titleRef.value.hideShadow()
      }
    }
    const back = () => {
      router.go(-1)
    }
    const doFlatNavigation = (content, deep = 1) => {
      const arr = []
      content.forEach(item => {
        item.deep = deep
        arr.push(item)
        if (item.subitems && item.subitems.length > 0) {
          arr.push(doFlatNavigation(item.subitems, deep + 1))
        }
      })
      return arr
    }
    const itemStyle = item => {
      return {
        marginLeft: (item.deep - 1) * px2rem(20) + 'rem'
      }
    }
    const readBook = () => {
      router.push({
        path: `/ebook/${categoryText.value}|${fileName.value}`
      })
    }
    const showToast = text => {
      toastText.value = text
      toastRef.value.show()
    }
    const getShelf = () => {
      let shelf = getBookShelf()
      if (!shelf) {
        shelf = useTypeThreeAddbookToShelf([])
      }
      return shelf
    }
    const removeFromBookShelf = (book, shelf) => {
      console.log(shelf)
      const list = shelf.filter(item => {
        if (item.itemList) {
          item.itemList = item.itemList.filter(
            item => item.bookId !== book.bookId
          )
        }
        return item.bookId !== book.bookId
      })
      console.log(list)
      _setShelfList(list).then(() => {
        saveBookShelf(shelfList.value)
        inBookShelf.value = false
      })
    }
    const addToShelf = (book, shelf) => {
      book.type = 1
      shelf.push(book)
      _setShelfList(useTypeThreeAddbookToShelf(shelf)).then(() => {
        saveBookShelf(shelfList.value)
        inBookShelf.value = true
      })
    }
    const addOrRemoveShelf = () => {
      const shelf = getShelf()
      if (inBookShelf.value) {
        removeFromBookShelf(bookItem.value, shelf)
      } else {
        addToShelf(bookItem.value, shelf)
      }
    }
    onMounted(() => {
      init()
    })
    return {
      scrollRef,
      previewRef,
      titleRef,
      toastRef,
      displayed,
      navigation,
      cover,
      categoryText,
      desc,
      flatNavigation,
      toastText,
      lang,
      isbn,
      publisher,
      title,
      author,
      inBookShelf,
      onScroll,
      back,
      itemStyle,
      readBook,
      addOrRemoveShelf
    }
  }
}
</script>

<style lang="scss"  scoped>
@import '@/assets/css/global.scss';

.book-detail {
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
  .content-wrapper {
    width: 100%;
    .book-detail-content-wrapper {
      width: 100%;
      border-bottom: px2rem(1) solid #eee;
      box-sizing: border-box;
      .book-detail-content-title {
        font-size: px2rem(20);
        font-weight: bold;
        padding: px2rem(20) px2rem(15) px2rem(10) px2rem(15);
        box-sizing: border-box;
      }
      .book-detail-content-list-wrapper {
        padding: px2rem(10) px2rem(15);
        box-sizing: border-box;
        .loading-text-wrapper {
          width: 100%;
          .loading-text {
            font-size: px2rem(14);
            color: #666;
          }
        }
        .book-detail-content-row {
          display: flex;
          box-sizing: border-box;
          margin-bottom: px2rem(10);
          .book-detail-content-label {
            flex: 0 0 px2rem(70);
            font-size: px2rem(14);
            color: #666;
          }
          .book-detail-content-text {
            flex: 1;
            font-size: px2rem(14);
            color: #333;
          }
        }
        #preview {
        }
        .book-detail-content-item-wrapper {
          .book-detail-content-item {
            padding: px2rem(15) 0;
            font-size: px2rem(14);
            line-height: px2rem(16);
            color: #666;
            border-bottom: px2rem(1) solid #eee;
            &:last-child {
              border-bottom: none;
            }
            .book-detail-content-navigation-text {
              width: 100%;
              @include ellipsis;
              &.is-sub {
                color: #666;
              }
            }
          }
        }
      }
    }
    .audio-wrapper {
      width: 100%;
      padding: px2rem(15);
      box-sizing: border-box;
      #audio {
        width: 100%;
      }
    }
  }
  .bottom-wrapper {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    height: px2rem(52);
    box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, 0.1);
    .bottom-btn {
      flex: 1;
      color: $color-blue;
      font-weight: bold;
      font-size: px2rem(14);
      @include center;
      &:active {
        color: $color-blue-transparent;
      }
      .icon-check {
        margin-right: px2rem(5);
      }
      span {
        cursor: pointer;
      }
    }
    &.hide-shadow {
      box-shadow: none;
    }
  }
}
</style>
