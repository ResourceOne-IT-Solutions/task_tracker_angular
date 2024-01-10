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
  BE_LOCAL = 'http://192.168.10.30:1234';
  BE_URL = this.BE_SERVER
  constructor(private http: HttpClient) { }
  getUserData(data: any) {
    return this.http.post(this.BE_URL+'/login', data)
  }

  // Users calls

  getAllUsers() {
    return this.http.get(this.BE_URL+'/users')
  }
  AddNewUsers(data:any){
    return this.http.post(this.BE_URL+'/users/create',data)
  }
  UpdateUsers(data:any){
    return this.http.put(this.BE_URL+'/users/update',data)
  }

  // client calls

  getAllClients() {
    return this.http.get(this.BE_URL+'/clients')
  }
  AddNewClient(data:any){
    return this.http.post(this.BE_URL+'/clients/create',data)
  }
  updateClient(data:any){
    return this.http.put(this.BE_URL+'/clients/update',data)
  }

  // tickets api calls

  getAllTickets(){
    return this.http.get('http://192.168.10.30:1234/tickets')
  }

  createNewTicket(data:any){
    return this.http.post(this.BE_URL+'/client/create',data)
  }
  updateTicket(data:any){
    return this.http.put(this.BE_URL+'/client/update',data)
  }

  updateUsers(data:any ,userdata:any ){
    
    const userdetails = {id:data, data :userdata}
   return this.http.put(this.BE_LOCAL+'/tickets/update',userdetails);
   }
}
