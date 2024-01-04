import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url = 'http://192.168.10.30:1234/users/login'
  constructor(private http: HttpClient) { }
  getUserData(data: any) {
    return this.http.post(`${this.url}`, data)
  }
  getAllUsers() {
    return this.http.get('http://192.168.10.30:1234/users')
  }
}
