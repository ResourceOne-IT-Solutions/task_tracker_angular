import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
   RoleData = new BehaviorSubject('');
   getRoleData(role:any){
    this.RoleData.next(role)
   }
   //User Behavior
    UserLoginData = new BehaviorSubject('');
    UserLogin(data:any){
      this.UserLoginData.next(data)
    }
  BE_SERVER= "https://task-tracker-server-2njm.onrender.com"
  BE_LOCAL = 'http://192.168.10.30:1234/login';
  BE_URL = this.BE_SERVER
  constructor(private http: HttpClient) { }
  getUserData(data: any) {
    return this.http.post(this.BE_URL+'/login', data)
  }
  getAllUsers() {
    return this.http.get(this.BE_URL+'/users')
  }
  getAllClients() {
    return this.http.get(this.BE_URL+'/clients')
  }
  AddNewUsers(data:any){
    return this.http.post(this.BE_URL+'/users/create',data)
  }
  getAllTickets(){
    return this.http.get(this.BE_URL+'/tickets')
  }
}
