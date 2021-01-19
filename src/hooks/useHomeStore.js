import store from '@/store'
import { computed } from 'vue'

const useHomeStore = () => {
  const offsetY = computed(() => store.state.home.offsetY)
  const hotSearchOffsetY = computed(() => store.state.home.hotSearchOffsetY)
  const flapCardVisible = computed(() => store.state.home.flapCardVisible)
  const isEditMode = computed(() => store.state.home.isEditMode)
  const shelfList = computed(() => store.state.home.shelfList)
  const shelfSelected = computed(() => store.state.home.shelfSelected)
  const shelfTitleVisible = computed(() => store.state.home.shelfTitleVisible)
  const shelfCategory = computed(() => store.state.home.shelfCategory)
  const currentType = computed(() => store.state.home.currentType)

  const _setOffsetY = offsetY => {
    return store.dispatch('setOffsetY', offsetY)
  }
  const _setHotSearchOffsetY = offsetY => {
    return store.dispatch('setHotSearchOffsetY', offsetY)
  }
  const _setFlapCardVisible = visible => {
    return store.dispatch('setFlapCardVisible', visible)
  }
  const _setIsEditMode = mode => {
    return store.dispatch('setIsEditMode', mode)
  }
  const _setShelfList = list => {
    return store.dispatch('setShelfList', list)
  }
  const _setShelfSelected = selected => {
    return store.dispatch('selected', selected)
  }
  const _setShelfTitleVisible = visible => {
    return store.dispatch('setShelfTitleVisible', visible)
  }
  const _setShelfCategory = category => {
    return store.dispatch('setShelfCategory', category)
  }
  const _setCurrentType = type => {
    return store.dispatch('setCurrentType', type)
  }
  return {
    offsetY,
    flapCardVisible,
    hotSearchOffsetY,
    isEditMode,
    shelfList,
    shelfSelected,
    shelfTitleVisible,
    shelfCategory,
    currentType,
    _setOffsetY,
    _setHotSearchOffsetY,
    _setFlapCardVisible,
    _setIsEditMode,
    _setShelfList,
    _setShelfSelected,
    _setShelfTitleVisible,
    _setShelfCategory,
    _setCurrentType
  }
}

export default useHomeStore
