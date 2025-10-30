import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

interface ContextData {
  requestId?: string;
  userId?: string;
  [key: string]: any; // Permite armazenar outros dados dinamicamente
}

@Injectable()
export class Context {
  private readonly storage = new AsyncLocalStorage<ContextData>();

  run(context: ContextData, callback: () => void): void {
    this.storage.run(context, callback);
  }

  get<T = any>(key: keyof ContextData): T | undefined {
    const store = this.storage.getStore();
    return store ? store[key] : undefined;
  }

  getAll(): ContextData | undefined {
    const data = this.storage.getStore();
    if (!data) {
      return {};
    }
    return data;
  }

  set(key: keyof ContextData, value: any): void {
    const store = this.storage.getStore();
    if (store) {
      store[key] = value;
    }
  }
}
