import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from 'src/app/reusable/dialog-info/dialog-info.component';
import { ChatService } from 'src/app/services/chat.service';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { openDialog } from 'src/app/chat-store/table.actions';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotpasswordComponent implements OnInit {
  constructor(
    private chatservice: ChatService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private location: Location,
    private store: Store
  ) { }

  errorMesg: any;
  passwordError: any;
  otpError: any;
  verifyinfo: any;
  otpverify: any;
  isfirstSubmit: boolean = false;
  submitted: boolean = false;
  isSubmit: boolean = false;
  isMail: boolean = true;
  showpassword: boolean = false;
  showpassword2: boolean = false;

  passworderrors: boolean = false;
  isLinear = true;
  passwordSuccess: any;
  'firstFormGroup': FormGroup;
  'secondFormGroup': FormGroup;
  'passwordForm': FormGroup;
  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      newpassword: ['', Validators.required],
      confirmpassword: ['', Validators.required],
    });
    this.firstFormGroup = this.fb.group({
      userid: ['', Validators.required],
    });

    this.secondFormGroup = this.fb.group({
      otp: ['', Validators.required],
    });
  }
  get mail() {
    return this.firstFormGroup.controls;
  }
  get id() {
    return this.mail['userid'];
  }

  get password() {
    return this.passwordForm.controls;
  }
  get newpassword() {
    return this.password['newpassword'];
  }
  get confirmpassword() {
    return this.password['confirmpassword'];
  }
  verifymail(stepper: any) {
    if (this.firstFormGroup.valid) {
      this.errorMesg = '';
      this.isMail = false;
      const payload = {
        data: this.firstFormGroup.value.userid,
      };
      this.chatservice.getMailVerify(payload).subscribe(
        (res: any) => {
          this.verifyinfo = res;
          this.isfirstSubmit = true;
          stepper.next();
          this.store.dispatch(openDialog({ message: res.message, title: '' }))
        },
        (err: any) => {
          this.isMail = true;
          this.errorMesg = err.error.error;
        },
      );
    }
  }

  // verify otp
  verifyOtp(stepper: any) {
    if (this.secondFormGroup.valid) {
      this.isMail = false;
      this.otpError = '';
      const verifypayload = {
        data: {
          key: this.firstFormGroup.value.userid,
          otp: this.secondFormGroup.value.otp,
        },
      };
      this.chatservice.verifyOtp(verifypayload).subscribe(
        (res) => {
          this.otpverify = res;
          stepper.next();
        },
        (err: any) => {
          this.isMail = true;
          this.otpError = err.error.error;
        },
      );
    }
  }
  // Update password
  updatePassword(stepper: any) {
    this.submitted = true;
    const key = this.verifyinfo.userId ? 'userId' : 'email';
    const credentials = {
      [key]: this.verifyinfo[key],
    };
    if (this.passwordForm.valid) {
      const updatepayload = {
        data: {
          password: this.passwordForm.value.newpassword,
        },
        credentials,
      };
      if (
        this.passwordForm.controls['newpassword'].value ===
        this.passwordForm.controls['confirmpassword'].value
      ) {
        this.submitted = false;
        this.isSubmit = false;
        this.chatservice.updatePassword(updatepayload).subscribe(
          (res) => {
            this.passwordSuccess = res;
            this.store.dispatch(openDialog({ message: this.passwordSuccess.message, title: '' }))
          },
          (err: any) => {
            this.passwordError = err.error.error;
            this.store.dispatch(openDialog({ message: this.passwordError, title: '' }))
          },
        );
      }
    }
    this.passwordForm.reset();
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
  }

  goback() {
    this.location.back();
  }
  togglePassword() {
    this.showpassword = !this.showpassword;
  }
  togglePasswordtwo() {
    this.showpassword2 = !this.showpassword2;
  }
}
