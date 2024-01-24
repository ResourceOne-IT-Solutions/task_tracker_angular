import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileRenderComponent } from './file-render.component';

describe('FileRenderComponent', () => {
  let component: FileRenderComponent;
  let fixture: ComponentFixture<FileRenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileRenderComponent],
    });
    fixture = TestBed.createComponent(FileRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
