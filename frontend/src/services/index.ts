import { notify } from '@kyvg/vue3-notification';

import { API_BASE_ENDPOINT } from '@/common/enums/api-base-endpoint.enum';
import type { EnvironmentConfig } from '@/common/types/environment-config.type';

import { AuthApiService } from './auth-api/auth-api.service';
import { BooksApiService } from './books-api/books-api.service';
import { ConfigService } from './config/config.service';
import { HttpService } from './http/http.service';
import { NotificationService } from './notification/notification.service';
import { StorageService } from './storage/storage.service';
import { UserService } from './user-api/user-api.service';
import { GenresApiService } from './genres-api/genres-api.service';

const configService = new ConfigService(import.meta.env as EnvironmentConfig);

const notificationService = new NotificationService(notify);

const storageService = new StorageService(window.localStorage);

const httpService = new HttpService(storageService, configService.getApiUrl());

const authApiService = new AuthApiService(httpService, API_BASE_ENDPOINT.AUTH);

const userApiService = new UserService(httpService, API_BASE_ENDPOINT.USERS);

const booksApiService = new BooksApiService(httpService, API_BASE_ENDPOINT.BOOKS);

const genresApiService = new GenresApiService(httpService, API_BASE_ENDPOINT.GENRES);

export {
  authApiService,
  booksApiService,
  configService,
  httpService,
  notificationService,
  storageService,
  userApiService,
  genresApiService,
};
