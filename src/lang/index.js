import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'
import { getLanguage, saveLanguage } from '@/utils/localStorage'

let locale = getLanguage()

if (!locale) {
  locale = 'zh'
  saveLanguage(locale)
}

const i18n = createI18n({
  locale,
  messages: {
    en,
    zh
  }
})

export default i18n
