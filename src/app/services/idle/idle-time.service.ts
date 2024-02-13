import { Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { ChatService } from '../chat.service';

@Injectable({
  providedIn: 'root',
})
export class IdleTimeService {
  private idleTimeoutInSeconds = 15 * 60; // 15 minutes
  private timer$!: Subscription;
  constructor(private chatservice: ChatService) {}
  // timer Start
  startIdleMonitoring() {
    this.timer$ = timer(1000, 1000).subscribe(() => {
      if (this.idleTimeoutInSeconds > 0) {
        this.idleTimeoutInSeconds--;
        if (this.idleTimeoutInSeconds === 0) {
          this.chatservice.UserLoginData.subscribe((res: any) => {
            const updatePayload = {
              id: res._id,
              status: 'Sleep',
            };
            this.chatservice.sendSocketData({
              key: 'changeStatus',
              data: updatePayload,
            });
          });
        }
      }
    });
    //this.timer$.
    document.addEventListener('mouseover', () => this.resetIdleTimer());
    document.addEventListener('keypress', () => this.resetIdleTimer());
  }

  // Stop timer
  stopIdleIdleMonitoring() {
    if (this.timer$) {
      this.timer$.unsubscribe();
    }
  }

  // Reset the idle timer
  resetIdleTimer() {
    this.idleTimeoutInSeconds = 15 * 60;
  }
}
