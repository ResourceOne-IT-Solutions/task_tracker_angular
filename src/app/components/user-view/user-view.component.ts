import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {
  userChatRequest: any;
  userTicketRequest: any;
  adminMessages: any;
  currentuser: any;
  constructor(private chatservice: ChatService) {}

  ngOnInit() {
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentuser = res;
    });

    this.chatservice.getChatMessages().subscribe((res: any) => {
      this.userChatRequest = res.filter(
        (val: any) => val.sender.id === this.currentuser._id,
      );

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
}
