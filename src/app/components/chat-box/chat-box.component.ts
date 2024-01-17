import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'socket.io-client';
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
    },
    {
      id: 2,
      name: 'Wade Warren',
    },
    {
      id: 3,
      name: 'Albert Flores'
    },

  ];
  selectedUser: any;
  messageArray: any;
  messageText: any
  sendingMessage: any;
  currentUser: any;
  UserListData: any;
  SelectedUser: any;
  UserSelected: any;
  RoomId: any;
  TotalMessages: any;
  NoUser:boolean=true;
  ChatBox:boolean=false;

  constructor(private chatservice: ChatService,private route:Router) { }
  ngOnInit() {
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentUser = res
      console.log(res, '888888.......', this.currentUser)
    })
    this.chatservice.sendSocketData({ data: { name: 'hello' }, key: 'newUser' })
    this.chatservice.getSocketData('newUser').subscribe(res => {
      this.UserListData = res;
      console.log(this.UserListData, '7999999')
    })
    if(this.currentUser){
      this.chatservice.getSocketData('roomMessages').subscribe((res) => {
        this.TotalMessages = res
        console.log(this.TotalMessages, '75::::::')
      })
    }else{
      this.route.navigate([''])
    }
    this.UserSelected = 'Test';
  }
  getFormattedTime() {
    const d = new Date().toLocaleString().split(" ")
    const t = d[1].slice(0, -3)
    return t + " " + d[2]
  }
  getFormattedDate(date: Date, format?: any) {
    // const date = new Date()
    const year = date.getFullYear()
    let month = (1 + date.getMonth()).toString()
    month = month.length > 1 ? month : "0" + month
    let day = date.getDate().toString()
    day = day.length > 1 ? day : "0" + day
    switch (format) {
      case 'dd/mm/yyyy': {
        return `${day}/${month}/${year}`
      }
      case 'yyyy/mm/dd': {
        return `${year}/${month}/${day}`
      }
      default: {
        return `${month}/${day}/${year}`
      }
    }
  }

  SelectUser(user: any) {
    this.UserSelected = user;
    this.NoUser =false;
    this.ChatBox =true;
    console.log('88888', user._id)
    this.RoomId = this.genarateRoomId(user._id, this.currentUser._id);
    console.log(this.RoomId, '11222222')
    this.chatservice.sendSocketData({ key: 'joinRoom', data: { room: this.RoomId, previousRoom: '' } })
    console.log(this.UserSelected, '80:::')
  }
  sendMessage() {
    console.log(this.RoomId, '0101', this.currentUser.firstName, '301', this.currentUser._id)
    this.chatservice.sendSocketData({ key: 'sendMessage', })
    const socketPayload = {
      to: this.RoomId,
      content: this.messageText,
      from: { name: this.currentUser.firstName, id: this.currentUser._id },
      time: this.getFormattedTime(),
      date: this.getFormattedDate(new Date()),
      opponentId: this.UserSelected._id,
      type: 'message',
      fileLink: ''
    }
    this.chatservice.sendSocketData({ key: 'sendMessage', data: socketPayload })
    console.log(socketPayload, '121111111')
    this.messageText = ''
  }
  genarateRoomId(id1: any, id2: any) {
    console.log(id1, '93333', id2)
    if (id1 > id2) {
      return id1 + "-" + id2
    } else {
      return id2 + "-" + id1
    }
  }
// Assuming this is in your component class
getMessageClass(message: any): string {
  return (this.currentUser._id === message.from.id) ? 'SendUser' : 'receive';
}



}
