import { createStore } from 'vuex'
import book from './book'
import home from './home'

const store = createStore({
  modules: {
    book,
    home
  }
})

export default store
