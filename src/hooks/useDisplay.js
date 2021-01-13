import useBookStore from './useBookStore'
import useRefreshLocation from './useRefreshLocation'
const { currentBook } = useBookStore()

const useDisplay = (target, callBack) => {
  if (target) {
    // 通过cfi渲染页面
    currentBook.value.rendition.display(target).then(() => {
      useRefreshLocation()
      if (callBack) callBack()
    })
  } else {
    // 没有从存储中获取cfi 直接渲染
    currentBook.value.rendition.display().then(() => {
      useRefreshLocation()
      if (callBack) callBack()
    })
  }
}

export default useDisplay
