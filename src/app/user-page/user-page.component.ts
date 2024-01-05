import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  UserData: any;
  constructor(private chatservice:ChatService){}
  ngOnInit(): void {
    this.chatservice.UserLoginData.subscribe((res) =>{
      this.UserData = res;
      console.log(res,'000',this.UserData)
    })
  }

}
