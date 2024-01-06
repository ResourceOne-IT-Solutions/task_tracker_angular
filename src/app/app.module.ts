import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WellComePageComponent } from './well-come-page/well-come-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { CreateUserComponent } from './create-user/create-user.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog';
import { guardGuard } from './services/auth/guard.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { UserPageComponent } from './user-page/user-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from './reusable/table/table.component';
@NgModule({
  declarations: [
    AppComponent,
    WellComePageComponent,
    LoginPageComponent,
    DashBoardComponent,
    CreateUserComponent,
    UserPageComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    NgbModule,
  ],
  providers: [guardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
