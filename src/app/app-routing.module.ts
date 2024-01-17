import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelComePageComponent } from './components/welcome-page/welcome-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { guardGuard } from './services/auth/guard.guard';
import { UserPageComponent } from './components/user-page/user-page.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';

import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { ClientTicketsComponent } from './components/client-tickets/client-tickets.component';

const routes: Routes = [
  { path: '', component: WelComePageComponent },
  { path: 'login_page', component: LoginPageComponent },
  { path: 'dashboard', component: MainDashboardComponent },
  { path: 'create-user', component: CreateUserComponent  },
  { path: 'User-page', component: UserPageComponent},
  { path: 'Chat-Box', component: ChatBoxComponent},
  { path: 'User-page', component: UserPageComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'client-tickets', component: ClientTicketsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
