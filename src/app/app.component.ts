import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from './services/chat.service';
import { IdleTimeService } from './services/idle/idle-time.service';
import { Observable, filter, map } from 'rxjs';
import { DialogConfig } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DialogModelComponent } from './reusable/dialog-model/dialog-model.component';
import { DialogInfoComponent } from './reusable/dialog-info/dialog-info.component';
import { Store } from '@ngrx/store';
import { chatRequests, openDialog } from './chat-store/table.actions';
import { isLoading } from './chat-store/table.selector';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUser: any;
  isLoading: any;
  isOnline: boolean;
  modalVersion: boolean;

  constructor(
    private route: Router,
    private chatservice: ChatService,
    private idleservice: IdleTimeService,
    private dialog: MatDialog,
    private store: Store,
    private swUpdate: SwUpdate,
  ) {
    this.isOnline = true;
    this.modalVersion = false;
  }
  ngOnInit(): void {
    window.addEventListener('online', this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));
    // if (this.swUpdate.isEnabled) {
    //   this.swUpdate.versionUpdates.pipe(
    //     filter(
    //       (evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY',
    //     ),
    //     map((evt: any) => {
    //       this.modalVersion = true;
    //     }),
    //   );
    // }

    this.chatservice.UserLoginData.subscribe((res) => {
      this.currentUser = res;
    });
    this.store.select(isLoading).subscribe((res: any) => {
      this.isLoading = res;
    });
    this.chatservice.getSocketData('userRaisedTicket').subscribe((res) => {
      if (this.currentUser.isAdmin) {
        const message = `${res.sender.name} raised ticket`;
        this.store.dispatch(openDialog({ message, title: 'Ticket Rise' }));
      }
    });
    this.chatservice
      .getSocketData('ticketRaiseStatus')
      .subscribe((res: any) => {
        this.store.dispatch(
          openDialog({ message: res, title: 'Ticket Requset' }),
        );
      });

    this.chatservice.getSocketData('chatRequest').subscribe((res) => {
      if (this.currentUser.isAdmin) {
        this.store.dispatch(chatRequests({ chatRequest: res._id }));
        const message = `${res.sender.name} is Requisting to Chat with ${res.opponent.name}`;
        this.store.dispatch(openDialog({ message, title: 'Chat Requset' }));
      }
    });
    this.chatservice.getSocketData('ticketsRequest').subscribe((res) => {
      this.store.dispatch(chatRequests({ chatRequest: res._id }));
      if (this.currentUser.isAdmin) {
        const message = `${res.sender.name} is Requisting to Ticket with ${res.client.name}`;
        this.store.dispatch(openDialog({ message, title: 'Ticket Requset' }));
      }
    });
    this.chatservice
      .getSocketData('userRequestApproved')
      .subscribe(({ type, result }) => {
        if (this.currentUser._id === result.sender.id) {
          const message = `your  ${type} request is approvedby:${result.approvedBy.name}`;
          this.store.dispatch(
            openDialog({ message, title: 'Requset Approved' }),
          );
        }
      });
  }

  private updateOnlineStatus(event: any): void {
    console.log(event, '97::');
    this.isOnline = event.type === 'online';
  }
}
