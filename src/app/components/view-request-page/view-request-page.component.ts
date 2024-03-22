import { ChangeDetectorRef, Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Location } from '@angular/common';
import { Column } from '../dash-board/dash-board.component';
// import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { EmptyChatRequests } from 'src/app/chat-store/table.actions';
import { getChatRequests } from 'src/app/chat-store/table.selector';
import {
  ADMIN_MESSAGES,
  CHATMESSAGES,
  TICKETRAISEDMESSAGES,
  TICKETREQUESTMESSAGES,
} from 'src/app/utils/Constants';

@Component({
  selector: 'app-view-request-page',
  templateUrl: './view-request-page.component.html',
  styleUrls: ['./view-request-page.component.scss'],
})
export class ViewRequestPageComponent {
  type = true;
  requestCount: any = [];
  selectedTicket: any = [];
  time: any;
  date: any;
  isChatRequest = true;
  ChatRequest: any = [];
  ticketDetails: any;
  chatpayload: any;
  TicketRequest: any = [];
  chatDetails: any;
  currentuser: any;
  adminMessages: any;
  raiseTicketMessages: any;
  totalUser: any;
  seletedRequests = ADMIN_MESSAGES;
  ADMIN_MESSAGES: any = ADMIN_MESSAGES;
  TICKETRAISEDMESSAGES: any = TICKETRAISEDMESSAGES;
  TICKETREQUESTMESSAGES: any = TICKETREQUESTMESSAGES;
  CHATMESSAGES: any = CHATMESSAGES;
  isSelected = true;
  constructor(
    private chatservice: ChatService,
    private loader: NgxSpinnerService,
    private location: Location,
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit() {
    this.loader.show();
    this.chatservice.getRaiseTicketMessages().subscribe((res) => {
      this.raiseTicketMessages = res;
    });
    this.store.select(getChatRequests).subscribe((res: any) => {
      if (res && res.length) {
        this.requestCount = [...res];
      }
    });
    this.store.dispatch(EmptyChatRequests());
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
    this.chatservice.getSocketData('chatRequest').subscribe((res) => {
      this.requestCount.push(res._id);
      this.ChatRequest.unshift(res);
    });
    this.chatservice.getAdminChatMessages().subscribe((res: any) => {
      this.adminMessages = res;
      this.loader.hide();
    });
    this.chatservice.getTickesRequest().subscribe((res) => {
      this.TicketRequest = res;
      this.loader.hide();
    });
    this.chatservice.getSocketData('ticketsRequest').subscribe((res) => {
      this.requestCount.push(res._id);
      this.TicketRequest.unshift(res);
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
  AdminRequests(data: any) {
    this.seletedRequests = data;
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
