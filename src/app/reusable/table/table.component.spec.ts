import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [NgxSpinnerModule, MatTableModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.tableColumns = [
      {
        columnDef: 'name',
        header: 'Name',
        cell: Function,
        isMultiButton: true,
        isButton: true,
        isImage: true,
        isLink: true,
      },
      {
        columnDef: 'name',
        header: 'Name',
        cell: Function,
        isMultiButton: true,
        isButton: true,
        isImage: true,
        isLink: true,
      },
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should set displayedColumns and create dataSource in ngOnInit', () => {
  //   const columns:any = [
  //     { columnDef: 'name', header: 'Name' },
  //     { columnDef: 'age', header: 'Age' },
  //   ];

  //   component.ngOnInit();
  //   component.tableColumns = columns;

  //   expect(component.displayedColumns).toEqual(['name', 'age']);
  //   expect(component.dataSource).toBeTruthy();
  // });
});
