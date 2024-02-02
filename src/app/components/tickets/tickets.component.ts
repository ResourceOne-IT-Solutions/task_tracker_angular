import { Component, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent {
  @ViewChild('ExcelDialouge', { static: false }) ExcelDialouge: any;

  searchText: string = '';
  selectedStatus: string = '';
  ticketsData: any = [];
  ticketColumns: Array<Column> = [
    {
      columnDef: 'client',
      header: 'client name',
      cell: (element: any) => `${element['client'].name}`,
      isText: true,
    },
    {
      columnDef: 'status',
      header: 'status',
      cell: (element: any) => `${element['status']}`,
      isText: true,
    },
    {
      columnDef: 'user',
      header: 'user name',
      cell: (element: any) => `${element['user'].name || '--'}`,
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
      header: 'receivedDate',
      cell: (element: any) =>
        `${new Date(element['receivedDate']).toLocaleString()}`,
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
      columnDef: 'description',
      header: 'Description',
      cell: (element: any) =>
        `${element['description']}`,
      isText: true,
      isLink:true
    },
  ];
  dateData: any = ['today', 'month', '3months', 'year'];
  mockTicketsData: any = [];
  seletedDate: string = '';
  selectedTicket: any;
  isTicket = true;
  statusData: any;
  isStatusSeleted: boolean = false;
  description: any;
  ticketDetails: any;
  isFilterDate: boolean = false;
  constructor(
    private chatservice: ChatService,
    private modalService: NgbModal,
    private route:Router
  ) { }
  ngOnInit() {
    this.chatservice.ticketRequest.subscribe((res: any) => {
      this.selectedTicket = res;
      if (this.selectedTicket) {
        this.chatservice.getClientById(this.selectedTicket.client?.id).subscribe((res: any) => {
          this.ticketsData = res;
        })
      } else {
        this.chatservice.getAllTickets().subscribe((res: any) => {
          this.mockTicketsData = res;
          this.ticketsData = res;
          console.log(this.ticketsData,'8888')
          this.statusData = [
            ...new Set(this.ticketsData.map((val: any) => val.status)),
          ];
        });
      }
    })

  }
  gotodescription(data:any){
    console.log(data,'11111')
    this.route.navigate(['/client-tickets'])
  }
  searchFilter() {
    if (!this.isFilterDate && this.isStatusSeleted) {
      this.ticketsData = this.filterByNames(
        this.filterBasedOnStatus(this.mockTicketsData),
      );
    } else if (this.isFilterDate && this.isStatusSeleted) {
      this.ticketsData = this.filterBasedOnStatus(
        this.filterByNames(this.filterDates(this.seletedDate)),
      );
    } else {
      this.ticketsData = this.filterByNames(this.mockTicketsData);
    }
  }
  filterByStatus(evt: any) {
    this.isStatusSeleted = true;
    if (this.searchText.length && !this.isFilterDate) {
      this.ticketsData = this.filterByNames(
        this.filterBasedOnStatus(this.mockTicketsData),
      );
    } else if (this.isFilterDate && this.searchText.length) {
      this.ticketsData = this.filterBasedOnStatus(
        this.filterByNames(this.filterDates(this.seletedDate)),
      );
    } else {
      this.ticketsData = this.filterBasedOnStatus(this.mockTicketsData);
    }
  }
  filterByDate(evt: any) {
    this.isFilterDate = true;
    if (this.searchText.length && !this.isStatusSeleted) {
      this.ticketsData = this.filterByNames(this.filterDates(this.seletedDate));
    } else if (this.isStatusSeleted && this.searchText.length) {
      this.ticketsData = this.filterBasedOnStatus(
        this.filterByNames(this.filterDates(this.seletedDate)),
      );
    } else {
      this.ticketsData = this.filterDates(this.seletedDate);
    }
  }
  filterByNames(tickets: any) {
    return tickets.filter(
      (res: any) =>
        res.client.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >
        -1 ||
        res.user.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1,
    );
  }
  filterBasedOnStatus(tickets: any) {
    return tickets.filter(
      (res: any) =>
        res.status.toLowerCase() === this.selectedStatus.toLowerCase(),
    );
  }
  filterDates(selection: string) {
    const currentDate = new Date();
    switch (selection) {
      case 'today':
        return this.mockTicketsData.filter((val: any) =>
          this.isToday(new Date(val.receivedDate), currentDate),
        );
      case 'month':
        return this.mockTicketsData.filter((val: any) =>
          this.isSameMonth(new Date(val.receivedDate), currentDate),
        );
      case '3months':
        return this.mockTicketsData.filter((val: any) =>
          this.isLastThreeMonths(new Date(val.receivedDate), currentDate),
        );
      case 'year':
        return this.mockTicketsData.filter((val: any) =>
          this.isSameYear(new Date(val.receivedDate), currentDate),
        );
      default:
        return this.mockTicketsData;
    }
  }

  private isToday(date: Date, currentDate: Date): boolean {
    return date.toDateString() === currentDate.toDateString();
  }

  private isSameMonth(date: Date, currentDate: Date): boolean {
    return (
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  }

  private isLastThreeMonths(date: Date, currentDate: Date): boolean {
    const threeMonthsAgo = new Date(currentDate);
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    return date >= threeMonthsAgo && date <= currentDate;
  }

  private isSameYear(date: Date, currentDate: Date): boolean {
    return date.getFullYear() === currentDate.getFullYear();
  }
  ResetFilter() {
    this.searchText = '';
    this.selectedStatus = '';
    this.seletedDate = '';
    this.ticketsData = this.mockTicketsData;
  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  excelModal(): void {
    this.modalService.open(this.ExcelDialouge);
  }
  cancel(dismiss: any) {
    dismiss();
  }
  ConvertExcel(){
    const covertedData = this.ticketsData.map((element: any) => {
      const modifiedElement = {
        ...element,
        client: element.client.name,
        user: element.user.name,
        addOnResource: element?.addOnResource?.length
          ? element?.addOnResource?.map((res: any) => res.name).toString()
          : '',
      };
      return modifiedElement;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(covertedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'excel-export.xlsx');
  }
}
