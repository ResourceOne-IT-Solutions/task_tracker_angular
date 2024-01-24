import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';

@Component({
  selector: 'app-view-request-page',
  templateUrl: './view-request-page.component.html',
  styleUrls: ['./view-request-page.component.scss'],
})
export class ViewRequestPageComponent {
  ChatRequest: any;
  TicketRequest: any;
  constructor(private chatservice: ChatService) {}
  ngOnInit() {
    this.chatservice.getChatMessages().subscribe((res) => {
      this.ChatRequest = res;
      console.log(this.ChatRequest, '2111');
    });
    this.chatservice.getTickesRequest().subscribe((res) => {
      this.TicketRequest = res;
    });
  }
}
