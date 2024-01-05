import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  UserData: any;
  UserDataa: boolean = false;
  est: any;
  pstDate: any;
  cstDate: any;
  RoleDetails: any;
  constructor(private route: Router, private fb: FormBuilder, private chatservice: ChatService) { }
  'loginForm': FormGroup;
  ngOnInit() {
    const user: any = localStorage.getItem('userData')
    this.chatservice.getAllUsers().subscribe(res => console.log(res,'222::::'))
    const userData = JSON.parse(user)
    if (userData && userData.userId) {
      this.route.navigate(['/dashboard'])
    }
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
    this.loginForm.valueChanges.subscribe((res: any) => {
      this.UserDataa = false;
    })
    this.chatservice.RoleData.subscribe((res: any) => {
      this.RoleDetails = res;
      console.log(res, '28:::::')
    }
    )
    setInterval(() => {
      let Estdate = new Date();
      this.est = Estdate.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
      })
      var myDate = new Date()
      this.pstDate = myDate.toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles"
      })
      var myDate = new Date()
      this.cstDate = myDate.toLocaleTimeString("en-US", {
        timeZone: "America/Chicago"
      })

    }, 1000)
  }

  AdminLogin() {
    this.UserDataa = true;
    const isAdmin = this.RoleDetails === 'Admin'
    if (this.loginForm.valid) {
      this.chatservice.getUserData({ ...this.loginForm.value, isAdmin }).subscribe((res: any) => {
        // localStorage.setItem('userData', JSON.stringify(res))
        this.chatservice.UserLogin(res)
        console.log(res, '45:::');
        if (isAdmin) {
          console.log(isAdmin, '63:::::')
          this.route.navigate(['dashboard'])
        } else {
          this.route.navigate(['User-page'])
        } 
      })
    }
  }
}
