import mutations from './mutations'
import actions from './actions'

const home = {
  state: {
    offsetY: 0, // 首页滑动距离
    hotSearchOffsetY: 0, // 搜索组件滑动距离
    flapCardVisible: false,
    isEditMode: false, // 是否进入编辑模式
    shelfList: [], // 书架图书列表
    shelfSelected: [], // 书架图书选中列表
    shelfTitleVisible: true, // 书架标题显示状态
    shelfCategory: [], // 书架分类列表数据
    currentType: 1 // 书架列表为1  书架分类列表为2
  },
  mutations,
  actions
}

export default home
