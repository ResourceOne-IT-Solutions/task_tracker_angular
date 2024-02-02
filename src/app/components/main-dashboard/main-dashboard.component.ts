import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IdleTimeService } from 'src/app/services/idle/idle-time.service';
import { ActivatedRoute } from '@angular/router';
import { DashBoardComponent } from '../dash-board/dash-board.component';
import { UserPageComponent } from '../user-page/user-page.component';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
})
export class MainDashboardComponent {
  data: any;
  'userData$': Observable<any>;
  constructor(
    private chatservice: ChatService,
    private idleSerive: IdleTimeService,
    private route :ActivatedRoute
  ) {}
  ngOnInit() {
    this.data = localStorage.getItem('currentTaskUser');
    this.chatservice.getSocketData('error').subscribe((res) => {
      alert(res);
    });
    this.userData$ = this.chatservice.UserLoginData.pipe(
      map((res: any) => {
       
        if (!res.isAdmin) {
          this.idleSerive.startIdleMonitoring();
        }
        return res;
      }),
    );
  }
}
