import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent {
  public userList = [
    {
      id: 1,
      name: 'The Swag Coder',
      phone: '9876598765',
      image: 'assets/user/user-1.png',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3'
      }
    },
    {
      id: 2,
      name: 'Wade Warren',
      phone: '9876543210',
      image: 'assets/user/user-2.png',
      roomId: {
        1: 'room-1',
        3: 'room-4',
        4: 'room-5'
      }
    },
    {
      id: 3,
      name: 'Albert Flores',
      phone: '9988776655',
      image: 'assets/user/user-3.png',
      roomId: {
        1: 'room-2',
        2: 'room-4',
        4: 'room-6'
      }
    },
    {
      id: 4,
      name: 'Dianne Russell',
      phone: '9876556789',
      image: 'assets/user/user-4.png',
      roomId: {
        1: 'room-3',
        2: 'room-5',
        3: 'room-6'
      }
    }
  ];
  public messages =[
    'Hello Hi Bhasker Rao How are You...!'
  ]
  public Sender =[
    'Good Bro what About You'
  ]
  selectedUser: any;
  messageArray: any;
  messageText:any
  sendingMessage: any;
  currentUser:any;
  constructor(private chatservice : ChatService){}
  ngOnInit(){
    this.selectedUser = this.userList[0],
    this.currentUser = this.userList[0],

    this.messageArray=this.messages,
    this.sendingMessage = this.Sender
    console.log(this.messageArray)
  }
  sendMessage(){
    console.log('send')
    this.chatservice.newUser({name :'hello'})
  }
}
