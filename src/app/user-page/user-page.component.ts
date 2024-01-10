import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { from } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
Chart.register(...registerables)
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  @ViewChild('updateModel', { static: false }) updateModel: any;
  userstatus = ['In Progess', 'Pending', 'Resolved'];
  UserData: any;
  modelHeader: string = ''
  userID:any = [];
  updateForm: FormGroup;
  userTickets: any=[];
  Resolved: any;
  Assigned: any;
  pending: any;
  inprogress: any;
  displayColumns = ["client","status","user","technology","recivedDate","TicketRaised"]
  constructor(private chatservice: ChatService , private fb : FormBuilder ,  private modalService: NgbModal,) { 
    this.updateForm = this.fb.group({
      description: ['', Validators.required],
      comments: ['', Validators.required],
      status : ['' , Validators.required]
    
     
    })
  }
  ngOnInit(): void {
    this.chatservice.UserLoginData.subscribe((res) => {
      this.UserData = res;
    })
    this.chatservice.getAllTickets().subscribe((res: any) => {
      this.userTickets = res.filter((item: any) =>
        item.user.id === this.UserData._id
      )
      this.Resolved = this.userTickets.filter((val: any) => val.status === 'Resolved').length,
      this.Assigned = this.userTickets.filter((val: any) => val.status === 'Assigned').length,
      this.pending = this.userTickets.filter((val: any) => val.status === 'Pending').length,
      this.inprogress = this.userTickets.filter((val: any) => val.status === 'In Progress').length
      this.pieChart(this.Resolved, this.Assigned,this.pending,this.inprogress);
    })
  }

  pieChart(resolved: any, assigned: any,pending:any,inprogress:any) {
    new Chart('piechart', {
      type: 'pie',
      data: {
        labels: ["Resolved", "Assigned","Pending","In Progress"],
        datasets: [{
          label: this.UserData.firstName,
          data: [resolved, assigned,pending,inprogress],
        }]
      },
    
    });
  } 

  update(userDetails: any) {
    // console.log(userDetails , '666')
    this.userID = userDetails._id;
  
    this.openPopup(this.updateModel)
    this.updateForm.patchValue({
      description: userDetails.description,
      comments: userDetails.comments,
      status : userDetails.status
    })
   
  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  updateUser(dismiss:any) {
    if(this.updateForm.valid){
      this.chatservice.updateUsers(this.userID, this.updateForm.value, ).subscribe(res => {
      
        console.log(res , '83')
      })
      dismiss();
      this.updateForm.reset();

    }
   
  }
  cancel(dismiss:any){
    dismiss();

  }
}