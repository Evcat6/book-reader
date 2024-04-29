import { ExceptionName, HttpCode } from '@/common/enums';

const DEFAULT_MESSAGE = 'Network Error';

class HttpError extends Error {
  public status?: HttpCode;
  public constructor({ status = HttpCode.INTERNAL_SERVER_ERROR, message = DEFAULT_MESSAGE } = {}) {
    super(message);
    this.status = status;
    this.name = ExceptionName.HTTP_ERROR;
  }
}

export { HttpError };
