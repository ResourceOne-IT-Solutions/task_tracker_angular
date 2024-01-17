import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  RoleData = new BehaviorSubject('');
  private socket: Socket;
  getRoleData(role: any) {
    this.RoleData.next(role)
  }
  //User Behavior
  UserLoginData = new BehaviorSubject('');
  UserLogin(data: any) {
    console.log(data, '16:::')
    this.UserLoginData.next(data)
  }
  BE_SERVER = "https://task-tracker-server-2njm.onrender.com"
  BE_LOCAL = 'http://192.168.10.30:1234';
  BE_URL = this.BE_LOCAL
  constructor(private http: HttpClient) { 
    this.socket = io(this.BE_LOCAL, { transports: ['websocket', 'polling', 'flashsocket'] });
  }
  getUserData(data: any) {
    return this.http.post(this.BE_URL + '/login', data)
  }

  // Users calls
  getAllUsers() {
    return this.get('/users')
  }
  AddNewUsers(data: any) {
    return this.post('/users/create', data)
  }
  UpdateUsers(data: any) {
    return this.put('/users/update', data)
  }

  // client calls

  getAllClients() {
    return this.get('/clients')
  }
  AddNewClient(data: any) {
    return this.post('/clients/create', data)
  }
  updateClient(data: any) {
    return this.put('/clients/update', data)
  }

  // tickets api calls

  getAllTickets() {
    return this.get('/tickets')
  }
  getChatMessages() {
    return this.get('/message/user-chat-request')
  }
  getTickesRequest() {
    return this.get('/message/user-ticket-request')
  }

  createNewTicket(data: any) {
    return this.post('/tickets/create', data)
  }
  updateTicket(data: any) {
    return this.put('/tickets/update', data)
  }
  updateResuorce(data: any) {
    return this.put('/tickets/assign-resource', data)
  }
  currentTaskUser(data: any) {
    return this.post('/verify-login', data)
  }
  getLoginSetup(data: any) {
    return this.get('/get-user')
  }

  getToken() {
    return this.getCookie('token') || ''

  }
  // Cookie.....
  setCookie(name: string, value: string, days: number) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = encodeURIComponent(value) + '; expires=' + expirationDate.toUTCString();
    document.cookie = name + '=' + cookieValue;
  }

  getCookie(name: any) {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    console.log(cookies, '103:::', name)
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
    console.log('hello',data)
    this.socket.emit(data.key, data.data)
  }
  getSocketData(eventName:any): Observable<any> {
    console.log('1077777777',eventName)
    return new Observable<{
      user: string,
      room: string,
      phone: string
    }>(observer => {
      this.socket.on(eventName, (data:any) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }

  // api mian calls
  get(url: any,) {
    return this.http.get(this.BE_URL + url, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      })
    });
  }
  post(url: any, data: any) {
    return this.http.post(this.BE_URL + url, data, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      })
    });
  }
  put(url: any, data: any) {
    return this.http.put(this.BE_URL + url, data, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      })
    });
  }
  delete(url: any) {
    return this.http.delete(this.BE_URL + url, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      })
    });
  }
}
