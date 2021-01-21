const routes = [
  {
    path: '/',
    redirect: '/store'
  },
  {
    path: '/ebook',
    name: 'ebook',
    component: () => import('../views/ebook/index.vue'),
    children: [
      {
        path: ':fileName',
        component: () => import('../components/ebook/EbookReader.vue')
      }
    ]
  },
  {
    path: '/store',
    name: 'store',
    redirect: '/store/home',
    component: () => import('../views/store/index.vue'),
    children: [
      {
        path: 'home',
        name: 'storehome',
        component: () => import('../views/store/StoreHome.vue')
      },
      {
        path: 'list',
        name: 'storelist',
        component: () => import('@/views/store/StoreList.vue')

      },
      {
        path: 'detail',
        name: 'storedetail',
        component: () => import('@/views/store/BookDetail.vue')

      },
      {
        path: 'shelf',
        component: () => import('@/views/store/StoreShelf.vue')
      }
      // {
      //   path: 'category',
      //   name:'storecategory',
      //   component: () => import('@/views/store/StoreCategory.vue')

      // }
    ]
  }
]

export default routes
