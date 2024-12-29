import type { EnvironmentConfig } from '@/common/types/environment-config.type';

class ConfigService {
  public constructor(private environment: EnvironmentConfig) {}

  public getApiEndpoint(): string {
    return this.environment.VITE_API_URL;
  }

  public getApiUrl(): string {
    return this.environment.VITE_APP_PROXY_SERVER_URL;
  }
}

export { ConfigService };
