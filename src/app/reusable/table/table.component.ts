import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs';
import { Column } from 'src/app/components/dash-board/dash-board.component';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() data: any;
  @Input() 'tableColumns' :Column[]; 
  dataSource = new MatTableDataSource();
  displayedColumns: any
  @ViewChild(MatPaginator) 'paginator': MatPaginator;
  @ViewChild(MatSort) 'sort': MatSort;
  @Output() firstBtnClick = new EventEmitter();
  @Output() secondBtnClick = new EventEmitter();
  @Output() clientnameClick = new EventEmitter();
  @Output() userDetails = new EventEmitter()

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.dataSource = new MatTableDataSource(this.data);
  }
  ngOnChanges(change: SimpleChanges) {
    if (change['data']) {
      this.dataSource.data = this.data
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  btn1Click(data: any) {
    this.firstBtnClick.emit(data)
  }
  btn2Click(data: any) {
    this.secondBtnClick.emit(data)
  }
  clientNameClick(data:any){
    this.clientnameClick.emit(data)
  }
  openUserDetails(userDetails:any) {
    this.userDetails.emit(userDetails)
  }
}
