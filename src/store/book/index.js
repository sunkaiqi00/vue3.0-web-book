import mutations from './mutations'
import actions from './actions'

const book = {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1, // -1不显示 0字号 1主题 2进度 3目录
    defaultFontSize: 16,
    defaultFontFamily: 'Default',
    fontFamilyVisible: false,
    defaultTheme: 'Default',
    themeList: [], // 主题
    // 书是否加载完成
    bookAvailable: false,
    // 进度
    progress: 0,
    // 章节
    section: 0,
    isPaginating: true,
    // 电子书的book对象
    currentBook: null,
    // 目录
    navigation: null,
    // 电子书封面图片
    cover: null,
    // 电子书信息
    metadata: null,
    paginate: '',
    pagelist: null,
    // 书签偏移量
    offsetY: 0,
    // 是否为书签页
    isBookmark: null
  },
  mutations,
  actions
}

export default book
