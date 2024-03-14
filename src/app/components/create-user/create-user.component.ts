import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { openDialog } from 'src/app/chat-store/table.actions';
import { DialogInfoComponent } from 'src/app/reusable/dialog-info/dialog-info.component';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent {
  'createUserForm': FormGroup<any>;
  genders: any = ['Male', 'Female', 'Not Specified'];
  submitted: boolean = false;
  currentUser: any;

  createuserError: any;
  isAccountcreate: boolean = false;
  maxDate: any;
  profileImage: any;

  constructor(
    private fb: FormBuilder,
    private chatservice: ChatService,
    private dialog: MatDialog,
    private store: Store,
  ) {
    this.maxDate = new Date();
    this.createUserForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['+91', Validators.required],
      dob: ['', Validators.required],
      password: ['', Validators.required],
      empId: ['', Validators.required],
      joiningDate: ['', Validators.required],
      profileImageUrl: ['', Validators.required],
      designation: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      isAdmin: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentUser = res;
    });
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
  get user() {
    return this.createUserForm.controls;
  }
  get fname() {
    return this.user['fname'];
  }
  get lname() {
    return this.user['lname'];
  }
  get email() {
    return this.user['email'];
  }
  get phone() {
    return this.user['phone'];
  }
  get dob() {
    return this.user['dob'];
  }
  get joiningDate() {
    return this.user['joiningDate'];
  }
  get designation() {
    return this.user['designation'];
  }
  get profileImageUrl() {
    return this.user['profileImageUrl'];
  }
  get gender() {
    return this.user['gender'];
  }
  get address() {
    return this.user['address'];
  }
  get isAdmin() {
    return this.user['isAdmin'];
  }
  get password() {
    return this.user['password'];
  }
  get employeId() {
    return this.user['empId'];
  }
  phoneValidation(evt: any) {
    const inputChar = String.fromCharCode(evt.charCode);
    if (this.phone?.value.length > 12 || !/^\d+$/.test(inputChar)) {
      evt.preventDefault();
      return;
    }
  }
  selecteImage(evt: any) {
    this.profileImage = evt.target.files[0];
  }
  createNewUser() {
    const formData = new FormData();

    this.submitted = true;
    if (this.createUserForm.valid) {
      const Data = {
        firstName: this.createUserForm.value.fname,
        lastName: this.createUserForm.value.lname,
        email: this.createUserForm.value.email,
        mobile: this.createUserForm.value.phone,
        password: this.createUserForm.value.password,
        dob: this.createUserForm.value.dob,
        joinedDate: this.createUserForm.value.joiningDate,
        designation: this.createUserForm.value.designation,
        address: this.createUserForm.value.address,
        employeId: this.createUserForm.value.employeId,
        isAdmin: this.createUserForm.value.isAdmin,
        gender: this.createUserForm.value.gender,
        empId: this.createUserForm.value.empId,
        createdBy: {
          name: this.chatservice.getFullName(this.currentUser),
          id: this.currentUser._id,
        },
      };
      formData.append('file', this.profileImage);
      formData.append('user', JSON.stringify(Data));
      this.chatservice.AddNewUsers(formData).subscribe(
        (res) => {
          this.createuserError = '';
          const message = `EmpId : ${res.empId} <br /> UserId : ${res.userId}`;
          this.store.dispatch(openDialog({ message, title: 'Credentials' }));
          this.isAccountcreate = true;
          this.submitted = false;
          this.createUserForm.reset();
        },
        (error) => {
          this.createuserError = error.error.error;
        },
      );
    }
  }
}
