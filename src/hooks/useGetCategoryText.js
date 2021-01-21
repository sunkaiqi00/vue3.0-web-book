const useGetCategoryText = (category, ctx) => {
  switch (category) {
    case 1:
      return ctx.$t('category.computerScience')
    case 2:
      return ctx.$t('category.socialSciences')
    case 3:
      return ctx.$t('category.economics')
    case 4:
      return ctx.$t('category.education')
    case 5:
      return ctx.$t('category.engineering')
    case 6:
      return ctx.$t('category.environment')
    case 7:
      return ctx.$t('category.geography')
    case 8:
      return ctx.$t('category.history')
    case 9:
      return ctx.$t('category.laws')
    case 10:
      return ctx.$t('category.lifeSciences')
    case 11:
      return ctx.$t('category.literature')
    case 12:
      return ctx.$t('category.biomedicine')
    case 13:
      return ctx.$t('category.businessandManagement')
    case 14:
      return ctx.$t('category.earthSciences')
    case 15:
      return ctx.$t('category.materialsScience')
    case 16:
      return ctx.$t('category.mathematics')
    case 17:
      return ctx.$t('category.medicineAndPublicHealth')
    case 18:
      return ctx.$t('category.philosophy')
    case 19:
      return ctx.$t('category.physics')
    case 20:
      return ctx.$t('category.politicalScienceAndInternationalRelations')
    case 21:
      return ctx.$t('category.psychology')
    case 22:
      return ctx.$t('category.statistics')
  }
}

export default useGetCategoryText
