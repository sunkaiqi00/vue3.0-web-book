import Mock from 'mockjs'
import home from './bookHome'
import shelf from './bookShelf'
import bookList from './bookList'
import flatList from './bookFlatList'

// 拦截请求路径
Mock.mock(/\/book\/home/, 'get', home)
Mock.mock(/\/book\/shelf/, 'get', shelf)
Mock.mock(/\/book\/list/, 'get', bookList)
Mock.mock(/\/book\/flat-list/, 'get', flatList)

export default Mock
