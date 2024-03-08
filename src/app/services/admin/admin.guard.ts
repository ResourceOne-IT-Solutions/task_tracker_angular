import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { ChatService } from '../chat.service';
import { DashBoardComponent } from 'src/app/components/dash-board/dash-board.component';
import { UserPageComponent } from 'src/app/components/user-page/user-page.component';
import { Store } from '@ngrx/store';
@Injectable()
export class adminGuard implements CanActivate {
  constructor(
    private router: Router,
    private chatservice: ChatService,
    private store: Store,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    //forget about: how to get the authority of user (I have kept it in shared service)
    return new Observable<boolean>((observer) => {
      window.navigator.geolocation.getCurrentPosition((location: any) => {
        const latitude = location?.coords?.latitude;
        const longitude = location?.coords?.longitude;
        return this.chatservice
          .get(`/get-user?latitude=${latitude}&longitude=${longitude}`)
          .subscribe(
            (res: any) => {
              this.chatservice.UserLogin(res);
              route.component = res.isAdmin
                ? DashBoardComponent
                : UserPageComponent;
              observer.next(true);
              observer.complete();
            },
            (error) => {
              console.log('Error occurred:', error);
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              this.router.navigate(['login_page']);
              observer.next(false);
              observer.complete();
            },
          );
      });
    });
  }
}
