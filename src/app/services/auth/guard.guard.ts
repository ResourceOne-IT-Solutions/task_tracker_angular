import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class guardGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

    //forget about: how to get the authority of user (I have kept it in shared service)   

    const data: any = localStorage.getItem('userData')
    const userdata = JSON.parse(data)
    if (userdata && userdata?.userId) {
      return of(true)
    } else {
      this.router.navigate(['/login_page'])
      return of(false)
    }
  }
}
