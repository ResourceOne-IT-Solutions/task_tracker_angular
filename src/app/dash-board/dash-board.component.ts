import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent {
  @ViewChild('userModel', {static: false}) userModel: any;
  @ViewChild('addClient', {static: false}) addClient: any;

  phone:any;
  modelHeader :string =''
  'userForm' : FormGroup;
  'clientForm' :FormGroup
  displayedColumns: string[] = ['firstName', 'designation', 'empId', 'dob', 'action'];
  cities = ['New York' , 'New Jersey' , 'Los Angeles' ]
  dataSource: any;
  user: any;
  userList :any =[];
  dropdownSettings: any;
  technologies: any = [];
  constructor(private chatservice: ChatService , private router :Router, private modalService: NgbModal , private fb : FormBuilder) {
      this.userForm = this.fb.group({
        fname : ['' , Validators.required] ,
        lname : ['' , Validators.required] , 
        email : ['' , Validators.required] , 
        phone : ['' , Validators.required] , 
        dob : ['' , Validators.required] 
      })
      this.clientForm = this.fb.group({
        name : ['' , Validators.required],
        location : ['' , Validators.required],
        mobile : ['' , Validators.required],
        technologies : ['' , Validators.required],
        email : ['' , Validators.required],
      })
   }
  ngOnInit() {
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
      this.dataSource = new MatTableDataSource(this.userList)
    })
  }
  addNewClient(){
    this.openPopup(this.addClient)
  }
  creatTicket(){
    
  }
  addNewUser(){
    this.modelHeader = 'Add New User'
   this.openPopup(this.userModel)
  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  addUser(dismiss: any): void {
      dismiss();
      console.log(this.userForm.value , "add new user")
      this.dataSource
      this.userForm.reset()
  }
  updateUser(dismiss: any): void {
    dismiss();
    console.log(this.userForm.value , "add new user")
    this.userForm.reset()
}
  editUser(userDetails:any){
    this.modelHeader = 'Update User' 
   this.openPopup(this.userModel)
    console.log(userDetails)
    this.userForm.patchValue({
      fname : userDetails.firstName ,
      lname : userDetails.lastName ,
      email : userDetails.email ,
      phone : userDetails.mobile ,
      dob : new Date(userDetails.dob).toISOString().split('T')[0]
    })
  }
  cancel(dismiss :any){
     dismiss()
     this.userForm.reset()
  }
  newClient(dismiss:any){
    console.log(this.clientForm.value , "68::::")

  }
}
