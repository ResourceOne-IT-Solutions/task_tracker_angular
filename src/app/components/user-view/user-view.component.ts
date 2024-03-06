import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import {
  ADMIN_MESSAGES,
  CHATMESSAGES,
  TICKETREQUESTMESSAGES,
} from 'src/app/utils/Constants';
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
  SelectedRequests = ADMIN_MESSAGES;
  ADMIN_MESSAGES: any = ADMIN_MESSAGES;
  TICKETREQUESTMESSAGES: any = TICKETREQUESTMESSAGES;
  CHATMESSAGES: any = CHATMESSAGES;
  constructor(
    private chatservice: ChatService,
    private router: Router,
    private loader: NgxSpinnerService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit() {
    this.loader.show();
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentuser = res;
    });

    this.chatservice
      .getChatMessageById(this.currentuser._id)
      .subscribe((res) => {
        this.userChatRequest = res;
        this.loader.hide();
      });
    this.chatservice
      .getTickesRequestMesgById(this.currentuser._id)
      .subscribe((res) => {
        this.userTicketRequest = res;
        this.loader.hide();
      });

    this.chatservice
      .getSocketData('userRequestApproved')
      .subscribe(({ type, result }) => {
        if (result.sender.id === this.currentuser._id) {
          if (type === 'TICKET') {
            const ticket = this.userTicketRequest.map((tkt: any) => {
              if (tkt._id === result._id) {
                return result;
              }
              return tkt;
            });
            this.userTicketRequest = ticket;
          }
          if (type === 'CHAT') {
            const chat = this.userChatRequest.map((chat: any) => {
              if (chat._id === result._id) {
                return result;
              }
              return chat;
            });
            this.userChatRequest = chat;
          }
        }
      });
    this.chatservice.getAdminChatMessages().subscribe((res) => {
      this.adminMessages = res;
      this.loader.hide();
    });
  }
  chatRequestApproved(data: any) {
    this.selectedChatUser = data;
    this.chatservice.chatRequests(this.selectedChatUser);
    this.router.navigate(['../Chat-Box'], { relativeTo: this.route });
  }
  ticketRequestApproved(data: any) {
    this.router.navigate(['../tickets/client', data.client.id], {
      relativeTo: this.route,
    });
  }
  updateMessage(message: any) {
    const payload = {
      status: 'SEEN',
      messageId: message._id,
      userId: this.currentuser._id,
    };
    message.viewedBy.push(this.currentuser._id);
    this.chatservice.sendSocketData({
      key: 'updateAdminMessageStatus',
      data: payload,
    });
  }
  goback() {
    this.location.back();
  }
  UserRequests(requests: any) {
    this.SelectedRequests = requests;
  }
}
