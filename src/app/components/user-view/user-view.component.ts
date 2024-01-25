import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {
  userChatRequest: any;
  userTicketRequest: any;
  selectedChatUser: any = [];
  adminMessages: any;
  currentuser: any;
  constructor(
    private chatservice: ChatService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentuser = res;
    });

    this.chatservice.getChatMessages().subscribe((res: any) => {
      this.userChatRequest = res.filter(
        (val: any) => val.sender.id === this.currentuser._id,
      );
      console.log(this.userChatRequest, 'userchatrequest:::');
    });

    this.chatservice.getTickesRequest().subscribe((res: any) => {
      this.userTicketRequest = res.filter(
        (val: any) => val.sender.id === this.currentuser._id,
      );
    });

    this.chatservice.getAdminChatMessages().subscribe((res) => {
      this.adminMessages = res;
    });
  }
  chatRequestApproved(data: any) {
    console.log(data, 'dataaa:::::::');
    this.selectedChatUser = data;
    this.chatservice.chatRequests(this.selectedChatUser);
    this.router.navigate(['Chat-Box']);

    // this.selectedChatUser.push(data);
    // console.log(this.selectedChatUser , '4444');
    // const filteruser = this.selectedChatUser.filter((res:any) => {
    //   return res.opponent.id
    // });

    // console.log(filteruser , '47:::::::');
  }
  ticketRequestApproved() {
    console.log('ticketrequest');
  }
}
