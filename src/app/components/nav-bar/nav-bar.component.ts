import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  adminStatus = ['Offline', 'Break', 'Available', 'On Ticket'];

  @Input() 'isAdmin': boolean;

  statuschange: any;
  @Input() userDetails: any;
  Status: any;
  constructor(
    private router: Router,
    private chatservice: ChatService,
  ) {}
  ngOnInit() {
    console.log(this.userDetails , '23:::::::::')
    this.Status = this.userDetails.status;

    this.chatservice.getSocketData('statusUpdate').subscribe(res=>{
      console.log(res , '27:::::::::::::::::::::')
    })
  }
  logout() {
    this.deleteCookie('token');

      const logoutpayload = {
        id : this.userDetails._id,
      }
      this.chatservice.sendSocketData({key : 'logout' ,data : logoutpayload.id})
      console.log(logoutpayload , 'logoutpayload')
      this.router.navigate(['/']);
  

      // this.chatservice.getSocketData('eventName').subscribe(res=> {
      //   console.log(res , '42::::::');
      // })
  }
  changeStatus(data: any) {
    this.statuschange = data;
    // console.log(data , 'admin status')
    const updatePayload = {
      id: this.userDetails._id,
      status: this.Status,
    };
    this.chatservice.sendSocketData({
      key: 'changeStatus',
      data: updatePayload,
    });
    console.log(updatePayload, 'statuspayload');
  }
  deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  }
  OpenChatBox() {
    this.router.navigate(['Chat-Box']);
  }
  ViewQequest() {
    this.router.navigate(['view-requestPage']);
    console.log('view42:');
  }
  ViewTicket() {
    this.router.navigate(['tickets']);
  }
  user() {
    this.router.navigate(['user-view-request']);
  }
}
