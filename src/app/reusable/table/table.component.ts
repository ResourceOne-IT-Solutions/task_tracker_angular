import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap } from 'rxjs';
import { Column } from 'src/app/components/dash-board/dash-board.component';
import { ChatService } from 'src/app/services/chat.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @ContentChild(TemplateRef) templateRef!: TemplateRef<any>;
  @Input() data: any;
  @Input() 'tableColumns': Column[];
  dataSource = new MatTableDataSource();
  displayedColumns: any;
  @ViewChild(MatPaginator) 'paginator': MatPaginator;
  @ViewChild(MatSort) 'sort': MatSort;
  @Output() firstBtnClick = new EventEmitter();
  @Output() secondBtnClick = new EventEmitter();
  @Output() thirdBtnClick = new EventEmitter();
  @Output() nameClick = new EventEmitter();
  @Output() descriptionClick = new EventEmitter();
  @Output() detailsClick = new EventEmitter();
  @Input() tableData: any[] = [];
  @Output() userDetails = new EventEmitter();
  @Output() singleButtonClick = new EventEmitter();
  @Input() nextpaginator = true;
  url: string = '';
  constructor(
    private loader: NgxSpinnerService,
    private chatservice: ChatService,
  ) {}
  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];
  position = new FormControl(this.positionOptions[0]);
  ngOnInit() {
    this.url = this.chatservice.BE_URL + '/profile-images';
    // this.loader.show();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.dataSource = new MatTableDataSource(this.data);
  }
  ngOnChanges(change: SimpleChanges) {
    if (change['data']) {
      this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
      this.dataSource.data = this.data;
      // this.loader.hide();
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  btn1Click(data: any) {
    this.firstBtnClick.emit(data);
  }
  btn2Click(data: any) {
    this.secondBtnClick.emit(data);
  }
  btn3Click(data: any) {
    this.thirdBtnClick.emit(data);
  }
  NameClick(data: any) {
    this.nameClick.emit(data);
  }
  Description(data: any) {
    this.descriptionClick.emit(data);
  }
  Details(data: any) {
    this.detailsClick.emit(data);
  }
  openUserDetails(userDetails: any) {
    this.userDetails.emit(userDetails);
  }
  onClick(userDetails: any, name: any) {
    this.singleButtonClick.emit({ userDetails, name });
  }
}
