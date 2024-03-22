import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  ViewChild,
  createComponent,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Socket } from 'socket.io-client';
import { ChatService } from 'src/app/services/chat.service';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { TooltipPosition } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent {
  @ViewChild('groupModel', { static: false }) groupModel: any;
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  //ToolTip.
  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];
  position = new FormControl(this.positionOptions[0]);
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
  ClientContactModel: boolean = false;
  noGroupAvailable: any;
  SearchFilter: any;
  filteredUsers: any = [];
  MockUserData: any;
  MockGroupList: any;
  requestedChat: any;
  ClientContacts: any;
  SelectedContact: any = [];
  today: number = Date.now();
  contact: any;
  ExportChatModal: boolean = false;
  ChartUser: boolean = true;
  url: string = '';
  activeButton: string = 'button1';
  chatButtons = ['Users', 'Groups'];
  userChatList = true;
  isChat = true;
  constructor(
    public chatservice: ChatService,
    private location: Location,
    private route: Router,
    private loader: NgxSpinnerService,
    public dialog: MatDialog,
  ) {
    this.today = Date.now();
  }
  ngOnInit() {
    const ismobile = window.innerWidth;
    if (ismobile <= 768) {
      this.userChatList = true;
      this.NoUser = false;
    }
    this.url = this.chatservice.BE_URL + '/profile-images';
    this.loader.show();
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentUser = res;
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
        if (this.requestedChat) {
          const user = this.UserListData.find(
            (res: any) => res._id === this.requestedChat.opponent.id,
          );
          if (user) {
            this.SelectUser(user);
          }
        }
        this.UserListData = this.UserListData.filter(
          (res: any) => res._id !== this.currentUser._id,
        );
        this.loader.hide();
        this.MockUserData = this.UserListData;
      });
    if (this.currentUser) {
      this.chatservice.getSocketData('roomMessages').subscribe((res) => {
        this.TotalMessages = res;
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      });
    } else {
    }
    this.chatservice.chatRequest.subscribe((res: any) => {
      if (res) {
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
  getOnlyAdmins(data: any) {
    return data.filter((val: any) => val.isAdmin);
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
    this.isChat = !this.isChat;
    Object.keys(this.currentUser.newMessages).forEach((val: any) => {
      if (val.includes(user._id)) {
        delete this.currentUser.newMessages[val];
      }
    });
    this.chatservice.sendSocketData({
      key: 'updateUser',
      data: this.currentUser,
    });
    this.chatservice.UserLogin(this.currentUser);
    const roomId = this.genarateRoomId(user._id, this.currentUser._id);
    this.chatservice.sendSocketData({
      key: 'joinRoom',
      data: { room: roomId, previousRoom: this.RoomId },
    });
    this.RoomId = roomId;
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }
  getMembers(data: any) {
    return data.members.map((res: any) => res.name).toString();
  }
  SelectGroup(group: any) {
    this.UserSelected = group;
    this.isGroup = true;
    this.NoUser = false;
    this.ChatBox = true;
    this.isChat = !this.isChat;
    Object.keys(this.currentUser.newMessages).forEach((val: any) => {
      if (val.includes(group._id)) {
        delete this.currentUser.newMessages[val];
      }
    });
    this.chatservice.sendSocketData({
      key: 'updateUser',
      data: this.currentUser,
    });
    this.chatservice.UserLogin(this.currentUser);
    this.ChatBox = true;
    this.chatservice.sendSocketData({
      key: 'joinRoom',
      data: { room: group._id, previousRoom: this.RoomId },
    });
    this.RoomId = group._id;
  }

  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight + 10;
    }
  }
  Contacts() {
    this.chatservice.getAllClients().subscribe((res: any) => {
      this.ClientContacts = res;
      this.ClientContactModel = !this.ClientContactModel;
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    });
  }
  SeclectContact(contacts: any) {
    const { firstName, mobile } = contacts;
    this.ClientContactModel = false;
    this.displayIcons = false;
    this.reUseableSendMessage(
      firstName,
      'contact',
      JSON.stringify({ name: firstName, mobile }),
    );
  }
  Close() {
    this.ClientContactModel = false;
  }
  sendMessage() {
    const content = this.messageText;
    const type = 'message';
    const fileLink = '';
    this.reUseableSendMessage(content, type, fileLink);
  }
  reUseableSendMessage(content: any, type: any, fileLink: any) {
    const socketPayload = {
      to: this.RoomId,
      content,
      from: {
        name: this.chatservice.getFullName(this.currentUser),
        id: this.currentUser._id,
      },
      time: this.chatservice.getDate(),
      date: new Date().toDateString(),
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
    this.UserSelected = {};
    this.NoUser = true;
    this.ChatBox = false;
    this.userChatList = true;
    this.isChat = !this.isChat;
    this.chatservice.sendSocketData({ key: 'leaveRoom', data: this.RoomId });
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
    let messages = 0;
    Object.keys(this.currentUser?.newMessages).forEach((val: any) => {
      const data = val.split('-');
      if (data.includes(id._id)) {
        messages += this.currentUser?.newMessages[val];
      }
    });
    return messages;
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
  ExportChat() {
    const chatHistory = this.TotalMessages.flatMap((messages: any) =>
      messages.messageByDate.map((message: any) => {
        return `${message.from.name}: ${message.content} - ${new Date(
          message.date,
        ).toLocaleDateString()} ${new Date(message.time).toLocaleTimeString()}`;
      }),
    );
    const pdf = new jsPDF();
    const pageSize = pdf.internal.pageSize;
    const pageHeight = pageSize.height;
    const lineHeight = 5; // Adjust as needed
    const marginLeft = 10; // Adjust the left margin as needed
    let cursorY = 10;
    chatHistory.forEach((message: any) => {
      if (cursorY + lineHeight > pageHeight) {
        pdf.addPage(); // Add a new page
        cursorY = 10; // Reset Y position
      }

      // Split the message into lines if it's too long
      const lines = pdf.splitTextToSize(
        message,
        pdf.internal.pageSize.getWidth() - 2 * marginLeft,
      );
      // Output each line
      lines.forEach((line: string, lineIndex: number) => {
        if (lineIndex === 0) {
          pdf.text(line, marginLeft, cursorY);
        } else {
          pdf.text(line, marginLeft + 5, cursorY);
        }
        cursorY += lineHeight;
      });
      cursorY += lineHeight;
    });
    const pdfName = `${this.chatservice.getFullName(this.currentUser)}-${this.chatservice.getFullName(this.UserSelected)}-Chat.pdf`;
    pdf.save(pdfName);
  }
  ChatInfo(data: any) {
    this.ChartUser = data;
  }
}
