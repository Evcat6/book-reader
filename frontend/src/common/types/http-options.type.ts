import { type ContentType, type HttpMethod } from '../enums';

type HttpOptions = {
  method: HttpMethod;
  payload?: BodyInit | null;
  hasAuth?: boolean;
  contentType?: ContentType;
  query?: Record<string, string | number | boolean>;
};

export { type HttpOptions };
