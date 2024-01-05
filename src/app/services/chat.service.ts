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
  
  url = 'http://192.168.10.30:1234/login';
  constructor(private http: HttpClient) { }
  getUserData(data: any) {
    return this.http.post(`${this.url}`, data)
  }
  getAllUsers() {
    return this.http.get('http://192.168.10.30:1234/users')
  }
  getAllClients() {
    return this.http.get('http://192.168.10.30:1234/clients')
  }
  AddNewUsers(data:any){
    return this.http.post('http://192.168.10.30:1234/users/create',data)
  }
}
