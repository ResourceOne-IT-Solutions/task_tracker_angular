import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { ChatService } from '../chat.service';
import { DashBoardComponent } from 'src/app/components/dash-board/dash-board.component';
import { UserPageComponent } from 'src/app/components/user-page/user-page.component';
@Injectable()
export class adminGuard implements CanActivate {
  constructor(
    private router: Router,
    private chatservice: ChatService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    //forget about: how to get the authority of user (I have kept it in shared service)
    const token = this.chatservice.getToken();
    if (token) {
      let httpOptions = {
        headers: new HttpHeaders({
          Authorization: token,
        }),
      };
      return this.chatservice.getLoginSetup(httpOptions).pipe(
        map((res: any) => {
          route.component = res.isAdmin ? DashBoardComponent :UserPageComponent
          return true;
        }),
      );
    }
    return of(false)
  }
}