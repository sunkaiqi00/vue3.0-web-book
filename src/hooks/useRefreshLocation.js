import useBookStore from './useBookStore'
import { saveLocation } from '@/utils/localStorage'
const { currentBook, bookFileName, _setProgress, _setSection } = useBookStore()

//  刷新进度百分比 (通过当前章节起始位置的cfi获取该章节的百分比)
const useRefreshLocation = () => {
  const currentLocation = currentBook.value.rendition.currentLocation()
  const startCfi = currentLocation.start.cfi
  const progress = currentBook.value.locations.percentageFromCfi(startCfi)
  _setProgress(Math.floor(progress * 100))
  _setSection(currentLocation.start.index)
  // 存储当前章节 cfi
  saveLocation(bookFileName.value, startCfi)
}

export default useRefreshLocation
