import useBookStore from '@/hooks/useBookStore'
import { getReadTime } from '@/utils/localStorage'

const { bookFileName } = useBookStore()

const useGetReadTimeText = (ctx) => {
  return ctx
    .$t('book.haveRead')
    .replace('$1', getReadTimeToMinute())
}

const getReadTimeToMinute = () => {
  let readTime = getReadTime(bookFileName.value)
  if (!readTime) {
    readTime = 0
  } else {
    readTime = Math.ceil(readTime / 60)
  }
  return readTime
}

export default useGetReadTimeText
