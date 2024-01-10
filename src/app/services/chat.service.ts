import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  RoleData = new BehaviorSubject('');
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
  BE_URL = this.BE_SERVER
  constructor(private http: HttpClient) { }
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

  createNewTicket(data: any) {
    return this.post('/client/create', data)
  }
  updateTicket(data: any) {
    return this.put('/client/update', data)
  }

  updateUsers(data: any, userdata: any) {
    const userdetails = { id: data, data: userdata }
    return this.put('/tickets/update', userdetails)
  }

  currentTaskUser(data: any) {
    return this.post('/verify-login', data)
  }
  getLoginSetup(data: any) {
    return this.get('/get-user')
  }

  getToken() {
    return localStorage.getItem('currentTaskUser') || ''
  }

  get(url: any,) {
    return this.http.get(this.BE_LOCAL + url, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      })
    });
  }
  post(url: any, data: any) {
    return this.http.post(this.BE_LOCAL + url,data,{
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      })
    });
  }
  put(url: any, data: any) {
    return this.http.put(this.BE_LOCAL + url,data, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      })
    });
  }
  delete(url: any) {
    return this.http.delete(this.BE_LOCAL + url, {
      headers: new HttpHeaders({
        Authorization: this.getToken(),
      })
    });
  }
}