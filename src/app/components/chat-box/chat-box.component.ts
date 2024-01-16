import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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

  ];
  public messages = [
    'Hello Hi Bhasker Rao How are You...!'
  ]
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
  constructor(private chatservice: ChatService) { }
  ngOnInit() {
    this.messageArray = this.messages,
      console.log(this.messageArray)
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentUser = res
      console.log(res, '888888.......', this.currentUser)
    })
    this.chatservice.socketConnection({ data: { name: 'hello' }, key: 'newUser' })
    this.chatservice.getNewUser('newUser').subscribe(res => {
      this.UserListData = res;
      console.log(this.UserListData, '7999999')
    })
    this.chatservice.getNewUser('roomMessages').subscribe((res) => {
      this.TotalMessages = res
      console.log(this.TotalMessages, '75::::::')
    })
    this.UserSelected = 'Test';
  }
  getFormattedTime() {
    const d = new Date().toLocaleString().split(" ")
    const t = d[1]
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
    console.log('88888', user._id)
    this.RoomId = this.genarateRoomId(user._id, this.currentUser._id);
    console.log(this.RoomId, '11222222')
    this.chatservice.socketConnection({ key: 'joinRoom', data: { room: this.RoomId, previousRoom: '' } })
    console.log(this.UserSelected, '80:::')
  }
  sendMessage() {
    console.log(this.RoomId, '0101', this.currentUser.firstName, '301', this.currentUser._id)
    this.chatservice.socketConnection({ key: 'sendMessage', })
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
    this.chatservice.socketConnection({ key: 'sendMessage', data: socketPayload })
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



}
