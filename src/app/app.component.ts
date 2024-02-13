import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from './services/chat.service';
import { IdleTimeService } from './services/idle/idle-time.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUser: any;

  constructor(
    private route: Router,
    private chatservice: ChatService,
    private idleservice: IdleTimeService,
  ) {}
  ngOnInit(): void {
    this.chatservice.UserLoginData.subscribe((res) => {
      this.currentUser = res;
    });
    this.chatservice.getSocketData('chatRequest').subscribe((res) => {
      if (this.currentUser.isAdmin) {
        this.chatservice.chatRequestCount(res);
        const message = `${res.sender.name} is Requisting to Chat with ${res.opponent.name}`;
        alert(message);
      }
    });
    this.chatservice.getSocketData('ticketsRequest').subscribe((res) => {
      if (this.currentUser.isAdmin) {
        const message = `${res.sender.name} is Requisting to Ticket with ${res.client.name}`;
        alert(message);
      }
    });
    this.chatservice
      .getSocketData('userRequestApproved')
      .subscribe(({ type, result }) => {
        if (this.currentUser._id === result.sender.id) {
          alert(
            `your  ${type} request is approvedby:${result.approvedBy.name}`,
          );
        }
      });
  }
}
