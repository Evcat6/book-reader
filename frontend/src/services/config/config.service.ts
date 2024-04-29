import { EnvironmentConfig } from '@/common/types/environment-config.type';

class ConfigService {
  constructor(private environment: EnvironmentConfig) {}

  public getApiUrl() {
    return this.environment.VITE_API_URL;
  }
}

export { ConfigService };
