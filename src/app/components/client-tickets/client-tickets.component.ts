import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';
// import { Column } from '../dash-board/dash-board.component';

@Component({
  selector: 'app-client-tickets',
  templateUrl: './client-tickets.component.html',
  styleUrls: ['./client-tickets.component.scss']
})
export class ClientTicketsComponent implements OnInit {
  clientDataTable:any;
  constructor(private chatservice : ChatService){

  }

  clientColumns: Array<Column> = [
    { columnDef: 'firstName', header: 'client name', cell: (element: any) => `${element['firstName']}`, isText: true },
    { columnDef: 'mobile', header: 'Mobile', cell: (element: any) => `${element['mobile']}`, isText: true },
    { columnDef: 'technology', header: 'Technology', cell: (element: any) => `${element['technology']}`, isText: true },
    { columnDef: 'email', header: 'Email', cell: (element: any) => `${element['email']}`, isText: true },
    // { columnDef: 'companyName', header: 'CompanyName', cell: (element: any) => `${element['companyName']}`, isText: true },
    // { columnDef: 'action', header: 'Action', cell: (element: any) => element === ' isMultiButton: false },
  ];
  ngOnInit(): void {
    this.chatservice.getAllClients().subscribe((res: any) => {
      this.clientDataTable = res
      console.log(this.clientDataTable , 'clientDataTable')
    })
  }
  clientTickets(clienttableData:any){
    console.log(clienttableData , '32:::::::');
    // this.clientDataTable = clienttableData;

  }

}
