import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent {
  data: any
  isAdmin: boolean=false;
  constructor(private chatservice: ChatService) { }
  ngOnInit() {
    this.data = localStorage.getItem("currentTaskUser")
    // let customHeaders = new Headers({ Authorization:this.data });
    // console.log(customHeaders,'17::::')
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.data,
      })
    }
    this.chatservice.getLoginSetup(httpOptions).subscribe((res: any) => {
      this.isAdmin = res.isAdmin;
      this.chatservice.UserLogin(res)
    })

  }


}
