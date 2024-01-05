import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
   RoleData = new BehaviorSubject('');
   getRoleData(role:any){
    console.log(role,'11')
    this.RoleData.next(role)
   }
  
  url = 'http://192.168.10.30:1234/users/login'
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
