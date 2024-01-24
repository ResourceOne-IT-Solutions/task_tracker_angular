import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { ChatService } from '../chat.service';

@Injectable({
  providedIn: 'root',
})
export class IdleTimeService {
  private idleTimeoutInSeconds = 15 * 60; // 15 minutes
  private timer$: any;
  constructor(private chatservice: ChatService) {}
  // timer Start
  startIdleMonitoring() {
    this.timer$ = timer(1000, 1000);

    this.timer$.subscribe(() => {
      if (this.idleTimeoutInSeconds > 0) {
        this.idleTimeoutInSeconds--;
        if (this.idleTimeoutInSeconds === 0) {
          this.chatservice.UserLoginData.subscribe((res: any) => {
            const updatePayload = {
              id: res._id,
              status: 'Break',
            };
            this.chatservice.sendSocketData({
              key: 'changeStatus',
              data: updatePayload,
            });
          });
        }
      }
    });
    document.addEventListener('mouseover', () => this.resetIdleTimer());
    document.addEventListener('keypress', () => this.resetIdleTimer());
  }

  // Reset the idle timer
  resetIdleTimer() {
    this.idleTimeoutInSeconds = 15 * 60;
  }
}
