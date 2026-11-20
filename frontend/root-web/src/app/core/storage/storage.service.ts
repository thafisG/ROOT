import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ZodType } from 'zod';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly prefix = 'root:';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  read<T>(key: string, fallback: T, schema?: ZodType<T>): T {
    if (!this.isBrowser) return fallback;

    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return fallback;

      const value: unknown = JSON.parse(raw);
      if (!schema) return value as T;

      const result = schema.safeParse(value);
      if (result.success) {
        if (JSON.stringify(result.data) !== raw) this.write(key, result.data);
        return result.data;
      }

      console.warn(`Dados inválidos em "${key}"; usando o valor padrão.`);
      this.clear(key);
      return fallback;
    } catch (error) {
      console.error(`Erro ao ler "${key}" do localStorage.`, error);
      return fallback;
    }
  }

  write<T>(key: string, value: T): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar "${key}" no localStorage.`, error);
    }
  }

  clear(key: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error(`Erro ao remover "${key}" do localStorage.`, error);
    }
  }
}
