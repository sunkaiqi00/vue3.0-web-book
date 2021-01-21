<template>
  <div class="book-list-wrapper">
    <detail-title :title="title" :showShelf="true" @back="back" ref="titleRef"></detail-title>
    <scroll class="book-list-scroll-wrapper" :top="42" @onScroll="onScroll" ref="scroll">
      <featured
        :data="value"
        :titleText="titleText ? titleText : getCategoryText(key)"
        :btnText="''"
        v-for="(value, key, index) in bookList"
        :key="index"
      ></featured>
    </scroll>
  </div>
</template>

<script>
import DetailTitle from '@/components/detail/DetaiTitle'
import Scroll from '@/components/common/Scroll'
import Featured from '@/components/home/Featured'
import useGetCategoryText from '../../hooks/useGetCategoryText'
import { categoryList } from '@/utils/book'
import { getList } from '@/api/book'
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'StoreList',
  components: {
    DetailTitle,
    Scroll,
    Featured
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const bookList = ref({})
    const total = ref(null)
    const instance = ref(null)
    const titleRef = ref()
    const titleText = ref('')
    const title = computed(() => {
      if (bookList.value) {
        return (
          total.value &&
          instance.value.$t('home.allBook').replace('$1', totalNumber.value)
        )
      } else {
        return null
      }
    })
    const totalNumber = computed(() => {
      let num = 0
      Object.keys(bookList.value).forEach(key => {
        num += bookList.value[key].length
      })
      return num
    })
    const back = () => {
      router.go(-1)
    }
    const onScroll = offsetY => {
      if (offsetY > 0) {
        titleRef.value.showShadow()
      } else {
        titleRef.value.hideShadow()
      }
    }
    const getCategoryText = key => {
      return `${useGetCategoryText(categoryList[key], instance.value)}(${
        bookList.value[key].length
      })`
    }
    const getBookList = () => {
      getList().then(response => {
        bookList.value = response.data.data
        total.value = response.data.total
        const category = route.query.category
        const keyword = route.query.keyword
        if (category) {
          const key = Object.keys(bookList.value).filter(
            item => item === category
          )[0]
          const data = bookList.value[key]
          bookList.value = {}
          bookList.value[key] = data
        } else if (keyword) {
          Object.keys(bookList.value).filter(key => {
            bookList.value[key] = bookList.value[key].filter(book =>
              book.fileName.toLowerCase().includes(keyword.toLowerCase())
            )
            return bookList.value[key].length > 0
          })
        }
      })
    }
    onMounted(() => {
      const { ctx } = getCurrentInstance()
      instance.value = ctx
      titleText.value = route.query.categoryText
      getBookList()
    })

    return {
      bookList,
      title,
      titleRef,
      back,
      onScroll,
      titleText,
      getCategoryText
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/global.scss';

.book-list-wrapper {
  width: 100%;
  height: 100%;
  background: white;
}
</style>
