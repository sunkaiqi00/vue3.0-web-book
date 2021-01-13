import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function setLocalStorage(key, value) {
  return localStorage.set(key, value)
}

export function getLocalStorage(key) {
  return localStorage.get(key)
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}

// 存储book信息
export function setBookObject(fileName, key, value) {
  let book = getLocalStorage(`${fileName}-info`)
  if (!book) {
    book = {}
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)
}
// 获取book信息
export function getBookObject(fileName, key) {
  const book = getLocalStorage(`${fileName}-info`)
  if (book) {
    return book[key]
  } else {
    return null
  }
}

// 字体类型
export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}
export function saveFontFamily(fileName, font) {
  return setBookObject(fileName, 'fontFamily', font)
}

// 主题
export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}
export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}

// 字体大小
export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}
export function saveFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}

// 语言
export function getLanguage() {
  return getLocalStorage('language')
}
export function saveLanguage(language) {
  return setLocalStorage('language', language)
}

// 阅读章节
export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}
export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}

// 书签
export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}
export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}

// 阅读时间
export function getReadTime(fileName) {
  return getBookObject(fileName, 'time')
}
export function saveReadTime(fileName, theme) {
  setBookObject(fileName, 'time', theme)
}

// 阅读进度
export function getProgress(fileName) {
  return getBookObject(fileName, 'progress')
}
export function saveProgress(fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}

//
export function getNavigation(fileName) {
  return getBookObject(fileName, 'navigation')
}
export function saveNavigation(fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}

//
export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}
export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}

//
export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}
export function saveCover(fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}

//
export function saveBookShelf(shelf) {
  return setLocalStorage('shelf', shelf)
}
export function getBookShelf() {
  return getLocalStorage('shelf')
}
