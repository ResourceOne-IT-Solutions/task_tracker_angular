import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { User } from '../interface/users';
import { Task } from '../interface/tickets';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  RoleData = new BehaviorSubject('');
  userticketsById = new BehaviorSubject('');
  chatRequest = new BehaviorSubject('');
  TotalUser = new BehaviorSubject('');
  RequestCount = new BehaviorSubject([]);

  private socket: Socket;
  chatRequestCount(data: any) {
    if (data) {
      const currentdata = this.RequestCount.value;
      const value: any = [...currentdata, data];
      this.RequestCount.next(value);
    } else {
      this.RequestCount.next([]);
    }
  }
  getRoleData(role: any) {
    this.RoleData.next(role);
  }
  getuserTicketById(ticketId: any) {
    this.userticketsById.next(ticketId);
  }
  //User Behavior
  UserLoginData = new BehaviorSubject<User | undefined>(undefined);
  UserLogin(data: User) {
    this.UserLoginData.next(data);
  }
  // chat Behavior
  chatRequests(data: any) {
    this.chatRequest.next(data);
  }

  BE_SERVER = 'https://task-tracker-server-2njm.onrender.com';
  BE_LOCAL = 'http://192.168.10.30:1234';
  BE_LOCAL2 = 'http://192.168.29.109:1234';
  BE_URL = this.BE_SERVER;
  constructor(private http: HttpClient) {
    this.socket = io(this.BE_URL, {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
  }
  getUserData(data: any) {
    return this.http.post(this.BE_URL + '/login', data);
  }

  // Users calls
  getAllUsers() {
    return this.get('/users');
  }
  AddNewUsers(data: any) {
    return this.post('/users/create', data);
  }
  UpdateUsers(data: any) {
    return this.put('/users/update', data);
  }

  // client calls

  getAllClients() {
    return this.get('/clients');
  }
  getClientById(clientid: any) {
    return this.get('/tickets/client/' + clientid);
  }
  AddNewClient(data: any) {
    return this.post('/clients/create', data);
  }
  updateClient(data: any) {
    return this.put('/clients/update', data);
  }

  // messages api calls
  getChatMessages() {
    return this.get('/message/user-chat-request');
  }
  getChatMessageById(id: any) {
    return this.get('/message/user-chat-request/' + id);
  }
  getTickesRequest() {
    return this.get('/message/user-ticket-request');
  }
  getTickesRequestMesgById(id: any) {
    return this.get('/message/user-ticket-request/' + id);
  }
  getAdminChatMessages() {
    return this.get('/message/admin-messages');
  }

  // tickets api calls

  getAllTickets(): Observable<Task[]> {
    return this.get('/tickets');
  }
  getPendingTickets() {
    return this.get('/tickets/pending-tickets');
  }
  getTicketById(ticketId: any) {
    return this.get('/tickets/' + ticketId);
  }
  createNewTicket(data: any) {
    return this.post('/tickets/create', data);
  }
  updateTicket(data: any) {
    return this.put('/tickets/update', data);
  }
  getTicketDetails(data: any) {
    return this.get(`/tickets/${data}`);
  }
  updateResuorce(data: any) {
    return this.put('/tickets/assign-resource', data);
  }
  currentTaskUser(data: any) {
    return this.post('/verify-login', data);
  }
  getLoginSetup(data: any) {
    return this.get('/get-user');
  }

  // forgot password
  updatePassword(data: any) {
    return this.post('/update-password', data);
  }

  getToken() {
    return this.getCookie('token') || '';
  }
  // upload file
  uploadFile(data: any) {
    return this.post('/file', data);
  }
  getFile(data: any) {
    return this.get(`/file/${data}`);
  }

  // Cookie.....
  setCookie(name: string, value: string, days: number) {
    const currentDate = new Date();
    const expirationTime = new Date(currentDate.getTime() + 8 * 60 * 60 * 1000);
    const cookieValue =
      encodeURIComponent(value) + '; expires=' + expirationTime.toUTCString();
    document.cookie = name + '=' + cookieValue;
  }

  getCookie(name: any) {
    const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }
  // socket io
  sendSocketData(data: any) {
    this.socket.emit(data.key, data.data);
  }
  getDate(date = new Date()) {
    return new Date(date).toISOString();
  }
  // time
  getFormattedTime() {
    const d = new Date().toLocaleString().split(' ');
    const t = d[1].slice(0, -3);
    return t + ' ' + d[2];
  }
  // date
  getFormattedDate(date: Date, format?: any) {
    // const date = new Date()
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    switch (format) {
      case 'dd-mm-yyyy': {
        return `${day}-${month}-${year}`;
      }
      case 'mm-dd-yyyy': {
        return `${month}-${day}-${year}`;
      }
      default: {
        return `${year}-${month}-${day}`;
      }
    }
  }

  getSocketData(eventName: any): Observable<any> {
    return new Observable<{
      user: string;
      room: string;
      phone: string;
    }>((observer) => {
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }
  // ticket assignned

  getTicketSocketData(eventName: any): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on(eventName, (id: any, sender: any) => {
        observer.next({ id, sender });
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  // groups

  getAllGroups(id: any) {
    return this.get(`/message/groups/${id}`);
  }

  // api mian calls

  get(url: any): Observable<any> {
    return this.http.get(this.BE_URL + url, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      }),
    });
  }
  post(url: any, data: any): Observable<any> {
    return this.http.post(this.BE_URL + url, data, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      }),
    });
  }
  put(url: any, data: any): Observable<any> {
    return this.http.put(this.BE_URL + url, data, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      }),
    });
  }
  delete(url: any): Observable<any> {
    return this.http.delete(this.BE_URL + url, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      }),
    });
  }
  // send mail

  sendMail(data: any) {
    return this.post('/mail/client-update', data);
  }
  ticketsendmail(data: any) {
    return this.post('/mail/ticket-update', data);
  }
  // get full Name
  getFullName(data: any) {
    if (data.firstName && data.lastName) {
      return data.firstName + ' ' + data.lastName;
    }
    if (data.firstName) {
      return data.firstname;
    }
    if (data.name) {
      return data.name;
    }
    return 'Invalid Name';
  }
  groupByDate(data: any, key: any) {
    return data.reduce((acc: any, status: any) => {
      const date = status[key];
      if (acc[date]) {
        acc[date].push(status);
      } else {
        acc[date] = [status];
      }
      return acc;
    }, {});
  }
}
