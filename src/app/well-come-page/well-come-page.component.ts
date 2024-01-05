import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-well-come-page',
  templateUrl: './well-come-page.component.html',
  styleUrls: ['./well-come-page.component.scss']
})
export class WellComePageComponent {

  constructor(private Router: Router, private chatservice: ChatService) {
  }

  LoginPage(role: any) {
    this.Router.navigate(['/login_page']);
    this.chatservice.getRoleData(role);
  }
}
