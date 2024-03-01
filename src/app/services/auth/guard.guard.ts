import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
} from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { ChatService } from '../chat.service';
import { HttpHeaders } from '@angular/common/http';
import { DashBoardComponent } from 'src/app/components/dash-board/dash-board.component';
import { UserPageComponent } from 'src/app/components/user-page/user-page.component';
import { Store } from '@ngrx/store';
import { loadTable } from 'src/app/chat-store/table.actions';

@Injectable()
export class guardGuard implements CanActivate {
  constructor(
    private router: Router,
    private chatservice: ChatService,
    private store: Store,
    private activateRoute: ActivatedRoute,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const token = this.chatservice.getToken();
    // if (token) {
    return this.chatservice.UserLoginData.pipe(
      map((res: any) => {
        if (res) {
          if (route.routeConfig && route.routeConfig.path === 'login_page') {
            this.router.navigate(['/dashboard']);
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
    // } else {
    // if (route.routeConfig && route.routeConfig.path === 'login_page') {
    //   return of(true);
    // } else {
    //     this.router.navigate(['/']);
    //     return of(true);
    //   }
    // }
  }
}
