import { Layout } from "../components/components";
import { createRouter, createWebHistory } from 'vue-router';
import { Auth, UploadBook, NotFound } from '../pages/pages';
import { AppRoutes } from '../common/enums/enums';

const routes = [
  {
    path: AppRoutes.ROOT,
    component: Layout,
    children: [
      {
        path: AppRoutes.UPLOAD_BOOK,
        component: UploadBook
      }
    ]
  },
  {
    path: AppRoutes.NOT_FOUND,
    component: NotFound
  },
  {
    path: AppRoutes.LOGIN,
    component: Auth,
  },
  {
    path: AppRoutes.REGISTER,
    component: Auth,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router };
