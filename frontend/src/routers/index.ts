import { Layout } from '../components/components';
import { RouteLocation, createRouter, createWebHistory } from 'vue-router';
import { Auth, UploadBook, NotFound, Books, Book } from '../pages';
import { AppRoute, DataStatus, StorageKey } from '../common/enums';
import { storageService } from '@/services';
import { useUserStore } from '@/stores/user.store';

const routes = [
  {
    path: AppRoute.ROOT,
    component: Layout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: AppRoute.UPLOAD_BOOK,
        component: UploadBook,
      },
      {
        name: 'books',
        path: AppRoute.BOOKS_$TYPE,
        component: Books,
      },
      {
        path: AppRoute.BOOKS,
        redirect: () => {
          return '/books/all';
        },
      },
      {
        path: AppRoute.BOOK_$ID,
        component: Book,
      },
    ],
    redirect: (to: RouteLocation) => {
      if (to.path === AppRoute.ROOT) {
        return AppRoute.BOOKS_$TYPE;
      }
      return to.path;
    },
  },
  {
    path: AppRoute.NOT_FOUND,
    component: NotFound,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: AppRoute.LOGIN,
    component: Auth,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: AppRoute.REGISTER,
    component: Auth,
    meta: {
      requiresAuth: false,
    },
  },
];

const publicRoutes = routes.filter((route) => !route.meta.requiresAuth).map((route) => route.path);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  if (to.meta.requiresAuth) {
    const token = storageService.get(StorageKey.TOKEN);
    if (!token) return next(AppRoute.LOGIN);

    const userStore = useUserStore();

    if (userStore.dataStatus === DataStatus.FULFILLED) return next();

    await userStore.load();
    if (userStore.dataStatus === DataStatus.REJECTED) return next(AppRoute.LOGIN);
  }
  if (!to.meta.requiresAuth) {
    const token = storageService.get(StorageKey.TOKEN);
    if (token && publicRoutes.includes(to.path as AppRoute)) return next(AppRoute.BOOKS_$TYPE);
  }
  next();
});

export { router };
