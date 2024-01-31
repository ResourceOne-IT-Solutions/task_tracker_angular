import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';


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
    private loader: NgxSpinnerService,

  ) {}

  ngOnInit() {
    this.loader.show();
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentuser = res;
    });

    this.chatservice.getChatMessages().subscribe((res: any) => {
      this.userChatRequest = res.filter(
        (val: any) => val.sender.id === this.currentuser._id,
      );
      this.loader.hide();
    });

    this.chatservice.getTickesRequest().subscribe((res: any) => {
      this.userTicketRequest = res.filter(
        (val: any) => val.sender.id === this.currentuser._id,
      );
      this.loader.hide();
    });

    this.chatservice.getAdminChatMessages().subscribe((res) => {
      this.adminMessages = res;
      this.loader.hide();
    });
  }
  chatRequestApproved(data: any) {
    this.selectedChatUser = data;
    this.chatservice.chatRequests(this.selectedChatUser);
    this.router.navigate(['Chat-Box']);
  }
  ticketRequestApproved(data: any) {
    this.chatservice.ticketRequests(data);
    this.router.navigate(['tickets'])
  }
  updateMessage(message:any){
    console.log(message , "message")
    const payload = {
      status : 'SEEN',
      messageId : message._id , 
      userId :this.currentuser._id,
    }
    message.viewedBy.push(this.currentuser._id)
    this.chatservice.sendSocketData({key:'updateAdminMessageStatus' , data :payload})
  }

}
