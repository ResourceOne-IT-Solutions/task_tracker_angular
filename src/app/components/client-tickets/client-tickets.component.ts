import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';
import { Chart, registerables } from 'node_modules/chart.js';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-client-tickets',
  templateUrl: './client-tickets.component.html',
  styleUrls: ['./client-tickets.component.scss'],
})
export class ClientTicketsComponent implements OnInit {
  clientDataTable: any;
  clientTicketById: any[] = [];
  Closed: any;
  NotAssigned: any;
  Assigned: any;
  Pending: any;
  Improper: any;
  inprogress: any;
  paramId: any;
  constructor(
    private chatservice: ChatService,
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  clientColumns: Array<Column> = [
    {
      columnDef: 'client',
      header: 'client Name',
      cell: (element: any) => `${element['client'].name}`,
      isText: true,
    },
    {
      columnDef: 'user',
      header: 'User Name',
      cell: (element: any) => `${element['user'].name}`,
      isText: true,
    },
    {
      columnDef: 'status',
      header: 'Status',
      cell: (element: any) => `${element['status']}`,
      isText: true,
    },
    {
      columnDef: 'technology',
      header: 'Technology',
      cell: (element: any) => `${element['technology']}`,
      isText: true,
    },
    {
      columnDef: 'receivedDate',
      header: 'Receive Date',
      cell: (element: any) => `${element['receivedDate']}`,
      isText: true,
    },
    {
      columnDef: 'closedDate',
      header: 'Closed Date',
      cell: (element: any) => `${element['closedDate']}`,
      isText: true,
    },
    {
      columnDef: 'targetDate',
      header: 'Target Date',
      cell: (element: any) => `${element['targetDate']}`,
      isText: true,
    },
    {
      columnDef: 'addOnResource',
      header: 'Helped By',
      cell: (element: any) =>
        `${element['addOnResource']?.map((res: any) => res.name)?.toString() || '--'}`,
      isText: true,
    },
    {
      columnDef: 'comments',
      header: 'Comments',
      cell: (element: any) => `${element['comments']}`,
      isText: true,
    },
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: any) => `${element['description']}`,
      isText: true,
    },
  ];
  ngOnInit(): void {
    this.paramId = this.route.snapshot.paramMap.get('id');

    if (this.paramId) {
      this.chatservice.get(`/clients/${this.paramId}`).subscribe((res) => {
        this.clientDataTable = res;
      });
      this.chatservice.getClientById(this.paramId).subscribe((res: any) => {
        this.clientTicketById = res;
        (this.Closed = this.clientTicketById.filter(
          (val: any) => val.status == 'Closed',
        ).length),
          (this.NotAssigned = this.clientTicketById.filter(
            (val: any) => val.status == 'Not Assigned',
          ).length),
          (this.Assigned = this.clientTicketById.filter(
            (val: any) => val.status == 'Assigned',
          ).length),
          (this.Pending = this.clientTicketById.filter(
            (val: any) => val.status == 'Pending',
          ).length),
          (this.Improper = this.clientTicketById.filter(
            (val: any) => val.status == 'Improper Requirment',
          ).length),
          (this.inprogress = this.clientTicketById.filter(
            (val: any) => val.status == 'In Progress',
          ).length);
        this.pieChart(
          this.Closed,
          this.NotAssigned,
          this.Assigned,
          this.Pending,
          this.Improper,
          this.inprogress,
        );
      });
    }
  }

  pieChart(
    resolved: any,
    notassigned: any,
    assigned: any,
    pending: any,
    improper: any,
    inprogress: any,
  ) {
    new Chart('piechart', {
      type: 'pie',
      data: {
        labels: [
          'Closed',
          'NotAssigned',
          'Assigned',
          'Pending',
          'Improper',
          'InProrss',
        ],
        datasets: [
          {
            label: this.clientDataTable.firstName,
            data: [
              resolved,
              notassigned,
              assigned,
              pending,
              improper,
              inprogress,
            ],
          },
        ],
      },
    });
  }
  goback() {
    this.location.back();
  }
}
