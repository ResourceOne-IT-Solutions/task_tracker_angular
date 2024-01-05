import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent {

  @ViewChild('userModel', { static: false }) userModel: any;
  @ViewChild('clientModel', { static: false }) clientModel: any;
  @ViewChild('userDetailsModel', { static: false }) userDetailsModel: any;


  phone: any;
  modelHeader: string = ''
  'userForm': FormGroup;
  'clientForm': FormGroup;
  displayUserColumns: string[] = ['firstName', 'designation', 'empId', 'profileImageUrl', 'dob', 'action'];
  cities = ['New York', 'New Jersey', 'Los Angeles'];
  displayclientColumns: string[] = ['firstName', 'mobile', 'technology', 'email', 'action']
  user: any;
  userList: any = [];
  dropdownSettings: any;
  technologies: any = [];
  clientData: any = [];
  displayUsers: boolean = false;
  userModelData: any;
  constructor(private chatservice: ChatService, private router: Router, private modalService: NgbModal, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      dob: ['', Validators.required]
    })
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      mobile: ['', Validators.required],
      technologies: ['', Validators.required],
      email: ['', Validators.required],
    })
  }
  ngOnInit() {
    this.chatservice.getAllClients().subscribe((res: any) => {
      this.clientData = res
    })
    this.technologies = [
      { id: 1, technology: 'Angular' },
      { id: 2, technology: 'React Js' },
      { id: 3, technology: 'Vue Js' },
      { id: 4, technology: 'Python' },
      { id: 5, technology: 'Jquery' }
    ];
    this.dropdownSettings = {
      idField: 'id',
      textField: 'technology',
    };

    this.user = localStorage.getItem('userData')
    this.chatservice.getAllUsers().subscribe(res => {
      this.userList = res
    })
  }

  openClientModel() {
    this.modelHeader = 'Add New Client'
    this.openPopup(this.clientModel)
  }
  creatTicket() {
  }
  openUserModel() {
    this.userForm.reset()
    this.modelHeader = 'Add New User'
    this.openPopup(this.userModel)
  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  addUser(dismiss: any): void {
    const Data = {
      firstName: this.userForm.value.fname,
      lastName: this.userForm.value.lname,
      email: this.userForm.value.email,
      mobile: this.userForm.value.phone,
      userId: 'naresh1',
      password: 'user123',
      joinedDate: this.userForm.value.dob,
      dob: this.userForm.value.dob,
      isAdmin: false,
      designation: 'angular',
      profileImageUrl: '',
    }
    this.chatservice.AddNewUsers(Data).subscribe(res => console.log(res, '98:::::'))
    dismiss();
    this.userForm.reset();
  }
  updateUser(dismiss: any): void {
    dismiss();
    this.userForm.reset()
  }
  editClient(clientDetails: any) {
    this.modelHeader = 'Update Client'
    this.openPopup(this.clientModel)
    this.clientForm.patchValue({
      name: clientDetails.firstName,
      location: clientDetails.lastName,
      mobile: clientDetails.mobile,
      technologies: clientDetails.technology,
      email: clientDetails.email
    })
  }
  editUser(userDetails: any) {
    this.modelHeader = 'Update User'
    this.openPopup(this.userModel)
    console.log(userDetails)
    this.userForm.patchValue({
      fname: userDetails.firstName,
      lname: userDetails.lastName,
      email: userDetails.email,
      phone: userDetails.mobile,
      dob: new Date(userDetails.dob).toISOString().split('T')[0]
    })
  }
  openUserDetails(userDetails: any) {
    this.userModelData = userDetails
    console.log(this.userModelData, "12345")
    if (this.userModelData && this.userModelData?.email) {
      this.modalService.open(this.userDetailsModel)
    }
  }
  cancel(dismiss: any) {
    dismiss()
    this.userForm.reset()
    this.clientForm.reset()
  }
  newClient(dismiss: any) {
    console.log(this.clientForm.value, "68::::")
  }
  updateClient(dismiss:any){
    dismiss()
  }
}
