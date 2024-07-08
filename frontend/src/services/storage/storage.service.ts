import type { StorageKey } from '@/common/enums/storage-key.enum';
import type { ValueOf } from '@/common/types';

class StorageService {
  public constructor(private store: globalThis.Storage) {}

  public set(key: ValueOf<typeof StorageKey>, value: string): void {
    this.store.setItem(key as string, value);
  }

  public get<R = string>(key: ValueOf<typeof StorageKey>): R {
    return this.store.getItem(key as string) as R;
  }

  public drop(key: ValueOf<typeof StorageKey>): void {
    this.store.removeItem(key as string);
  }

  public has(key: ValueOf<typeof StorageKey>): boolean {
    const value = this.get(key);

    return Boolean(value);
  }
}

export { StorageService };
