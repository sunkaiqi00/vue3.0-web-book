const useTypeThreeAddbookToShelf = shelfList => {
  const typeThree = shelfList.find(item => item.type === 3)
  if (typeThree) {
    useRemoveAddBookToShelf(shelfList).push({
      id: -1,
      type: 3
    })
  } else {
    shelfList.push({
      id: -1,
      type: 3
    })
  }
  return shelfList
}
const useRemoveAddBookToShelf = shelfList => {
  return shelfList.filter(item => item.type !== 3)
}

export default useTypeThreeAddbookToShelf
