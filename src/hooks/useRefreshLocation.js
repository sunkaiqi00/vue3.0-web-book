import useBookStore from './useBookStore'
import { saveLocation, getBookMark } from '@/utils/localStorage'

const { currentBook, bookFileName, _setProgress, _setSection, _setIsBookmark } = useBookStore()
//  刷新进度百分比 (通过当前章节起始位置的cfi获取该章节的百分比)
const useRefreshLocation = () => {
  const currentLocation = currentBook.value.rendition.currentLocation()
  if (currentLocation && currentLocation.start && currentLocation.start.cfi) {
    const startCfi = currentLocation.start.cfi
    // 通过 cfi 获取阅读百分比
    const progress = currentBook.value.locations.percentageFromCfi(startCfi)
    // 设置进度百分比
    _setProgress(Math.floor(progress * 100))
    // 设置章节
    _setSection(currentLocation.start.index)
    // 存储当前章节 cfi
    saveLocation(bookFileName.value, startCfi)

    // 判断当前页是否为书签页
    const bookMark = getBookMark(bookFileName.value)
    if (bookMark) {
      if (bookMark.some(item => item.cfi === startCfi)) {
        _setIsBookmark(true)
      } else {
        _setIsBookmark(false)
      }
    } else {
      _setIsBookmark(false)
    }
  }
}

export default useRefreshLocation
