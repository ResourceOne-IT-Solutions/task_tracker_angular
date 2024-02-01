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
  time:any;
  date:any;
  isChatRequest = true;
  ChatRequest: any;
  ticketDetails: any;
  chatpayload: any;
  TicketRequest: any;

  approvedtype: any;
  adminMessages: any;
  totalUser: any;
  constructor(
    private chatservice: ChatService,
    private loader: NgxSpinnerService,
  ) {}
  ngOnInit() {
    this.loader.show();
    this.chatservice.TotalUser.subscribe((res:any)=>{
      this.totalUser = res
    })
    this.chatservice.getSocketData('userRequestApproved').subscribe((res) => {
      this.approvedtype = res;
    });
    this.chatservice.getChatMessages().subscribe((res) => {
      this.ChatRequest = res;
      this.loader.hide();
    });
    this.chatservice.getAdminChatMessages().subscribe((res:any) => {
      this.adminMessages = res;
      this.loader.hide();
    });
    this.chatservice.getTickesRequest().subscribe((res) => {
      this.TicketRequest = res;
      this.loader.hide();
    });
   this. time = this.chatservice.getFormattedTime();
    this.date = this.chatservice.getFormattedDate(new Date());
    this.chatservice.getSocketData('adminMessageStatusUpdated').subscribe((res:any)=>{
    this.adminMessages =  this.adminMessages.map((val:any)=>val._id === res._id ? res : val)
    })
  }
  approveUserChatRequest(data: any) {
    if (data) {
      const filteruser = this.ChatRequest.filter((res: any) => {
        return res.isPending == true;
      });
      data.isPending = !data.isPending;
      
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
      data.isPending=!data.isPending;
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
