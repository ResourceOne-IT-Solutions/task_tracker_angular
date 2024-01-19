import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { from } from 'rxjs';
import { LocationStrategy } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Column } from '../dash-board/dash-board.component';
import { Router } from '@angular/router';

Chart.register(...registerables)
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  requestchat = false;
  isupdatestatus = false;
  Userstatus =true
  // Userdata = true;
  susers = ['Offline', 'Busy', 'Available'];
  selectedstatus: any;
  date = new Date();
  @ViewChild('updateModel', { static: false }) updateModel: any;
  userstatus = ['In Progress', 'Pending', 'Resolved', 'Improper Requirment'];
  // selectusers = ['user1', 'user2', 'user3',]
  UserData: any;
  userTickets: any = [];
  modelHeader: string = ''
  userID: any = [];
  updateForm: FormGroup;
  Resolved: any;
  Assigned: any;
  pending: any;
  inprogress: any;
  stepper: any;
  Improper: any;
  helpedTickets: any;
  Status:any;
  ticketColumns: Array<Column> = [
    { columnDef: 'client', header: 'client name', cell: (element: any) => `${element['client'].name}`, isText: true },
    { columnDef: 'status', header: 'status', cell: (element: any) => `${element['status']}`, isText: true },
    { columnDef: 'user', header: 'user name', cell: (element: any) => `${element['user'].name || '--'}`, isText: true },
    { columnDef: 'technology', header: 'Technology', cell: (element: any) => `${element['technology']}`, isText: true },
    { columnDef: 'description', header: 'Description', cell: (element: any) => `${element['description']}`, isText: true },
    { columnDef: 'assignedDate', header: 'AssignedDate', cell: (element: any) => `${element['assignedDate']}`, isText: true },
    { columnDef: 'closedDate', header: 'closedDate', cell: (element: any) => `${element['closedDate']}`, isText: true },
    { columnDef: 'comments', header: 'comments', cell: (element: any) => `${element['comments']}`, isText: true },
    { columnDef: 'receivedDate', header: 'receivedDate', cell: (element: any) => `${new Date(element['receivedDate']).toLocaleString()}`, isText: true },
    { columnDef: 'TicketRaised', header: 'Ticket Rise', cell: (element: any) => element === 'btn1' ? 'Update Ticket' : 'Request ticket', isMultiButton: true },
  ];

  displayColumns = ["client", "status", "user", "technology", "recivedDate", "TicketRaised", "description", "comments"]
  clientDetails: any;
  currentUser: any;
  userList: any;
  SelectedUserdata: any;
  statuschange: any;
  constructor(private chatservice: ChatService, private router: Router, private fb: FormBuilder, private modalService: NgbModal, private location: LocationStrategy) {
    history.pushState(null, '', window.location.href);
    // check if back or forward button is pressed.
    this.location.onPopState(() => {
      history.pushState(null, '', window.location.href);
      // this.stepper.previous();
    });
    this.updateForm = this.fb.group({
      description: ['', Validators.required],
      comments: ['', Validators.required],
      status: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this.chatservice.UserLoginData.subscribe((res:any)=>{
      this.currentUser = res;
      console.log(this.currentUser , 'currentuser')
    })
    //AllUserList.....
    this.chatservice.getAllUsers().subscribe(res => {
      this.userList = res;
      console.log(this.userList,'UserList')
    })
    this.chatservice.getSocketData('adminMessageToAll').subscribe(res => {
      alert('admin message recived ..')
    })
    this.chatservice.getSocketData('statusUpdate').subscribe(res=> {
      this.UserData = res ;
      console.log(res , '8999::::::::')
      console.log(this.UserData , 'getsocket.............') 
    })
  
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.UserData = res;
      console.log(this.UserData , 'userData')
    })
    this.Status = this.UserData.status

    this.chatservice.getAllTickets().subscribe((res: any) => {
      console.log(res , 'getalltickets')

      this.userTickets = res.filter((item: any) =>
        item.user.id === this.currentUser._id
      )
      console.log(this.userTickets , '89::::::::')
      
      this.Resolved = this.userTickets.filter((val: any) => val.status == 'Resolved').length,
      this.Assigned = this.userTickets.filter((val: any) => val.status == 'Assigned').length,
      this.pending = this.userTickets.filter((val: any) => val.status == 'Pending').length,
      this.Improper  = this.userTickets.filter((val: any) => val.status == 'Improper Requirment').length,
      this.helpedTickets = this.UserData.helpedTickets,
      this.inprogress = this.userTickets.filter((val: any) => val.status == 'In Progress').length
      this.pieChart(this.Resolved, this.Assigned, this.pending, this.inprogress,this.helpedTickets,this.Improper);
    })
  }
  pieChart(resolved: any, assigned: any, pending: any, inprogress: any, helped: any, Improper: any) {
    console.log(this.inprogress, '9999')
    new Chart('piechartdemo', {
      type: 'pie',
      data: {
        labels: ["Resolved", "Assigned", "Pending", "InProgress", "HelpedTickets", "ImproperRequirement"],
        datasets: [{
          label: this.UserData.firstName,
          data: [resolved, assigned, pending, inprogress, helped, Improper],
        }]
      },
    });
  }
  Logout() {
    this.deleteCookie('token')
    // this.chatservice.setCookie('token', '', 1)
    this.router.navigate(['/'])
  }
  deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  }
  update(userDetails: any) {
    this.modelHeader = 'Update Ticket'
    this.userID = userDetails._id;
    this.clientDetails = userDetails
    this.openPopup(this.updateModel)
    this.updateForm.patchValue({
      description: userDetails.description,
      comments: userDetails.comments,
      status: userDetails.status
    })

  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  updateUser(dismiss: any) {
    console.log('update')
    if (this.updateForm.valid) {

      const ticketpayload = {
        id: this.userID,
        data: this.updateForm.value
      }

      this.chatservice.updateTicket(ticketpayload).subscribe((res: any) => {
        this.userTickets = this.userTickets.map((val: any) => {
          if (val._id === res._id) {
            val = res;
            return res
          }
          return val

        })

        this.updateForm.reset();
      })
      dismiss();

    }

  }
  cancel(dismiss: any) {
    dismiss();
  }

  requestChat() {
    this.requestchat = !this.requestchat;
    console.log(this.requestchat, '139::::')
  }
  sendadmin() {
    this.requestchat = !this.requestchat;
    console.log(this.SelectedUserdata,'0000====')
    this.chatservice.sendSocketData({key:'requestChat',data:{user:{name:this.currentUser.firstName,id:this.currentUser._id},opponent:{name:this.SelectedUserdata.firstName,id:this.SelectedUserdata._id}}})
    alert('request send admin')
    // if(this.requestchat){
    //   console.log('if.....')
    // }
    // else {
    //   this.requestchat = false;
    //   console.log('else')

    // }


  }

  updateStatus() {
    console.log('update status')
    this.isupdatestatus = !this.isupdatestatus
  }

  changeStatus(data: any) {
    this.statuschange = data;
    // this.Userstatus =false;
    this.Status = this.statuschange;
    // this.Userdata = false;
    // this.UserData = this.UserData.status =''
    // console.log( this.Status,11,data , '1999:::::::::::::',this.UserData)
    // const updatepayload = {
    //   id: this.UserData._id,
    //   data: {
    //     status: this.statuschange
    //   }
    // }
    // this.chatservice.sendSocketData({key : ''})
    // this.chatservice.UpdateUsers(updatepayload).subscribe((res: any) => {
    //   console.log(res, 'resssssssss::::::::')
    //   this.isupdatestatus = !this.isupdatestatus;
    // })
    const updateAdminPayload = {
      id: this.UserData._id,
      status: this.statuschange
      
    }
    this.chatservice.sendSocketData({ key: 'changeStatus', data: updateAdminPayload })
    console.log(updateAdminPayload, 'adminpayload')

  }

  selectuser(data: any) {
    console.log(data, 'selecteduser')
    this.SelectedUserdata = data

  }


  routeToTickets(data: any) {
    console.log('214:::',data)
    const CilentPayload = {
      client:{
        name:data.client.name,
        id:data.client.id
      },
      sender:{
        name:this.currentUser.firstName,
        id:this.currentUser._id
      }
    }
    this.chatservice.sendSocketData({key:'requestTickets',data:CilentPayload})
    this.router.navigate(['/tickets'])
  }

}

