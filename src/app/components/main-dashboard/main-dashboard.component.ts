import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IdleTimeService } from 'src/app/services/idle/idle-time.service';
import { ActivatedRoute } from '@angular/router';
import { DashBoardComponent } from '../dash-board/dash-board.component';
import { UserPageComponent } from '../user-page/user-page.component';
import { Store } from '@ngrx/store';
import { DialogInfoComponent } from 'src/app/reusable/dialog-info/dialog-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
})
export class MainDashboardComponent {
  data: any;
  'userData$': Observable<any>;
  isAdmin: boolean = false;
  constructor(
    private chatservice: ChatService,
    private idleSerive: IdleTimeService,
    private route: ActivatedRoute,
    private store: Store,
    private dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.chatservice.getSocketData('error').subscribe((res) => {
      this.dialog.open(DialogInfoComponent, {
        data: {
          title: 'Socket Error',
          class: 'error',
          message: res,
          btn1: 'Close',
        },
      });
    });
    this.userData$ = this.chatservice.UserLoginData.pipe(
      map((res: any) => {
        this.isAdmin = res.isAdmin;
        if (!res.isAdmin && res.status === 'Available') {
          this.idleSerive.startIdleMonitoring();
        }
        return res;
      }),
    );
    this.chatservice.getSocketData('adminMessageToAll').subscribe((res) => {
      if (!this.isAdmin) {
        const message = `Send By AdminName: ${res.sender.name} ,    Admin message  : ${res.content}`;
        this.dialog.open(DialogInfoComponent, {
          data: {
            title: 'Admin Message',
            class: 'info',
            message: message,
            btn1: 'Close',
          },
        });
      }
    });
  }
}
