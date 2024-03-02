import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/users';
import { ChatService } from 'src/app/services/chat.service';
import { IdleTimeService } from 'src/app/services/idle/idle-time.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() 'isAdmin': boolean;
  @Input() userDetails: any;
  @Input() Status: any;
  SelectedStatus: any;
  StartTimer: boolean = false;
  textColor: boolean = false;
  Minutes = 0;
  Seconds = 0;
  ms = 0;
  timerId: any = Number;
  adminStatus = ['Offline', 'Available', 'OnTicket', 'Sleep'];
  Breaks = ['BreakFastBreak', 'Lunch Break'];
  adminDetails!: User | undefined;

  constructor(
    private router: Router,
    private idle: IdleTimeService,
    public chatservice: ChatService,
  ) {}

  ngOnInit(): void {
    this.Status = this.userDetails.status;
    console.log(this.userDetails, '14:::');
    // this.chatservice.UserLogin(this.userDetails);
    this.chatservice.UserLoginData.subscribe((res: User | undefined) => {
      this.adminDetails = res;
      console.log(this.adminDetails, '42::');
    });
  }

  SelectStatus(data: any) {
    this.SelectedStatus = data;
    this.StartTimer = false;
    const updatePayload = {
      id: this.userDetails._id,
      status: data,
    };
    data === 'Available'
      ? this.idle.startIdleMonitoring()
      : this.idle.stopIdleIdleMonitoring();
    this.chatservice.sendSocketData({
      key: 'changeStatus',
      data: updatePayload,
    });
    if (
      this.SelectedStatus === 'BreakFast Break' ||
      this.SelectedStatus === 'Lunch Break'
    ) {
      this.StartTimer = true;
      this.textColor = false;
      this.Seconds = 0;
      this.Minutes = 0;
      this.clickHandler();
    } else {
      clearInterval(this.timerId);
      this.StartTimer = false;
    }
  }
  SelectBreakTime(breakTime: any) {
    this.SelectedStatus = breakTime;
    const updatePayload = {
      id: this.userDetails._id,
      status: breakTime,
    };
    this.chatservice.sendSocketData({
      key: 'changeStatus',
      data: updatePayload,
    });
  }
  // logout function
  logout() {
    this.deleteTokens();
    const logoutpayload = {
      id: this.userDetails._id,
    };
    this.chatservice.sendSocketData({ key: 'logout', data: logoutpayload.id });
    this.router.navigate(['/']);
  }
  deleteTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  clickHandler() {
    this.timerId = setInterval(() => {
      this.Seconds++;
      if (this.Seconds >= 60) {
        this.Minutes++;
        this.Seconds = 0;
      }
      if (this.Minutes >= 20 || this.Minutes >= 30) {
        this.textColor = true;
      }
    }, 1000);
  }
  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }
}
