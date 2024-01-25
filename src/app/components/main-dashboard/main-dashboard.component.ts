import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IdleTimeService } from 'src/app/services/idle/idle-time.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
})
export class MainDashboardComponent {
  data: any;
  'isAdmin$': Observable<any>;
  constructor(
    private chatservice: ChatService,
    private idleSerive: IdleTimeService,
  ) {}
  ngOnInit() {
    this.data = localStorage.getItem('currentTaskUser');
    this.chatservice.getSocketData('error').subscribe((res) => {
      alert(res);
    });
    this.isAdmin$ = this.chatservice.UserLoginData.pipe(
      map((res: any) => {
        if (!res.isAdmin) {
          this.idleSerive.startIdleMonitoring();
        }
        return res;
      }),
    );
  }
}
