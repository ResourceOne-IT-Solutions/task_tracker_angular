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
  constructor(
    private route: Router,
    private chatservice: ChatService,
    private idleservice: IdleTimeService,
  ) {}
  ngOnInit(): void {}
}
