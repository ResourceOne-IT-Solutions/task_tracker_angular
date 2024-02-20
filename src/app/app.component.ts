import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from './services/chat.service';
import { IdleTimeService } from './services/idle/idle-time.service';
import { Observable, map } from 'rxjs';
import { DialogConfig } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DialogModelComponent } from './reusable/dialog-model/dialog-model.component';
import { DialogInfoComponent } from './reusable/dialog-info/dialog-info.component';
import { Store } from '@ngrx/store';
import { chatRequests } from './chat-store/table.actions';
import { isLoading } from './chat-store/table.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUser: any;
  isLoading: any;

  constructor(
    private route: Router,
    private chatservice: ChatService,
    private idleservice: IdleTimeService,
    private dialog: MatDialog,
    private store: Store,
  ) {}
  ngOnInit(): void {
    this.chatservice.UserLoginData.subscribe((res) => {
      this.currentUser = res;
    });
    this.store.select(isLoading).subscribe((res: any) => {
      this.isLoading = res;
    });
    this.chatservice.getSocketData('userRaisedTicket').subscribe((res) => {
      if (this.currentUser.isAdmin) {
        const message = `${res.sender.name} raised ticket`;
        this.dialog.open(DialogInfoComponent, {
          data: {
            title: 'Ticket Requset',
            class: 'info',
            message: message,
            btn1: 'Close',
          },
        });
      }
    });
    this.chatservice
      .getSocketData('ticketRaiseStatus')
      .subscribe((res: any) => {
        this.dialog.open(DialogInfoComponent, {
          data: {
            title: 'Ticket Requset',
            class: 'info',
            message: res,
            btn1: 'Close',
          },
        });
      });

    this.chatservice.getSocketData('chatRequest').subscribe((res) => {
      if (this.currentUser.isAdmin) {
        this.store.dispatch(chatRequests({ chatRequest: res._id }));
        const message = `${res.sender.name} is Requisting to Chat with ${res.opponent.name}`;
        this.dialog.open(DialogInfoComponent, {
          data: {
            title: 'Chat Requset',
            class: 'info',
            message: message,
            btn1: 'Close',
          },
        });
      }
    });
    this.chatservice.getSocketData('ticketsRequest').subscribe((res) => {
      this.store.dispatch(chatRequests({ chatRequest: res._id }));
      if (this.currentUser.isAdmin) {
        const message = `${res.sender.name} is Requisting to Ticket with ${res.client.name}`;
        this.dialog.open(DialogInfoComponent, {
          data: {
            title: 'Ticket Requset',
            class: 'info',
            message: message,
            btn1: 'Close',
          },
        });
      }
    });
    this.chatservice
      .getSocketData('userRequestApproved')
      .subscribe(({ type, result }) => {
        if (this.currentUser._id === result.sender.id) {
          const message = `your  ${type} request is approvedby:${result.approvedBy.name}`;
          this.dialog.open(DialogInfoComponent, {
            data: {
              title: 'Chat Requset',
              class: 'info',
              message: message,
              btn1: 'Close',
            },
          });
        }
      });
  }
}
