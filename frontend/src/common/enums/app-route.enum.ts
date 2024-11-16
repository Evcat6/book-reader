enum AppRoute {
  ROOT = '/',
  NOT_FOUND = '/:catchAll(.*)',
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  UPLOAD_BOOK = '/books/upload',
  BOOKS_$TYPE = '/books/:type',
  BOOKS = '/books',
  BOOK_$ID = '/book/:id',
  PROFILE = '/profile'
}

export { AppRoute };
