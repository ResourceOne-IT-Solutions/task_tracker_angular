import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { ChatService } from '../chat.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class guardGuard implements CanActivate {

  constructor(private router: Router, private chatservice: ChatService) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    
    //forget about: how to get the authority of user (I have kept it in shared service)  
    const token = this.chatservice.getToken()
    console.log(this.chatservice.getToken(), "token" , route)
    if (token) {
      let httpOptions = {
        headers: new HttpHeaders({
          Authorization: token,
        })
      }
      if( route.routeConfig && route.routeConfig.path === 'login_page'){
        this.router.navigate(['/dashboard'])
      }
      return this.chatservice.getLoginSetup(httpOptions).pipe(map((res: any) => {
        this.chatservice.UserLogin(res)
        return true
      }))
    } else {
      if( route.routeConfig && route.routeConfig.path === 'login_page'){
        return of(true)
      }else{
        this.router.navigate(['/'])
        return of(false)
      }
    }
  }
}
