import { ContentType, HttpHeader, StorageKey } from '@/common/enums';
import { HttpMethod } from '@/common/enums/http-method.enum';
import { HttpError } from '@/common/exceptions';
import type { HttpApiResponse, HttpOptions } from '@/common/types';

import type { StorageService } from '../storage/storage.service';

class HttpService {
  public constructor(private storage: StorageService, private baseUrl: string) {}

  public load(endpoint: string, options: HttpOptions): Promise<HttpApiResponse> {
    const {
      method = HttpMethod.GET,
      payload = null,
      hasAuth = true,
      contentType = ContentType.APPLICATION_JSON,
      query,
    } = options;
    const headers = this.getHeaders({
      hasAuth,
      contentType,
    });

    return fetch(this.getUrl(`${this.baseUrl}/${endpoint}`, query), {
      method,
      headers,
      body: payload,
    })
      .then(this.checkStatus.bind(this))
      .catch(this.throwError.bind(this)) as Promise<HttpApiResponse>;
  }

  private async checkStatus(response: Response): Promise<Response> {
    if (!response.ok) {
      const parsedException = await response.json().catch(() => ({
        message: response.statusText,
      }));

      throw new HttpError({
        status: response.status,
        message: parsedException?.message,
      });
    }

    return response;
  }

  private getHeaders({ hasAuth, contentType }: { hasAuth: boolean; contentType: ContentType }): Headers {
    const headers = new Headers();

    if (contentType !== ContentType.MULTIPART_FORM_DATA) {
      headers.append(HttpHeader.CONTENT_TYPE, contentType);
    }

    if (hasAuth) {
      const token = this.storage.get(StorageKey.TOKEN);

      headers.append(HttpHeader.AUTHORIZATION, `Bearer ${token}`);
    }

    return headers;
  }

  private getUrl(url: string, query?: Record<string, string | number | boolean>): string {
    return `${url}${query ? '?' + this.getQuery(query) : ''}`;
  }

  private getQuery(query: Record<string, string | number | boolean>): string {
    return Object.keys(query)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
      .join('&');
  }

  private throwError(error: unknown): void {
    throw error;
  }
}

export { HttpService };
