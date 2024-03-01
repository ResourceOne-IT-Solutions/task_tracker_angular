import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelComePageComponent {
  formValue: any;
  inputValue: any;
  constructor(
    private Router: Router,
    private chatservice: ChatService,
  ) {
    const token = this.chatservice.getToken();
    if (token) {
      this.Router.navigate(['/dashboard']);
    }
  }

  LoginPage(role: any) {
    this.Router.navigate(['/login_page']);
    this.chatservice.getRoleData(role);
  }
}
