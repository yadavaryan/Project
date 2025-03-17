import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChildFn, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginService } from './login.service';

export const canActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  
  const authService = inject(LoginService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/auth']);
    return of(false);
  }

  return authService.isloggin(token).pipe(
    map((isvalid) => {
      if (isvalid) {
        return true
      } else {
        router.navigate(['/auth']); 
        return false
      }
    }),
    catchError((error) => {
      router.navigate(['/auth']);
      localStorage.removeItem('token') 
      return of(false); 
    })
  );
};

export const canActivateChildGuard: CanActivateChildFn = canActivateGuard;
