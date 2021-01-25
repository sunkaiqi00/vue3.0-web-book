const useComputedId = list => {
  return list.map((book, index) => {
    if (book.type !== 3) {
      book.id = index + 1
      if (book.itemList) {
        book.itemList = useComputedId(book.itemList)
      }
    }
    return book
  })
}

export default useComputedId
