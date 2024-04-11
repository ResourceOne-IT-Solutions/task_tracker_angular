import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  map,
  switchMap,
  throwError,
  timer,
} from 'rxjs';
import * as jwt from 'jwt-decode';
import { io, Socket } from 'socket.io-client';
import { User } from '../interface/users';
import { Task } from '../interface/tickets';
import { Store } from '@ngrx/store';
import { openDialog } from '../chat-store/table.actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  RoleData = new BehaviorSubject('');
  chatRequest = new BehaviorSubject('');
  TotalUser = new BehaviorSubject('');
  dashBoard = new BehaviorSubject(false);
  ClickDashBoard(data:any){
    this.dashBoard.next(data)
  }
  private socket: Socket;
  getRoleData(role: any) {
    this.RoleData.next(role);
  }

  //User Behavior
  UserLoginData = new BehaviorSubject<User | undefined>(undefined);
  UserLogin(data: User | undefined) {
    this.UserLoginData.next(data);
  }
  // chat Behavior
  chatRequests(data: any) {
    this.chatRequest.next(data);
  }

  BE_SERVER = 'https://task-tracker-server-2njm.onrender.com';
  BE_LOCAL = 'http://192.168.10.30:1234';
  BE_LOCAL2 = 'http://192.168.29.109:1234';
  SOCKET_URL = this.BE_SERVER;
  VERSION = '/api/v1';
  BE_URL = this.SOCKET_URL + this.VERSION;
  constructor(
    private http: HttpClient,
    private store: Store,
    private route: Router,
  ) {
    this.socket = io(this.SOCKET_URL, {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
  }
  getUserData(data: any) {
    return this.http.post(this.BE_URL + '/login', data);
  }
  private selectedElementSubject = new BehaviorSubject<string>('');

  setSelectedElement(element: string): void {
    this.selectedElementSubject.next(element);
  }

  getSelectedElement(): string {
    return this.selectedElementSubject.value;
  }

  // Users calls
  getAllUsers() {
    return this.get('/users');
  }
  getUsertickets(userId: any) {
    return this.get('/tickets/user/' + userId);
  }
  AddNewUsers(data: any) {
    return this.post('/users/create', data);
  }
  UpdateUsers(data: any) {
    return this.put('/users/update', data);
  }
  updateProfile(data: any) {
    console.log(data, '85:::::');
    return this.put('/users/update/profile-image', data);
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
  getRaiseTicketMessages() {
    return this.get('/message/ticket-raise-messages');
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
    return this.http.post(this.BE_URL + '/verify-login', data);
  }
  getLoginSetup() {
    return this.get('/get-user');
  }

  getToken() {
    return localStorage.getItem('token') || '';
  }
  // upload file
  uploadFile(data: any) {
    return this.post('/file', data);
  }
  getFile(data: any) {
    return this.get(`/file/${data}`);
  }
  sendFeedBack(data: any) {
    return this.post('/users/feedback', data);
  }
  getFeedBack() {
    return this.get('/users/feedback');
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
  getRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(this.BE_URL + '/refresh-token', { refreshToken });
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
      this.socket.off(eventName).on(eventName, (data: any) => {
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
  // mail verify
  getMailVerify(data: any) {
    return this.post('/mail-verify', data);
  }
  // mail otp
  verifyOtp(data: any) {
    return this.post('/verify-otp', data);
  }
  // update password
  updatePassword(data: any) {
    return this.post('/update-password', data);
  }
  // groups

  getAllGroups(id: any) {
    return this.get(`/message/groups/${id}`);
  }
  isAccessTokenExpired(token: any) {
    try {
      const decodedToken = jwt.jwtDecode(token);
      if (decodedToken && decodedToken.exp) {
        return Date.now() >= decodedToken.exp * 1000;
      }
      return true;
    } catch (error: any) {
      return true;
    }
  }

  fetchWithAccessToken(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
  ): Observable<any> {
    let accessToken = localStorage.getItem('token') || '';
    if (!accessToken || this.isAccessTokenExpired(accessToken)) {
      return this.getRefreshToken().pipe(
        switchMap((res: any) => {
          accessToken = res.accessToken;
          localStorage.setItem('token', accessToken);
          return this.makeHttpRequest(method, url, data, accessToken);
        }),
        catchError((error: any) => {
          this.handleTokenError();
          this.store.dispatch(
            openDialog({
              message: error.error.message,
              title: 'Refresh Token Error',
            }),
          );
          return throwError('Refresh token error');
        }),
      );
    } else {
      return this.makeHttpRequest(method, url, data, accessToken);
    }
  }

  private makeHttpRequest(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    accessToken?: any,
  ): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: accessToken,
    });

    if (method == 'post' || method === 'put') {
      return this.http[method](url, data, { headers });
    } else {
      return this.http[method](url, { headers });
    }
  }

  //get call

  get(url: any): Observable<any> {
    return this.fetchWithAccessToken('get', this.BE_URL + url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        if (
          error === 'Refresh token error' ||
          error.error.error === 'invalid token'
        ) {
          this.handleTokenError();
        }
        return throwError(error);
      }),
    );
  }

  //post call

  post(url: any, data: any): Observable<any> {
    return this.fetchWithAccessToken('post', this.BE_URL + url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        if (
          error === 'Refresh token error' ||
          error.error.error === 'invalid token'
        ) {
          this.handleTokenError();
        }
        return throwError(error);
      }),
    );
  }

  // put call

  put(url: any, data: any): Observable<any> {
    return this.fetchWithAccessToken('put', this.BE_URL + url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        if (
          error === 'Refresh token error' ||
          error.error.error === 'invalid token'
        ) {
          this.handleTokenError();
        }
        return throwError(error);
      }),
    );
  }

  // delete call

  delete(url: any): Observable<any> {
    return this.fetchWithAccessToken('delete', this.BE_URL + url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        if (
          error === 'Refresh token error' ||
          error.error.error === 'invalid token'
        ) {
          this.handleTokenError();
        }
        return throwError(error);
      }),
    );
  }
  //handling Token Error
  handleTokenError() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.UserLoginData.next(undefined);
    this.route.navigate(['/login_page']);
    this.store.dispatch(
      openDialog({ message: 'invalid token', title: 'Api Call error' }),
    );
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
      return data.firstName;
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
  getPieChartData(data: any) {
    const statusData: any = {};
    data.forEach((val: any) => {
      if (val.status in statusData) {
        statusData[val.status] = statusData[val.status] + 1;
      } else {
        statusData[val.status] = 1;
      }
    });
    return statusData;
  }
}
