import { saveSearchHistory, getSearchHistory } from '@/utils/localStorage'

const useSaveSearchHistory = (searchText) => {
  let list = getSearchHistory()
  if (!list) {
    list = []
  }
  const filterList = list.filter(item => item.text !== searchText)
  const randomNum = Math.ceil(Math.random() * 2)
  const searchObj = {
    type: randomNum,
    text: searchText
  }
  filterList.unshift(searchObj)
  saveSearchHistory(filterList)
}

export default useSaveSearchHistory
