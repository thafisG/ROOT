import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly prefix = 'root:';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  read<T>(key: string, fallback: T): T {
    if (!this.isBrowser) return fallback;
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  write<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch {
    }
  }

  clear(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.prefix + key);
  }
}
