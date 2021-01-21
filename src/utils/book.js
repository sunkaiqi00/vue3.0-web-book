import { realPx } from './utils'

export const fontSizeList = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]
export const fontFamiltList = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]

export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          color: '#4c5059',
          background: '#cecece',
          'padding-top': `${realPx(40)}px!important`, // 为电子书 body增加上下内边距
          'padding-bottom': `${realPx(40)}px!important`
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          color: '#5c5b56',
          background: '#c6c2b6',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          color: '#404c42',
          background: '#a9c1a9',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          color: '#cecece',
          background: '#000000',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        }
      }
    }
  ]
}

export const categoryList = {
  ComputerScience: 1,
  SocialSciences: 2,
  Economics: 3,
  Education: 4,
  Engineering: 5,
  Environment: 6,
  Geography: 7,
  History: 8,
  Laws: 9,
  LifeSciences: 10,
  Literature: 11,
  Biomedicine: 12,
  BusinessandManagement: 13,
  EarthSciences: 14,
  MaterialsScience: 15,
  Mathematics: 16,
  MedicineAndPublicHealth: 17,
  Philosophy: 18,
  Physics: 19,
  PoliticalScienceAndInternationalRelations: 20,
  Psychology: 21,
  Statistics: 22
}
