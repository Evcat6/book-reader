import type { EnvironmentConfig } from '@/common/types/environment-config.type';

class ConfigService {
  public constructor(private environment: EnvironmentConfig) {}

  public getApiUrl(): string {
    return this.environment.VITE_API_URL;
  }
}

export { ConfigService };
