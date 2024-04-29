import { StorageService } from './storage/storage.service';
import { NotificationService } from './notification/notification.service';
import { HttpService } from './http/http.service';
import { notify } from '@kyvg/vue3-notification';
import { ConfigService } from './config/config.service';
import { EnvironmentConfig } from '@/common/types/environment-config.type';
import { AuthApiService } from './auth-api/auth-api.service';
import { API_BASE_ENDPOINT } from '@/common/enums/api-base-endpoint.enum';
import { UserService } from './user-api/user-api.service';
import { BooksApiService } from './books-api/books-api.service';

const configService = new ConfigService(import.meta.env as EnvironmentConfig);

const notificationService = new NotificationService(notify);

const storageService = new StorageService(window.localStorage);

const httpService = new HttpService(storageService, configService.getApiUrl());

const authApiService = new AuthApiService(httpService, API_BASE_ENDPOINT.AUTH);

const userApiService = new UserService(httpService, API_BASE_ENDPOINT.USERS);

const booksApiService = new BooksApiService(httpService, API_BASE_ENDPOINT.BOOKS);

export {
  storageService,
  notificationService,
  httpService,
  configService,
  authApiService,
  userApiService,
  booksApiService,
};
