import { getBookShelf, saveBookShelf } from '@/utils/localStorage'
import { getShelf } from '@/api/book'
import useHomeStore from './useHomeStore'
import useTypeThreeAddbookToShelf from './useTypeThreeAddbookToShelf'

const { _setShelfList } = useHomeStore()

const useGetBookShelf = async () => {
  let shelf
  const list = getBookShelf()
  if (!list) {
    const data = await getShelf()
    if (data.status === 200 && data.data.bookList) {
      shelf = data.data.bookList
    }
  } else {
    shelf = list
  }
  shelf = useTypeThreeAddbookToShelf(shelf)
  _setShelfList(shelf)
  saveBookShelf(shelf)
  return shelf
}

export default useGetBookShelf
