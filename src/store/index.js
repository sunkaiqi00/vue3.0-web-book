import { createStore } from 'vuex'
import book from './book'

const store = createStore({
  modules: {
    book
  }
})

export default store
