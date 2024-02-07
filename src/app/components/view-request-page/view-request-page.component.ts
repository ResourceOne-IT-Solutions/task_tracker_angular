import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Location } from '@angular/common';
import { Column } from '../dash-board/dash-board.component';
// import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-request-page',
  templateUrl: './view-request-page.component.html',
  styleUrls: ['./view-request-page.component.scss'],
})
export class ViewRequestPageComponent {
  type = true;
  time: any;
  date: any;
  isChatRequest = true;
  ChatRequest: any;
  ticketDetails: any;
  chatpayload: any;
  TicketRequest: any;
  chatDetails: any;
  currentuser: any;
  adminMessages: any;
  totalUser: any;
  constructor(
    private chatservice: ChatService,
    private loader: NgxSpinnerService,
    private location: Location,
  ) {}
  ngOnInit() {
    this.loader.show();
    this.chatservice.TotalUser.subscribe((res: any) => {
      this.totalUser = res;
    });
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentuser = res;
    });
    this.chatservice
      .getSocketData('userRequestApproved')
      .subscribe(({ type, result }) => {
        if (type === 'TICKET') {
          this.TicketRequest.forEach((tkt: any) => {
            if (tkt._id === result._id) {
              tkt = result;
            }
          });
        }
        if (type === 'CHAT') {
          this.ChatRequest.forEach((chat: any) => {
            if (chat._id === result._id) {
              chat = result;
            }
          });
        }
      });
    this.chatservice.getChatMessages().subscribe((res) => {
      this.ChatRequest = res;
      this.loader.hide();
    });
    this.chatservice.getAdminChatMessages().subscribe((res: any) => {
      this.adminMessages = res;
      this.loader.hide();
    });
    this.chatservice.getTickesRequest().subscribe((res) => {
      this.TicketRequest = res;
      this.loader.hide();
    });
    this.time = this.chatservice.getFormattedTime();
    this.date = this.chatservice.getFormattedDate(new Date());
    this.chatservice
      .getSocketData('adminMessageStatusUpdated')
      .subscribe((res: any) => {
        this.adminMessages = this.adminMessages.map((val: any) =>
          val._id === res._id ? res : val,
        );
      });
  }
  goback() {
    this.location.back();
  }
  approveUserChatRequest(data: any) {
    data.isPending = !data.isPending;
    if (data) {
      this.chatDetails = {
        user: {
          name: this.chatservice.getFullName(this.currentuser),
          id: this.currentuser._id,
          time: this.chatservice.getFormattedTime(),
          date: this.chatservice.getFormattedDate(new Date()),
        },
        requestId: data._id,
        type: 'CHAT',
        status: false,
      };
      this.chatservice.sendSocketData({
        key: 'approveUserRequest',
        data: this.chatDetails,
      });
    }
  }
  approveUserTicketRequest(data: any) {
    data.isPending = !data.isPending;
    if (data) {
      this.ticketDetails = {
        user: {
          name: this.chatservice.getFullName(this.currentuser),
          id: this.currentuser._id,
          time: this.chatservice.getFormattedTime(),
          date: this.chatservice.getFormattedDate(new Date()),
        },
        requestId: data._id,
        type: 'TICKET',
        status: false,
      };
      this.chatservice.sendSocketData({
        key: 'approveUserRequest',
        data: this.ticketDetails,
      });
    }
  }
}
