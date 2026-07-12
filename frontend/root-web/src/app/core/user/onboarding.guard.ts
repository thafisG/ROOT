import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

export const requireOnboardingGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.isOnboarded() ? true : router.parseUrl('/onboarding');
};

export const redirectIfOnboardedGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.isOnboarded() ? router.parseUrl('/dashboard') : true;
};
