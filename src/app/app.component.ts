import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Task-Tracker';
  constructor(
    private route: Router,
    private chatservice: ChatService,
  ) {}
  // @HostListener('document:mouseover', ['$event'])
  // onDocumentMouseOver(event: MouseEvent): void {
  //   // Handle mouseover event
  //   console.log('mouseover')
  //   this.chatservice.resetIdleTimer();
  // }

  @HostListener('document:click', ['$event'])
  onDocumentKeyPress(event: KeyboardEvent): void {
    // Handle keypress event
    console.log('keypress');
    this.chatservice.resetIdleTimer();
  }
}
