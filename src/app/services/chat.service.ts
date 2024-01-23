import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  RoleData = new BehaviorSubject('');
  ticketsById = new BehaviorSubject('')
  private socket: Socket;
  private idleTimeoutInSeconds = 1 * 60; // 15 minutes
  private timer$: any;
  getRoleData(role: any) {
    this.RoleData.next(role)
  }
  getTicketId(clientid: any) {
    this.ticketsById.next(clientid)
  }
  //User Behavior
  UserLoginData = new BehaviorSubject('');
  UserLogin(data: any) {
    console.log(data, '16:::')
    this.UserLoginData.next(data)
  }
  BE_SERVER = "https://task-tracker-server-2njm.onrender.com"
  BE_LOCAL = 'http://192.168.10.30:1234';
  BE_LOCAL2 = 'http://192.168.29.109:1234'
  BE_URL = this.BE_LOCAL
  constructor(private http: HttpClient) {
    this.socket = io(this.BE_URL, { transports: ['websocket', 'polling', 'flashsocket'] });
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
  getClientById(clientid: any) {
    return this.get('/clients/tickets/' + clientid)
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
  getAdminChatMessages() {
    return this.get('/message/admin-messages')
  }

  createNewTicket(data: any) {
    return this.post('/tickets/create', data)
  }
  updateTicket(data: any) {
    return this.put('/tickets/update', data)
  }
  getTicketDetails(data: any) {
    return this.get(`/tickets/${data}`)
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
  // upload file 
  uploadFile(data: any) {
    return this.post('/file', data)
  }
  getFile(data: any) {
    return this.get(`/file/${data}`)
  }

  // Cookie.....
  setCookie(name: string, value: string, days: number) {
    const currentDate = new Date();
    const expirationTime = new Date(currentDate.getTime() + 8 * 60 * 60 * 1000);
    console.log(expirationTime.toUTCString(), "109::::")
    const cookieValue = encodeURIComponent(value) + '; expires=' + expirationTime.toUTCString();
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
    console.log('hello', data)
    this.socket.emit(data.key, data.data)
  }

  // time 
  getFormattedTime() {
    const d = new Date().toLocaleString().split(" ")
    const t = d[1].slice(0, -3)
    return t + " " + d[2]
  }
  // date
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


  getSocketData(eventName: any): Observable<any> {
    console.log('1077777777', eventName)
    return new Observable<{
      user: string,
      room: string,
      phone: string
    }>(observer => {
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }
  // ticket assignned 

  getTicketSocketData(eventName: any): Observable<any> {
    console.log('1077777777', eventName)
    return new Observable<any>(observer => {
      this.socket.on(eventName, (id: any, sender: any) => {
        console.log(sender, id, 'socket tiggered')
        observer.next({ id, sender });
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
  // send mail

  sendMail(data:any){
   return this.post('/mail/client-update' , data)
  }

  // get full Name 
  getFullName(data: any) {
    return data.firstName + ' ' + data.lastName
  }

  // timer Start
  startIdleMonitoring() {
    this.timer$ = timer(1000, 1000); 

    this.timer$.subscribe(() => {
      console.log(this.idleTimeoutInSeconds , "timer")
      if (this.idleTimeoutInSeconds > 0) {
        this.idleTimeoutInSeconds--;

        if (this.idleTimeoutInSeconds === 0) {
          this.UserLoginData.subscribe((res:any)=>{
            const updatePayload = {
             id:res._id,
             status : 'Break'
            }
            this.sendSocketData({ key: 'changeStatus', data: updatePayload })
          })
        }
      }
    });
  }

  // Reset the idle timer
  resetIdleTimer() {
    this.idleTimeoutInSeconds = 1 * 60; 
  }
 
}
