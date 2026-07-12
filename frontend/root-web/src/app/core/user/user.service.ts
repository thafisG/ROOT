import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { UserProfile } from '../../features/onboarding/models/onboarding.models';

const STORAGE_KEY = 'user-profile';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly storage = inject(StorageService);

  private readonly _profile = signal<UserProfile | null>(
    this.storage.read<UserProfile | null>(STORAGE_KEY, null),
  );

  readonly profile = this._profile.asReadonly();
  readonly isOnboarded = computed(() => this._profile() !== null);

  saveProfile(profile: UserProfile): void {
    this._profile.set(profile);
    this.storage.write(STORAGE_KEY, profile);
  }

  clearProfile(): void {
    this._profile.set(null);
    this.storage.clear(STORAGE_KEY);
  }
}
