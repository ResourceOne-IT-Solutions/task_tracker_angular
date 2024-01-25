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
  TicketRequest: any;
  constructor(private chatservice: ChatService,private loader: NgxSpinnerService,) {}
  ngOnInit() {
      this.loader.show();
      console.log(this.loader.show(),'20:::::',this.loader.hide())
    this.chatservice.getSocketData('userRequestApproved').subscribe((res) => {
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
      });
    }
  }
}
