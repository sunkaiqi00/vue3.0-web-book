import { addCss, clearCss } from './useCssDom'
import useBookStore from './useBookStore'

const { defaultTheme } = useBookStore()

export default function useInitGlobalStyle() {
  // 先清除
  clearCss()
  switch (defaultTheme.value) {
    case 'Default':
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
      break
    case 'Eye':
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
      break
    case 'Gold':
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
      break
    case 'Night':
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
      break
    default:
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
      break
  }
}
