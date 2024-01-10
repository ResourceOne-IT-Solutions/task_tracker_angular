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
  LoginBoolean: boolean = true;
  est: any;
  pstDate: any;
  cstDate: any;
  RoleDetails: any;
  ErrorMsg: any;
  navigateData: any;
  ErrorHandling:boolean=true;
  constructor(private route: Router, private fb: FormBuilder, private chatservice: ChatService) { }
  'loginForm': FormGroup;
  ngOnInit() {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
    this.loginForm.valueChanges.subscribe((res: any) => {
      this.UserDataa = false;
    })
    this.chatservice.RoleData.subscribe((res: any) => {
      this.RoleDetails = res;
      if(this.RoleDetails === "Admin"){
        this.navigateData = "User";
      }else{
        this.navigateData = "Admin";
      }
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
    this.LoginBoolean= false;
    const isAdmin = this.RoleDetails === 'Admin'
    if (this.loginForm.valid) {
      this.chatservice.getUserData({ ...this.loginForm.value, isAdmin }).subscribe((res: any) => {
         localStorage.setItem('userData', JSON.stringify(res))
        this.chatservice.UserLogin(res)
        if (isAdmin) {
          this.route.navigate(['dashboard'])
        } else {
          this.route.navigate(['User-page'])
        } 
      },(err:any) =>{
        this.LoginBoolean= true;
        this.ErrorMsg = err.error.error;
      })
    }
  }
  getNavigate(){
  const data =  this.chatservice.getRoleData(this.navigateData);
    this.loginForm.reset();
    this.ErrorMsg = '';
  }
}
