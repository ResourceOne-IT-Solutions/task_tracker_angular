import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';

@Component({
  selector: 'app-view-request-page',
  templateUrl: './view-request-page.component.html',
  styleUrls: ['./view-request-page.component.scss'],
})
export class ViewRequestPageComponent {
  type = true;
  isChatRequest = true;
  ChatRequest: any;
  TicketRequest: any;
  constructor(private chatservice: ChatService) {}
  ngOnInit() {
    this.chatservice.getSocketData('userRequestApproved').subscribe((res) => {
      console.log(res, '499:::::::::::::::::::::');
    });
    this.chatservice.getChatMessages().subscribe((res) => {
      this.ChatRequest = res;
      console.log(this.ChatRequest, '2111');
    });
    this.chatservice.getTickesRequest().subscribe((res) => {
      this.TicketRequest = res;
      console.log(this.TicketRequest.length, '25::::::::');
    });
  }
  approveUserRequest() {
    if (this.ChatRequest) {
      const filteruser = this.ChatRequest.filter((res: any) => {
        return res.isPending == true;
      });

      const demo = filteruser.forEach((val: any) => {
        const approvepayload = {
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
        this.chatservice.sendSocketData({
          key: 'approveUserRequest',
          data: approvepayload,
        });
        console.log(approvepayload, '49:::::::::::');
      });
    }
  }
}
