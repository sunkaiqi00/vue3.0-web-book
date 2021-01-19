import { computed } from 'vue'
import useBookStore from './useBookStore'

const { navigation, section } = useBookStore()

const useGetSectionName = computed(() => {
  // if (section.value) {
  //   // 通过章节数(第几章)获取章节信息
  //   const sectionInfo = currentBook.value.section(section.value)
  //   if (
  //     sectionInfo &&
  //     sectionInfo.href &&
  //     currentBook.value &&
  //     currentBook.value.navigation
  //   ) {
  //     // 通过当前章节的href获取目录信息   navigation 电子书目录
  //     const title = currentBook.value.navigation.get(sectionInfo.href)
  //     return `${section.value}. ${title.label}`
  //   }
  // }
  // 通过章节(数) 从目录中获取对应章节的标题
  if (navigation.value) {
    return section.value ? `${section.value}. ${navigation.value[section.value].label}` : ''
  }
})

export default useGetSectionName
