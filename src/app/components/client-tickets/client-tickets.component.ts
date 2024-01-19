import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';
import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables)


// import { Column } from '../dash-board/dash-board.component';

@Component({
  selector: 'app-client-tickets',
  templateUrl: './client-tickets.component.html',
  styleUrls: ['./client-tickets.component.scss']
})
export class ClientTicketsComponent implements OnInit {
  clientDataTable:any;
  clientTicketById:any[] = [];
  Resolved: any;
  NotAssigned: any;
  Assigned: any;
  Pending:any;
  Improper: any;
  inprogress: any;
  constructor(private chatservice : ChatService){

  }

  clientColumns: Array<Column> = [
    { columnDef: 'user', header: 'User Name', cell: (element: any) => `${element['user'].name}`, isText: true },
    { columnDef: 'client', header: 'client Name', cell: (element: any) => `${element['client'].name}`, isText: true },
    { columnDef: 'addOnResource', header: 'Held By', cell: (element: any) => `${element['addOnResource']?.map((res: any) => res.name)?.toString() || '--'}`, isText: true },
    { columnDef: 'description', header: 'Description', cell: (element: any) => `${element['description']}`, isText: true },
    { columnDef: 'technology', header: 'Technology', cell: (element: any) => `${element['technology']}`, isText: true },
    { columnDef: 'status', header: 'Status', cell: (element: any) => `${element['status']}`, isText: true },
    
  ];
  ngOnInit(): void {
    this.chatservice.ticketsById.subscribe(res => {
      this.clientDataTable = res;
      console.log(this.clientDataTable , 'clientddddddddd:::')
     
    })
    this.chatservice.getClientById(this.clientDataTable._id).subscribe((res:any) => {
      // console.log(res , 'resssssssssss')
       this.clientTicketById = res;   
       this.Resolved = this.clientTicketById.filter((val: any) => val.status == 'Resolved').length,
       this.NotAssigned = this.clientTicketById.filter((val: any) => val.status == 'Not Assigned').length,
        this.Assigned = this.clientTicketById.filter((val: any) => val.status == 'Assigned').length,
        this.Pending = this.clientTicketById.filter((val: any) => val.status == 'Pending').length,
        this.Improper  = this.clientTicketById.filter((val: any) => val.status == 'Improper Requirment').length,
        this.inprogress = this.clientTicketById.filter((val: any) => val.status == 'In Progress').length
       this.pieChart(this.Resolved, this.NotAssigned ,this.Assigned ,  this.Pending , this.Improper  ,this.inprogress);
    })

  }

  pieChart(resolved: any, notassigned: any,assigned:any , pending:any ,improper:any , inprogress:any ) {
    new Chart('piechart', {
      type: 'pie',
      data: {
        labels: ["Resolved", "NotAssigned" ,"Assigned" ,"Pending", "Improper" , "InProrss" ],
        datasets: [{
          label: this.clientDataTable.firstName,
          data: [resolved,notassigned , assigned , pending , improper , inprogress ],
        }]
      },
    });
  }

}
