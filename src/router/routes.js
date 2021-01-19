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
        name: 'store-home',
        component: () => import('../views/store/StoreHome.vue')
      }
    ]
  }
]

export default routes
