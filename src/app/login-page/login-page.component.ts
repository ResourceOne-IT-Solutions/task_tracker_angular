import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  constructor(private route: Router, private chatservice: ChatService) {
    const data: any = localStorage.getItem('userData');
    const userData = JSON.parse(data)
    if (userData && userData?.userId) {
      this.route.navigate(['/dashboard'])
    }
  }
  AdminLogin() {
    this.chatservice.getUserData({ userId: 'fgdfgdf', password: 'fdgdfg', isAdmin: true }).subscribe((res) => {
      localStorage.setItem('userData', JSON.stringify(res))
      this.route.navigate(['/dashboard'])
    })
  }
}
