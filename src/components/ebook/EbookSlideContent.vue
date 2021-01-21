<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          type="text"
          class="slide-contents-search-input"
          :placeholder="$t('book.searchHint')"
          v-model.trim="searchText"
          @click="showSearchPage"
          @keyup.enter.exact="search"
        />
      </div>
      <div
        class="slide-contents-search-cancel"
        v-if="searchVisible"
        @click="hideSearchPage"
      >{{$t('book.cancel')}}</div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" alt class="slide-contents-book-img" />
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{metadata&&metadata.title}}</span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{metadata&&metadata.creator}}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{readTime}}</div>
      </div>
    </div>
    <scroll class="slide-contents-list" :top="156" :bottom="48" v-show="!searchVisible">
      <div class="slide-contents-item" v-for="(item,index) in navigation" :key="index">
        <span
          class="slide-contents-item-label"
          :class="{selected:section===index}"
          :style="contentItemStyle(item)"
          @click="displayContentByHref(item.href)"
        >{{item.label}}</span>
        <span class="slide-contents-item-page"></span>
      </div>
    </scroll>
    <scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisible">
      <div
        class="slide-search-item"
        v-for="(item,index) in searchResult"
        :key="index"
        v-html="item.excerpt"
        @click="displayContentByCfi(item.cfi)"
      ></div>
      <div v-if="emptySearch" class="empty-search-result">没有搜索到内容...</div>
    </scroll>
  </div>
</template>

<script>
import { onMounted, ref, getCurrentInstance, watch } from 'vue'
import useBookStore from '@/hooks/useBookStore'
import useGetReadTimeText from '@/hooks/useGetReadTimeText'
import Scroll from '../common/Scroll.vue'
import { px2rem } from '@/utils/utils'
import useDisplay from '@/hooks/useDisplay'
import useHideTitleAndMenu from '@/hooks/useHideTitleAndMenu'
export default {
  name: 'EbookSlideContent',
  components: {
    Scroll
  },
  setup() {
    const { ctx } = getCurrentInstance()
    const {
      progress,
      cover,
      metadata,
      navigation,
      section,
      currentBook,
      settingVisible
    } = useBookStore()
    const searchText = ref('')
    const searchVisible = ref(false)
    const readTime = ref(0)
    const searchResult = ref([])
    const emptySearch = ref(false)

    watch(
      () => settingVisible.value,
      val => {
        if (val === -1) {
          searchVisible.value = false
          searchText.value = ''
        }
      }
    )
    const showSearchPage = () => {
      searchVisible.value = true
    }
    // 全文搜索
    const doSearch = q => {
      return Promise.all(
        currentBook.value.spine.spineItems.map(section =>
          section
            .load(currentBook.value.load.bind(currentBook.value))
            .then(section.find.bind(section, q))
            .finally(section.unload.bind(section))
        )
      ).then(results => Promise.resolve([].concat.apply([], results)))
    }
    const search = () => {
      if (!searchText.value) return
      doSearch(searchText.value).then(result => {
        // searchResult.value = result
        // 文字高亮显示
        searchResult.value = result.map(item => {
          item.excerpt = item.excerpt.replace(
            searchText.value,
            `<span class='content-search-text'>${searchText.value}</span>`
          )
          return item
        })
      })
      if (!searchResult.value.length) {
        emptySearch.value = true
      }
    }
    const hideSearchPage = () => {
      searchVisible.value = false
      searchText.value = ''
      searchResult.value = []
      if (emptySearch.value) {
        emptySearch.value = false
      }
    }
    // 目录缩进
    const contentItemStyle = item => {
      return { marginLeft: `${px2rem(item.level * 15)}rem` }
    }
    // 点击目录跳转至该内容页面
    const displayContentByHref = href => {
      useDisplay(href, () => {
        useHideTitleAndMenu()
      })
    }
    // 点击搜索结果跳转至该内容页面
    const displayContentByCfi = cfi => {
      useDisplay(cfi, () => {
        useHideTitleAndMenu()
        // 搜索内容 搜索文字高亮显示
        currentBook.value.rendition.annotations.highlight(cfi)
        emptySearch.value = false
        searchResult.value = []
        searchVisible.value = false
        searchText.value = ''
      })
    }
    onMounted(() => {
      // 获取阅读时间
      readTime.value = useGetReadTimeText(ctx)
    })
    return {
      readTime,
      searchText,
      searchVisible,
      showSearchPage,
      search,
      searchResult,
      hideSearchPage,
      cover,
      progress,
      metadata,
      navigation,
      section,
      contentItemStyle,
      displayContentByHref,
      displayContentByCfi,
      emptySearch
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.ebook-slide-contents {
  width: 100%;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      @include center;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(28);
        font-size: px2rem(12);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-title {
        font-size: px2rem(13);
        line-height: px2rem(16);
        margin-top: px2rem(5);
        @include left;
        .slide-contents-book-title-text {
          @include ellipsis2(2);
        }
      }
      .slide-contents-book-author {
        font-size: px2rem(12);
        line-height: px2rem(14);
        margin-top: px2rem(5);
        @include left;
        .slide-contents-book-author-text {
          @include ellipsis2(1);
        }
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      display: flex;
      flex-direction: column;
      .slide-contents-book-progress {
        flex: 1;
        margin-top: px2rem(-5);
        box-sizing: border-box;
        .progress {
          font-size: px2rem(10);
        }
        .progress-text {
          font-size: px2rem(10);
        }
      }
      .slide-contents-book-time {
        flex: 1;
        font-size: px2rem(10);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: px2rem(18) 0;
      box-sizing: border-box;
      font-size: px2rem(14);
      cursor: pointer;
      .slide-contents-item-label {
        flex: 1;
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis;
      }
      .slide-contents-item-page {
        flex: 0 0 px2rem(30);
        font-size: px2rem(10);
        @include right;
      }
    }
  }
  .slide-search-list {
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .slide-search-item {
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
    .empty-search-result {
      width: 100%;
      height: 100%;
      font-size: px2rem(12);
      @include center;
    }
  }
}
</style>
