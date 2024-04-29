import { StorageKey } from '@/common/enums/storage-key.enum';
import { ValueOf } from '@/common/types';

class StorageService {
  constructor(private store: globalThis.Storage) {}

  public set(key: ValueOf<typeof StorageKey>, value: string) {
    this.store.setItem(key as string, value);
  }

  public get<R = string>(key: ValueOf<typeof StorageKey>): R {
    return this.store.getItem(key as string) as R;
  }

  public drop(key: ValueOf<typeof StorageKey>) {
    this.store.removeItem(key as string);
  }

  public async has(key: ValueOf<typeof StorageKey>) {
    const value = this.get(key);

    return Boolean(value);
  }
}

export { StorageService };
