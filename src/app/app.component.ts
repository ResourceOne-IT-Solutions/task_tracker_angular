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
  title = 'Task-Tracker';
  'userData$': Observable<any>;

  constructor(
    private route: Router,
    private chatservice: ChatService,
    private idleservice: IdleTimeService,
  ) {}
  ngOnInit(): void {
    this.userData$ = this.chatservice.UserLoginData.pipe(
      map((res: any) => {
        return res;
      }),
    );
    this.chatservice.getSocketData('userRequestApproved').subscribe((res) => {
      console.log(res, 'app:::::::::::::::::::::');
    });
  }

  // @HostListener('document:mouseover', ['$event'])
  // onDocumentMouseOver(event: MouseEvent): void {
  //   // Handle mouseover event
  //   console.log('mouseover')
  //   this.chatservice.resetIdleTimer();
  // }

  // @HostListener('document:click', ['$event'])
  // onDocumentKeyPress(event: KeyboardEvent): void {
  //   // Handle keypress event
  //   console.log('keypress');
  //   this.idleservice.resetIdleTimer();
  // }
}
