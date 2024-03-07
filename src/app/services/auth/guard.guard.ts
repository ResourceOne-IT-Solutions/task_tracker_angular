import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { ChatService } from '../chat.service';
import { Store } from '@ngrx/store';

@Injectable()
export class guardGuard implements CanActivate {
  constructor(
    private router: Router,
    private chatservice: ChatService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const token = this.chatservice.getToken();
    return this.chatservice.UserLoginData.pipe(
      map((res: any) => {
        if (res) {
          if (route.routeConfig && route.routeConfig.path === 'login_page') {
            this.router.navigate(['/dashboard']);
            return true;
          }
          return true;
        } else {
          if (token) {
            this.router.navigate(['/dashboard']);
          }
          return true;
        }
      }),
    );
  }
}
