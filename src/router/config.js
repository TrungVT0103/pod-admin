import { LayoutAuth, LayoutDefault } from '@/components/layouts'
import RouteWrapper from '@/components/layouts/RouteWrapper'

export const publicRoute = [
  {
    path: '*',
    component: () => import('@/views/error/NotFound.vue'),
  },
  {
    path: '/auth',
    component: LayoutAuth,
    meta: {
      title: 'Login',
    },
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        meta: {
          title: 'Login',
        },
        component: () => import('@/views/auth/Login.vue'),
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    meta: {
      title: 'Not Found',
    },
    component: () => import('@/views/error/NotFound.vue'),
  },

  {
    path: '/500',
    name: '500',
    meta: {
      title: 'Server Error',
    },
    component: () => import('@/views/error/Error.vue'),
  },
]

export const protectedRoute = [
  {
    path: '/',
    component: LayoutDefault,
    meta: {
      title: 'home',
      icon: '',
    },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: 'dashboard',
          icon: 'mdi-view-dashboard',
        },
        component: () => import('@/views/dashboard/Dashboard.vue'),
      },
      //account
      {
        path: '/account',
        meta: {
          title: 'Accounts',
          icon: 'mdi-account-group-outline',
        },
        name: 'account',
        component: () => import('@/views/account/Account.vue'),
      },
      {
        path: '/help',
        component: RouteWrapper,
        meta: {
          title: 'Help',
          icon: 'mdi-help-circle-outline ',
        },
        redirect: '/post-group/list',
        children: [
          {
            path: '/post-group',
            name: 'PostGroup',
            meta: {
              title: 'Groups',
              icon: 'mdi-select-group',
            },
            component: RouteWrapper,
            redirect: '/post-group/list',
            children: [
              {
                path: '/post-group/list',
                name: 'ListPostGroup',
                meta: {
                  title: 'List',
                  hidden: true,
                },
                component: () => import('@/views/post-group/List.vue'),
              },
              {
                path: '/post-group/create',
                name: 'CreatePostGroup',
                meta: {
                  title: 'Create Post Group',
                  hidden: true,
                },
                component: () => import('@/views/post-group/Create.vue'),
              },
              {
                path: '/post-group/update/:id',
                name: 'UpdatePostGroup',
                meta: {
                  title: 'Update Post Group',
                  hidden: true,
                },
                component: () => import('@/views/post-group/Update.vue'),
              },
            ],
          },
          // Category
          {
            path: '/category',
            name: 'category',
            meta: {
              title: 'Categories',
              icon: 'mdi-shape',
            },
            component: RouteWrapper,
            redirect: '/category/list',
            children: [
              {
                path: 'list',
                name: 'category.list',
                meta: {
                  hidden: true,
                  title: 'List',
                },
                component: () => import('@/views/category/List'),
              },
              {
                path: 'create',
                name: 'category.create',
                meta: {
                  hidden: true,
                  title: 'Create',
                },
                component: () => import('@/views/category/Create'),
              },
              {
                path: '/category/update/:id',
                name: 'category.update',
                meta: {
                  hidden: true,
                  title: 'Update',
                },
                component: () => import('@/views/category/Update'),
              },
            ],
          },
          // Post
          {
            path: '/posts',
            name: 'posts',
            meta: {
              title: 'Posts',
              icon: 'mdi-post',
            },
            component: RouteWrapper,
            redirect: '/post/list',
            children: [
              {
                path: '/post/list',
                name: 'post.list',
                meta: {
                  hidden: true,
                  title: 'List',
                },
                component: () => import('@/views/post/List'),
              },
              {
                path: '/post/create',
                name: 'post.create',
                meta: {
                  hidden: true,
                  title: 'Create',
                },
                component: () => import('@/views/post/CreatePost'),
              },
              {
                path: '/post/update/:id',
                name: 'post.update',
                meta: {
                  hidden: true,
                  title: 'Update',
                },
                component: () => import('@/views/post/CreatePost'),
              },
            ],
          },
        ],
      },
      //Color pick
      {
        path: '/lattehub',
        component: RouteWrapper,
        meta: {
          title: 'Lattehub',
          icon: 'mdi-form-textbox',
        },
        redirect: '/printhub/color',
        children: [
          {
            path: '/lattehub/catalog/create',
            name: 'lattehub.catalog.create',
            meta: {
              hidden: true,
              icon: 'mdi-alpha-c',
            },
            component: () => import('@/views/catalog/Create.vue'),
          },
          {
            path: '/lattehub/catalog/edit/:id',
            name: 'lattehub.catalog.edit',
            meta: {
              hidden: true,
              icon: 'mdi-alpha-c',
            },
            component: () => import('@/views/catalog/Create.vue'),
          },
          {
            path: '/printhub/color',
            name: 'printhub.color',
            meta: {
              title: 'Color',
              icon: 'mdi-alpha-c',
            },
            component: () => import('@/views/printhub/Color.vue'),
          },
          {
            path: '/printhub/size',
            name: 'printhub.size',
            meta: {
              title: 'Size',
              icon: 'mdi-alpha-s',
            },
            component: () => import('@/views/printhub/Size.vue'),
          },
          {
            path: '/printhub/mockup',
            name: 'printhub.mockup',
            meta: {
              title: 'Mockup Types',
              icon: 'mdi-alpha-m',
            },
            component: () => import('@/views/printhub/Mockup.vue'),
          },
          {
            path: '/lattehub/catalog',
            name: 'lattehub.catalog',
            meta: {
              title: 'Catalog',
              icon: 'mdi-drag-variant',
            },
            component: () => import('@/views/catalog/index.vue'),
          },
          {
            path: '/lattehub/template',
            name: 'lattehub.template',
            meta: {
              hidden: true,
              title: 'Template',
              icon: 'mdi-alpha-t',
            },
            component: () => import('@/views/template/index.vue'),
          },
          {
            path: '/lattehub/template/:id/mockup/:mockupId',
            name: 'lattehub.template.edit',
            meta: {
              hidden: true,
              icon: 'mdi-alpha-c',
            },
            component: () => import('@/views/template/Create.vue'),
          },
          {
            path: '/lattehub/template/create/:mockupId',
            name: 'lattehub.template.create',
            meta: {
              // title: 'Template',
              hidden: true,
              icon: 'mdi-alpha-t',
            },
            component: () => import('@/views/template/Create.vue'),
          },
        ],
      },
    ],
  },
  //media
  // {
  //   path: '/media',
  //   meta: {
  //     title: 'media',
  //     icon: 'mdi-image',
  //   },
  //   name: 'media',
  //   component: LayoutMedia,
  //   redirect: '/media/file',
  //   children: [
  //     {
  //       path: '/media/file',
  //       name: 'media.index',
  //       meta: {
  //         title: 'media manager',
  //         icon: 'mdi-view',
  //       },
  //       component: () => import('@/views/media/MediaView.vue'),
  //     },
  //     {
  //       path: '/media/:type',
  //       name: 'media.type',
  //       meta: {
  //         title: 'media manager',
  //         icon: 'mdi-view',
  //       },
  //       props: true,
  //       component: () => import('@/views/media/MediaView.vue'),
  //     },
  //   ],
  // },
  // chat app
  // {
  //   path: '/chat',
  //   name: 'Chat',
  //   component: LayoutChat,
  //   redirect: {
  //     path: '/chat/messaging',
  //   },
  //   meta: {
  //     title: 'Chat',
  //     icon: 'chat_bubble',
  //   },
  //   children: [
  //     {
  //       path: '/chat/messaging/:uuid?',
  //       name: 'ChatMessaging',
  //       props: true,
  //       component: () => import('@/views/chat/ChatMessaging.vue'),
  //     },
  //   ],
  // },
]
