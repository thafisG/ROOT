import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

export const requireOnboardingGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isAuthenticated()) return true;
  return router.parseUrl(userService.isOnboarded() ? '/login' : '/onboarding');
};

export const redirectIfOnboardedGuard: CanActivateFn = (route) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (route.queryParamMap.get('register') === '1') return true;

  if (userService.isAuthenticated()) return router.parseUrl('/dashboard');
  return userService.isOnboarded() ? router.parseUrl('/login') : true;
};
