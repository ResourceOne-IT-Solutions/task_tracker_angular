import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
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
  isChatRequest = true;
  ChatRequest: any;
  ticketDetails: any;
  chatpayload: any;
  TicketRequest: any;

  approvedtype: any;
  constructor(
    private chatservice: ChatService,
    private loader: NgxSpinnerService,
  ) {}
  ngOnInit() {
    this.loader.show();
    console.log(this.loader.show(), '20:::::', this.loader.hide());
    this.chatservice.getSocketData('userRequestApproved').subscribe((res) => {
      this.approvedtype = res;
    });
    this.chatservice.getChatMessages().subscribe((res) => {
      this.ChatRequest = res;
      this.loader.hide();
    });
    this.chatservice.getTickesRequest().subscribe((res) => {
      this.TicketRequest = res;
      this.loader.hide();
    });
  }
  approveUserChatRequest(data: any) {
    if (data) {
      const filteruser = this.ChatRequest.filter((res: any) => {
        return res.isPending == true;
      });
      const demo = filteruser.forEach((val: any) => {
        this.chatpayload = {
          user: {
            name: val.sender.name,
            id: val.sender.id,
            time: this.chatservice.getFormattedTime(),
            date: this.chatservice.getFormattedDate(new Date()),
          },
          requestId: val._id,
          type: 'CHAT',
          status: val.isPending === 'false',
        };
      });
      this.chatservice.sendSocketData({
        key: 'approveUserRequest',
        data: this.chatpayload,
      });
    }
  }
  approveUserTicketRequest(data: any) {
    if (data) {
      const filterticket = this.TicketRequest.filter((res: any) => {
        return res.isPending == true;
      });
      const demo = filterticket.forEach((val: any) => {
        this.ticketDetails = {
          user: {
            name: val.sender.name,
            id: val.sender.id,
            time: this.chatservice.getFormattedTime(),
            date: this.chatservice.getFormattedDate(new Date()),
          },
          requestId: val._id,
          type: 'TICKET',
          status: val.isPending === 'false',
        };
      });
      this.chatservice.sendSocketData({
        key: 'approveUserRequest',
        data: this.ticketDetails,
      });
    }
  }
}
