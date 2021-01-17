import useBookStore from './useBookStore'

const {
  _setMenuVisible,
  _setSettingVisible,
  _setFontFamilyVisible
} = useBookStore()

const useHideTitleAndMenu = () => {
  _setMenuVisible(false)
  _setSettingVisible(-1)
  _setFontFamilyVisible(false)
}

export default useHideTitleAndMenu
