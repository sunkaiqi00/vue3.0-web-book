const useTypeThreeAddbookToShelf = shelfList => {
  let list = []
  const typeThree = shelfList.find(item => item.type === 3)
  if (typeThree) {
    list = useRemoveAddBookToShelf(shelfList)
    list.push({
      id: -1,
      type: 3
    })
  } else {
    list = shelfList
    list.push({
      id: -1,
      type: 3
    })
  }
  return list
}
const useRemoveAddBookToShelf = shelfList => {
  return shelfList.filter(item => item.type !== 3)
}

export default useTypeThreeAddbookToShelf
