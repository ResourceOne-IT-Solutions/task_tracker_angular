import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent {
  'createUserForm': FormGroup;
  genders: any = ['Male', 'Female', 'Not Specified'];
  submitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private chatservice: ChatService,
  ) {
    this.createUserForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      password: ['', Validators.required],
      joiningDate: ['', Validators.required],
      profileImageUrl: ['', Validators.required],
      designation: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      isAdmin: ['', Validators.required],
    });
  }
  ngOnInit() {}
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

  phoneValidation(evt: any) {
    console.log(this.phone?.value);
    const inputChar = String.fromCharCode(evt.charCode);
    if (this.phone?.value.length > 9 || !/^\d+$/.test(inputChar)) {
      evt.preventDefault();
      return;
    }
  }

  createNewUser() {
    this.submitted = true;
    if (this.createUserForm.valid) {
      const Data = {
        firstName: this.createUserForm.value.fname,
        lastName: this.createUserForm.value.lname,
        email: this.createUserForm.value.email,
        mobile: this.createUserForm.value.phone,
        password: this.createUserForm.value.password,
        joinedDate: this.createUserForm.value.joiningDate,
        dob: this.createUserForm.value.dob,
        isAdmin: this.createUserForm.value.isAdmin,
        gender: this.createUserForm.value.gender,
        designation: this.createUserForm.value.designation,
        address: this.createUserForm.value.address,
        profileImageUrl: this.createUserForm.value.profileImageUrl,
      };
      this.chatservice.AddNewUsers(Data).subscribe((res) => console.log(res));
      this.createUserForm.reset();
    }
  }
}
