import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getUsersData(data: any) {
    console.log(data, '12:::')
    return this.http.post('http://192.168.10.30:1234/users/login', data)
  }
}
