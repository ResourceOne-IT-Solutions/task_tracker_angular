import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  UserData: any;
  UserDataa: boolean = false;
  LoginBoolean: boolean = true;
  RoleDetails: any;
  submitted: boolean = false;
  ErrorMsg: any;
  navigateData: any;
  ErrorHandling: boolean = true;
  password: any;
  show = true;
  showpassword: boolean = false;
  fieldTextType: any = { isTrue: false };
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private chatservice: ChatService,
    private cd: ChangeDetectorRef,
  ) {}
  'loginForm': FormGroup;
  ngOnInit() {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.loginForm.valueChanges.subscribe((res: any) => {
      this.UserDataa = false;
    });
    this.chatservice.RoleData.subscribe((res: any) => {
      this.RoleDetails = res;
      if (this.RoleDetails === 'Admin') {
        this.navigateData = 'User';
      } else {
        this.navigateData = 'Admin';
      }
    });
    this.password = 'password';
  }
  togglePassword() {
    this.showpassword = !this.showpassword;
    this.cd.detectChanges();
  }
  AdminLogin() {
    this.UserDataa = true;
    this.submitted = true;
    const isAdmin = this.RoleDetails === 'Admin';
    if (this.loginForm.valid) {
      this.LoginBoolean = false;
      this.chatservice
        .currentTaskUser({ ...this.loginForm.value, isAdmin })
        .subscribe(
          (res: any) => {
            this.chatservice.setCookie('token', res.token, 1);
            this.chatservice.UserLogin(res);
            this.route.navigate(['dashboard']);
          },
          (err: any) => {
            this.LoginBoolean = true;
            this.ErrorMsg = err.error.error;
          },
        );
    }
  }
  get login() {
    return this.loginForm.controls;
  }
  get userId() {
    return this.login['userId'];
  }
  get pwd() {
    return this.login['password'];
  }
  getNavigate() {
    const data = this.chatservice.getRoleData(this.navigateData);
    this.loginForm.reset();
    this.ErrorMsg = '';
  }
  toggleFieldTextType() {
    this.fieldTextType.isTrue = !this.fieldTextType.isTrue;
    this.cd.detectChanges();
  }
  forgotPassword() {
    this.route.navigate(['forgot-password']);
  }
}
