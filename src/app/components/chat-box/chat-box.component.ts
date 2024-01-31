import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, createComponent } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Socket } from 'socket.io-client';
import { ChatService } from 'src/app/services/chat.service';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupComponent } from '../create-group/create-group.component';
@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent {
  @ViewChild('groupModel', { static: false }) groupModel: any;

  groupList: any = [];
  displayIcons: boolean = false;
  messageText: any;
  currentUser: any;
  UserListData: any = [];
  UserSelected: any;
  RoomId: any;
  TotalMessages: any;
  NoUser: boolean = true;
  ChatBox: boolean = false;
  isGroup: boolean = false;
  noGroupAvailable: any;
  SearchFilter: any;
  filteredUsers: any = [];
  MockUserData: any;
  MockGroupList: any;
  requestedChat: any;
  constructor(
    public chatservice: ChatService,
    private location: Location,
    private route: Router,
    private loader: NgxSpinnerService,
    public dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.loader.show();
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentUser = res;
    });
    this.chatservice.chatRequest.subscribe((res) => {
      // this.ChatBox = true;
      // this.UserSelected = res;
    });
    this.chatservice.sendSocketData({
      data: { userId: this.currentUser._id },
      key: 'newUser',
    });
    this.chatservice
      .getSocketData('newUser')
      .subscribe(({ userPayload, userId, opponentPayload, opponentId }) => {
        if (this.currentUser._id == userId) {
          this.UserListData = this.currentUser.isAdmin
            ? userPayload
            : this.getOnlyAdmins(userPayload);
        } else if (this.currentUser._id == opponentId) {
          this.UserListData = this.currentUser.isAdmin
            ? opponentPayload
            : this.getOnlyAdmins(opponentPayload);
        } else {
          this.UserListData = userPayload
            ? this.UserListData.map((user: any) => {
                user.status = userPayload.find(
                  (val: any) => val._id === user._id,
                ).status;
                return user;
              })
            : this.UserListData;   
        }
        if(this.requestedChat){
          const user  = this.UserListData.find((res:any)=> res._id ===  this.requestedChat.opponent.id)
         if(user){
           this.SelectUser(user)
         }
       }
        this.loader.hide();
        this.MockUserData = this.UserListData;
      });
    if (this.currentUser) {
      this.chatservice.getSocketData('roomMessages').subscribe((res) => {
        this.TotalMessages = res;
      });
    } else {
    }
    this.chatservice.chatRequest.subscribe((res:any) => {
          if(res){
            this.requestedChat = res;
          }
    });
    this.UserSelected = 'Test';
    this.chatservice.getSocketData('groupCreated').subscribe((res) => {
      this.groupList.push(res);
      this.loader.hide();
    });
    if (this.currentUser.isAdmin) {
      this.chatservice.getAllGroups('').subscribe((res: any) => {
        this.groupList = res;
        this.MockGroupList = this.groupList;
      });
    } else {
      this.chatservice.getAllGroups(this.currentUser._id).subscribe(
        (res: any) => {
          this.groupList = res;
        },
        (error) => {
          this.noGroupAvailable = error.error.error;
        },
      );
    }
  }
  getFormattedTime() {
    const d = new Date().toLocaleString().split(' ');
    const t = d[1].slice(0, -3);
    return t + ' ' + d[2];
  }
  getOnlyAdmins(data: any) {
    return data.filter((val: any) => val.isAdmin);
  }
  getFormattedDate(date: Date, format?: any) {
    // const date = new Date()
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    switch (format) {
      case 'dd/mm/yyyy': {
        return `${day}/${month}/${year}`;
      }
      case 'yyyy/mm/dd': {
        return `${year}/${month}/${day}`;
      }
      default: {
        return `${month}/${day}/${year}`;
      }
    }
  }
  openCreateGroupModel() {
    const dialogRef = this.dialog.open(CreateGroupComponent, {
      data: { UserListData: this.UserListData },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const payload = {
          name: result.groupName,
          members: result.userlist.map((res: any) => ({
            name: this.chatservice.getFullName(res),
            id: res._id,
          })),
          description: result.description,
          admin: {
            name: this.chatservice.getFullName(this.currentUser),
            id: this.currentUser._id,
          },
        };
        this.chatservice.sendSocketData({ key: 'createGroup', data: payload });
      }
    });
  }
  SelectUser(user: any) {
    this.isGroup = false;
    this.UserSelected = user;
    this.NoUser = false;
    this.ChatBox = true;
    Object.keys(this.currentUser.newMessages).forEach((val:any)=>{
      if (val.includes(this.currentUser._id)) {
        delete this.currentUser.newMessages[val] 
      }
    })
    this.chatservice.sendSocketData({key:'updateUser' , data: this.currentUser });
    const roomId = this.genarateRoomId(user._id, this.currentUser._id);
    this.chatservice.sendSocketData({
      key: 'joinRoom',
      data: { room: roomId, previousRoom: this.RoomId },
    });
    this.RoomId = roomId;
  }
  getMembers(data: any) {
    return data.members.map((res: any) => res.name).toString();
  }
  SelectGroup(group: any) {
    this.UserSelected = group;
    this.isGroup = true;
    this.NoUser = false;
    Object.keys(this.currentUser.newMessages).forEach((val:any)=>{
      if (val.includes(group._id)) {
       delete this.currentUser.newMessages[val] 
      }
    })
    this.chatservice.sendSocketData({key:'updateUser' , data: this.currentUser });
    this.ChatBox = true;
    this.chatservice.sendSocketData({
      key: 'joinRoom',
      data: { room: group._id, previousRoom: this.RoomId },
    });
    this.RoomId = group._id;
  }

  sendMessage() {
    const content = this.messageText;
    const type = 'message';
    const fileLink = '';
    this.reUseableSendMessage(content, type, fileLink);
  }
  reUseableSendMessage(content: any, type: any, fileLink: any) {
    this.chatservice.sendSocketData({ key: 'sendMessage' });
    const socketPayload = {
      to: this.RoomId,
      content,
      from: {
        name: this.chatservice.getFullName(this.currentUser),
        id: this.currentUser._id,
      },
      time: this.getFormattedTime(),
      date: this.getFormattedDate(new Date()),
      opponentId: this.UserSelected._id,
      type,
      fileLink,
      isGroup: this.isGroup,
    };
    this.chatservice.sendSocketData({
      key: 'sendMessage',
      data: socketPayload,
    });
    this.chatservice.sendSocketData({
      data: { userId: this.currentUser._id, opponentId: this.UserSelected._id },
      key: 'newUser',
    });
    this.messageText = '';
  }
  genarateRoomId(id1: any, id2: any) {
    if (id1 > id2) {
      return id1 + '-' + id2;
    } else {
      return id2 + '-' + id1;
    }
  }
  // Assuming this is in your component class
  getMessageClass(message: any): string {
    return this.currentUser._id === message.from.id ? 'SendUser' : 'receive';
  }
  goBack() {
    this.location.back();
  }
  PreviousPage() {
    this.NoUser = true;
    this.ChatBox = false;
  }

  SelectedImage(evt: any) {
    const selectedFile = evt.target.files[0];
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (selectedFile) {
      this.chatservice.uploadFile(formData).subscribe((res: any) => {
        this.reUseableSendMessage(res.fileName, res.type, res._id);
      });
    }
  }
  getNewMessages(id: any) {
    let messages = 0
    Object.keys(this.currentUser?.newMessages).forEach((val: any) => {
      const data = val.split('-')
      if (data.includes(id._id)) {
        messages += this.currentUser?.newMessages[val]
      }
    })
    return messages
  }
  SearchUsers() {
    this.UserListData = this.MockUserData.filter(
      (val: any) =>
        val.firstName?.toLowerCase().indexOf(this.SearchFilter?.toLowerCase()) >
        -1,
    );
    this.groupList = this.MockGroupList.filter(
      (val: any) =>
        val.name?.toLowerCase().indexOf(this.SearchFilter?.toLowerCase()) > -1,
    );
  }
}
