import store from '@/store'
import { computed } from 'vue'

const useBookStore = () => {
  const bookFileName = computed(() => store.state.book.fileName)
  const menuVisible = computed(() => store.state.book.menuVisible)
  const settingVisible = computed(() => store.state.book.settingVisible)
  const defaultFontSize = computed(() => store.state.book.defaultFontSize)
  const currentBook = computed(() => store.state.book.currentBook)
  const defaultFontFamily = computed(() => store.state.book.defaultFontFamily)
  const fontFamilyVisible = computed(() => store.state.book.fontFamilyVisible)
  const defaultTheme = computed(() => store.state.book.defaultTheme)
  const themesList = computed(() => store.state.book.themeList)
  const bookAvailable = computed(() => store.state.book.bookAvailable)
  const progress = computed(() => store.state.book.progress)
  const section = computed(() => store.state.book.section)
  const _setFileName = (fileName) => {
    return store.dispatch('setFileName', fileName)
  }
  const _setMenuVisible = (visible) => {
    store.dispatch('setMenuVisible', visible)
  }
  const _setSettingVisible = (key) => {
    store.dispatch('setSettingVisible', key)
  }
  const _setDefaultFontSize = (fontSize) => {
    store.dispatch('setDefaultFontSize', fontSize)
  }
  const _setCurrentBook = (book) => {
    store.dispatch('setCurrentBook', book)
  }
  const _setFontFamilyVisible = (visible) => {
    store.dispatch('setFontFamilyVisible', visible)
  }
  const _setDefaultFontFamily = (fontFamily) => {
    store.dispatch('setDefaultFontFamily', fontFamily)
  }
  const _setDefaultTheme = (theme) => {
    return store.dispatch('setDefaultTheme', theme)
  }
  const _setThemeList = (themeList) => {
    store.dispatch('setThemeList', themeList)
  }
  const _setBookAvailable = (bookAvailable) => {
    store.dispatch('setBookAvailable', bookAvailable)
  }
  const _setProgress = (progress) => {
    return store.dispatch('setProgress', progress)
  }
  const _setSection = section => {
    return store.dispatch('setSection', section)
  }
  return {
    bookFileName,
    menuVisible,
    _setFileName,
    settingVisible,
    _setSettingVisible,
    defaultFontSize,
    _setDefaultFontSize,
    _setMenuVisible,
    _setCurrentBook,
    currentBook,
    defaultFontFamily,
    fontFamilyVisible,
    _setFontFamilyVisible,
    _setDefaultFontFamily,
    defaultTheme,
    _setDefaultTheme,
    themesList,
    _setThemeList,
    bookAvailable,
    progress,
    _setProgress,
    _setBookAvailable,
    section,
    _setSection
  }
}

export default useBookStore
