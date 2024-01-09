import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables } from 'node_modules/chart.js';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent {

  @ViewChild('userModel', { static: false }) userModel: any;
  @ViewChild('clientModel', { static: false }) clientModel: any;
  @ViewChild('userDetailsModel', { static: false }) userDetailsModel: any;
  @ViewChild('ticketModel', { static: false }) ticketModel: any;



  phone: any;
  modelHeader: string = ''
  'userForm': FormGroup;
  'clientForm': FormGroup;
  'TicketCreationForm': FormGroup
  displayUserColumns: string[] = ['firstName', 'designation', 'empId', 'profileImageUrl', 'dob', 'action'];
  cities = ['New York', 'New Jersey', 'Los Angeles'];
  displayclientColumns: string[] = ['firstName', 'mobile', 'technology', 'email', 'action']
  displayTicketColumns: string[] = ['client', 'status', 'user', 'technology', 'receivedDate', 'addOnResource']

  user: any;
  dropdownSettings: any;
  technologies: any = [];
  userList: any = [];
  clientData: any = [];
  ticketData: any = [];
  displayUsers: boolean = true;
  displayClient: boolean = false;
  displayTickets: boolean = false;
  userModelData: any;
  userDetails: any;
  adminDetails: any;
  clientDetails: any;
  constructor(private chatservice: ChatService, private router: Router, private modalService: NgbModal, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      isAdmin: ['', Validators.required]
    })
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      mobile: ['', [Validators.required, this.validateNumberLength.bind(this)]],
      technologies: ['', Validators.required],
      email: ['', Validators.required],
      applicationType: ['', Validators.required],
      companyName: ['', Validators.required]

    })
    this.TicketCreationForm = this.fb.group({
      clientName: ['', Validators.required],
      technologies: ['', Validators.required],
      targetDate: ['', Validators.required],
      description: ['', Validators.required],
    })
  }
  ngOnInit() {
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.adminDetails = res;
      console.log(this.adminDetails, "70::")
    })
    this.pieChart(1, 4, 5, 6)
    this.chatservice.getAllClients().subscribe((res: any) => {
      this.clientData = res
    })
    this.chatservice.getAllTickets().subscribe((res: any) => {
      this.ticketData = res
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



  openPopup(content: any): void {
    this.modalService.open(content);
  }

  // user functions 

  openUserModel() {
    this.userForm.reset()
    this.modelHeader = 'Add New User'
    this.openPopup(this.userModel)
  }
  addUser(dismiss: any): void {
    console.log(this.userForm.value.isAdmin, this.userForm.value.isAdmin !== null, "isAdmin", this.userDetails)
    const Data = {
      firstName: this.userForm.value.fname,
      lastName: this.userForm.value.lname,
      email: this.userForm.value.email,
      mobile: this.userForm.value.phone,
      password: `${this.userForm.value.fname}@123`,
      joinedDate: this.userForm.value.dob,
      dob: this.userForm.value.dob,
      isAdmin: this.userForm.value.isAdmin,
      designation: 'angular',
      profileImageUrl: '',
    }
    this.chatservice.AddNewUsers(Data).subscribe(res => console.log(res, '98:::::'))
    dismiss();
    this.userForm.reset();
  }
  updateUser(dismiss: any): void {
    console.log(this.userForm.value.isAdmin, this.userForm.value.isAdmin !== null, "userDetails")
    dismiss();
    const Data = {
      firstName: this.userForm.value.fname,
      lastName: this.userForm.value.lname,
      email: this.userForm.value.email,
      mobile: this.userForm.value.phone,
      userId: this.userDetails.userId,
      password: this.userDetails.password,
      joinedDate: this.userForm.value.dob,
      dob: this.userForm.value.dob,
      isAdmin: this.userDetails.isAdmin,
      designation: this.userDetails.designation,
      profileImageUrl: this.userDetails.profileImageUrl,
    }
    const payload = {
      id: this.userDetails._id,
      data: Data
    }
    // this.chatservice.UpdateUsers(payload).subscribe(res=>console.log(res, "resss"))
    this.userForm.reset()
  }
  editUser(userData: any) {
    this.modelHeader = 'Update User'
    this.openPopup(this.userModel)
    console.log(userData)
    this.userForm.patchValue({
      fname: userData.firstName,
      lname: userData.lastName,
      email: userData.email,
      phone: userData.mobile,
      dob: new Date(userData.dob).toISOString().split('T')[0]
    })
    this.userDetails = userData
  }


  // client functions 

  openClientModel() {
    this.modelHeader = 'Add New Client'
    this.openPopup(this.clientModel)
  }
  newClient(dismiss: any) {
    dismiss()
    const data = {
      firstName: this.clientForm.value.name,
      email: this.clientForm.value.email,
      mobile: this.clientForm.value.mobile,
      location: { area: this.clientForm.value.location, zone: 'EST' },
      companyName: this.clientForm.value.companyName,
      technology: this.clientForm.value.technologies,
      applicationType: this.clientForm.value.applicationType
    }
    this.chatservice.AddNewClient(data).subscribe(res => console.log(res, 'new client res'))
  }
  updateClient(dismiss: any) {
    dismiss()
    const data = {
      mobile: this.clientForm.value.mobile,
      location: { area: this.clientForm.value.location, zone: 'EST' },
      companyName: this.clientForm.value.companyName,
      technology: this.clientForm.value.technologies,
    }
    console.log(data , this.clientDetails , this.clientForm.value , "client update1")
    const payload ={
      id : this.clientDetails._id,
      data:data
    }
    console.log(data, "playload")
    this.chatservice.updateClient(payload).subscribe(res=> console.log(res , "client update"))
  }
  editClient(clientDetails: any) {
    this.modelHeader = 'Update Client'
    this.openPopup(this.clientModel)
    this.clientDetails = clientDetails
    this.clientForm.patchValue({
      name: clientDetails.firstName,
      location: clientDetails.location.area,
      mobile: clientDetails.mobile,
      technologies: clientDetails.technology,
      email: clientDetails.email,
      companyName: clientDetails.companyName,
      applicationType: clientDetails.applicationType
    })
  }

  openUserDetails(userDetails: any) {
    this.userModelData = userDetails
    console.log(this.userModelData, "12345")
    if (this.userModelData && this.userModelData?.email) {
      this.chatservice.UserLogin(userDetails)
      this.modalService.open(this.userDetailsModel)
    }
  }
  cancel(dismiss: any) {
    dismiss()
    this.userForm.reset()
    this.clientForm.reset()
  }

  UserPage(dismiss: any) {
    dismiss()
    this.router.navigate(['/User-page'])
  }

  // ticket functions
  createTicket(dismiss: any) {
    dismiss()
    console.log(this.TicketCreationForm.value)
    this.TicketCreationForm.reset()
  }

  OpenTicketModel() {
    this.modalService.open(this.ticketModel)
  }
  validateNumberLength(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value && control.value.toString().length > 10) {
      return { 'maxLengthExceeded': true };
    }
    return null;
  }

  // tickets piechart 
  pieChart(resolved: any, assigned: any, pending: any, inprogress: any) {
    console.log(resolved, '13', assigned)
    new Chart('piechart', {
      type: 'pie',
      data: {
        labels: ["Resolved", "Assigned", "Pending", "In Progress"],
        datasets: [{
          label: '',
          data: [resolved, assigned, pending, inprogress],
        }]
      },
    });
  }
}