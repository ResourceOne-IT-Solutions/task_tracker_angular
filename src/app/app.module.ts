import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelComePageComponent } from './components/welcome-page/welcome-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { CreateUserComponent } from './components/create-user/create-user.component'
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
import { MatGridListModule } from '@angular/material/grid-list';
import { UserPageComponent } from './components/user-page/user-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from './reusable/table/table.component';
import { APP_BASE_HREF } from '@angular/common';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    AppComponent,
    WelComePageComponent,
    LoginPageComponent,
    DashBoardComponent,
    CreateUserComponent,
    UserPageComponent,
    TableComponent,
    MainDashboardComponent,
    chatcomponent
    ChatBoxComponent,
    TicketsComponent,
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
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    NgbModule,
    MatGridListModule,
    MatSelectModule
  ],
  providers: [guardGuard, { provide: APP_BASE_HREF, useValue: '/task_tracker_angular/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
