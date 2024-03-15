import { Component, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { description, ticketColumns } from '../userlist/tabledata';
import { Store } from '@ngrx/store';
import { loadTickets } from 'src/app/chat-store/table.actions';
import { getTicketsData } from 'src/app/chat-store/table.selector';

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
  ticketColumns: Array<Column> = [...ticketColumns, ...description];
  dateData: any = ['today', 'month', '3months', 'year'];
  mockTicketsData: any = [];
  seletedDate: string = '';
  seletedClient: string = '';
  selectedTicket: any;
  isTicket = true;
  statusData: any = [
    'Closed',
    'Assigned',
    'Pending',
    'In Progress',
    'Not Assigned',
    'Improper Requirment',
  ];
  isStatusSeleted: boolean = false;
  description: any;
  ticketDetails: any;
  isFilterDate: boolean = false;
  paramId: string = '';
  ClientData: any = [];
  constructor(
    private chatservice: ChatService,
    private modalService: NgbModal,
    private route: Router,
    private router: ActivatedRoute,
    private store: Store,
  ) {}
  ngOnInit() {
    this.paramId = this.router.snapshot.paramMap.get('id') || '';
    this.store.dispatch(loadTickets({ params: this.paramId }));
    this.store.select(getTicketsData).subscribe((res: any) => {
      this.ticketsData = res;
      this.mockTicketsData = this.ticketsData;
      this.ClientData = [
        ...new Set(this.mockTicketsData.map((val: any) => val.client.name)),
      ];
    });
  }
  gotodescription(data: any) {
    if (this.paramId) {
      this.route.navigate(['../../ticket-description', data._id], {
        relativeTo: this.router,
      });
    } else {
      this.route.navigate(['../ticket-description', data._id], {
        relativeTo: this.router,
      });
    }
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
  filterByClient() {
    this.ticketsData = this.mockTicketsData.filter(
      (val: any) => val.client.name === this.seletedClient,
    );
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
    this.seletedClient = '';
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
  ConvertExcel(dismiss: any) {
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
    dismiss();
  }
}
