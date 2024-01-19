import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  adminStatus = ['Offline', 'Busy', 'Available'];
  isAdminStatus: boolean = false;
  @Input() 'isAdmin' :boolean 
  statuschange: any;
  @Input() userDetails: any;
  Status:any
  constructor(private router :Router, private chatservice :ChatService){}
  ngOnInit(){
    this.Status = this.userDetails.status
  }
  Logout() {
    this.deleteCookie('token')
    this.router.navigate(['/'])
  }
  updateAdminStatus() {
    this.isAdminStatus = !this.isAdminStatus
  }
  changeStatus(data: any) {
    this.statuschange = data
    // console.log(data , 'admin status')
    const updatePayload = {
      id: this.userDetails._id,
      status: this.statuschange
    }
    this.chatservice.sendSocketData({ key: 'changeStatus', data: updatePayload })
    console.log(updatePayload, 'statuspayload')
  }
  deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  }
}
