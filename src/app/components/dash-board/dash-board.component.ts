import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
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
  @ViewChild('assignTicketModel', { static: false }) assignTicketModel: any;

  isAdminStatus = false
  susers = ['Offline', 'Busy', 'Available'];



  phone: any;
  modelHeader: string = ''
  'userForm': FormGroup;
  'clientForm': FormGroup;
  'TicketCreationForm': FormGroup;
  userColumns: Array<Column> = [
    { columnDef: 'firstName', header: 'first name', cell: (element: any) => `${element['firstName']}`, isText: true },
    { columnDef: 'designation', header: 'Designation', cell: (element: any) => `${element['designation']}`, isText: true },
    { columnDef: 'empId', header: 'Employee Id', cell: (element: any) => `${element['empId']}`, isText: true },
    { columnDef: 'profileImageUrl', header: 'Profile Pic', cell: (element: any) => `${element['profileImageUrl']}`, isImage: true },
    { columnDef: 'dob', header: 'Date of Birth', cell: (element: any) => `${new Date(element['dob']).toLocaleString()}`, isText: true },
    { columnDef: 'action', header: 'Action', cell: (element: any) => element === 'btn1' ? 'Edit' : 'Delete', isMultiButton: true },
  ];
  clientColumns: Array<Column> = [
    { columnDef: 'firstName', header: 'client name', cell: (element: any) => `${element['firstName']}`, isText: true },
    { columnDef: 'mobile', header: 'Mobile', cell: (element: any) => `${element['mobile']}`, isText: true },
    { columnDef: 'technology', header: 'Technology', cell: (element: any) => `${element['technology']}`, isText: true },
    { columnDef: 'email', header: 'Email', cell: (element: any) => `${element['email']}`, isText: true },
    { columnDef: 'location', header: 'Location', cell: (element: any) => `${element['location'].area} - ${element['location'].zone}`, isText: true },
    { columnDef: 'action', header: 'Action', cell: (element: any) => element === 'btn1' ? 'Edit' : 'Delete', isMultiButton: true },
  ];
  ticketColumns: Array<Column> = [
    { columnDef: 'client', header: 'client name', cell: (element: any) => `${element['client'].name}`, isText: true },
    { columnDef: 'status', header: 'status', cell: (element: any) => `${element['status']}`, isText: true },
    { columnDef: 'closedDate', header: 'closedDate', cell: (element: any) => `${element['closedDate']}`, isText: true },
    { columnDef: 'comments', header: 'comments', cell: (element: any) => `${element['comments']}`, isText: true },
    { columnDef: 'description', header: 'description', cell: (element: any) => `${element['description']}`, isText: true },
    { columnDef: 'user', header: 'user name', cell: (element: any) => `${element['user'].name || '--'}`, isText: true },
    { columnDef: 'technology', header: 'Technology', cell: (element: any) => `${element['technology']}`, isText: true },
    { columnDef: 'receivedDate', header: 'receivedDate', cell: (element: any) => `${new Date(element['receivedDate']).toLocaleString()}`, isText: true },
    { columnDef: 'assignedDate', header: 'assignedDate', cell: (element: any) => `${new Date(element['assignedDate']).toLocaleString()}`, isText: true },
    { columnDef: 'addOnResource', header: 'Helped By', cell: (element: any) => `${element['addOnResource']?.map((res: any) => res.name)?.toString() || '--'}`, isText: true },
    { columnDef: 'assignTicket', header: 'assignTicket', cell: (element: any) => element['user']?.name ? 'Add Resource' : 'Assign User', isButton: true },
  ];
  pieChartData: number[] = [];
  pieChartLabels: string[] = ["Resolved", "Assigned", "Pending", "In Progress", "Not Assigned"];
  pieChartColors: string[] = ['blue', 'gray', 'yellow', 'green', 'red'];
  cities = ['New York', 'New Jersey', 'Los Angeles'];
  technology = ['React Saga', 'Angular', 'Python', 'Vue Js', 'JQuery']
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
  ticketDetails: any;
  assignUser: any;
  AssignedUser: any
  todaysTickets: any =[];
  resolvedTickets: any=[];
  pendingTickets: any=[];
  inprogressTickets: any=[];
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
      client: ['', Validators.required],
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
    this.chatservice.getAllClients().subscribe((res: any) => {
      console.log(res , '107:::::::::')
      this.clientData = res
    })
    this.chatservice.getSocketData('chatRequest').subscribe((res)=>{
      console.log(res,'110')
      const message = `${res.sender.name} is Requisting to Chat with ${res.opponent.name}`;
      alert(message)
    })
    this.chatservice.getSocketData('ticketsRequest').subscribe((res)=>{
      console.log(res,'110')
      const message = `${res.sender.name} is Requisting for ${res.client.name} Tickets`;
      alert(message)
    })
    this.chatservice.getAllTickets().subscribe((res: any) => {
      this.ticketData = res;
      console.log(this.ticketData , '113:::::::::::')
      this.todaysTickets = this.ticketData.filter((val :any)=>  new Date(val.receivedDate).toLocaleDateString() === new Date().toLocaleDateString()) 
      this.resolvedTickets = this.ticketData.filter((val: any) => val.status.toLowerCase() == 'resolved').length
      this.pendingTickets = this.ticketData.filter((val: any) => val.status.toLowerCase() == 'pending').length
      this.inprogressTickets = this.ticketData.filter((val: any) => val.status.toLowerCase() == 'in progress' || val.status.toLowerCase() == 'in progess').length
      const assigned = this.ticketData.filter((val: any) => val.status.toLowerCase() == 'assigned').length
      const improper = this.ticketData.filter((val: any) => val.status.toLowerCase() == 'Improper Requirment').length
      const notAssigned = this.ticketData.filter((val: any) => val.status.toLowerCase() == 'not assigned').length
     console.log(improper,'000000')
      this.pieChart(this.resolvedTickets, assigned, this.pendingTickets, this.inprogressTickets, notAssigned , improper)

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
      this.userList = res;
    })
  }

  Logout() {
    this.deleteCookie('token')
    // this.chatservice.setCookie('token', '', 1)    
    this.router.navigate(['/'])
  }
  deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }

   /// admin status

   
   selectChange(data:any){
    console.log(data , 'admin status')

   }
   adminStatus(){
    this.isAdminStatus = !this.isAdminStatus
    

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
    this.chatservice.AddNewUsers(Data).subscribe(res => console.log(res,))
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
    this.chatservice.UpdateUsers(payload).subscribe((res: any) => {
      this.clientData = this.clientData.map((element: any) => element._id === res._id ? res : element)

    })
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
    console.log(data, this.clientDetails, this.clientForm.value, "client update1")
    const payload = {
      id: this.clientDetails._id,
      data: data
    }
    console.log(data, "playload")
    this.chatservice.updateClient(payload).subscribe((res: any) => {
      console.log(res, "client update")
      this.clientData = this.clientData.map((element: any) => element._id === res._id ? res : element)
      console.log(this.clientData, "updating client")
    })
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
    console.log(this.TicketCreationForm.value, "create ticket")
    if (this.TicketCreationForm.valid) {
      const payload = {
        client: {
          name: this.TicketCreationForm.value.client.firstName,
          id: this.TicketCreationForm.value.client._id,
          mobile: this.TicketCreationForm.value.client.mobile
        },
        user: {
          name: '',
          id: ''
        },
        technology: this.TicketCreationForm.value.technologies,
        description: this.TicketCreationForm.value.description,
        targetDate: this.TicketCreationForm.value.targetDate
      }
      this.chatservice.createNewTicket(payload).subscribe((res: any) => console.log(res, "created ticket"))
    }
    dismiss()
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

  assignTicket(ticket: any) {
    this.ticketDetails = ticket
    this.assignUser = ticket.user?.name ? 'Assign Resource' : 'Assign User'
    this.modalService.open(this.assignTicketModel)
    console.log(ticket, "ticket")
  }
  ticketAssign(dismiss: any) {
    dismiss()
    console.log(this.AssignedUser, "assgined")
    if (this.assignUser == 'Assign User') {
      const payload = {
        id: this.ticketDetails._id,
        data: {
          user: {
            name: this.AssignedUser.firstName + ' ' + this.AssignedUser.lastName,
            id: this.AssignedUser._id
          },
          status: 'Assigned'
        }
      }
      console.log(payload, 'payload')
      this.chatservice.updateTicket(payload).subscribe((res:any) => {
        this.ticketData = this.ticketData.map((element: any) => element._id === res._id ? res : element)
      })
    } else if (this.assignUser == 'Assign Resource') {
      const payload = {
        id: this.ticketDetails._id,
        data: {
          addOnResource: {
            name: this.AssignedUser.firstName + ' ' + this.AssignedUser.lastName,
            id: this.AssignedUser._id
          }
        }
      }
      console.log(payload, 'payload')
      this.chatservice.updateResuorce(payload).subscribe((res:any) => {
        this.ticketData = this.ticketData.map((element: any) => element._id === res._id ? res : element)
      } )
    }
  }
  // tickets piechart 
  pieChart(resolved: any, assigned: any, pending: any, inprogress: any, notAssigned: any , improper:any ) {
    this.pieChartData = [resolved , assigned , pending , inprogress , notAssigned , improper]
   new Chart('pieChart', {
    type: 'pie',
    data: {
      labels: this.pieChartLabels,
      datasets: [{
        label: '',
        data: this.pieChartData,
        backgroundColor: this.pieChartColors,
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
  }

  OpenChatBox(){
    this.router.navigate(['Chat-Box'])
  }
  routeToClientTickets(data:any){
    this.router.navigate(['/client-tickets']);
    this.chatservice.getTicketId(data)
  

  }
  ViewQequest(){
    this.router.navigate(['view-requestPage'])
  }
}
export interface Column {
  columnDef: string;
  header: string;
  cell: Function;
  isMultiButton?: boolean;
  isButton?: boolean;
  isImage?: boolean;
  isText?: boolean
}