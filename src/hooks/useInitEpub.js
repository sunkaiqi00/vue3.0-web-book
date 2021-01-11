import Epub from 'epubjs'
import useBookStore from './useBookStore'
import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme } from '@/utils/localStorage'
import useInitGlobalStyle from '@/hooks/useInitGlobalStyle'
global.ePub = Epub
const {
  menuVisible,
  bookFileName,
  defaultFontFamily,
  defaultFontSize,
  _setDefaultFontFamily,
  _setDefaultFontSize,
  _setMenuVisible,
  _setSettingVisible,
  _setCurrentBook,
  _setFontFamilyVisible,
  themesList,
  _setDefaultTheme
} = useBookStore()

const useInitEpub = (domId, fileName) => {
  const url = `${process.env.VUE_APP_RES_URL}/epub/${fileName}.epub`
  // book对象
  const book = new Epub(url)
  // 存储book 到store
  _setCurrentBook(book)
  // 手指点击的位置
  let touchStartX
  // 手指点击的时间
  let touchStartTime
  // 上一页
  const prevPage = () => {
    if (rendition) {
      rendition.prev()
      hideTitleAndMenu()
    }
  }
  // 下一页
  const nextPage = () => {
    if (rendition) {
      rendition.next()
      hideTitleAndMenu()
    }
  }
  // 切换页 隐藏
  const hideTitleAndMenu = () => {
    _setMenuVisible(false)
    _setSettingVisible(-1)
    _setFontFamilyVisible(false)
  }
  // 点击切换 title ，menu菜单
  const toggleTitleAndMenu = () => {
    _setMenuVisible(!menuVisible.value)
    _setFontFamilyVisible(false)
    if (menuVisible.value) {
      _setSettingVisible(-1)
    }
  }
  // 初始化字体类型
  const initFontFamily = () => {
    // 获取localStorage保存的字体类型 初始化字体
    const fontFamily = getFontFamily(bookFileName.value)
    if (!fontFamily) {
      saveFontFamily(bookFileName.value, defaultFontFamily.value)
    } else {
      rendition.themes.font(fontFamily)
      _setDefaultFontFamily(fontFamily)
    }
  }
  // 初始化字体大小
  const initFontSize = () => {
    const fontSize = getFontSize(bookFileName.value)
    if (!fontSize) {
      saveFontSize(bookFileName.value, defaultFontSize.value)
    } else {
      rendition.themes.fontSize(fontSize + 'px')
      _setDefaultFontSize(fontSize)
    }
  }
  // 阅读器注册主题
  const initTheme = () => {
    let currentTheme = getTheme(bookFileName.value)
    if (!currentTheme) {
      currentTheme = themesList.value[0].name
      saveTheme(bookFileName.value, currentTheme)
    }
    themesList.value.forEach(theme => {
      rendition.themes.register(theme.name, theme.style)
    })
    _setDefaultTheme(currentTheme)
    rendition.themes.select(currentTheme)
  }

  const rendition = book.renderTo(domId, {
    width: window.innerWidth,
    height: window.innerHeight
  })
  // 渲染电子书
  rendition.display().then(() => {
    initFontFamily()
    initFontSize()
    initTheme()
    // 全局主题切换
    useInitGlobalStyle()
  })
  // rendition 监听事件
  rendition.on('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX
    touchStartTime = e.timeStamp
    e.stopPropagation()
  })
  rendition.on('touchend', e => {
    const offsetX = e.changedTouches[0].clientX - touchStartX
    const time = e.timeStamp - touchStartTime
    if (time < 500 && offsetX > 50) {
      prevPage()
    } else if (time < 500 && offsetX < -50) {
      nextPage()
    } else {
      toggleTitleAndMenu()
    }
    e.stopPropagation()
  })
  // 字体注入
  rendition.hooks.content.register(content => {
    Promise.all([
      content.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
      content.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
      content.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
      content.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
    ]).then(() => {})
  })
}

export default useInitEpub
