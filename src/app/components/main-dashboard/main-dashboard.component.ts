import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent {
  data: any
  'isAdmin$': Observable<any>;
  constructor(private chatservice: ChatService) { }
  ngOnInit() {
    this.data = localStorage.getItem("currentTaskUser")
    this.chatservice.getSocketData('error').subscribe(res => {
      console.log('SOCKET ERROR:::', res)
    })
    // let customHeaders = new Headers({ Authorization:this.data });
    // console.log(customHeaders,'17::::')
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.data,
      })
    }
    this.isAdmin$ = this.chatservice.getLoginSetup(httpOptions).pipe(map((res: any) => {
      this.chatservice.UserLogin(res)
      return res
    }))

  }


}
